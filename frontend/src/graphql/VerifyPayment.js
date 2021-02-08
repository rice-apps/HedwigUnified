import gql from 'graphql-tag.macro'

const VERIFY_PAYMENT = gql`
  query verifyPayment(
    $paymentId: String
    $vendor: String!
    $source: DataSourceEnum
  ) {
    verifyPayment(paymentId: $paymentId, vendor: $vendor, source: $source)
  }
`

export default VERIFY_PAYMENT
