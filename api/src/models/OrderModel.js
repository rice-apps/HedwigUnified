import { sc } from 'graphql-compose'

import {
  MoneyTC,
  OrderStatusEnumTC,
  FulfillmentStatusEnumTC,
  FindOrdersDateTimeFilterTC,
  SortOrderTimeEnumTC,
  SortOrderEnumTC
} from './CommonModels'

const LineItemTC = sc.createObjectTC({
  name: 'LineItem',
  description:
    'Common data model representation of line items, useful when placing an Order.',
  fields: {
    quantity: {
      type: 'String!',
      description:
        'The amount of this item to order. Inputted as String for Square compatibility purposes'
    },
    catalog_object_id: {
      type: 'String!',
      description: 'The ID of the variant of this item'
    },
    modifiers: {
      type: '[OrderLineItemModifier]',
      description: 'A list of modifier IDs to apply to this line item'
    }
  }
})

const PreviousLineItemTC = sc.createObjectTC({
  name: 'PreviousLineItem',
  description: 'A line item in a past order',
  fields: {
    name: 'String',
    quantity: 'String',
    catalog_object_id: 'String',
    variation_name: 'String',
    modifiers: `
      type OrderLineItemModifier {
        uid: String
        catalog_object_id: String,
        name: String
        base_price_money: Money
        total_price_money: Money
      }
    `,
    total_money: MoneyTC,
    total_tax: MoneyTC
  }
})

const OrderFulfillmentRecipientTC = sc.createObjectTC({
  name: 'OrderFulfillmentRecipient',
  description: 'Contains information on the recipient of a fulfillment',
  fields: {
    name: 'String',
    email: 'String',
    phone: 'String'
  }
})

const OrderFulfillmentPickupDetailsTC = sc.createObjectTC({
  name: 'OrderFulfillmentPickupDetails',
  description: 'Contains details necessary to fulfill a pickup order',
  fields: {
    pickupAt: 'String',
    placedAt: 'String',
    recipient: OrderFulfillmentRecipientTC.getType()
  }
})

const OrderFulfillmentTC = sc.createObjectTC({
  name: 'OrderFulfillment',
  description: 'Contains details on how to fulfill an order',
  fields: {
    uid: 'String',
    state: FulfillmentStatusEnumTC.getType(),
    pickupDetails: OrderFulfillmentPickupDetailsTC.getType()
  }
})

const OrderTC = sc.createObjectTC({
  name: 'Order',
  description: 'The common data model representation of orders',
  fields: {
    id: 'String!',
    merchant: 'String!',
    customer: OrderFulfillmentRecipientTC.getType(),
    items: PreviousLineItemTC.getTypeNonNull()
      .getTypePlural()
      .getType(),
    totalTax: MoneyTC.getTypeNonNull().getType(),
    totalDiscount: MoneyTC.getTypeNonNull().getType(),
    total: MoneyTC.getTypeNonNull().getType(),
    orderStatus: OrderStatusEnumTC.getTypeNonNull().getType(),
    fulfillment: OrderFulfillmentTC.getType(),
    cohenId: 'String',
    studentId: 'String'
  }
})

const UpdateOrderTC = sc.createInputTC({
  name: 'UpdateOrderInput',
  description: 'The common data model representation of orders',
  fields: {
    id: 'String',
    merchant: 'String',
    customer: OrderFulfillmentRecipientTC.getITC().getType(),
    items: PreviousLineItemTC.getITC()
      .getTypePlural()
      .getType(),
    totalTax: MoneyTC.getITC().getType(),
    totalDiscount: MoneyTC.getITC().getType(),
    total: MoneyTC.getITC().getType(),
    orderStatus: OrderStatusEnumTC.getType(),
    fulfillment: OrderFulfillmentTC.getITC().getType()
  }
})

const CreateOrderInputTC = sc.createInputTC({
  name: 'CreateOrderInput',
  description: 'Input type for creating orders',
  fields: {
    idempotencyKey: 'String!',
    lineItems: LineItemTC.getITC()
      .getTypePlural()
      .getTypeNonNull()
      .getType(),
    recipient: OrderFulfillmentRecipientTC.getITC().getType(),
    pickupTime: 'String!',
    cohenId: 'String',
    studentId: 'String'
  }
})

const FindOrdersFulfillmentFilterTC = sc.createInputTC({
  name: 'FindOrderFulfillmentFilterInput',
  description: 'Input type for filtering by fulfillment',
  fields: {
    fulfillment_types: '[String]',
    fulfillment_states: '[String]'
  }
})

const FilterOrderStateInputTC = sc.createInputTC({
  name: 'FilterOrderStateInput',
  description: 'Input type for filtering orders by state',
  fields: {
    states: OrderStatusEnumTC.getTypePlural().getType()
  }
})

const FilterOrderInputTC = sc.createInputTC({
  name: 'FilterOrderInput',
  description: 'Input type for filter orders',
  fields: {
    state_filter: FilterOrderStateInputTC,
    date_time_filter: FindOrdersDateTimeFilterTC,
    fulfillment_filter: FindOrdersFulfillmentFilterTC,
    customer_filter: '[String]'
  }
})

const SortOrderInputTC = sc.createInputTC({
  name: 'SortOrderInput',
  description: 'Input type for sorting orders',
  fields: {
    sort_field: SortOrderTimeEnumTC,
    sort_order: SortOrderEnumTC
  }
})

const FindManyOrderPayloadTC = sc.createObjectTC({
  name: 'FindManyOrderPayload',
  description: 'Payload for findMany resolver',
  fields: {
    cursor: 'String',
    orders: OrderTC.getTypePlural().getType()
  }
})

export {
  OrderTC,
  CreateOrderInputTC,
  FilterOrderInputTC,
  SortOrderInputTC,
  FindManyOrderPayloadTC,
  UpdateOrderTC
}
