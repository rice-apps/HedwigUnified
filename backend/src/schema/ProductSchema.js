import { ApolloError } from 'apollo-server-express'
import { ApiError } from 'square'
import { v4 as uuid } from 'uuid'
import { ItemTC, DataSourceEnumTC, ItemModifierListTC, Vendor, VendorTC } from '../models/index.js'
import { squareClients } from '../utils/square.js'
import { pubsub } from '../utils/pubsub.js'

ItemTC.addResolver({
  name: 'getCatalog',
  args: {
    vendor: 'String!',
    dataSource: DataSourceEnumTC.getTypeNonNull().getType()
  },
  type: [ItemTC],
  resolve: async ({ args }) => {
    // Extract vendor name from args
    const { dataSource, vendor } = args

    const squareClient = squareClients.get(vendor)
    const catalogApi = squareClient.catalogApi

    const vendorData = await Vendor.findOne({
      name: vendor
    })

    try {
      // Make Square request for catalog
      const {
        result: { objects }
      } = await catalogApi.listCatalog(undefined, 'ITEM,CATEGORY,MODIFIER_LIST')
      // Filter objects into distinct sets
      const categories = objects.filter(object => object.type === 'CATEGORY')
      const modifierLists = objects.filter(
        object => object.type === 'MODIFIER_LIST'
      )
      const items = objects.filter(object => object.type === 'ITEM')

      // Define functions for getting category and modifier list data from id
      const categoryId2Name = id =>
        categories.find(category => category.id === id)?.categoryData.name
      const modifierListId2Data = id =>
        modifierLists.find(modifierList => modifierList.id === id)
      // Get fields for GraphQL response
      return items.map(async item => {
        const {
          id: itemId,
          imageId,
          itemData: {
            name: baseItemName,
            description: baseItemDescription,
            variations,
            modifierListInfo,
            categoryId
          }
        } = item

        let imageData
        try {
          const response = await catalogApi.retrieveCatalogObject(imageId)
          imageData = response.result.object.imageData.url
        } catch (error) {
          console.log('Image not found \n')
        }

        const categoryName = categoryId2Name(categoryId)

        const returnedVariants = variations.map(variant => {
          const {
            id: itemVariationId,
            itemVariationData: {
              itemId: parentItemId,
              name: itemVariationName,
              priceMoney
            }
          } = variant

          return {
            dataSourceId: itemVariationId,
            parentItemId,
            price: {
              amount: priceMoney ? priceMoney.amount : 0,
              currency: priceMoney ? priceMoney.currency : 'USD'
            },
            name: itemVariationName,
            dataSource,
            merchant: ''
          }
        })

        const modifierLists = modifierListInfo
          ? modifierListInfo.map(info => ({
              data: modifierListId2Data(info.modifierListId),
              min: info.minSelectedModifiers,
              max: info.maxSelectedModifiers
            }))
          : []

        const returnedModifierLists = modifierLists.map(modifierList => {
          const {
            id: parentListId,
            modifierListData: {
              name: modifierListName,
              selectionType,
              modifiers
            }
          } = modifierList.data

          const returnedModifiers = modifiers.map(modifier => {
            const {
              id: modifierId,
              modifierData: { name: modifierName, modifierListId, priceMoney }
            } = modifier

            return {
              dataSourceId: modifierId,
              parentListId: modifierListId,
              price: {
                amount: priceMoney ? priceMoney.amount : 0,
                currency: priceMoney ? priceMoney.currency : 'USD'
              },
              name: modifierName,
              dataSource,
              merchant: ''
            }
          })

          return {
            dataSourceId: parentListId,
            name: modifierListName,
            selectionType: selectionType,
            modifiers: returnedModifiers,
            minModifiers: modifierList.min,
            maxModifiers: modifierList.max
          }
        })

        return {
          dataSourceId: itemId,
          image: imageData,
          category: categoryName,
          variants: returnedVariants,
          modifierLists: returnedModifierLists,
          dataSource,
          name: baseItemName,
          description: baseItemDescription,
          merchant: '',
          isAvailable: vendorData.availableItems.includes(itemId)
        }
      })
    } catch (error) {
      if (error instanceof ApiError) {
        return new ApolloError(
          `Getting Square catalog failed because ${JSON.stringify(error.result)}`
        )
      }
      console.log(error)
      return new ApolloError('Something went wrong when getting Square catalog')
    }
  }
})
  .addResolver({
    name: 'getModifierLists',
    args: {
      vendor: 'String!',
      dataSource: DataSourceEnumTC.getTypeNonNull().getType()
    },
    type: [ItemModifierListTC],
    resolve: async ({ args }) => {
      // Extract vendor name from args
      const { dataSource, vendor } = args

      const squareClient = squareClients.get(vendor)
      const catalogApi = squareClient.catalogApi

      try {
        // Make Square request for catalog
        const {
          result: { objects }
        } = await catalogApi.listCatalog(undefined, 'MODIFIER_LIST')
        // Filter objects into distinct sets

        const modifierLists = objects.filter(
          object => object.type === 'MODIFIER_LIST'
        )

        // console.log('modifierLists', modifierLists)

        return modifierLists.map(async modifierList => {
          const {
            id: parentListId,
            modifierListData: {
              name: modifierListName,
              selectionType,
              modifiers
            }
          } = modifierList

          const returnedModifiers = modifiers.map(modifier => {
            const {
              id: modifierId,
              modifierData: { name: modifierName, modifierListId, priceMoney }
            } = modifier

            return {
              dataSourceId: modifierId,
              parentListId: modifierListId,
              price: {
                amount: priceMoney ? priceMoney.amount : 0,
                currency: priceMoney ? priceMoney.currency : 'USD'
              },
              name: modifierName,
              dataSource,
              merchant: ''
            }
          })

          return {
            dataSourceId: parentListId,
            name: modifierListName,
            selectionType: selectionType,
            modifiers: returnedModifiers,
            minModifiers: modifierList.min,
            maxModifiers: modifierList.max
          }
        })
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
  .addResolver({
    name: 'getItem',
    args: {
      vendor: 'String!',
      dataSource: DataSourceEnumTC.getTypeNonNull().getType(),
      dataSourceId: ItemTC.getFieldTC('dataSourceId')
        .getTypeNonNull()
        .getType()
    },
    type: ItemTC,
    resolve: async ({ args }) => {
      // Extract data source to interact with as well as ID of product (as used inside data source)
      const { vendor, dataSource, dataSourceId } = args

      const squareClient = squareClients.get(vendor)
      const catalogApi = squareClient.catalogApi

      const vendorData = await Vendor.findOne({
        name: vendor
      })

      try {
        const {
          result: { object }
        } = await catalogApi.retrieveCatalogObject(dataSourceId)

        const {
          imageId,
          itemData: {
            name: baseItemName,
            description: baseItemDescription,
            variations,
            modifierListInfo
          }
        } = object

        let imageData
        try {
          const response = await catalogApi.retrieveCatalogObject(imageId)
          imageData = response.result.object.imageData.url
        } catch (error) {
          console.log('Image not found')
        }

        const returnedVariants = variations.map(variant => {
          const {
            id: itemVariationId,
            itemVariationData: {
              itemId: parentItemId,
              name: itemVariationName,
              priceMoney
            }
          } = variant

          return {
            dataSourceId: itemVariationId,
            parentItemId,
            price: {
              amount: priceMoney ? priceMoney.amount : 0,
              currency: priceMoney ? priceMoney.currency : 'USD'
            },
            name: itemVariationName,
            dataSource,
            merchant: ''
          }
        })

        let returnedModifierLists = null

        if (modifierListInfo) {
          const modifierListIds = modifierListInfo.map(
            info => info.modifierListId
          )

          try {
            const {
              result: { objects: modifierObjects }
            } = await catalogApi.batchRetrieveCatalogObjects({
              objectIds: modifierListIds
            })

            returnedModifierLists = modifierObjects.map(modifierList => {
              const {
                id: parentListId,
                modifierListData: {
                  name: modifierListName,
                  selectionType,
                  modifiers
                }
              } = modifierList

              const parentListInfo = modifierListInfo.find(
                info => info.modifierListId === parentListId
              )

              const returnedModifiers = modifiers.map(modifier => {
                const {
                  id,
                  modifierData: {
                    name: modifierName,
                    modifierListId,
                    priceMoney
                  }
                } = modifier

                return {
                  dataSourceId: id,
                  parentListId: modifierListId,
                  price: {
                    amount: priceMoney ? priceMoney.amount : 0,
                    currency: priceMoney ? priceMoney.currency : 'USD'
                  },
                  name: modifierName,
                  dataSource,
                  merchant: ''
                }
              })

              return {
                dataSourceId: parentListId,
                name: modifierListName,
                selectionType: selectionType,
                modifiers: returnedModifiers,
                minModifiers: parentListInfo.minSelectedModifiers,
                maxModifiers: parentListInfo.maxSelectedModifiers
              }
            })
          } catch (error) {
            returnedModifierLists = null
          }
        }

        return {
          dataSourceId,
          variants: returnedVariants,
          modifierLists: returnedModifierLists || [],
          // From interface
          dataSource,
          image: imageData,
          name: baseItemName,
          description: baseItemDescription,
          merchant: '',
          isAvailable: vendorData.availableItems.includes(dataSourceId)
        }
      } catch (error) {
        if (error instanceof ApiError) {
          return new ApolloError(
            `Retrieving item ${dataSourceId} from Square failed because ${error.result}`
          )
        }

        return new ApolloError(
          `Something went wrong when retrieving item ${dataSourceId}`
        )
      }
    }
  })
  .addResolver({
    name: 'getAvailability',
    args: {
      vendor: 'String!',
      productId: 'String!',
      type: 'String!'
    },
    type: 'Boolean',
    resolve: async ({ args }) => {
      const { vendor, productId, type } = args
      const vendorData = await Vendor.findOne({
        name: vendor
      })
      try {
        if (type === 'item') {
          // querying item
          if (vendorData.availableItems.includes(productId)) {
            return true
          }
        } else {
          // querying modifiers
          if (vendorData.availableModifiers.includes(productId)) {
            return true
          }
        }
        return false
      } catch (error) {
        return new ApolloError(
          `Something went wrong getting availability for item ${productId}`
        )
      }
      // const squareClient = squareClients.get(vendor)
      // const catalogApi = squareClient.catalogApi

      // try {
      //   const {
      //     result: { object }
      //   } = await catalogApi.retrieveCatalogObject(productId)

      //   return object.customAttributeValues.is_available.booleanValue
      // } catch (error) {
      //   if (error instanceof ApiError) {
      //     return new ApolloError(
      //       `Getting availability for item ${productId} failed because ${error.result}`
      //     )
      //   }
      // }
    }
  })
  .addResolver({
    name: 'getAvailabilityBK',
    args: {
      vendor: 'String!',
      productId: 'String!'
    },
    type: 'Boolean',
    resolve: async ({ args }) => {
      const { vendor, productId } = args

      const squareClient = squareClients.get(vendor)
      const catalogApi = squareClient.catalogApi

      try {
        const {
          result: { object }
        } = await catalogApi.retrieveCatalogObject(productId)

        return object.customAttributeValues.is_available.booleanValue
      } catch (error) {
        if (error instanceof ApiError) {
          return new ApolloError(
            `Getting availability for item ${productId} failed because ${error.result}`
          )
        }

        return new ApolloError(
          `Something went wrong getting availability for item ${productId}`
        )
      }
    }
  })
  .addResolver({
    name: 'getAvailabilities',
    args: {
      vendor: 'String!',
      productIds: '[String!]',
      type: 'String!'
    },
    type: 'Boolean',
    resolve: async ({ args }) => {
      const { vendor, productIds, type } = args

      const vendorData = await Vendor.findOne({
        name: vendor
      })

      for (let i = 0; i < productIds.length; i++) {
        if (type === 'item') {
          if (!vendorData.availableItems.includes(productIds[i])) {
            return false
          }
        } else {
          if (!vendorData.availableModifiers.includes(productIds[i])) {
            return false
          }
        }
      }
      return true
    }
  })
  .addResolver({
    name: 'getAvailabilitiesBK',
    args: {
      vendor: 'String!',
      productIds: '[String!]'
    },
    type: 'Boolean',
    resolve: async ({ args }) => {
      const { vendor, productIds } = args

      const squareClient = squareClients.get(vendor)
      const catalogApi = squareClient.catalogApi

      try {
        const {
          result: { objects }
        } = await catalogApi.batchRetrieveCatalogObjects({
          objectIds: productIds
        })

        return objects.every(
          value => value.customAttributeValues.is_available.booleanValue
        )
      } catch (error) {
        if (error instanceof ApiError) {
          return new ApolloError(
            `Batch retrieve availabilities from Square failed because ${error.result}`
          )
        }

        return new ApolloError(
          'Something went wrong batch retrieving availabilities'
        )
      }
    }
  })
  .addResolver({
    name: 'setAvailability',
    args: {
      vendor: 'String!',
      productId: 'String!',
      isItemAvailable: 'Boolean!',
      dataSource: DataSourceEnumTC,
      type: 'String!'
    },
    type: VendorTC,
    resolve: async ({ args }) => {
      const { vendor, productId, isItemAvailable, type } = args
      const vendorData = await Vendor.findOne({
        name: vendor
      })
      let availability
      if (type === 'item') {
        availability = vendorData.availableItems
      } else {
        availability = vendorData.availableModifiers
      }
      const idx = availability.indexOf(productId) // initialize the index to find the item
      if (isItemAvailable && idx === -1) {
        availability.push(productId)
        await vendorData.save()
      }
      if (!isItemAvailable && idx !== -1) {
        availability.splice(idx, 1)
        await vendorData.save()
      }
      return vendorData
    }
  })
  .addResolver({
    name: 'setAvailabilityBK',
    args: {
      vendor: 'String!',
      productId: 'String!',
      isItemAvailable: 'Boolean!',
      dataSource: DataSourceEnumTC
    },
    type: ItemTC,
    resolve: async ({ args }) => {
      const { vendor, productId, isItemAvailable, dataSource } = args
      const squareClient = squareClients.get(vendor)
      const catalogApi = squareClient.catalogApi

      try {
        const {
          result: {
            object: { version, itemData, imageId }
          }
        } = await catalogApi.retrieveCatalogObject(productId)

        const {
          result: { catalogObject }
        } = await catalogApi.upsertCatalogObject({
          idempotencyKey: uuid(),
          object: {
            id: productId,
            type: 'ITEM',
            version: version,
            imageId: imageId,
            itemData: itemData,
            customAttributeValues: {
              is_available: {
                name: 'Is it available?',
                key: 'is_available',
                customAttributeDefinitionId: '7XN45PC5N5ALEEWG6TV6I7YJ',
                type: 'BOOLEAN',
                booleanValue: isItemAvailable
              }
            }
          }
        })

        const {
          itemData: {
            name: baseItemName,
            description: baseItemDescription,
            variations,
            modifierListInfo
          },
          customAttributeValues: {
            is_available: { booleanValue: isAvailable }
          }
        } = catalogObject

        const returnedVariants = variations.map(variant => {
          const {
            id: itemVariationId,
            itemVariationData: {
              itemId: parentItemId,
              name: itemVariationName,
              priceMoney
            }
          } = variant

          return {
            dataSourceId: itemVariationId,
            parentItemId,
            price: {
              amount: priceMoney ? priceMoney.amount : 0,
              currency: priceMoney ? priceMoney.currency : 'USD'
            },
            name: itemVariationName,
            dataSource,
            merchant: ''
          }
        })

        let returnedModifierLists = null

        if (modifierListInfo) {
          const modifierListIds = modifierListInfo.map(
            info => info.modifierListId
          )

          try {
            const {
              result: { objects: modifierObjects }
            } = await catalogApi.batchRetrieveCatalogObjects({
              objectIds: modifierListIds
            })

            returnedModifierLists = modifierObjects.map(modifierList => {
              const {
                id: parentListId,
                modifierListData: {
                  name: modifierListName,
                  selectionType,
                  modifiers
                }
              } = modifierList

              const parentListInfo = modifierListInfo.find(
                info => info.modifierListId === parentListId
              )

              const returnedModifiers = modifiers.map(modifier => {
                const {
                  id,
                  modifierData: {
                    name: modifierName,
                    modifierListId,
                    priceMoney
                  }
                } = modifier

                return {
                  dataSourceId: id,
                  parentListId: modifierListId,
                  price: {
                    amount: priceMoney ? priceMoney.amount : 0,
                    currency: priceMoney ? priceMoney.currency : 'USD'
                  },
                  name: modifierName,
                  dataSource,
                  merchant: ''
                }
              })

              return {
                dataSourceId: parentListId,
                name: modifierListName,
                selectionType: selectionType,
                modifiers: returnedModifiers,
                minModifiers: parentListInfo.minSelectedModifiers,
                maxModifiers: parentListInfo.maxSelectedModifiers
              }
            })
          } catch (error) {
            returnedModifierLists = null
          }
        }

        const CDMProduct = {
          dataSourceId: productId,
          variants: returnedVariants,
          modifierLists: returnedModifierLists || [],
          // From interface
          dataSource,
          name: baseItemName,
          description: baseItemDescription,
          merchant: '',
          isAvailable: isAvailable
        }

        pubsub.publish('availabilityChanged', {
          availabilityChanged: CDMProduct
        })

        return CDMProduct
      } catch (error) {
        if (error instanceof ApiError) {
          return new ApolloError(
            `Setting availability using Square failed because ${error.result}`
          )
        }

        return new ApolloError('Something went wrong setting availability')
      }
    }
  })
  .addResolver({
    name: 'createAvailabilityToggle',
    type: 'String',
    args: {
      vendor: 'String',
      merchantId: 'String!'
    },
    resolve: async ({ args }) => {
      const { vendor } = args

      const squareClient = squareClients.get(vendor)
      const catalogApi = squareClient.catalogApi

      try {
        const {
          result: { catalogObject }
        } = await catalogApi.upsertCatalogObject({
          idempotencyKey: uuid(),
          object: {
            id: '#is_available',
            type: 'CUSTOM_ATTRIBUTE_DEFINITION',
            customAttributeDefinitionData: {
              allowedObjectTypes: ['ITEM', 'ITEM_VARIATION'],
              name: 'is_available',
              type: 'BOOLEAN',
              key: 'is_available'
            }
          }
        })

        return catalogObject.id
      } catch (error) {
        if (error instanceof ApiError) {
          return new ApolloError(
            `Creating availability toggle using Square failed because ${error.result}`
          )
        }

        return new ApolloError('Something went wrong creating availability')
      }
    }
  })
  .addResolver({
    name: 'batchAddAvailability', // didn't use the vendor fild property
    type: [ItemTC],
    args: {
      products: '[String!]!',
      availabilityId: 'String',
      vendor: 'String'
    },
    resolve: async ({ args }) => {
      const { products, availabilityId, vendor } = args

      const squareClient = squareClients.get(vendor)
      const catalogApi = squareClient.catalogApi

      try {
        const {
          result: { objects: catalogObjects }
        } = await catalogApi.batchRetrieveCatalogObjects({
          objectIds: products
        })

        const upsertBatchObjects = catalogObjects.map(product => ({
          id: product.id,
          type: 'ITEM',
          version: product.version,
          itemData: product.itemData,
          customAttributeValues: {
            is_available: {
              name: 'Is it available?',
              key: 'is_available',
              customAttributeDefinitionId: availabilityId,
              type: 'BOOLEAN',
              booleanValue: true
            }
          }
        }))

        const {
          result: { objects }
        } = await catalogApi.batchUpsertCatalogObjects({
          idempotencyKey: uuid(),
          batches: [
            {
              objects: upsertBatchObjects
            }
          ]
        })

        // Filter objects into distinct sets
        const categories = objects.filter(object => object.type === 'CATEGORY')
        const modifierLists = objects.filter(
          object => object.type === 'MODIFIER_LIST'
        )
        const items = objects.filter(object => object.type === 'ITEM')

        // Define functions for getting category and modifier list data from id
        const categoryId2Name = id =>
          categories.find(category => category.id === id).categoryData.name
        const modifierListId2Data = id =>
          modifierLists.find(modifierList => modifierList.id === id)

        // Get fields for GraphQL response
        return items.map(item => {
          const {
            id: itemId,
            itemData: {
              name: baseItemName,
              description: baseItemDescription,
              variations,
              modifierListInfo,
              categoryId
            },
            customAttributeValues: {
              is_available: { booleanValue: isAvailable }
            }
          } = item

          const categoryName = categoryId2Name(categoryId)

          const returnedVariants = variations.map(variant => {
            const {
              id: itemVariationId,
              itemVariationData: {
                itemId: parentItemId,
                name: itemVariationName,
                priceMoney
              }
            } = variant

            return {
              dataSourceId: itemVariationId,
              parentItemId,
              price: {
                amount: priceMoney ? priceMoney.amount : 0,
                currency: priceMoney ? priceMoney.currency : 'USD'
              },
              name: itemVariationName,
              dataSource: 'SQUARE',
              merchant: ''
            }
          })

          const modifierLists = modifierListInfo
            ? modifierListInfo.map(info => ({
                data: modifierListId2Data(info.modifierListId),
                min: info.minSelectedModifiers,
                max: info.maxSelectedModifiers
              }))
            : []

          const returnedModifierLists = modifierLists.map(modifierList => {
            const {
              id: parentListId,
              modifierListData: {
                name: modifierListName,
                selectionType,
                modifiers
              }
            } = modifierList.data

            const returnedModifiers = modifiers.map(modifier => {
              const {
                id: modifierId,
                modifierData: { name: modifierName, modifierListId, priceMoney }
              } = modifier

              return {
                dataSourceId: modifierId,
                parentListId: modifierListId,
                price: {
                  amount: priceMoney ? priceMoney.amount : 0,
                  currency: priceMoney ? priceMoney.currency : 'USD'
                },
                name: modifierName,
                dataSource: 'SQUARE',
                merchant: ''
              }
            })

            return {
              dataSourceId: parentListId,
              name: modifierListName,
              selectionType: selectionType,
              modifiers: returnedModifiers,
              minModifiers: modifierList.min,
              maxModifiers: modifierList.max
            }
          })

          return {
            dataSourceId: itemId,
            category: categoryName,
            variants: returnedVariants,
            modifierLists: returnedModifierLists,
            dataSource: 'SQUARE',
            name: baseItemName,
            description: baseItemDescription,
            merchant: '',
            isAvailable: isAvailable
          }
        })
      } catch (error) {
        if (error instanceof ApiError) {
          return new ApolloError(
            `Creating availability toggle using Square failed because ${error.result}`
          )
        }

        return new ApolloError('Something went wrong creating availability')
      }
    }
  })

const ItemQueries = {
  getCatalog: ItemTC.getResolver('getCatalog'),
  getItem: ItemTC.getResolver('getItem'),
  getAvailability: ItemTC.getResolver('getAvailability'),
  getAvailabilities: ItemTC.getResolver('getAvailabilities'),
  getModifierLists: ItemTC.getResolver('getModifierLists')
}

const ItemMutations = {
  setAvailability: ItemTC.getResolver('setAvailability'),
  createAvailabilityToggle: ItemTC.getResolver('createAvailabilityToggle'),
  batchAddAvailability: ItemTC.getResolver('batchAddAvailability')
}

const ItemSubscriptions = {
  availabilityChanged: {
    type: ItemTC,

    subscribe: () => pubsub.asyncIterator('availabilityChanged')
  }
}

export { ItemQueries, ItemMutations, ItemSubscriptions }
