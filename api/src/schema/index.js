import { sc } from 'graphql-compose'
import { PaymentQueries, PaymentMutations } from './PaymentSchema'
import { UserQueries, UserMutations } from './UserSchema'
import { ItemQueries, ItemMutations, ItemSubscriptions } from './ProductSchema'
import { OrderQueries, OrderMutations, OrderSubscriptions } from './OrderSchema'
import {
  OrderTrackerQueries,
  OrderTrackerMutations
} from './OrderTrackerSchema'
import { VendorQueries, VendorMutations } from './VendorSchema'

sc.Query.addFields({
  ...UserQueries,
  ...ItemQueries,
  ...VendorQueries,
  ...OrderQueries,
  ...OrderTrackerQueries,
  ...PaymentQueries
})

sc.Mutation.addFields({
  ...PaymentMutations,
  ...OrderMutations,
  ...VendorMutations,
  ...ItemMutations,
  ...OrderTrackerMutations,
  ...UserMutations
})

sc.Subscription.addFields({
  ...OrderSubscriptions,
  ...ItemSubscriptions
})

const Schema = sc.buildSchema()

export default Schema
