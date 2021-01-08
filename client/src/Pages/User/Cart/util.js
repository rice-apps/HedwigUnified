import { gql } from '@apollo/client'
import { orderSummary, userProfile } from '../../../apollo'
import { v4 as uuidv4 } from 'uuid'
import moment from 'moment'

export const GET_VENDOR = gql`
  query GET_VENDOR($filter: FilterFindOneVendorsInput!) {
    getVendor(filter: $filter) {
      name
      hours {
        start
        end
        day
        isClosed
      }
      squareInfo {
        merchantId
        locationIds
      }
    }
  }
`

export const CREATE_ORDER = gql`
  mutation(
    $studentId: String!
    $name: String!
    $phone: String!
    $time: String!
    $key: String!
    $lineItems: [LineItemInput]!
    $location: String!
    $type: PaymentSourceEnum!
    $cohenId: String
  ) {
    createOrder(
      locationId: $location
      record: {
        studentId: $studentId
        idempotencyKey: $key
        lineItems: $lineItems
        recipient: { name: $name, phone: $phone }
        pickupTime: $time
        paymentType: $type
        cohenId: $cohenId
      }
    ) {
      id
      total {
        amount
      }
      totalTax {
        amount
      }
      customer {
        name
      }
      fulfillment {
        uid
        state
        pickupDetails {
          pickupAt
          placedAt
        }
      }
      items {
        name
        quantity
        modifiers {
          catalog_object_id
        }
      }
    }
  }
`

export const CREATE_PAYMENT = gql`
  mutation(
    $orderId: String!
    $subtotal: Int!
    $currency: String!
    $location: String!
  ) {
    createPayment(
      record: {
        source: SHOPIFY
        sourceId: "cnon:card-nonce-ok"
        orderId: $orderId
        locationId: $location
        subtotal: { amount: $subtotal, currency: $currency }
      }
    ) {
      id
      url
      total {
        amount
        currency
      }
    }
  }
`

export const UPDATE_ORDER_TRACKER = gql`
  mutation($paymentType: String!, $orderId: String!) {
    updateOrderTracker(
      record: { paymentType: $paymentType }
      filter: { orderId: $orderId }
    ) {
      recordId
    }
  }
`

const getRecipient = () => {
  const user = userProfile()
  return {
    name: user.name,
    phone: user.phone
  }
}

const getLineItems = items => {
  const rtn = []
  for (const [, item] of Object.entries(items)) {
    const modifierList = []
    for (const [, m] of Object.entries(item.modifierLists)) {
      modifierList.push({
        catalog_object_id: m.dataSourceId
      })
    }
    const i = {
      modifiers: modifierList,
      catalog_object_id: item.variant.dataSourceId,
      quantity: item.quantity.toString()
      // variation_name: item.variant.name,
    }
    rtn.push(i)
  }
  return rtn
}

export const createRecord = (items, paymentType, cohenId) => {
  const recipient = getRecipient()
  const user = userProfile()
  console.log(orderSummary())
  return {
    studentId: user.studentId,
    key: uuidv4(),
    lineItems: getLineItems(items),
    name: recipient.name,
    phone: recipient.phone,
    time: orderSummary().time ? moment(orderSummary().time).format() : null,
    location: orderSummary().vendor.locationIds[0],
    type: paymentType,
    cohenId: cohenId
  }
}

export const checkNullFields = source => {
  const fields = ['name', 'phone', 'studentId', 'type', 'time']
  const detailedInfo = [
    'name',
    'phone number',
    'rice student id',
    'payment method',
    'pickup time'
  ]
  let field
  console.log(source)
  for (field in fields) {
    if (!source.variables[fields[field]]) {
      console.log(detailedInfo[field])
      return detailedInfo[field]
    }
  }
  console.log(source.variables.cohenId)
  if (source.variables.type === 'COHEN' && !source.variables.cohenId) {
    console.log('no cohen id')
    return 'cohen id'
  }
  return null
}
