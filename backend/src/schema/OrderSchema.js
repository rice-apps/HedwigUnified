import { ApolloError } from 'apollo-server-express'
import {
  CreateOrderInputTC,
  OrderTC,
  OrderTracker,
  FilterOrderInputTC,
  SortOrderInputTC,
  FindManyOrderPayloadTC,
  UpdateOrderTC,
  Vendor
} from '../models/index.js'
import { pubsub } from '../utils/pubsub.js'
import {
  squareClients,
  orderFetchAndParse,
  orderParse
} from '../utils/square.js'
import TwilioClient from '../utils/twilio.js'
import { ApiError } from 'square'

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
      defaultValue: 1000
    },
    cursor: {
      type: 'String',
      defaultValue: ''
    }
  },
  resolve: async ({ args }) => {
    const { vendor, locations, cursor, limit } = args

    const squareClient = squareClients.get(vendor)

    const today = new Date()
    const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000)

    const query = {
      filter: {
        dateTimeFilter: {
          createdAt: {
            endAt: today.toISOString(),
            startAt: yesterday.toISOString()
          }
        },
        fulfillmentFilter: {
          fulfillmentTypes: ['PICKUP']
        }
      },
      sort: {
        sortField: 'CREATED_AT'
      }
    }

    try {
      const {
        result: { cursor: newCursor, orders }
      } = await squareClient.ordersApi.searchOrders({
        locationIds: locations,
        cursor,
        limit,
        query,
        returnEntries: false
      })

      const filteredOrders = orders.filter(
        order => typeof order.fulfillments !== 'undefined'
      )

      const orderIds = filteredOrders.map(order => order.id)
      const orderTrackers = await OrderTracker.find({
        orderId: { $in: orderIds }
      })
        .lean()
        .exec()

      const returnedOrders = filteredOrders.map(async order => {
        const orderTracker = orderTrackers.find(obj => obj.orderId === order.id)

        const parsedOrder = orderParse(order)
        parsedOrder.fulfillment.state = orderTracker
          ? orderTracker.status
          : order.fulfillments[0].state

        return parsedOrder
      })

      return {
        cursor: newCursor,
        orders: returnedOrders
      }
    } catch (error) {
      if (error instanceof ApiError) {
        return new ApolloError(
          `Finding orders using Square failed because ${JSON.stringify(error)}`
        )
      }

      return new ApolloError(
        `Something went wrong finding orders: ${JSON.stringify(error)}`
      )
    }
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
          paymentType,
          note,
          roomNumber
        }
      } = args

      const squareClient = squareClients.get(vendor)

      const vendorDoc = await Vendor.findOne({ name: vendor }).lean().exec()

      try {
        const {
          result: { order: newOrder }
        } = await squareClient.ordersApi.createOrder({
          idempotencyKey: idempotencyKey,
          order: {
            locationId: locationId,
            lineItems: lineItems,
            metadata: {
              cohenId: cohenId || 'N/A',
              studentId: studentId || 'N/A',
              submissionTime: submissionTime || 'N/A'
            },
            fulfillments: [
              {
                type: 'PICKUP',
                state: 'PROPOSED',
                pickupDetails: {
                  pickupAt: pickupTime,
                  recipient: {
                    displayName: recipient.name,
                    emailAddress: recipient.email,
                    phoneNumber: recipient.phone
                  }
                }
              }
            ],
            state: 'OPEN'
          }
        })

        await OrderTracker.create({
          note,
          roomNumber,
          pickupTime,
          submissionTime,
          locationId,
          paymentType,
          dataSource: vendorDoc.dataSource,
          status: 'PROPOSED',
          orderId: newOrder.id,
          vendor: vendor
        })

        const order = orderParse(newOrder)

        console.log(order.fulfillment.pickupDetails.recipient)

        pubsub.publish('orderCreated', {
          orderCreated: order
        })

        TwilioClient.messages.create({
          body: 'Your order has been placed.',
          from: '+13466667153',
          to: order.fulfillment.pickupDetails.recipient.phone
        })

        return order
      } catch (error) {
        if (error instanceof ApiError) {
          throw new ApolloError(
            `Creating new order on Square failed because ${JSON.stringify(
              error.result
            )}`
          )
        }

        throw new ApolloError('Something went wrong when creating new order')
      }
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

      const squareClient = squareClients.get(vendor)

      const order = await orderFetchAndParse(squareClient, orderId)
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
