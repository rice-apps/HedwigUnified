import { ApolloError } from 'apollo-server-express'
import {
  CreateOrderInputTC,
  OrderTC,
  OrderTracker,
  FilterOrderInputTC,
  SortOrderInputTC,
  FindManyOrderPayloadTC,
  UpdateOrderTC
} from '../models/index.js'
import { pubsub } from '../utils/pubsub.js'
import squareClient from '../utils/square.js'
import TwilioClient from '../utils/twilio.js'
import { ApiError } from 'square'

OrderTC.addResolver({
  name: 'findOrders',
  type: FindManyOrderPayloadTC,
  args: {
    locations: '[String!]!',
    filter: FilterOrderInputTC,
    sort: SortOrderInputTC,
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
    const { locations, cursor, limit, filter, sort } = args

    const ordersApi = squareClient.ordersApi

    const query = {}

    if (filter) {
      query.filter = filter
    }

    if (sort) {
      query.sort = sort
    }

    try {
      const {
        result: { cursor: newCursor, orders }
      } = await ordersApi.searchOrders({
        locationIds: locations,
        cursor,
        limit,
        query,
        returnEntries: false
      })

      const filteredOrders = orders.filter(
        order => typeof order.fulfillments !== 'undefined'
      )

      const returnedOrders = filteredOrders.map(async order => {
        const orderTracker = await OrderTracker.findOne({ orderId: order.id })

        return {
          id: order.id,
          merchant: order.locationId,
          customer: {
            name: order.fulfillments[0].pickupDetails.recipient.displayName,
            email: order.fulfillments[0].pickupDetails.recipient.emailAddress,
            phone: order.fulfillments[0].pickupDetails.recipient.phoneNumber
          },
          items: order.lineItems.map(lineItem => ({
            name: lineItem.name,
            quantity: lineItem.quantity,
            catalogObjectId: lineItem.catalogObjectId,
            variationName: lineItem.variationName,
            totalMoney: lineItem.totalMoney,
            totalTax: lineItem.totalTaxMoney,
            modifiers: lineItem.modifiers?.map(modifier => ({
              uid: modifier.uid,
              catalogObjectId: modifier.catalogObjectId,
              name: modifier.name,
              basePriceMoney: modifier.basePriceMoney,
              totalPriceMoney: modifier.totalPriceMoney
            }))
          })),
          totalTax: order.totalTaxMoney,
          totalDiscount: order.totalDiscountMoney,
          total: order.totalMoney,
          orderStatus: order.state,
          cohenId: order.metadata?.cohenId,
          studentId: order.metadata?.studentId,
          fulfillment: {
            uid: order.fulfillments[0].uid,
            state: orderTracker?.status || order.fulfillments[0].state,
            pickupDetails: {
              pickupAt: order.fulfillments[0].pickupDetails.pickupAt,
              placedAt: order.fulfillments[0].pickupDetails.placedAt,
              recipient: {
                name: order.fulfillments[0].pickupDetails.recipient.displayName,
                email:
                  order.fulfillments[0].pickupDetails.recipient.emailAddress,
                phone: order.fulfillments[0].pickupDetails.recipient.phoneNumber
              }
            }
          }
        }
      })

      return {
        cursor: newCursor,
        orders: returnedOrders
      }
    } catch (error) {
      if (error instanceof ApiError) {
        return new ApolloError(
          `Finding orders using Square failed because ${error.result}`
        )
      }

      return new ApolloError(`Something went wrong finding orders`)
    }
  }
})
  .addResolver({
    name: 'createOrder',
    type: OrderTC,
    args: {
      locationId: 'String!',
      record: CreateOrderInputTC.getTypeNonNull().getType()
    },
    resolve: async ({ args }) => {
      const {
        locationId,
        record: {
          idempotencyKey,
          lineItems,
          recipient,
          pickupTime,
          cohenId,
          studentId,
          paymentType
        }
      } = args

      const ordersApi = squareClient.ordersApi

      try {
        const {
          result: { order }
        } = await ordersApi.createOrder({
          idempotencyKey: idempotencyKey,
          order: {
            locationId: locationId,
            lineItems: lineItems,
            metadata: {
              cohenId: cohenId || 'N/A',
              studentId: studentId || 'N/A'
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
          status: 'PROPOSED',
          pickupTime: pickupTime,
          locationId: locationId,
          orderId: order.id,
          paymentType: paymentType
        })

        const CDMOrder = {
          id: order.id,
          merchant: order.locationId,
          customer: {
            name: order.fulfillments[0].pickupDetails.recipient.displayName,
            email: order.fulfillments[0].pickupDetails.recipient.emailAddress,
            phone: order.fulfillments[0].pickupDetails.recipient.phoneNumber
          },
          items: order.lineItems.map(lineItem => ({
            name: lineItem.name,
            quantity: lineItem.quantity,
            catalogObjectId: lineItem.catalogObjectId,
            variationName: lineItem.variationName,
            totalMoney: lineItem.totalMoney,
            totalTax: lineItem.totalTaxMoney,
            modifiers: lineItem.modifiers?.map(modifier => ({
              uid: modifier.uid,
              catalogObjectId: modifier.catalogObjectId,
              name: modifier.name,
              basePriceMoney: modifier.basePriceMoney,
              totalPriceMoney: modifier.totalPriceMoney
            }))
          })),
          totalTax: order.totalTaxMoney,
          totalDiscount: order.totalDiscountMoney,
          total: order.totalMoney,
          orderStatus: order.state,
          cohenId: order.metadata?.cohenId,
          studentId: order.metadata?.studentId,
          fulfillment: {
            uid: order.fulfillments[0].uid,
            state: order.fulfillments[0].state,
            pickupDetails: {
              pickupAt: order.fulfillments[0].pickupDetails.pickupAt,
              placedAt: order.fulfillments[0].pickupDetails.placedAt,
              recipient: {
                name: order.fulfillments[0].pickupDetails.recipient.displayName,
                email:
                  order.fulfillments[0].pickupDetails.recipient.emailAddress,
                phone: order.fulfillments[0].pickupDetails.recipient.phoneNumber
              }
            }
          }
        }

        pubsub.publish('orderCreated', {
          orderCreated: CDMOrder
        })

        TwilioClient.messages.create({
          body: 'Your order has been placed.',
          from: '+13466667153',
          to: order.fulfillments[0].pickupDetails.recipient.phoneNumber
        })

        return CDMOrder
      } catch (error) {
        if (error instanceof ApiError) {
          return new ApolloError(
            `Creating new order on Square failed because ${error.result}`
          )
        }
        return new ApolloError('Something went wrong when creating new order')
      }
    }
  })
  .addResolver({
    name: 'updateOrder',
    type: OrderTC,
    args: {
      orderId: 'String!',
      record: UpdateOrderTC.getType()
    },
    resolve: async ({ args }) => {
      const {
        orderId,
        record: { fulfillment }
      } = args

      const updatedOrderTracker = await OrderTracker.findOne({
        orderId: orderId
      })

      updatedOrderTracker.status = fulfillment.state

      await updatedOrderTracker.save()

      const ordersApi = squareClient.ordersApi

      try {
        const {
          result: { order }
        } = await ordersApi.retrieveOrder(orderId)

        const CDMOrder = {
          id: order.id,
          merchant: order.locationId,
          customer: {
            name: order.fulfillments[0].pickupDetails.recipient.displayName,
            email: order.fulfillments[0].pickupDetails.recipient.emailAddress,
            phone: order.fulfillments[0].pickupDetails.recipient.phoneNumber
          },
          items: order.lineItems.map(lineItem => ({
            name: lineItem.name,
            quantity: lineItem.quantity,
            catalogObjectId: lineItem.catalogObjectId,
            variationName: lineItem.variationName,
            totalMoney: lineItem.totalMoney,
            totalTax: lineItem.totalTaxMoney,
            modifiers: lineItem.modifiers?.map(modifier => ({
              uid: modifier.uid,
              catalogObjectId: modifier.catalogObjectId,
              name: modifier.name,
              basePriceMoney: modifier.basePriceMoney,
              totalPriceMoney: modifier.totalPriceMoney
            }))
          })),
          totalTax: order.totalTaxMoney,
          totalDiscount: order.totalDiscountMoney,
          total: order.totalMoney,
          orderStatus: order.state,
          cohenId: order.metadata?.cohenId,
          studentId: order.metadata?.studentId,
          fulfillment: {
            uid: order.fulfillments[0].uid,
            state: updatedOrderTracker.status,
            pickupDetails: {
              pickupAt: order.fulfillments[0].pickupDetails.pickupAt,
              placedAt: order.fulfillments[0].pickupDetails.placedAt,
              recipient: {
                name: order.fulfillments[0].pickupDetails.recipient.displayName,
                email:
                  order.fulfillments[0].pickupDetails.recipient.emailAddress,
                phone: order.fulfillments[0].pickupDetails.recipient.phoneNumber
              }
            }
          }
        }

        pubsub.publish('orderUpdated', {
          orderUpdated: CDMOrder
        })

        switch (updatedOrderTracker.status) {
          case 'PREPARED':
            TwilioClient.messages.create({
              body:
                'Your recent order has been prepared. Please go to the pickup location',
              from: '+13466667153',
              to: order.fulfillments[0].pickupDetails.recipient.phoneNumber
            })
            break
          case 'COMPLETED':
            TwilioClient.messages.create({
              body:
                'Your order has been picked up. If you did not do this, please contact the vendor directly.',
              from: '+13466667153',
              to: order.fulfillments[0].pickupDetails.recipient.phoneNumber
            })
            break
          case 'CANCELED':
            TwilioClient.messages.create({
              body:
                'Your order has been cancelled. To reorder, please visit https://hedwig.riceapps.org/',
              from: '+13466667153',
              to: order.fulfillments[0].pickupDetails.recipient.phoneNumber
            })
            break
          default:
            TwilioClient.messages.create({
              body:
                'Your order has been updated. Please check https://hedwig.riceapps.org/ for more details',
              from: '+13466667153',
              to: order.fulfillments[0].pickupDetails.recipient.phoneNumber
            })
        }

        return CDMOrder
      } catch (error) {
        if (error instanceof ApiError) {
          return new ApolloError(
            `Updating order ${orderId} using Square failed because ${error.result}`
          )
        }
        return new ApolloError(
          `Something went wrong when updating order ${orderId}`
        )
      }
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
