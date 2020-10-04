import { sc } from 'graphql-compose'
import { GraphQLNonNull, GraphQLString, GraphQLInt } from 'graphql'

const DataSourceEnumTC = sc.createEnumTC({
  name: 'DataSourceEnum',
  description: 'The various types of data sources',
  values: {
    SQUARE: { value: 'SQUARE' },
    SHOPIFY: { value: 'SHOPIFY' },
    EXCEL: { value: 'EXCEL' }
  }
})

const MoneyTC = sc.createObjectTC({
  name: 'Money',
  description: 'Common data model money representation',
  fields: {
    amount: 'Int!',
    currency: 'String!'
  }
})

const OrderStatusEnumTC = sc.createEnumTC({
  name: 'OrderStatusEnum',
  description: 'The possible states for an Order to be in',
  values: {
    OPEN: { value: 'OPEN' },
    CLOSED: { value: 'CLOSED' },
    CANCELED: { value: 'CANCELED' }
  }
})

const FulfillmentStatusEnumTC = sc.createEnumTC({
  name: 'FulFillmentStatusEnum',
  description: 'The possible states for a fulfillment to be in',
  values: {
    PROPOSED: { value: 'PROPOSED' },
    RESERVED: { value: 'RESERVED' },
    PREPARED: { value: 'PREPARED' },
    COMPLETED: { value: 'COMPLETED' },
    CANCELED: { value: 'CANCELED' }
  }
})

const DayEnumTC = sc.createEnumTC({
  name: 'DayEnum',
  description: 'The possible states for a day',
  values: {
    MONDAY: { value: 'M' },
    TUESDAY: { value: 'T' },
    WEDNESDAY: { value: 'W' },
    THURSDAY: { value: 'R' },
    FRIDAY: { value: 'F' },
    SATURDAY: { value: 'S' },
    SUNDAY: { value: 'U' }
  }
})

const PeriodTC = sc.createObjectTC({
  name: 'Period',
  description:
    'Common data model representing a period which the business is operating during.',
  fields: {
    start: 'Int',
    end: 'Int',
    day: DayEnumTC.getType()
  }
})

const TimeRangeTC = sc.createObjectTC({
  name: 'TimeRange',
  description: 'A generic time range in RFC-3339 format',
  fields: {
    start_at: 'String',
    end_at: 'String'
  }
})

const FindOrdersDateTimeFilterTC = sc.createInputTC({
  name: 'FindOrdersDateTimeFilter',
  description: 'Input type for filtering orders by date and time',
  fields: {
    created_at: TimeRangeTC.getITC().getType(),
    updated_at: TimeRangeTC.getITC().getType(),
    closed_at: TimeRangeTC.getITC().getType()
  }
})

const SortOrderTimeEnumTC = sc.createEnumTC({
  name: 'SortOrderTimeEnum',
  description: 'Enum type for sort orders',
  values: {
    CREATED_AT: { value: 'CREATED_AT' },
    UPDATED_AT: { value: 'UPDATED_AT' },
    CLOSED_AT: { value: 'CLOSED_AT' }
  }
})

const SortOrderEnumTC = sc.createEnumTC({
  name: 'SortOrderEnum',
  description: 'Enum type for ascending or descending sort',
  values: {
    ASC: { value: 'ASC' },
    DESC: { value: 'DESC' }
  }
})

export {
  DataSourceEnumTC,
  MoneyTC,
  OrderStatusEnumTC,
  FulfillmentStatusEnumTC,
  PeriodTC,
  FindOrdersDateTimeFilterTC,
  SortOrderEnumTC,
  SortOrderTimeEnumTC
}
