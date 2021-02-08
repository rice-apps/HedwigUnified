import gql from 'graphql-tag.macro'
import { v4 as uuidv4 } from 'uuid'
import moment from 'moment'

export const GET_VENDOR = gql`
  query GET_VENDOR($filter: FilterFindOneVendorsInput!) {
    getVendor(filter: $filter) {
      name
      pickupInstruction
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
    $pickupTime: String!
    $submissionTime: String!
    $key: String!
    $lineItems: [LineItemInput]!
    $location: String!
    $type: PaymentSourceEnum!
    $cohenId: String
    $email: String!
    $vendor: String!
  ) {
    createOrder(
      locationId: $location
      vendor: $vendor
      record: {
        studentId: $studentId
        idempotencyKey: $key
        lineItems: $lineItems
        recipient: { name: $name, phone: $phone, email: $email }
        pickupTime: $pickupTime
        submissionTime: $submissionTime
        paymentType: $type
        cohenId: $cohenId
      }
    ) {
      id
      submissionTime
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
          catalogObjectId
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
    $vendor: String!
  ) {
    createPayment(
      vendor: $vendor
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
  const user = JSON.parse(localStorage.getItem('userProfile'))
  return {
    name: user.name,
    phone: user.phone,
    email: user.netid + '@rice.edu'
  }
}

const getLineItems = items => {
  const rtn = []
  for (const [, item] of Object.entries(items)) {
    const modifierList = []
    for (const [, m] of Object.entries(item.modifierLists)) {
      modifierList.push({
        catalogObjectId: m.dataSourceId
      })
    }
    const i = {
      modifiers: modifierList,
      catalogObjectId: item.variant.dataSourceId,
      quantity: item.quantity.toString()
      // variation_name: item.variant.name,
    }
    rtn.push(i)
  }
  return rtn
}

export const createRecord = (items, paymentType, cohenId) => {
  const recipient = getRecipient()
  const user = JSON.parse(localStorage.getItem('userProfile'))
  const order = JSON.parse(localStorage.getItem('order'))
  return {
    vendor: order.vendor.name,
    studentId: user.studentId,
    key: uuidv4(),
    lineItems: getLineItems(items),
    name: recipient.name,
    phone: recipient.phone,
    email: recipient.email,
    pickupTime: order.pickupTime ? moment(order.pickupTime).format() : null,
    submissionTime: moment().toISOString(),
    location: order.vendor.locationIds[0],
    type: paymentType,
    cohenId: cohenId
  }
}

export const checkNullFields = source => {
  const fields = ['name', 'phone', 'studentId', 'type', 'pickupTime']
  const detailedInfo = [
    'name',
    'phone number',
    'rice student id',
    'payment method',
    'pickup time'
  ]
  let field
  for (field in fields) {
    if (!source.variables[fields[field]]) {
      console.log(detailedInfo[field])
      return detailedInfo[field]
    }
  }
  if (source.variables.type === 'COHEN' && !source.variables.cohenId) {
    console.log('no cohen id')
    return 'cohen id'
  }
  return null
}

export const resetOrderSummary = () => {
  localStorage.setItem(
    'order',
    JSON.stringify({ vendor: {}, pickupTime: null, fulfillment: {} })
  )
}
