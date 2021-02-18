import { sc } from 'graphql-compose'
import { PaymentQueries, PaymentMutations } from './PaymentResolvers.js'
import { UserQueries, UserMutations } from './UserResolvers.js'
import {
  ItemQueries,
  ItemMutations,
  ItemSubscriptions
} from './ProductResolvers.js'
import {
  OrderQueries,
  OrderMutations,
  OrderSubscriptions
} from './OrderResolvers.js'
import {
  OrderTrackerQueries,
  OrderTrackerMutations
} from './OrderTrackerResolvers.js'
import { VendorQueries, VendorMutations } from './VendorResolvers.js'

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
