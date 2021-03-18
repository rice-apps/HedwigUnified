import gql from 'graphql-tag.macro'

const ORDER_TRACKER = gql`
  query ORDER_TRACKER($orderId: String!) {
    getOrderTracker(filter: { orderId: $orderId }) {
      shopifyOrderId
      paymentType
      note
      roomNumber
      paymentId
      dataSource
    }
  }
`

const GET_COMPLETED_ORDERS = gql`
  query GET_ORDERS($vendor: String!){
    getOrderTrackers(filter: {status: "COMPLETED", vendor: $vendor}){
      status
      merchantId
      vendor
      submissionTime
      orderId
      paymentId
    }
  }
`

export {ORDER_TRACKER, GET_COMPLETED_ORDERS}
