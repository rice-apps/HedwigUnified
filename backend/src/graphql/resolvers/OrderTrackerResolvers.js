import { OrderTrackerTC, UserTC } from '../schema/index.js'

OrderTrackerTC.addRelation('customer', {
  resolver: () => UserTC.mongooseResolvers.dataLoader(),

  prepareArgs: {
    _id: source => source.customer
  },

  projection: {
    customer: 1
  }
})

const OrderTrackerQueries = {
  getOrderTracker: OrderTrackerTC.mongooseResolvers.findOne(),
  getOrderTrackers: OrderTrackerTC.mongooseResolvers.findMany()
}

const OrderTrackerMutations = {
  updateOrderTracker: OrderTrackerTC.mongooseResolvers.updateOne(),
  deleteOrderTracker: OrderTrackerTC.mongooseResolvers.removeOne()
}

export { OrderTrackerQueries, OrderTrackerMutations }
