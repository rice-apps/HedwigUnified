import { VendorTC } from '../models/VendorModel'

const VendorQueries = {
  getVendor: VendorTC.getResolver('findOne'),
  getVendors: VendorTC.getResolver('findMany')
}

const VendorMutations = {
  createVendor: VendorTC.getResolver('createOne'),
  updateVendor: VendorTC.getResolver('updateOne'),
  removeVendor: VendorTC.getResolver('removeOne'),
}

export { VendorQueries, VendorMutations }
