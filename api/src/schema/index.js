import { sc } from 'graphql-compose'
import { PaymentQueries, PaymentMutations } from './PaymentSchema'
import { UserQueries, UserMutations } from './UserSchema'
import { ItemQueries, ItemMutations, ItemSubscriptions } from './ProductSchema'
import { OrderQueries, OrderMutations, OrderSubscriptions } from './OrderSchema'
import { VendorQueries, VendorMutations } from './VendorSchema'

sc.Query.addFields({
  ...UserQueries,
  ...ItemQueries,
  ...VendorQueries,
  ...OrderQueries,
  ...PaymentQueries
})

sc.Mutation.addFields({
  ...PaymentMutations,
  ...OrderMutations,
  ...VendorMutations,
  ...ItemMutations,
  ...UserMutations
})

sc.Subscription.addFields({
  ...OrderSubscriptions,
  ...ItemSubscriptions
})

const Schema = sc.buildSchema()

export default Schema
