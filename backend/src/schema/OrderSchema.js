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
import { squareClients, orderParse } from '../utils/square.js'
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

      if (!orders) {
        return {
          cursor: newCursor,
          orders: []
        }
      }

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
      console.log(error)
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

      const vendorDoc = await Vendor.findOne({ name: vendor })
        .lean()
        .exec()

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

        pubsub.publish('orderCreated', {
          orderCreated: order
        })

        // TwilioClient.messages.create({
        //   body:
        //     'Your order with Cohen House has been placed. If you need to contact Cohen House, please call them at (713) 348-4000.',
        //   from: '+13466667153',
        //   to: order.fulfillment.pickupDetails.recipient.phone
        // })

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

      const vendorData = await Vendor.findOne({ name: vendor })
        .lean()
        .exec()

      const squareClient = squareClients.get(vendor)

      /** @type {import('square').Order} */
      let order

      try {
        order = (await squareClient.ordersApi.retrieveOrder(orderId)).result
          .order
      } catch (error) {
        if (error instanceof ApiError) {
          throw new ApolloError(
            `Can't retrive existing order from Square: ${JSON.stringify(
              error.result
            )}`
          )
        }

        throw new ApolloError(
          `Something went wrong retrieving existing order: ${JSON.stringify(
            error
          )}`
        )
      }

      if (updatedOrderTracker.status === fulfillment.state) {
        return orderParse(order)
      }

      if (
        vendorData.dataSource === 'SQUARE' &&
        updatedOrderTracker.paymentType === 'CREDIT'
      ) {
        try {
          order = (
            await squareClient.ordersApi.updateOrder(orderId, {
              order: {
                version: order.version,
                locationId: order.locationId,
                fulfillments: [
                  {
                    uid: order.fulfillments[0].uid,
                    state: fulfillment.state
                  }
                ],
                state:
                  fulfillment.state === 'COMPLETED' ||
                  fulfillment.state === 'CANCELED'
                    ? fulfillment.state
                    : 'OPEN'
              }
            })
          ).result.order
        } catch (error) {
          if (error instanceof ApiError) {
            throw new ApolloError(
              `Updating order in Square failed: ${JSON.stringify(error.result)}`
            )
          }

          throw new ApolloError(
            `Something went wrong updating order on Square: ${JSON.stringify(
              error
            )}`
          )
        }
      }

      updatedOrderTracker.status = fulfillment.state

      updatedOrderTracker.save()

      const parsedOrder = orderParse(order)

      parsedOrder.fulfillment.state = fulfillment.state

      pubsub.publish('orderUpdated', {
        orderUpdated: parsedOrder
      })

      switch (updatedOrderTracker.status) {
        case 'PREPARED':
          TwilioClient.messages.create({
            body:
              'Your order with Cohen House is ready for pickup. Please remember to wear a mask and socially distance! ',
            from: '+13466667153',
            to: parsedOrder.fulfillment.pickupDetails.recipient.phone
          })
          break
        case 'COMPLETED':
          TwilioClient.messages.create({
            body:
              'Your order with Cohen House has been picked up. If you did not pick up the order, please call them at (713) 348-4000. Tell us how your ordering and food experience was by filling out the survey here: https://forms.gle/BzW3C8JAnXD7N6Jz7 ',
            from: '+13466667153',
            to: parsedOrder.fulfillment.pickupDetails.recipient.phone
          })
          break
        case 'CANCELED':
          TwilioClient.messages.create({
            body:
              'You order with Cohen House has been cancelled. If you would like to contact Cohen House about your order, please call them at (713) 348-4000',
            from: '+13466667153',
            to: parsedOrder.fulfillment.pickupDetails.recipient.phone
          })
          break
        default:
          TwilioClient.messages.create({
            body:
              'Your order with Cohen House has been accepted and is being prepared. Please do not come to pick up your order until you receive a text asking you to do so.',
            from: '+13466667153',
            to: parsedOrder.fulfillment.pickupDetails.recipient.phone
          })
      }

      return parsedOrder
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
