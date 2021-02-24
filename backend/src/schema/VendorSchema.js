
import { VendorTC, DataSourceEnumTC, Vendor } from '../models/index.js'

import { ApolloError } from 'apollo-server-express'
import { ApiError, Client, Environment } from 'square'

import {
  checkLoggedIn,
  checkCanUpdateVendor
} from '../utils/authenticationUtils.js'

import {squareClients} from '../utils/square.js'
import vault from '../utils/vault.js'

import { SQUARE_APPLICATION_ID, SQUARE_APPLICATION_SECRET } from '../config.js'

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

VendorTC.addResolver({
  name: 'initAvailableItems',
  args: {
    vendor: 'String!',
    dataSource: DataSourceEnumTC.getTypeNonNull().getType()
  },
  type: VendorTC,
  resolve: async ({ args }) => {
    // Extract vendor name from args
    const { dataSource, vendor } = args

    const squareClient = squareClients.get(vendor)
    const catalogApi = squareClient.catalogApi

    try {
      // Make Square request for catalog
      const {
        result: { objects }
      } = await catalogApi.listCatalog(undefined, 'ITEM,CATEGORY,MODIFIER_LIST')
      const items = objects.filter(object => object.type === 'ITEM')
      const modifiers = objects.filter(object => object.type === 'MODIFIER_LIST')
      console.log("modifiers")
      console.log(modifiers)
      var availability = [];
      for(var i=0; i<items.length; i++){ 
        // extract name and id
        availability.push(items[i].id)
      }

      const vendorData = await Vendor.findOne({
        name: vendor
      })

      vendorData.availableItems = availability;
      await vendorData.save();
      return vendorData;

    } catch (error) {
      if (error instanceof ApiError) {
        return new ApolloError(
          `Getting Square catalog failed because ${error.result}`
        )
      }
      console.log(error)
      return new ApolloError('Something went wrong when getting Square catalog')
    }
  }
}).addResolver({
  name: 'initAvailableModifiers',
  args: {
    vendor: 'String!',
    dataSource: DataSourceEnumTC.getTypeNonNull().getType()
  },
  type: VendorTC,
  resolve: async ({ args }) => {
    // Extract vendor name from args
    const { dataSource, vendor } = args

    const squareClient = squareClients.get(vendor)
    const catalogApi = squareClient.catalogApi

    try {
      // Make Square request for catalog
      const {
        result: { objects }
      } = await catalogApi.listCatalog(undefined, 'ITEM,CATEGORY,MODIFIER_LIST')
      const modifiers = objects.filter(object => object.type === 'MODIFIER_LIST')
      var availability = [];

      for(var i=0; i<modifiers.length; i++){ 
        // extract name and id
        availability.push(modifiers[i].id)
      }

      const vendorData = await Vendor.findOne({
        name: vendor
      })

      vendorData.availableModifiers = availability;
      await vendorData.save();
      return vendorData;

    } catch (error) {
      if (error instanceof ApiError) {
        return new ApolloError(
          `Getting Square catalog failed because ${error.result}`
        )
      }
      console.log(error)
      return new ApolloError('Something went wrong when getting Square catalog')
    }
  }
})

const VendorMutations = {
  updateVendor: VendorTC.mongooseResolvers
    .updateOne()
    .withMiddlewares([checkLoggedIn, checkCanUpdateVendor]),
  initAvailableItems: VendorTC.getResolver('initAvailableItems'),
  initAvailableModifiers: VendorTC.getResolver('initAvailableModifiers'),
  setupSquareTokens: VendorTC.getResolver('setupSquareTokens'),
  refreshSquareToken: VendorTC.getResolver(
    'refreshSquareToken'
  ).withMiddlewares([checkLoggedIn])
}

export { VendorQueries, VendorMutations }
