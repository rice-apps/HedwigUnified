import { PaymentsApi, CreatePaymentRequest } from 'square-connect'
import { v4 as uuid } from 'uuid'
import { ApolloError } from 'apollo-server-express'
import {
  CreatePaymentITC,
  MoneyTC,
  OrderTracker,
  PaymentTC,
  SortOrderEnumTC
} from '../models'
import { FetchPaymentPayloadTC } from '../models/PaymentModel'
import { shopifyClient, shopifyAdminClient } from '../shopify'

PaymentTC.addResolver({
  name: 'fetchPayments',
  type: FetchPaymentPayloadTC,
  args: {
    beginTime: 'String',
    endTime: 'String',
    sortOrder: {
      type: () => SortOrderEnumTC,
      defaultValue: 'DESC'
    },
    cursor: {
      type: 'String',
      defaultValue: null
    }
  },
  resolve: async ({ args }) => {
    const api = new PaymentsApi()

    const fetchPaymentsResponse = await api.listPayments(args)

    if (fetchPaymentsResponse.errors) {
      return new ApolloError(
        `Payments couldn't be listed because of error: ${fetchPaymentsResponse.errors}`
      )
    }

    const paymentsList = fetchPaymentsResponse.payments.map(payment => ({
      id: payment.id,
      order: payment.order_id,
      customer: payment.customer_id,
      subtotal: payment.amount_money,
      tip: payment.tip_money,
      total: payment.total_money,
      status: payment.status
    }))

    return {
      cursor: fetchPaymentsResponse.cursor,
      payments: paymentsList
    }
  }
})
  .addResolver({
    name: 'createPayment',
    args: {
      record: CreatePaymentITC.getTypeNonNull().getType()
    },
    type: PaymentTC,
    resolve: async ({ args }) => {
      const {
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
          const api = new PaymentsApi()
          const paymentBody = new CreatePaymentRequest()

          const paymentResponse = await api.createPayment({
            ...paymentBody,
            location_id: locationId,
            source_id: sourceId,
            idempotency_key: uuid(),
            amount_money: subtotal,
            tip_money: tip,
            order_id: orderId,
            customer_id: customerId,
            autocomplete: false
          })

          if (paymentResponse.errors) {
            return new ApolloError(
              `Encounter the following errors while create payment: ${paymentResponse.errors}`
            )
          }

          const {
            payment: {
              id,
              order_id,
              customer_id,
              amount_money,
              tip_money,
              total_money,
              status
            }
          } = paymentResponse

          response = {
            id,
            order: order_id,
            customer: customer_id,
            subtotal: amount_money,
            tip: tip_money,
            total: total_money,
            status
          }

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
                        quantity: subtotal.amount / 25,
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

          OrderTracker.findOneAndUpdate(
            { orderId: orderId },
            { shopifyOrderId: checkout.data.checkoutCreate.checkout.order.id }
          )

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
      paymentId: 'String!',
      source: 'String!',
      money: MoneyTC.getITC()
    },
    type: PaymentTC,
    resolve: async ({ args }) => {
      let response

      switch (args.source) {
        case 'SQUARE': {
          const api = new PaymentsApi()

          const paymentResponse = await api.completePayment(args.paymentId)

          if (paymentResponse.errors) {
            return new ApolloError(
              `Encounter the following errors while complete payment: ${paymentResponse.errors}`
            )
          }

          const {
            payment: {
              id,
              order_id,
              customer_id,
              amount_money,
              tip_money,
              total_money,
              status
            }
          } = paymentResponse

          response = {
            id,
            order: order_id,
            customer: customer_id,
            subtotal: amount_money,
            tip: tip_money,
            total: total_money,
            status
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
                amount: args.money.amount / 25,
                currency: args.money.currency,
                id: checkout.data.node.order.id,
                parentTransactionId: transactions.node.transactions[0].id
              }
            }
          )

          console.log(completeResponse.orderCapture)

          response = {
            id: checkout.data.node.id,
            order: checkout.data.node.order.id
          }
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
      source: 'String!',
      paymentId: 'String',
      orderId: 'String'
    },
    resolve: async ({ args }) => {
      const { source, paymentId, orderId } = args

      let response

      switch (source) {
        case 'SQUARE': {
          const api = new PaymentsApi()

          const getPaymentResponse = await api.getPayment(paymentId)

          if (getPaymentResponse.errors) {
            return new ApolloError(
              `Couldn't verify payment because ${getPaymentResponse.errors}`
            )
          }

          response =
            getPaymentResponse.payment.status != 'CANCELED' &&
            getPaymentResponse.payment.status != 'FAILED'
        }

        case 'SHOPIFY': {
          const orderQuery = `
            query GetOrder($id: ID!) {
              node(id: $id) {
                ...on Order {
                  fullyPaid
                  transactions {
                    id
                  }
                }
              }
            }
          `

          const order = await shopifyAdminClient.graphql(orderQuery, {
            id: orderId
          })

          response = order.data.node.order.fullyPaid
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
    type: PaymentTC,
    args: {
      vendor: 'String!',
      paymentId: 'String!'
    },
    resolve: async ({ args }) => {
      const { paymentId } = args // TODO: handle cancelling payments for different vendors

      const api = new PaymentsApi()

      const cancelPaymentResponse = await api.cancelPayment(paymentId)

      if (cancelPaymentResponse.errors) {
        return new ApolloError(
          `Couldn't cancel payment because of error: ${cancelPaymentResponse.errors}`
        )
      }

      const {
        payment: {
          id,
          order_id,
          customer_id,
          amount_money,
          tip_money,
          total_money,
          status
        }
      } = cancelPaymentResponse

      return {
        id,
        order: order_id,
        customer: customer_id,
        subtotal: amount_money,
        tip: tip_money,
        total: total_money,
        status
      }
    }
  })

const PaymentQueries = {
  fetchPayments: PaymentTC.getResolver('fetchPayments')
}

const PaymentMutations = {
  createPayment: PaymentTC.getResolver('createPayment'),
  completePayment: PaymentTC.getResolver('completePayment'),
  cancelPayment: PaymentTC.getResolver('cancelPayment')
}

export { PaymentQueries, PaymentMutations }
