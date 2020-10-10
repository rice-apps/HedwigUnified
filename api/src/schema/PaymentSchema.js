import { PaymentsApi, CreatePaymentRequest } from 'square-connect'
import { GraphQLString, GraphQLNonNull } from 'graphql'
import { v4 as uuid } from 'uuid'
import { ApolloError } from 'apollo-server-express'
import { CreatePaymentITC, PaymentTC, SortOrderEnumTC } from '../models'
import { FetchPaymentPayloadTC } from '../models/PaymentModel'
import shopifyClient from '../shopify'

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
        case 'SQUARE':
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

        case 'SHOPIFY':
          const unitProduct = await shopifyClient.product.fetchByHandle(
            'unitproduct'
          )
          let checkout = await shopifyClient.checkout.create()

          await shopifyClient.checkout.addLineItems(checkout.id, [
            {
              variantId: unitProduct.variants[0].id,
              quantity: subtotal.amount / 25
            }
          ])

          response = {
            id: checkout.id,
            total: subtotal,
            url: checkout.webUrl,
            source
          }

          break
        default:
          response = new ApolloError(
            'Payment method did not match any specified!'
          )
      }

      return response
    }
  })
  .addResolver({
    name: 'completePayment',
    args: {
      // TODO: add fields for Shopify
      paymentId: GraphQLNonNull(GraphQLString)
    },
    type: PaymentTC,
    resolve: async ({ args }) => {
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
