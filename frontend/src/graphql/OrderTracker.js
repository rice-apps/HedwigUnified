import gql from 'graphql-tag.macro'

const ORDER_TRACKER = gql`
  query ORDER_TRACKER($orderId: String!) {
    getOrderTracker(filter: { orderId: $orderId }) {
      shopifyOrderId
      paymentType
      note
      roomNumber
    }
  }
`

export default ORDER_TRACKER
