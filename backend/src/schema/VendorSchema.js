import { AuthenticationError } from 'apollo-server-express'
import { VendorTC } from '../models/index.js'
import {
  checkLoggedIn,
  checkCanUpdateVendor
} from '../utils/authenticationUtils.js'

const VendorQueries = {
  getVendor: VendorTC.mongooseResolvers
    .findOne()
    .withMiddlewares([checkLoggedIn])
    .wrapResolve(next => async rp => {
      const vendor = await next({
        ...rp,
        projection: { allowedNetid: {}, ...rp.projection }
      })

      // if (vendor.allowedNetid.includes(rp.context.netid)) {
        return vendor
      // }

      return new AuthenticationError('Not on approved vendor list')
    }),
  getVendors: VendorTC.mongooseResolvers
    .findMany()
    .withMiddlewares([checkLoggedIn])
    .wrapResolve(next => async rp => {
      const vendors = await next({
        ...rp,
        projection: { allowedNetid: {}, ...rp.projection }
      })

      const availableVendors = vendors.filter(vendor =>
        vendor.allowedNetid.includes(rp.context.netid)
      )

      // if (availableVendors.length === 0) {
      //   return new AuthenticationError('Not approved for any vendors')
      // }

      return vendors
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
