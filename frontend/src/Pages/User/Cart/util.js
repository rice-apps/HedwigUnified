import gql from 'graphql-tag.macro'
import { v4 as uuidv4 } from 'uuid'
import moment from 'moment'

export const GET_VENDOR = gql`
  query GET_VENDOR($filter: FilterFindOneVendorsInput!) {
    getVendor(filter: $filter) {
      name
      pickupInstruction
      dataSource
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
    $note: String
    $roomNumber: String
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
        note: $note
        roomNumber: $roomNumber
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
    $sourceId: String!
    $source: DataSourceEnum!
  ) {
    createPayment(
      vendor: $vendor
      record: {
        source: $source
        sourceId: $sourceId
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
  mutation($paymentId: String, $orderId: String!) {
    updateOrderTracker(
      record: { paymentId: $paymentId}
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

export const createRecord = (items, paymentType, cohenId, note, room) => {
  const recipient = getRecipient()
  const user = JSON.parse(localStorage.getItem('userProfile'))
  const order = JSON.parse(localStorage.getItem('order'))
  let timePlaceHolder = null
  if (order.vendor.name === 'Test Account CMT') {
    paymentType = 'None'
    timePlaceHolder = moment().format()
  }
  return {
    vendor: order.vendor.name,
    studentId: user.studentId,
    key: uuidv4(),
    lineItems: getLineItems(items),
    name: recipient.name,
    phone: recipient.phone,
    email: recipient.email,
    pickupTime: order.pickupTime
      ? moment(order.pickupTime).format() : timePlaceHolder,
    submissionTime: moment().toISOString(),
    location: order.vendor.locationIds[0],
    type: paymentType,
    cohenId: cohenId,
    note: note,
    roomNumber: room
  }
}


export const checkNullFields = (source, vendorName) => {
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
    return 'cohen id'
  }
  if (vendorName === 'Test Account CMT' && !source.variables.roomNumber) {
    return 'room number'
  }
  return null
}


export const resetOrderSummary = () => {
  localStorage.setItem(
    'order',
    JSON.stringify({ vendor: {}, pickupTime: null, fulfillment: {} })
  )
}
