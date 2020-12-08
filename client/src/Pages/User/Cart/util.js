import { gql } from '@apollo/client'
import { orderSummary } from '../../../apollo'
import { v4 as uuidv4 } from 'uuid'
import moment from 'moment'

export const GET_VENDOR = gql`
  query {
    getVendors {
      name
      hours {
        day
        start
        end
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
    $email: String!
    $time: String!
    $key: String!
    $lineItems: [LineItemInput]!
  ) {
    createOrder(
      locationId: "FMXAFFWJR95WC"
      record: {
        studentId: $studentId
        idempotencyKey: $key
        lineItems: $lineItems
        recipient: { name: $name, phone: $phone, email: $email }
        pickupTime: $time
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
  mutation($orderId: String!, $subtotal: Int!, $currency: String!) {
    createPayment(
      record: {
        source: SQUARE
        sourceId: "cnon:card-nonce-ok"
        orderId: $orderId
        locationId: "FMXAFFWJR95WC"
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

const sStorage = localStorage
const getRecipient = () => {
  return {
    name: sStorage.getItem('first name') + ' ' + sStorage.getItem('last name'),
    phone: sStorage.getItem('phone'),
    email: sStorage.getItem('email')
  }
}

const getLineItems = items => {
  const rtn = []
  const item = null
  for (const [v, item] of Object.entries(items)) {
    const modifierList = []
    for (const [k, m] of Object.entries(item.modifierLists)) {
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

export const createRecord = items => {
  const recipient = getRecipient()
  return {
    studentId: sStorage.getItem('id'),
    key: uuidv4(),
    lineItems: getLineItems(items),
    name: recipient.name,
    phone: recipient.phone,
    email: recipient.email,
    time: orderSummary().time.format()
  }
}
