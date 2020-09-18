import { gql } from '@apollo/client'

const GET_PAST_ORDERS = gql`
  query getOrders {
    findOrders(
        locations: ["FMXAFFWJR95WC"]
        filter: { fulfillment_filter: { fulfillment_states: ["COMPLETED"] } }
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
  query getOrders {
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