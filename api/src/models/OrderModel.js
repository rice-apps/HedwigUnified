import { sc } from 'graphql-compose'

import { Order } from 'square-connect'
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
      type: '[String]',
      description: 'A list of modifier IDs to apply to this line item'
    }
  }
})

const OrderTC = sc.createObjectTC({
  name: 'Order',
  description: 'The common data model representation of orders',
  fields: {
    id: 'String!',
    merchant: 'String!',
    customer: 'String!',
    items: LineItemTC.getTypeNonNull().getType(),
    totalTax: MoneyTC.getTypeNonNull().getType(),
    totalDiscount: MoneyTC.getTypeNonNull().getType(),
    total: MoneyTC.getTypeNonNull().getType(),
    orderStatus: OrderStatusEnumTC.getTypeNonNull().getType(),
    fulfillmentStatus: FulfillmentStatusEnumTC.getTypeNonNull().getType()
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
    recipient: 'String!',
    pickupTime: 'String!'
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
  FindManyOrderPayloadTC
}
