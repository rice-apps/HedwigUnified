import gql from 'graphql-tag.macro'

const COMPLETE_PAYMENT = gql`
  mutation CompletePayment(
    $vendor: String!
    $paymentId: String!
    $source: DataSourceEnum
    $money: MoneyInput
  ) {
    completePayment(
      vendor: $vendor
      paymentId: $paymentId
      source: $source
      money: $money
    ) {
      id
      order
      subtotal {
        amount
        currency
      }
    }
  }
`

export { COMPLETE_PAYMENT }
