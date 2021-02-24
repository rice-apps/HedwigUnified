import { Vendor, VendorTC } from '../models/index.js'
import {
  checkLoggedIn,
  checkCanUpdateVendor
} from '../utils/authenticationUtils.js'
import vault from '../utils/vault.js'

import { SQUARE_APPLICATION_ID, SQUARE_APPLICATION_SECRET } from '../config.js'
import { ApolloError } from 'apollo-server-express'

VendorTC.addResolver({
  name: 'setupSquareTokens',
  type: '[String!]!',
  args: {
    vendorName: 'String!',
    slug: 'String!',
    code: 'String!'
  },
  resolve: async ({ args }) => {
    const { vendorName, slug, code } = args

    await Vendor.create({
      name: vendorName,
      slug: slug,
      dataSource: 'SQUARE'
    })

    try {
      const squareClient = new Client({
        environment:
          process.env.NODE_ENV === 'production'
            ? Environment.Production
            : Environment.Sandbox
      })

      const {
        result: { accessToken, refreshToken }
      } = await squareClient.oAuthApi.obtainToken({
        clientId: SQUARE_APPLICATION_ID,
        clientSecret: SQUARE_APPLICATION_SECRET,
        grantType: 'authorization_code',
        code: code
      })

      await vault.write(`cubbyhole/${slug.toLowerCase()}`, {
        'square-access': accessToken,
        'square-refresh': refreshToken
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
  type: '[String!]!',
  args: {
    vendorName: 'String!'
  },
  resolve: async ({ args }) => {
    const { vendorName } = args

    const vendor = await Vendor.findOne({ name: vendorName })
      .lean()
      .exec()

    try {
      const squareClient = new Client({
        environment:
          process.env.NODE_ENV === 'production'
            ? Environment.Production
            : Environment.Sandbox
      })

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

      await vault.write(`cubbyhole/${vendor.slug.toLowerCase()}`, {
        'square-access': accessToken,
        'square-refresh': refreshToken
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

VendorTC.addResolver({
  name: 'getAllowedVendors',
  type: [VendorTC],
  args: { name: 'String!' },
  resolve: async ({ args }) => {
    const vendors = await Vendor.find({})
    const userVendors = vendors.filter(vendor => {
      const allowedNetId = vendor.allowedNetid
      return allowedNetId.includes(args.name)
    })
    return userVendors
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
    }),
  getAllowedVendors: VendorTC.getResolver('getAllowedVendors')
}

const VendorMutations = {
  updateVendor: VendorTC.mongooseResolvers
    .updateOne()
    .withMiddlewares([checkLoggedIn, checkCanUpdateVendor]),
  setupSquareTokens: VendorTC.getResolver('setupSquareTokens'),
  refreshSquareToken: VendorTC.getResolver(
    'refreshSquareToken'
  ).withMiddlewares([checkLoggedIn])
}

export { VendorQueries, VendorMutations }
