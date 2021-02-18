import { sc } from 'graphql-compose'
import { DataSourceEnumTC, MoneyTC, UrlTC } from './Common.js'

const PaymentTC = sc.createObjectTC({
  name: 'Payment',
  description: 'Representation of payments in common data model',
  fields: {
    id: 'String',
    order: 'String',
    customer: 'String',
    subtotal: MoneyTC.getType(),
    tip: MoneyTC.getType(),
    total: MoneyTC.getTypeNonNull().getType(),
    status: 'String',
    url: UrlTC.getType(),
    source: DataSourceEnumTC.getTypeNonNull()
  }
})

const CreatePaymentITC = sc.createInputTC({
  name: 'CreatePaymentInput',
  description: 'Input type for creating Payments',
  fields: {
    sourceId: 'String!',
    orderId: 'String!',
    locationId: 'String!',
    subtotal: MoneyTC.getITC()
      .getTypeNonNull()
      .getType(),
    tip: MoneyTC.getITC().getType(),
    source: DataSourceEnumTC.getTypeNonNull()
  }
})

const FetchPaymentPayloadTC = sc.createObjectTC({
  name: 'FetchPaymentPayload',
  description: 'Payload for fetching payments',
  fields: {
    cursor: 'String!',
    payments: [PaymentTC]
  }
})

export { PaymentTC, CreatePaymentITC, FetchPaymentPayloadTC }
