import {
  CreateOrderInputTC,
  OrderTC,
  OrderTracker,
  FilterOrderInputTC,
  SortOrderInputTC,
  FindManyOrderPayloadTC,
  UpdateOrderTC
} from '../schema/index.js'
import pubsub from '../../utils/pubsub.js'
import getSquare from '../../utils/square.js'
import TwilioClient from '../../utils/twilio.js'

OrderTC.addResolver({
  name: 'findOrders',
  type: FindManyOrderPayloadTC,
  args: {
    locations: '[String!]!',
    filter: FilterOrderInputTC,
    sort: SortOrderInputTC,
    vendor: 'String!',
    limit: {
      type: 'Int',
      defaultValue: 500
    },
    cursor: {
      type: 'String',
      defaultValue: ''
    }
  },
  resolve: async ({ args }) => {
    const { vendor, locations, cursor, filter, sort } = args

    const squareController = getSquare(vendor)

    const query = {}

    if (filter) {
      query.filter = filter
    }

    if (sort) {
      query.sort = sort
    }

    return squareController.getOrders(cursor, locations, query)
  }
})
  .addResolver({
    name: 'createOrder',
    type: OrderTC,
    args: {
      locationId: 'String!',
      vendor: 'String!',
      record: CreateOrderInputTC.getTypeNonNull().getType()
    },
    resolve: async ({ args }) => {
      const {
        locationId,
        vendor,
        record: {
          idempotencyKey,
          lineItems,
          recipient,
          pickupTime,
          submissionTime,
          cohenId,
          studentId,
          paymentType
        }
      } = args

      const squareController = getSquare(vendor)

      const order = await squareController.createOrder(
        locationId,
        idempotencyKey,
        lineItems,
        recipient,
        pickupTime,
        submissionTime,
        cohenId,
        studentId
      )

      await OrderTracker.create({
        status: 'PROPOSED',
        pickupTime: pickupTime,
        submissionTime: submissionTime,
        locationId: locationId,
        orderId: order.id,
        paymentType: paymentType
      })

      pubsub.publish('orderCreated', {
        orderCreated: order
      })

      TwilioClient.messages.create({
        body: 'Your order has been placed.',
        from: '+13466667153',
        to: order.fulfillment.pickupDetails.recipient.phone
      })

      return order
    }
  })
  .addResolver({
    name: 'updateOrder',
    type: OrderTC,
    args: {
      orderId: 'String!',
      vendor: 'String',
      record: UpdateOrderTC.getType()
    },
    resolve: async ({ args }) => {
      const {
        orderId,
        vendor,
        record: { fulfillment }
      } = args

      const updatedOrderTracker = await OrderTracker.findOne({
        orderId: orderId
      })

      const squareController = getSquare(vendor)
      const order = await squareController.orderFetchAndParse(orderId)

      order.fulfillment.state = fulfillment.state

      if (updatedOrderTracker.status === fulfillment.state) {
        return order
      }

      updatedOrderTracker.status = fulfillment.state

      await updatedOrderTracker.save()

      pubsub.publish('orderUpdated', {
        orderUpdated: order
      })

      switch (updatedOrderTracker.status) {
        case 'PREPARED':
          TwilioClient.messages.create({
            body:
              'Your recent order has been prepared. Please go to the pickup location',
            from: '+13466667153',
            to: order.fulfillment.pickupDetails.recipient.phone
          })
          break
        case 'COMPLETED':
          TwilioClient.messages.create({
            body:
              'Your order has been picked up. If you did not do this, please contact the vendor directly.',
            from: '+13466667153',
            to: order.fulfillment.pickupDetails.recipient.phone
          })
          break
        case 'CANCELED':
          TwilioClient.messages.create({
            body:
              'Your order has been cancelled. To reorder, please visit https://hedwig.riceapps.org/',
            from: '+13466667153',
            to: order.fulfillment.pickupDetails.recipient.phone
          })
          break
        default:
          TwilioClient.messages.create({
            body:
              'Your order has been updated. Please check https://hedwig.riceapps.org/ for more details',
            from: '+13466667153',
            to: order.fulfillment.pickupDetails.recipient.phone
          })
      }

      return order
    }
  })

const OrderQueries = {
  findOrders: OrderTC.getResolver('findOrders')
}

const OrderMutations = {
  createOrder: OrderTC.getResolver('createOrder'),
  updateOrder: OrderTC.getResolver('updateOrder')
}

const OrderSubscriptions = {
  orderCreated: {
    type: OrderTC,

    subscribe: () => pubsub.asyncIterator('orderCreated')
  },

  orderUpdated: {
    type: OrderTC,

    subscribe: () => pubsub.asyncIterator('orderUpdated')
  }
}

export { OrderQueries, OrderMutations, OrderSubscriptions }
