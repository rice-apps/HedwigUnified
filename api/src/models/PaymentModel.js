import { sc } from 'graphql-compose'
import { GraphQLNonNull, GraphQLString } from 'graphql'
import { MoneyTC } from './CommonModels'

const PaymentTC = sc.createObjectTC({
  name: 'Payment',
  description: 'Representation of payments in common data model',
  fields: {
    id: GraphQLNonNull(GraphQLString),
    order: GraphQLNonNull(GraphQLString),
    customer: GraphQLNonNull(GraphQLString),
    subtotal: MoneyTC.getTypeNonNull(),
    tip: MoneyTC.getTypeNonNull(),
    total: MoneyTC.getTypeNonNull(),
    status: GraphQLNonNull(GraphQLString)
  }
})

const CreatePaymentITC = sc.createInputTC({
  name: 'CreatePaymentInput',
  description: 'Input type for creating Payments',
  fields: {
    sourceId: GraphQLNonNull(GraphQLString),
    orderId: GraphQLNonNull(GraphQLString),
    customerId: GraphQLNonNull(GraphQLString),
    subtotal: MoneyTC.getITC()
      .getTypeNonNull()
      .getType(),
    tip: MoneyTC.getITC().getType()
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
