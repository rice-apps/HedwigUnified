import {
  OrdersApi,
  CreateOrderRequest,
  SearchOrdersRequest
} from 'square-connect'
import { GraphQLNonNull, GraphQLString } from 'graphql'
import { ApolloError } from 'apollo-server-express'
import { CreateOrderInputTC, OrderTC, OrderTracker } from '../models'
import pubsub from '../utils/pubsub'
import {
  FilterOrderInputTC,
  SortOrderInputTC,
  FindManyOrderPayloadTC,
  UpdateOrderTC
} from '../models/OrderModel'
import TwilioClient from '../twilio'

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

    const api = new OrdersApi()

    const query = {}

    if (filter) {
      query.filter = filter
    }

    if (sort) {
      query.sort = sort
    }

    const searchOrderResponse = await api.searchOrders({
      ...new SearchOrdersRequest(),
      location_ids: locations,
      cursor,
      limit,
      query,
      return_entries: false
    })

    if (searchOrderResponse.errors) {
      return new ApolloError(
        `Finding orders failed with errors: ${searchOrderResponse.errors}`
      )
    }

    const { cursor: newCursor, orders } = searchOrderResponse

    const returnedOrders = orders.map(async order => {
      const orderTracker = await OrderTracker.findOne({ orderId: order.id })

      return {
        id: order.id,
        merchant: order.location_id,
        customer: {
          name: order.fulfillments[0].pickup_details.recipient.display_name,
          email: order.fulfillments[0].pickup_details.recipient.email_address,
          phone: order.fulfillments[0].pickup_details.recipient.phone_number
        },
        items: order.line_items?.map(lineItem => ({
          name: lineItem.name,
          quantity: lineItem.quantity,
          catalog_object_id: lineItem.catalog_object_id,
          variation_name: lineItem.variation_name,
          total_money: lineItem.total_money,
          total_tax: lineItem.total_tax,
          modifiers: lineItem.modifiers?.map(modifier => ({
            uid: modifier.uid,
            catalog_object_id: modifier.catalog_object_id,
            name: modifier.name,
            base_price_money: modifier.base_price_money,
            total_price_money: modifier.total_price_money
          }))
        })),
        totalTax: order.total_tax_money,
        totalDiscount: order.total_discount_money,
        total: order.total_money,
        orderStatus: order.state,
        cohenId: order.metadata?.cohenId,
        studentId: order.metadata?.studentId,
        fulfillment: {
          uid: order.fulfillments[0].uid,
          state: orderTracker?.status || order.fulfillments[0].state,
          pickupDetails: {
            pickupAt: order.fulfillments[0].pickup_details.pickup_at,
            placedAt: order.fulfillments[0].pickup_details.placed_at,
            recipient: {
              name: order.fulfillments[0].pickup_details.recipient.display_name,
              email:
                order.fulfillments[0].pickup_details.recipient.email_address,
              phone: order.fulfillments[0].pickup_details.recipient.phone_number
            }
          }
        }
      }
    })

    return {
      cursor: newCursor,
      orders: returnedOrders
    }
  }
})
  .addResolver({
    name: 'createOrder',
    type: OrderTC,
    args: {
      locationId: GraphQLNonNull(GraphQLString),
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

      const api = new OrdersApi()

      const orderResponse = await api.createOrder({
        ...new CreateOrderRequest(),
        idempotency_key: idempotencyKey,
        order: {
          location_id: locationId,
          line_items: lineItems,
          metadata: {
            cohenId: cohenId || null,
            studentId: studentId || null
          },
          fulfillments: [
            {
              type: 'PICKUP',
              state: 'PROPOSED',
              pickup_details: {
                pickup_at: pickupTime,
                recipient: {
                  display_name: recipient.name,
                  email_address: recipient.email,
                  phone_number: recipient.phone
                }
              }
            }
          ],
          state: 'OPEN'
        }
      })

      if (orderResponse.errors) {
        return new ApolloError(
          `New order couldn't be created due to reason: ${orderResponse.errors}`
        )
      }

      OrderTracker.create({
        status: 'PROPOSED',
        pickupTime: pickupTime,
        locationId: locationId,
        orderId: orderResponse.order.id,
        paymentType: paymentType
      })

      const {
        order: {
          id,
          location_id,
          line_items,
          total_tax_money,
          total_discount_money,
          total_money,
          state,
          fulfillments: [first]
        }
      } = orderResponse

      console.log(line_items[0].modifiers)

      const CDMOrder = {
        id: id,
        merchant: location_id,
        customer: {
          name: first.pickup_details.recipient.display_name,
          email: first.pickup_details.recipient.email_address,
          phone: first.pickup_details.recipient.phone_number
        },
        items: line_items.map(lineItem => ({
          name: lineItem.name,
          quantity: lineItem.quantity,
          catalog_object_id: lineItem.catalog_object_id,
          variation_name: lineItem.variation_name,
          total_money: lineItem.total_money,
          total_tax: lineItem.total_tax,
          modifiers: lineItem.modifiers?.map(modifier => ({
            uid: modifier.uid,
            catalog_object_id: modifier.catalog_object_id,
            name: modifier.name,
            base_price_money: modifier.base_price_money,
            total_price_money: modifier.total_price_money
          }))
        })),
        totalTax: total_tax_money,
        totalDiscount: total_discount_money,
        total: total_money,
        orderStatus: state,
        cohenId: orderResponse.order.metadata?.cohenId,
        studentId: orderResponse.order.metadata?.studentId,
        fulfillment: {
          uid: first.uid,
          state: first.state,
          pickupDetails: {
            pickupAt: first.pickup_details.pickup_at,
            placedAt: first.pickup_details.placed_at,
            recipient: {
              name: first.pickup_details.recipient.display_name,
              email: first.pickup_details.recipient.email_address,
              phone: first.pickup_details.recipient.phone_number
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
        to: first.pickup_details.recipient.phone_number
      })

      return CDMOrder
    }
  })
  .addResolver({
    name: 'updateOrder',
    type: OrderTC,
    args: {
      orderId: GraphQLNonNull(GraphQLString),
      record: UpdateOrderTC.getType()
    },
    resolve: async ({ args }) => {
      const {
        orderId,
        record: { orderStatus, cohenId, studentId, fulfillment }
      } = args

      const updatedOrderTracker = await OrderTracker.findOne({
        orderId: orderId
      })

      updatedOrderTracker.status = fulfillment.state

      await updatedOrderTracker.save()

      const api = new OrdersApi()

      const batchRetriveOrderResponse = await api.batchRetrieveOrders({
        order_ids: [orderId]
      })

      if (batchRetriveOrderResponse.errors) {
        return new ApolloError(
          `Order couldn't be updated due to reason: ${batchRetriveOrderResponse.errors}`
        )
      }

      const {
        id,
        location_id,
        line_items,
        total_tax_money,
        total_discount_money,
        total_money,
        state,
        fulfillments: [first]
      } = batchRetriveOrderResponse.orders[0]

      const CDMOrder = {
        id: id,
        merchant: location_id,
        customer: {
          name: first.pickup_details.recipient.display_name,
          email: first.pickup_details.recipient.email_address,
          phone: first.pickup_details.recipient.phone_number
        },
        items: line_items.map(lineItem => ({
          name: lineItem.name,
          quantity: lineItem.quantity,
          catalog_object_id: lineItem.catalog_object_id,
          variation_name: lineItem.variation_name,
          total_money: lineItem.total_money,
          total_tax: lineItem.total_tax,
          modifiers: lineItem.modifiers?.map(modifier => ({
            uid: modifier.uid,
            catalog_object_id: modifier.catalog_object_id,
            name: modifier.name,
            base_price_money: modifier.base_price_money,
            total_price_money: modifier.total_price_money
          }))
        })),
        totalTax: total_tax_money,
        totalDiscount: total_discount_money,
        total: total_money,
        orderStatus: state,
        cohenId: cohenId,
        studentId: studentId,
        fulfillment: {
          uid: first.uid,
          state: updatedOrderTracker.status,
          pickupDetails: {
            pickupAt: first.pickup_details.pickup_at,
            placedAt: first.pickup_details.placed_at,
            recipient: {
              name: first.pickup_details.recipient.display_name,
              email: first.pickup_details.recipient.email_address,
              phone: first.pickup_details.recipient.phone_number
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
            to: first.pickup_details.recipient.phone_number
          })
          break
        case 'COMPLETED':
          TwilioClient.messages.create({
            body:
              'Your order has been picked up. If you did not do this, please contact the vendor directly.',
            from: '+13466667153',
            to: first.pickup_details.recipient.phone_number
          })
          break
        case 'CANCELED':
          TwilioClient.messages.create({
            body:
              'Your order has been cancelled. To reorder, please visit https://hedwig.riceapps.org/',
            from: '+13466667153',
            to: first.pickup_details.recipient.phone_number
          })
          break
        default:
          TwilioClient.messages.create({
            body:
              'Your order has been updated. Please check https://hedwig.riceapps.org/ for more details',
            from: '+13466667153',
            to: first.pickup_details.recipient.phone_number
          })
      }

      return CDMOrder
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
