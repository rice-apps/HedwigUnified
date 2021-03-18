import gql from 'graphql-tag.macro'

const FIND_DONE_ORDERS = gql`
    query FIND_ORDERS($location: [String!]!, $vendor: String!, $neededOrderIds: [String!]!) {
        findOrders(locations: $location, vendor: $vendor, 
        neededOrderIds: $neededOrderIds, filterById: true) {
        orders {
            id
            studentId
            cohenId
            submissionTime
            customer {
            name
            email
            phone
            }
            items {
            name
            quantity
            variationName
            modifiers {
                name
                basePriceMoney {
                amount
                }
                totalPriceMoney {
                amount
                }
            }
            totalMoney {
                amount
            }
            totalTax {
                amount
            }
            }
            total {
            amount
            }
            totalTax {
            amount
            }
            totalDiscount {
            amount
            }
            fulfillment {
            uid
            state
            pickupDetails {
                pickupAt
            }
        }
      }
    }
  }
`

export {FIND_DONE_ORDERS}