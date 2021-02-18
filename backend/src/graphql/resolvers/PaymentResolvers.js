import {
  CreatePaymentITC,
  DataSourceEnumTC,
  FetchPaymentPayloadTC,
  MoneyTC,
  PaymentTC,
  SortOrderEnumTC
} from '../schema/index.js'
import getSquare from '../../utils/square.js'
import getShopify from '../../utils/shopify.js'

import { v4 as uuid } from 'uuid'
import { ApolloError } from 'apollo-server-express'

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
  resolve: ({ args }) => {
    const { vendor, cursor } = args

    const squareController = getSquare(vendor)

    return squareController.getPayments(cursor)
  }
})
  .addResolver({
    name: 'createPayment',
    type: PaymentTC,
    args: {
      vendor: 'String!',
      record: () => CreatePaymentITC.getTypeNonNull()
    },
    resolve: ({ args }) => {
      const {
        record: {
          sourceId,
          subtotal,
          tip,
          orderId,
          customerId,
          locationId,
          source
        },
        vendor
      } = args

      switch (source) {
        case 'SQUARE': {
          const squareController = getSquare(vendor)

          return squareController.createPayment(
            uuid(),
            sourceId,
            subtotal,
            tip,
            orderId,
            customerId,
            locationId
          )
        }

        case 'SHOPIFY': {
          const shopifyController = getShopify(vendor)

          return shopifyController.createPayment(subtotal, orderId)
        }

        default: {
          throw new ApolloError('Payment source not valid!')
        }
      }
    }
  })
  .addResolver({
    name: 'completePayment',
    type: PaymentTC,
    args: {
      vendor: 'String!',
      paymentId: 'String!',
      source: DataSourceEnumTC,
      money: () => MoneyTC.getITC()
    },
    resolve: ({ args }) => {
      const { vendor, paymentId, source, money } = args

      switch (source) {
        case 'SQUARE': {
          const squareController = getSquare(vendor)

          return squareController.completePayment(paymentId)
        }

        case 'SHOPIFY': {
          const shopifyController = getShopify(vendor)

          return shopifyController.completePayment(paymentId, money)
        }

        default: {
          throw new ApolloError('Payment source not valid!')
        }
      }
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
    resolve: ({ args }) => {
      const { source, paymentId, vendor } = args

      switch (source) {
        case 'SQUARE': {
          const squareController = getSquare(vendor)

          return squareController.verifyPayment(paymentId)
        }

        case 'SHOPIFY': {
          const shopifyController = getSquare(vendor)

          return shopifyController.verifyPayment(paymentId)
        }

        default: {
          throw new ApolloError('Payment source not valid!')
        }
      }
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
    resolve: ({ args }) => {
      const { paymentId, source, vendor } = args

      switch (source) {
        case 'SQUARE': {
          const squareClient = getSquare(vendor)

          return squareClient.cancelPayment(paymentId)
        }

        case 'SHOPIFY': {
          const shopifyClient = getShopify(vendor)

          return shopifyClient.cancelPayment(paymentId)
        }

        default: {
          throw new ApolloError('Payment source not valid!')
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
