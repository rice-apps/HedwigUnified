import { v4 as uuid } from 'uuid'
import { ApolloError } from 'apollo-server-express'
import {
  CreatePaymentITC,
  MoneyTC,
  OrderTracker,
  PaymentTC,
  SortOrderEnumTC,
  FetchPaymentPayloadTC,
  DataSourceEnumTC
} from '../models/index.js'
import { squareClients } from '../utils/square.js'
import { shopifyClient, shopifyAdminClient } from '../utils/shopify.js'
import { ApiError } from 'square'

PaymentTC.addResolver({
  name: 'fetchPayments',
  type: FetchPaymentPayloadTC,
  args: {
    vendor: 'String!',
    beginTime: 'String',
    endTime: 'String',
    sortOrder: {
      type: () => SortOrderEnumTC,
      defaultValue: 'DESC'
    },
    cursor: {
      type: 'String',
      defaultValue: undefined
    }
  },
  resolve: async ({ args }) => {
    const { beginTime, endTime, sortOrder, cursor, vendor } = args

    const squareClient = squareClients.get(vendor)
    const paymentsApi = squareClient.paymentsApi

    try {
      const {
        result: { cursor: newCursor, payments }
      } = await paymentsApi.listPayments(beginTime, endTime, sortOrder, cursor)
      const paymentsList = payments.map(payment => ({
        id: payment.id,
        order: payment.orderId,
        customer: payment.customerId,
        subtotal: payment.amountMoney,
        tip: payment.tipMoney,
        total: payment.totalMoney,
        status: payment.status
      }))

      return {
        cursor: newCursor,
        payments: paymentsList
      }
    } catch (error) {
      if (error instanceof ApiError) {
        return new ApolloError(
          `Retrieving list of payments from Square failed because ${error.result}`
        )
      }

      return new ApolloError(
        'Something went wrong while retrieving list of payments'
      )
    }
  }
})
  .addResolver({
    name: 'createPayment',
    args: {
      record: CreatePaymentITC.getTypeNonNull().getType(),
      vendor: 'String!'
    },
    type: PaymentTC,
    resolve: async ({ args }) => {
      const {
        vendor,
        record: {
          sourceId,
          subtotal,
          tip,
          orderId,
          customerId,
          locationId,
          source
        }
      } = args

      let response

      switch (source) {
        case 'SQUARE': {
          const squareClient = squareClients.get(vendor)
          const paymentsApi = squareClient.paymentsApi
          try {
            const {
              result: { payment }
            } = await paymentsApi.createPayment({
              locationId: locationId,
              sourceId: sourceId,
              idempotencyKey: uuid(),
              amountMoney: subtotal,
              tipMoney: tip,
              orderId: orderId,
              customerId: customerId,
              autocomplete: false
              // verificationToken: token
            })
            response = {
              id: payment.id,
              order: payment.orderId,
              customer: payment.customerId,
              subtotal: payment.amountMoney,
              tip: payment.tipMoney,
              total: payment.totalMoney,
              status: payment.status
            }
          } catch (error) {
            if (error instanceof ApiError) {
              console.log(error.result)
              response = new ApolloError(
                `Creating payment in Square failed because ${error.result}`
              )
            } else {
              response = new ApolloError(
                'Something went wrong while creating a payment in Square'
              )
            }
          }

          OrderTracker.findOneAndUpdate(
            { orderId: orderId },
            { dataSource: 'SQUARE'}
          ).exec()

          break
        }
        case 'SHOPIFY': {
          const unitProduct = await shopifyClient.product.fetchByHandle(
            'unit-product'
          )
          const createCheckoutMutation = shopifyClient.graphQLClient.mutation(
            root => {
              root.add(
                'checkoutCreate',
                {
                  args: {
                    input: {
                      lineItems: {
                        quantity: subtotal.amount,
                        variantId: unitProduct.variants[0].id
                      }
                    }
                  }
                },
                checkoutCreate => {
                  checkoutCreate.add('checkout', checkout => {
                    checkout.add('id')
                    checkout.add('webUrl')
                    checkout.add('order', order => {
                      order.add('id')
                    })
                    checkout.add('paymentDueV2', payment => {
                      payment.add('amount')
                      payment.add('currencyCode')
                    })
                  })
                }
              )
            }
          )

          const checkout = await shopifyClient.graphQLClient.send(
            createCheckoutMutation
          )
          response = {
            id: checkout.data.checkoutCreate.checkout.id,
            total: subtotal,
            url: checkout.data.checkoutCreate.checkout.webUrl,
            source
          }

          // I changed shopifyOrderId: checkout.data.checkoutCreate.checkout.order.id
          // to the code below to make createPayment work
          // not sure if this is correct !!! --- Lorraine
          OrderTracker.findOneAndUpdate(
            { orderId: orderId },
            { dataSource: 'SHOPIFY', shopifyOrderId: checkout.data.checkoutCreate.checkout.id }
          ).exec()
          break
        }

        default: {
          response = new ApolloError(
            'Payment method did not match any specified!'
          )
        }
      }

      return response
    }
  })
  .addResolver({
    name: 'completePayment',
    args: {
      vendor: 'String!',
      paymentId: 'String!',
      source: DataSourceEnumTC,
      money: MoneyTC.getITC()
    },
    type: PaymentTC,
    resolve: async ({ args }) => {
      let response
      switch (args.source) {
        case 'SQUARE': {
          const squareClient = squareClients.get(args.vendor)
          const paymentsApi = squareClient.paymentsApi

          try {
            const {
              result: { payment }
            } = await paymentsApi.completePayment(args.paymentId)

            response = {
              id: payment.id,
              order: payment.orderId,
              customer: payment.customerId,
              subtotal: payment.amountMoney,
              tip: payment.tipMoney,
              total: payment.totalMoney,
              status: payment.status
            }
          } catch (error) {
            if (error instanceof ApiError) {
              response = new ApolloError(
                `Completing payment ${args.paymentId} using Square failed because ${error.result}`
              )
            } else {
              response = new ApolloError(
                `Something went wrong when completing payment ${args.paymentId}`
              )
            }
          }

          break
        }

        case 'SHOPIFY': {
          const checkoutOrderQuery = shopifyClient.graphQLClient.query(root => {
            root.add('node', { args: { id: args.paymentId } }, node => {
              node.addInlineFragmentOn('Checkout', checkout => {
                checkout.add('id')
                checkout.add('order', order => {
                  order.add('id')
                })
              })
            })
          })

          const checkout = await shopifyClient.graphQLClient.send(
            checkoutOrderQuery
          )

          const transactionQuery = `
            query GetOrder($id: ID!) {
              node(id: $id) {
                ...on Order {
                  transactions {
                    id
                  }
                }
              }
            }
          `

          if (checkout.data.node.order === undefined) {
            response = new ApolloError(
              'Cannot complete payment for transaction with no authorization'
            )
            break
          }
          const transactions = await shopifyAdminClient.graphql(
            transactionQuery,
            {
              id: checkout.data.node.order.id
            }
          )

          const completePayment = `
            mutation CompletePayment($input: OrderCaptureInput!) {
              orderCapture(input: $input) {
                transaction {
                  id
                }
                userErrors {
                  field
                  message
                }
              }
            }
          `
          const completeResponse = await shopifyAdminClient.graphql(
            completePayment,
            {
              input: {
                amount: args.money.amount / 100,
                currency: args.money.currency,
                id: checkout.data.node.order.id,
                parentTransactionId: transactions.node.transactions[0].id
              }
            }
          )
          response = {
            id: checkout.data.node.id,
            order: checkout.data.node.order.id
          }
          break
        }

        default: {
          response = new ApolloError(
            'Payment method did not match any specified!'
          )
        }
      }
      return response
    }
  })
  .addResolver({
    name: 'verifyPayment',
    type: 'Boolean',
    args: {
      vendor: 'String!',
      source: DataSourceEnumTC,
      paymentId: 'String'
    },
    resolve: async ({ args }) => {
      const { source, paymentId, vendor } = args

      let response

      switch (source) {
        case 'SQUARE': {
          const squareClient = squareClients.get(vendor)
          const paymentsApi = squareClient.paymentsApi

          try {
            const {
              result: { payment }
            } = await paymentsApi.getPayment(paymentId)

            response =
              payment.status !== 'CANCELED' && payment.status !== 'FAILED'
          } catch (error) {
            if (error instanceof ApiError) {
              response = new ApolloError(
                `Verifying payment ${paymentId} on Square failed because ${error.result}`
              )
            } else {
              response = new ApolloError(
                `Something went wrong when verifying payment ${paymentId} on Square`
              )
            }
          }

          break
        }

        case 'SHOPIFY': {
          const checkoutOrderQuery = shopifyClient.graphQLClient.query(root => {
            root.add('node', { args: { id: paymentId } }, node => {
              node.addInlineFragmentOn('Checkout', checkout => {
                checkout.add('id')
                checkout.add('order', order => {
                  order.add('id')
                })
                checkout.add('paymentDueV2', payment => {
                  payment.add('amount')
                  payment.add('currencyCode')
                })
              })
            })
          })

          const checkout = await shopifyClient.graphQLClient.send(
            checkoutOrderQuery
          )

          const orderQuery = `
            query GetOrder($id: ID!) {
              node(id: $id) {
                ...on Order {
                  fullyPaid
                  totalCapturableSet {
                    presentmentMoney {
                      amount
                      currencyCode
                    }
                    shopMoney {
                      amount
                      currencyCode
                    }
                  }
                  transactions {
                    id
                  }
                }
              }
            }
          `

          if (checkout.data.node.order != null) {
            const order = await shopifyAdminClient.graphql(orderQuery, {
              id: checkout.data.node.order.id
            })

            response =
              order.node.fullyPaid ||
              (checkout.data.node.paymentDueV2.amount ===
                order.node.totalCapturableSet.presentmentMoney.amount &&
                checkout.data.node.paymentDueV2.currencyCode ===
                  order.node.totalCapturableSet.presentmentMoney.currencyCode)
          } else {
            response = false
          }

          break
        }

        default: {
          response = new ApolloError(
            'Payment source should be Shopify or Square!'
          )
        }
      }

      return response
    }
  })
  .addResolver({
    name: 'cancelPayment',
    type: PaymentTC.makeFieldNullable(PaymentTC.getFieldNames()),
    args: {
      vendor: 'String!',
      paymentId: 'String!',
      source: DataSourceEnumTC
    },
    resolve: async ({ args }) => {
      const { paymentId, source, vendor } = args // TODO: handle cancelling payments for different vendors

      switch (source) {
        case 'SQUARE': {
          const squareClient = squareClients.get(vendor)
          const paymentsApi = squareClient.paymentsApi

          try {
            const {
              result: { payment }
            } = await paymentsApi.cancelPayment(paymentId)

            return {
              id: payment.id,
              order: payment.orderId,
              customer: payment.customerId,
              subtotal: payment.amountMoney,
              tip: payment.tipMoney,
              total: payment.totalMoney,
              status: payment.status
            }
          } catch (error) {
            if (error instanceof ApiError) {
              return new ApolloError(
                `Cancelling payment ${paymentId} using Square failed because ${error.result}`
              )
            }

            return new ApolloError(
              `Something went wrong cancelling payment ${paymentId} using Square`
            )
          }
        }
        case 'SHOPIFY': {
          const checkoutOrderQuery = shopifyClient.graphQLClient.query(root => {
            root.add('node', { args: { id: args.paymentId } }, node => {
              node.addInlineFragmentOn('Checkout', checkout => {
                checkout.add('id')
                checkout.add('order', order => {
                  order.add('id')
                })
              })
            })
          })

          const checkout = await shopifyClient.graphQLClient.send(
            checkoutOrderQuery
          )

          const orderCloseMutation = `
            mutation CloseOrder($id: ID!) {
              orderClose(input: { id: $id }) {
                order {
                  id
                }
              }
            }
          `

          const order = await shopifyAdminClient.graphql(orderCloseMutation, {
            id: checkout.data.node.order.id
          })

          return {
            id: paymentId,
            order: order.orderClose.order.id
          }
        }
      }
    }
  })

const PaymentQueries = {
  fetchPayments: PaymentTC.getResolver('fetchPayments'),
  verifyPayment: PaymentTC.getResolver('verifyPayment')
}

const PaymentMutations = {
  createPayment: PaymentTC.getResolver('createPayment'),
  completePayment: PaymentTC.getResolver('completePayment'),
  cancelPayment: PaymentTC.getResolver('cancelPayment')
}

export { PaymentQueries, PaymentMutations }
