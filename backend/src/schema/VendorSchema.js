import { VendorTC, DataSourceEnumTC, Vendor } from '../models/index.js'
import {
  checkLoggedIn,
  checkCanUpdateVendor
} from '../utils/authenticationUtils.js'
import { squareClients } from '../utils/square.js'
import { ApiError } from 'square'
import { ApolloError } from 'apollo-server-express'

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
      const modifierList = objects.filter(object => object.type === 'MODIFIER_LIST')
      var availability = [];

      for (var i = 0; i < modifierList.length; i++) { 
        const modifiers = modifierList[i].modifierListData.modifiers;
        for (var j = 0; j < modifiers.length; j ++) {
          availability.push(modifiers[j].id)
        }
        
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
  createVendor: VendorTC.mongooseResolvers
    .createOne()
    .withMiddlewares([checkLoggedIn]),
  updateVendor: VendorTC.mongooseResolvers
    .updateOne()
    .withMiddlewares([checkLoggedIn, checkCanUpdateVendor]),
  initAvailableItems: VendorTC.getResolver('initAvailableItems'),
  initAvailableModifiers: VendorTC.getResolver('initAvailableModifiers')
}

export { VendorQueries, VendorMutations }
