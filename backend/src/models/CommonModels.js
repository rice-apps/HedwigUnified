import { sc } from 'graphql-compose'
import { Kind } from 'graphql'

const DataSourceEnumTC = sc.createEnumTC({
  name: 'DataSourceEnum',
  description: 'The various types of data sources',
  values: {
    SQUARE: { value: 'SQUARE' },
    SHOPIFY: { value: 'SHOPIFY' }
  }
})

const PaymentSourceEnumTC = sc.createEnumTC({
  name: 'PaymentSourceEnum',
  description: 'The various types of payments',
  values: {
    COHEN: { value: 'COHEN' },
    TETRA: { value: 'TETRA' },
    CREDIT: { value: 'CREDIT' }
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

const UrlTC = sc.createScalarTC({
  name: 'URL',
  description: 'Represents a URL as specified in RFC 3986',
  serialize: value => (value ? new URL(value.toString()).toString() : null),
  parseValue: value => (value ? new URL(value.toString()) : null),
  parseLiteral: ast => {
    if (ast.kind === Kind.STRING) {
      return new URL(ast.value.toString())
    }
    return null
  }
})

export {
  DataSourceEnumTC,
  PaymentSourceEnumTC,
  MoneyTC,
  OrderStatusEnumTC,
  FulfillmentStatusEnumTC,
  PeriodTC,
  FindOrdersDateTimeFilterTC,
  SortOrderEnumTC,
  SortOrderTimeEnumTC,
  UrlTC
}
