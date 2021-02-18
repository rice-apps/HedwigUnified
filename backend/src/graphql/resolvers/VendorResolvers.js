import { VendorTC } from '../schema/index.js'
import {
  checkLoggedIn,
  checkCanUpdateVendor
} from '../../utils/authenticationUtils.js'

const VendorQueries = {
  getVendor: VendorTC.mongooseResolvers
    .findOne()
    .withMiddlewares([checkLoggedIn])
    .wrapResolve(next => async rp => {
      const vendor = await next({
        ...rp,
        projection: { allowedNetid: {}, ...rp.projection }
      })

      if (!vendor.allowedNetid.includes(rp.context.netid)) {
        vendor.squareInfo = null
        vendor.allowedNetid = null
      }

      return vendor
    }),
  getVendors: VendorTC.mongooseResolvers
    .findMany()
    .withMiddlewares([checkLoggedIn])
    .wrapResolve(next => async rp => {
      const vendors = await next({
        ...rp,
        projection: { allowedNetid: {}, ...rp.projection }
      })

      return vendors.map(vendor => {
        if (!vendor.allowedNetid.includes(rp.context.netid)) {
          vendor.squareInfo = null
          vendor.allowedNetid = null
        }
        return vendor
      })
    })
}

const VendorMutations = {
  createVendor: VendorTC.mongooseResolvers
    .createOne()
    .withMiddlewares([checkLoggedIn]),
  updateVendor: VendorTC.mongooseResolvers
    .updateOne()
    .withMiddlewares([checkLoggedIn, checkCanUpdateVendor])
}

export { VendorQueries, VendorMutations }
