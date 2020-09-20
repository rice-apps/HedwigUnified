import { gql } from '@apollo/client'

//past orders should be "COMPLETED" not "PROPOSED"
const GET_PAST_ORDERS = gql` 
  query getPastOrders{
    findOrders(
      locations: ["FMXAFFWJR95WC"]
      filter: { fulfillment_filter: { fulfillment_states: ["PROPOSED"] } }
    ) {
      cursor
      orders {
        id
        merchant
        customer
        items {
          quantity
          catalog_object_id
        }
        total {
          amount
          currency
        }
        orderStatus
        fulfillmentStatus
      }
    }
  }
`
const GET_FUTURE_ORDERS = gql`
  query getFutureOrders {
    findOrders(
        locations: ["FMXAFFWJR95WC"]
        filter: { fulfillment_filter: { fulfillment_states: ["PROPOSED"] } }
      ) {
        cursor
        orders {
          id
          merchant
          customer
          items {
            quantity
            catalog_object_id
          }
          total {
            amount
            currency
          }
          orderStatus
          fulfillmentStatus
        }
      }
    }
  `

const CANCEL_ORDER = gql`
  mutation CancelOrder($_id: MongoID!) {
    orderUpdateOne(filter: { _id: $_id }, record: { fulfillment: Cancelled }) {
      record {
        _id
        __typename
        fulfillment
      }
    }
  }
`

export {
    GET_PAST_ORDERS,
    GET_FUTURE_ORDERS, 
    CANCEL_ORDER
}