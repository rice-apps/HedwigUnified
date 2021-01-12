import { gql } from '@apollo/client'

const VERIFY_PAYMENT = gql`
  query verifyPayment($orderId: String!) {
    verifyPayment(orderId: $orderId)
  }
`

export default VERIFY_PAYMENT
