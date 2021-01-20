import { sc } from 'graphql-compose'
import { PaymentQueries, PaymentMutations } from './PaymentSchema.js'
import { UserQueries, UserMutations } from './UserSchema.js'
import {
  ItemQueries,
  ItemMutations,
  ItemSubscriptions
} from './ProductSchema.js'
import {
  OrderQueries,
  OrderMutations,
  OrderSubscriptions
} from './OrderSchema.js'
import {
  OrderTrackerQueries,
  OrderTrackerMutations
} from './OrderTrackerSchema.js'
import { VendorQueries, VendorMutations } from './VendorSchema.js'

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
