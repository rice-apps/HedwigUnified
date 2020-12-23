import { VendorTC } from '../models/VendorModel'

const VendorQueries = {
  getVendor: VendorTC.mongooseResolvers.findOne(),
  getVendors: VendorTC.mongooseResolvers.findMany()
}

const VendorMutations = {
  createVendor: VendorTC.mongooseResolvers.createOne(),
  updateVendor: VendorTC.mongooseResolvers.updateOne(),
  removeVendor: VendorTC.mongooseResolvers.removeOne()
}

export { VendorQueries, VendorMutations }
