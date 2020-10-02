import {
  OrdersApi,
  CreateOrderRequest,
  UpdateOrderRequest,
  SearchOrdersRequest
} from 'square-connect'
import { GraphQLNonNull, GraphQLString } from 'graphql'
import { ApolloError } from 'apollo-server-express'
import { CreateOrderInputTC, OrderTC } from '../models'
import pubsub from '../utils/pubsub'
import {
  FilterOrderInputTC,
  SortOrderInputTC,
  FindManyOrderPayloadTC,
  UpdateOrderInputTC
} from '../models/OrderModel'
import TwilioClient from '../twilio'
import { v4 as uuid } from 'uuid'

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

    const returnedOrders = orders.map(order => ({
      id: order.id,
      merchant: order.location_id,
      customer: order.customer_id,
      items: order.line_items,
      totalTax: order.total_tax_money,
      totalDiscount: order.total_discount_money,
      total: order.total_money,
      orderStatus: order.state,
      fulfillmentStatus: order.fulfillments[0].state,
      fulfillmentId: order.fulfillments[0].uid
    }))

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
        record: { idempotencyKey, lineItems, recipient, pickupTime }
      } = args

      const api = new OrdersApi()

      const orderResponse = await api.createOrder({
        ...new CreateOrderRequest(),
        idempotency_key: idempotencyKey,
        order: {
          location_id: locationId,
          line_items: lineItems,
          customer_id: recipient,
          fulfillments: [
            {
              type: 'PICKUP',
              state: 'PROPOSED',
              pickup_details: {
                pickup_at: pickupTime,
                recipient: {
                  display_name: recipient
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

      const {
        order: {
          id,
          location_id,
          customer_id,
          line_items,
          total_tax_money,
          total_discount_money,
          total_money,
          state,
          fulfillments: [first]
        }
      } = orderResponse

      const CDMOrder = {
        id,
        merchant: location_id,
        customer: customer_id,
        items: line_items,
        totalTax: total_tax_money,
        totalDiscount: total_discount_money,
        total: total_money,
        orderStatus: state,
        fulfillmentStatus: first.state
      }

      pubsub.publish('orderCreated', {
        orderCreated: CDMOrder
      })

      TwilioClient.messages.create({
        body: 'Your order has been placed.',
        from: '+13466667153',
        to: '+14692475650'
      })

      return CDMOrder
    }
  })
  .addResolver({
    name: 'updateOrder',
    type: OrderTC,
    args: {
      orderId: GraphQLNonNull(GraphQLString),
      fulfillmentId: 'String!',
      record: UpdateOrderInputTC
    },
    resolve: async ({ args }) => {
      const {
        orderId,
        fulfillmentId,
        record: { orderStatus, fulfillmentStatus }
      } = args

      const api = new OrdersApi()

      await api.payOrder(orderId, {
        idempotency_key: uuid(),
        payment_ids: []
      })

      const updateOrderResponse = await api.updateOrder(orderId, {
        order: {
          state: orderStatus,
          version: 1,
          fulfillments: [
            {
              uid: fulfillmentId,
              state: fulfillmentStatus
            }
          ]
        }
      })

      if (updateOrderResponse.errors) {
        return new ApolloError(
          `Order couldn't be updated due to reason: ${updateOrderResponse.errors}`
        )
      }

      const {
        order: {
          id,
          location_id,
          customer_id,
          line_items,
          total_tax_money,
          total_discount_money,
          total_money,
          state,
          fulfillments: [first]
        }
      } = updateOrderResponse

      const CDMOrder = {
        id,
        merchant: location_id,
        customer: customer_id,
        items: line_items,
        totalTax: total_tax_money,
        totalDiscount: total_discount_money,
        total: total_money,
        orderStatus: state,
        fulfillmentStatus: first.state
      }

      pubsub.publish('orderUpdated', {
        orderUpdated: CDMOrder
      })

      switch (first.state) {
        case 'PROPOSED':
          TwilioClient.messages.create({
            body: 'Your order has been placed.',
            from: '+13466667153',
            to: '+14692475650'
          })
        case 'PREPARED':
          TwilioClient.messages.create({
            body:
              'Your recent order has been prepared. Please go to the pickup location',
            from: '+13466667153',
            to: '+14692475650'
          })
          break
        case 'COMPLETED':
          TwilioClient.messages.create({
            body:
              'Your order has been picked up. If you did not do this, please contact the vendor directly.',
            from: '+13466667153',
            to: '+14692475650'
          })
          break
        case 'CANCELED':
          TwilioClient.messages.create({
            body:
              'Your order has been cancelled. To reorder, please visit https://hedwig.riceapps.org/',
            from: '+13466667153',
            to: '+14692475650'
          })
          break
        default:
          TwilioClient.messages.create({
            body:
              'Your order has been updated. Please check https://hedwig.riceapps.org/ for more details',
            from: '+13466667153',
            to: '+14692475650'
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
