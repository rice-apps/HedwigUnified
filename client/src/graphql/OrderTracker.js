import { gql } from '@apollo/client'

const ORDER_TRACKER = gql`
  query ORDER_TRACKER($orderId: String!) {
    getOrderTracker(filter: { orderId: $orderId }) {
      shopifyOrderId
      paymentType
    }
  }
`

export default ORDER_TRACKER
