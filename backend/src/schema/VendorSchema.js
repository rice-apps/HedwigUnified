import { ApiError, Client, Environment } from 'square'

import { Vendor, VendorTC } from '../models/index.js'
import {
  checkLoggedIn,
  checkCanUpdateVendor
} from '../utils/authenticationUtils.js'
import vault from '../utils/vault.js'

import { SQUARE_APPLICATION_ID, SQUARE_APPLICATION_SECRET } from '../config'
import { ApolloError } from 'apollo-server-errors'

VendorTC.addResolver({
  name: 'setupSquareTokens',
  type: '[String]',
  args: {
    vendorName: 'String!',
    slug: 'String!',
    code: 'String!'
  },
  resolve: async ({ args }) => {
    const { vendorName, slug, code } = args

    await Vendor.create({
      name: vendorName,
      slug: slug
    })

    try {
      const squareClient = new Client({ environment: Environment.Sandbox })

      const {
        result: { accessToken, refreshToken }
      } = await squareClient.oAuthApi.obtainToken({
        clientId: SQUARE_APPLICATION_ID,
        clientSecret: SQUARE_APPLICATION_SECRET,
        grantType: 'authorization_code',
        code: code
      })

      await vault.write(`cubbyhole/${slug}`, {
        key: 'square-access',
        value: accessToken,
        lease: '1h'
      })
      await vault.write(`cubbyhole/${slug}`, {
        key: 'square-refresh',
        vaule: refreshToken,
        lease: '1h'
      })

      return [accessToken, refreshToken]
    } catch (error) {
      if (error instanceof ApiError) {
        throw new ApolloError(
          `Getting access token from Square failed because: ${JSON.stringify(
            error.result
          )}`
        )
      }

      throw new ApolloError(
        `Something went wrong getting access token: ${JSON.stringify(error)}`
      )
    }
  }
}).addResolver({
  name: 'refreshSquareToken',
  type: '[String]',
  args: {
    vendorName: 'String!'
  },
  resolve: async ({ args }) => {
    const { vendorName } = args

    const vendor = await Vendor.findOne({ name: vendorName })
      .lean()
      .exec()

    try {
      const squareClient = new Client({ environment: Environment.Sandbox })

      const {
        result: { accessToken, refreshToken }
      } = await squareClient.oAuthApi.obtainToken({
        clientId: SQUARE_APPLICATION_ID,
        clientSecret: SQUARE_APPLICATION_SECRET,
        grantType: 'refresh_token',
        refreshToken: await vault
          .read(`cubbyhole/${vendor.slug}`)
          .then(res => res.data['square-refresh'])
      })

      await vault.write(`cubbyhole/${vendor.slug}`, {
        key: 'square-access',
        value: accessToken,
        lease: '1h'
      })

      return [accessToken, refreshToken]
    } catch (error) {
      if (error instanceof ApiError) {
        throw new ApolloError(
          `Refreshing access token from Square failed because: ${JSON.stringify(
            error.result
          )}`
        )
      }

      throw new ApolloError(
        `Something went wrong refreshing access token: ${JSON.stringify(error)}`
      )
    }
  }
})

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
  updateVendor: VendorTC.mongooseResolvers
    .updateOne()
    .withMiddlewares([checkLoggedIn, checkCanUpdateVendor]),
  setupSquareTokens: VendorTC.getResolver('setupSquareTokens'),
  refreshSquareToken: VendorTC.getResolver(
    'refreshSquareToken'
  ).withMiddlewares([checkLoggedIn, checkCanUpdateVendor])
}

export { VendorQueries, VendorMutations }
