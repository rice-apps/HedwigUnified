import { gql } from "@apollo/client";
import { orderSummary } from "../../../apollo";
import moment from "moment";
const { v4: uuidv4 } = require("uuid");

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
`;

export const CREATE_ORDER = gql`
  mutation(
    $studentId: String!
    $name: String!
    $phone: String!
    $email: String!
    $time: String!
    $key: String!
    $lineItems: [LineItemInput]!
    $location: String!
  ) {
    createOrder(
      locationId: $location
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
`;

export const CREATE_PAYMENT = gql`
  mutation($orderId: String!, $subtotal: Int!, $currency: String!, $location: String!) {
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
`;

export const UPDATE_ORDER_TRACKER = gql`
  mutation($paymentType: String!, $orderId: String!) {
    updateOrderTracker(
      record: { paymentType: $paymentType }
      filter: { orderId: $orderId }
    ) {
      recordId
    }
  }
`;

const sStorage = localStorage;
const getRecipient = () => {
  return {
    name: sStorage.getItem("first name") + " " + sStorage.getItem("last name"),
    phone: sStorage.getItem("phone"),
    email: sStorage.getItem("email"),
  };
};

const getLineItems = (items) => {
  const rtn = [];
  const item = null;
  for (const [v, item] of Object.entries(items)) {
    const modifierList = [];
    for (const [k, m] of Object.entries(item.modifierLists)) {
      modifierList.push({
        catalog_object_id: m.dataSourceId,
      });
    }
    const i = {
      modifiers: modifierList,
      catalog_object_id: item.variant.dataSourceId,
      quantity: item.quantity.toString(),
      // variation_name: item.variant.name,
    };
    rtn.push(i);
  }
  return rtn;
};

export const createRecord = (items) => {
  const recipient = getRecipient();
  console.log("order summary: ", orderSummary());
  return {
    studentId: sStorage.getItem("id"),
    key: uuidv4(),
    lineItems: getLineItems(items),
    name: recipient.name,
    phone: recipient.phone,
    email: recipient.email,
    time: orderSummary().time.format(),
    location: orderSummary().vendor.locationIds[0]
  };
};

export const checkNullFields = () => {
  const fields = ["first name", "last name", "phone", "id"];
  let field;
  for (field of fields) {
    if (sStorage.getItem(field) == "") {
      return field;
    }
  }
  return null;
};
