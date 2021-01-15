<<<<<<< HEAD
import {
  BatchRetrieveCatalogObjectsRequest,
  CatalogApi,
  ListCatalogRequest,
  UpsertCatalogObjectRequest,
} from "square-connect";
import { ApolloError } from "apollo-server-express";
import { v4 as uuid } from "uuid";
import { ItemTC } from "../models";
import { DataSourceEnumTC } from "../models/CommonModels";
import { pubsub } from "../utils/pubsub";
=======
import { ApolloError } from 'apollo-server-express'
import { ApiError } from 'square'
import { v4 as uuid } from 'uuid'
import { ItemTC } from '../models'
import { DataSourceEnumTC } from '../models/CommonModels'
import squareClient from '../square'
import { pubsub } from '../utils/pubsub'
>>>>>>> 70cbb7320484a201dc4f85b19c21bad2fe25dc3f

ItemTC.addResolver({
  name: "getCatalog",
  args: {
    vendor: "String!",
    dataSource: DataSourceEnumTC.getTypeNonNull().getType(),
  },
  type: [ItemTC],
  resolve: async ({ args }) => {
    // Extract vendor name from args
    const { dataSource } = args;

<<<<<<< HEAD
    // Step 1: Make Square Request for Catalog
    const api = new CatalogApi();
    const listCatalogBody = new ListCatalogRequest();
    listCatalogBody.types = "ITEM,CATEGORY,MODIFIER_LIST";
    const catalogResponse = await api.listCatalog(listCatalogBody);
    // await fs.writeFile('example_catalog.json', JSON.stringify(catalogResponse), {}, () => console.log("Hi"));

    const { objects } = catalogResponse;

    // Step 1.5: Filter objects into distinct sets
    const categories = objects.filter((object) => object.type === "CATEGORY");
    const modifierLists = objects.filter(
      (object) => object.type === "MODIFIER_LIST"
    );
    const items = objects.filter((object) => object.type === "ITEM");

    // Step 1.7: Extract category names from categories
    const categoryId2Name = (id) =>
      categories.find((category) => category.id === id).category_data.name;
    const modifierListId2Data = (id) =>
      modifierLists.find((modifierList) => modifierList.id === id);

    // Step 2: Transform data into CMD
    return items.map((item) => {
      const {
        id: itemId,
        item_data: {
          name: baseItemName,
          description: baseItemDescription,
          variations,
          modifier_list_info,
          category_id,
        },
        custom_attribute_values: {
          is_available: { boolean_value: isAvailable },
        },
      } = item;

      // Step 2.25: Replace category IDs with names
      const categoryName = categoryId2Name(category_id);

      const returnedVariants = variations.map((variant) => {
        const {
          id: itemVariationId,
          item_variation_data: {
            item_id: parentItemId,
            name: itemVariationName,
            price_money,
          },
        } = variant;

        return {
          dataSourceId: itemVariationId,
          parentItemId,
          // Some variants do not have an associated price
          price: {
            amount: price_money ? price_money.amount : 0,
            currency: price_money ? price_money.currency : "USD",
          },
          // From interface
          name: itemVariationName,
          dataSource,
          merchant: "",
        };
      });

      const modifierLists = modifier_list_info
        ? modifier_list_info.map((info) => [
            modifierListId2Data(info.modifier_list_id),
            info.min_selected_modifiers,
            info.max_selected_modifiers,
          ])
        : [];

      const returnedModifierLists = modifierLists.map((modifierList) => {
        const {
          id: parentListId,
          modifier_list_data: {
            name: modifierListName,
            selection_type,
            modifiers,
          },
        } = modifierList[0];

        const returnedModifiers = modifiers.map((modifier) => {
          const {
            id: modifierId,
            modifier_data: {
              name: modifierName,
              modifier_list_id,
              price_money,
            },
          } = modifier;
=======
    const catalogApi = squareClient.catalogApi

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
        categories.find(category => category.id === id).categoryData.name
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
            categoryId,
          },
          customAttributeValues: {
            is_available: { booleanValue: isAvailable }
          }
        } = item

        console.log(baseItemName, imageId);

        let imageData;
        try{
          const response = await catalogApi.retrieveCatalogObject(imageId);
          imageData = response.result.object.imageData.url;
        } catch(error){
          console.log("Image not found");
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
>>>>>>> 70cbb7320484a201dc4f85b19c21bad2fe25dc3f

          return {
            dataSourceId: itemVariationId,
            parentItemId,
            price: {
<<<<<<< HEAD
              amount: price_money ? price_money.amount : 0,
              currency: price_money ? price_money.currency : "USD",
=======
              amount: priceMoney ? priceMoney.amount : 0,
              currency: priceMoney ? priceMoney.currency : 'USD'
>>>>>>> 70cbb7320484a201dc4f85b19c21bad2fe25dc3f
            },
            name: itemVariationName,
            dataSource,
            merchant: "",
          };
        });

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
<<<<<<< HEAD
          dataSourceId: parentListId,
          name: modifierListName,
          selectionType: selection_type,
          modifiers: returnedModifiers,
          minModifiers: modifierList[1],
          maxModifiers: modifierList[2],
        };
      });

      return {
        dataSourceId: itemId,
        category: categoryName,
        variants: returnedVariants,
        modifierLists: returnedModifierLists,
        // From interface
        dataSource,
        name: baseItemName,
        description: baseItemDescription,
        merchant: "",
        isAvailable: isAvailable,
      };
    });
  },
=======
          dataSourceId: itemId,
          image: imageData,
          category: categoryName,
          variants: returnedVariants,
          modifierLists: returnedModifierLists,
          dataSource,
          name: baseItemName,
          description: baseItemDescription,
          merchant: '',
          isAvailable: isAvailable
        }
      })
    } catch (error) {
      if (error instanceof ApiError) {
        return new ApolloError(
          `Getting Square catalog failed because ${error.result}`
        )
      }
      console.log(error)
      return new ApolloError(`Something went wrong when getting Square catalog`)
    }
  }
>>>>>>> 70cbb7320484a201dc4f85b19c21bad2fe25dc3f
})
  .addResolver({
    name: "getItem",
    args: {
      dataSource: DataSourceEnumTC.getTypeNonNull().getType(),
      dataSourceId: ItemTC.getFieldTC("dataSourceId")
        .getTypeNonNull()
        .getType(),
    },
    type: ItemTC,
    resolve: async ({ args }) => {
      // Extract data source to interact with as well as ID of product (as used inside data source)
      const { dataSource, dataSourceId } = args;

<<<<<<< HEAD
      // Step 1: Make request to Square to fetch this item ID
      const api = new CatalogApi();
      const retrievalResponse = await api.retrieveCatalogObject(dataSourceId);

      if (retrievalResponse.errors) {
        return new ApolloError(
          `Encountered the following errors while create payment: ${retrievalResponse.errors}`
        );
      }

      const { object } = retrievalResponse;

      // Step 2: Process Square Item into Common Data Model
      const {
        item_data: {
          name: baseItemName,
          description: baseItemDescription,
          variations,
          modifier_list_info,
        },
        custom_attribute_values: {
          is_available: { boolean_value: isAvailable },
        },
      } = object;

      // Parse variation data
      const returnedVariants = variations.map((variant) => {
        const {
          id: itemVariationId,
          item_variation_data: {
            item_id: parentItemId,
            name: itemVariationName,
            price_money,
          },
        } = variant;

        return {
          dataSourceId: itemVariationId,
          parentItemId,
          price: {
            amount: price_money ? price_money.amount : -1,
            currency: price_money ? price_money.currency : -1,
          },
          // From interface
          name: itemVariationName,
          dataSource,
          merchant: "",
        };
      });

      // Get all modifier list IDs that correspond to this item
      // this mapping below is breaking because the modifier_list_info is null
      let returnedModifierLists;
      if (modifier_list_info) {
        const modifier_list_ids = modifier_list_info.map(
          (info) => info.modifier_list_id
        );
        // Create request body for batch retrieval, using modifier list IDs
        const modifierRequestBody = new BatchRetrieveCatalogObjectsRequest();
        modifierRequestBody.object_ids = modifier_list_ids;

        // Make request for modifier lists
        const modifierListsData = await api.batchRetrieveCatalogObjects(
          modifierRequestBody
        );
        const { objects: modifierObjects } = modifierListsData;

        // Parse modifier lists data
        returnedModifierLists = modifierObjects.map((modifierList) => {
          const {
            id: parentListId,
            modifier_list_data: {
              name: modifierListName,
              selection_type,
              modifiers,
            },
          } = modifierList;

          const parentListInfo = modifier_list_info.filter(
            (info) => info.modifier_list_id === parentListId
          )[0];

          const returnedModifiers = modifiers.map((modifier) => {
            const {
              id,
              modifier_data: {
                name: modifierName,
                modifier_list_id,
                price_money,
              },
            } = modifier;

            return {
              dataSourceId: id,
              parentListId: modifier_list_id,
              // Some modifiers do not have an associated price
              price: {
                amount: price_money ? price_money.amount : 0,
                currency: price_money ? price_money.currency : "USD",
              },
              // For interface
              name: modifierName,
              dataSource,
              merchant: "",
            };
          });

          return {
            dataSourceId: parentListId,
            name: modifierListName,
            selectionType: selection_type,
            modifiers: returnedModifiers,
            minModifiers: parentListInfo.min_selected_modifiers,
            maxModifiers: parentListInfo.max_selected_modifiers,
          };
        });
      }

      // Step 3: Return product in common data model format
      return {
        dataSourceId,
        variants: returnedVariants,
        modifierLists: returnedModifierLists || [],
        // From interface
        dataSource,
        name: baseItemName,
        description: baseItemDescription,
        merchant: "",
        isAvailable: isAvailable,
      };
    },
=======
      const catalogApi = squareClient.catalogApi

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
          },
          customAttributeValues: {
            is_available: { booleanValue: isAvailable }
          }
        } = object


        let imageData;
        try{
          const response = await catalogApi.retrieveCatalogObject(imageId);
          imageData = response.result.object.imageData.url;
        } catch(error){
          console.log("Image not found");
        }

        console.log(imageData);

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
          isAvailable: isAvailable
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
>>>>>>> 70cbb7320484a201dc4f85b19c21bad2fe25dc3f
  })
  .addResolver({
    name: "getAvailability",
    args: {
      productId: "String!",
    },
    type: "Boolean",
    resolve: async ({ args }) => {
      const { productId } = args;

<<<<<<< HEAD
      const api = new CatalogApi();

      const retrieveCatalogObjectResponse = await api.retrieveCatalogObject(
        productId
      );
=======
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
>>>>>>> 70cbb7320484a201dc4f85b19c21bad2fe25dc3f

        return new ApolloError(
<<<<<<< HEAD
          `Updating availability failed: ${retrieveCatalogObjectResponse.errors}`
        );
      }

      return retrieveCatalogObjectResponse.object.custom_attribute_values
        .is_available.boolean_value;
    },
=======
          `Something went wrong getting availability for item ${productId}`
        )
      }
    }
>>>>>>> 70cbb7320484a201dc4f85b19c21bad2fe25dc3f
  })
  .addResolver({
    name: "getAvailabilities",
    args: {
      productIds: "[String!]",
    },
    type: "Boolean",
    resolve: async ({ args }) => {
      const { productIds } = args;

<<<<<<< HEAD
      const api = new CatalogApi();

      const batchRetrieveResponse = await api.batchRetrieveCatalogObjects({
        object_ids: productIds,
      });
=======
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
>>>>>>> 70cbb7320484a201dc4f85b19c21bad2fe25dc3f

        return new ApolloError(
<<<<<<< HEAD
          `Batch retrieving availabilities failed: ${batchRetrieveResponse.errors}`
        );
      }

      return batchRetrieveResponse.objects.every(
        (value) => value.custom_attribute_values.is_available.boolean_value
      );
    },
=======
          `Something went wrong batch retrieving availabilities`
        )
      }
    }
>>>>>>> 70cbb7320484a201dc4f85b19c21bad2fe25dc3f
  })
  .addResolver({
    name: "setAvailability",
    args: {
<<<<<<< HEAD
      idempotencyKey: "String!",
      productId: "String!",
      isItemAvailable: "Boolean!",
      dataSource: DataSourceEnumTC,
    },
    type: ItemTC,
    resolve: async ({ args }) => {
      const { idempotencyKey, productId, isItemAvailable, dataSource } = args;

      const api = new CatalogApi();

      const retrieveCatalogObjectResponse = await api.retrieveCatalogObject(
        productId
      );

      const upsertCatalogObjectBody = new UpsertCatalogObjectRequest();

      upsertCatalogObjectBody.idempotency_key = idempotencyKey;
      upsertCatalogObjectBody.object = {};
      upsertCatalogObjectBody.object.id = productId;
      upsertCatalogObjectBody.object.type = "ITEM";
      upsertCatalogObjectBody.object.version =
        retrieveCatalogObjectResponse.object.version;
      (upsertCatalogObjectBody.object.item_data =
        retrieveCatalogObjectResponse.object.item_data),
        (upsertCatalogObjectBody.object.custom_attribute_values = {
          is_available: {
            name: "Is it available?",
            key: "is_available",
            custom_attribute_definition_id: "7XN45PC5N5ALEEWG6TV6I7YJ",
            type: "BOOLEAN",
            boolean_value: isItemAvailable,
          },
        });

      const upsertCatalogItemResponse = await api.upsertCatalogObject(
        upsertCatalogObjectBody
      );

      if (upsertCatalogItemResponse.errors) {
        return new ApolloError(
          `Updating availability failed: ${upsertCatalogItemResponse.errors}`
        );
      }

      const {
        item_data: {
          name: baseItemName,
          description: baseItemDescription,
          variations,
          modifier_list_info,
        },
      } = upsertCatalogItemResponse.catalog_object;

      // Parse variation data
      const returnedVariants = variations.map((variant) => {
        const {
          id: itemVariationId,
          item_variation_data: {
            item_id: parentItemId,
            name: itemVariationName,
            price_money,
          },
        } = variant;

        return {
          dataSourceId: itemVariationId,
          parentItemId,
          price: {
            amount: price_money.amount,
            currency: price_money.currency,
          },
          // From interface
          name: itemVariationName,
          dataSource,
          merchant: "",
        };
      });

      // Get all modifier list IDs that correspond to this item
      const modifier_list_ids = modifier_list_info.map(
        (info) => info.modifier_list_id
      );
      // Create request body for batch retrieval, using modifier list IDs
      const modifierRequestBody = new BatchRetrieveCatalogObjectsRequest();
      modifierRequestBody.object_ids = modifier_list_ids;

      // Make request for modifier lists
      const modifierListsData = await api.batchRetrieveCatalogObjects(
        modifierRequestBody
      );
      const { objects: modifierObjects } = modifierListsData;

      // Parse modifier lists data
      const returnedModifierLists = modifierObjects.map((modifierList) => {
        const {
          id: parentListId,
          modifier_list_data: {
            name: modifierListName,
            selection_type,
            modifiers,
          },
        } = modifierList;

        const parentListInfo = modifier_list_info.filter(
          (info) => info.modifier_list_id === parentListId
        )[0];

        const returnedModifiers = modifiers.map((modifier) => {
          const {
            id,
            modifier_data: {
              name: modifierName,
              modifier_list_id,
              price_money,
            },
          } = modifier;
=======
      productId: 'String!',
      isItemAvailable: 'Boolean!',
      dataSource: DataSourceEnumTC
    },
    type: ItemTC,
    resolve: async ({ args }) => {
      const { productId, isItemAvailable, dataSource } = args

      const catalogApi = squareClient.catalogApi

      try {
        const {
          result: {
            object: { version, itemData }
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
>>>>>>> 70cbb7320484a201dc4f85b19c21bad2fe25dc3f

          return {
            dataSourceId: itemVariationId,
            parentItemId,
            price: {
<<<<<<< HEAD
              amount: price_money ? price_money.amount : 0,
              currency: price_money ? price_money.currency : "USD",
=======
              amount: priceMoney ? priceMoney.amount : 0,
              currency: priceMoney ? priceMoney.currency : 'USD'
>>>>>>> 70cbb7320484a201dc4f85b19c21bad2fe25dc3f
            },
            name: itemVariationName,
            dataSource,
            merchant: "",
          };
        });

<<<<<<< HEAD
        return {
          dataSourceId: parentListId,
          name: modifierListName,
          selectionType: selection_type,
          modifiers: returnedModifiers,
          minModifiers: parentListInfo.min_selected_modifiers,
          maxModifiers: parentListInfo.max_selected_modifiers,
        };
      });

      // Step 3: Return product in common data model format
      const CDMProduct = {
        dataSourceId: productId,
        variants: returnedVariants,
        modifierLists: returnedModifierLists,
        // From interface
        dataSource,
        name: baseItemName,
        description: baseItemDescription,
        merchant: "",
        isAvailable:
          upsertCatalogItemResponse.catalog_object.custom_attribute_values
            .is_available.boolean_value,
      };

      pubsub.publish("availabilityChanged", {
        availabilityChanged: CDMProduct,
      });

      return CDMProduct;
    },
=======
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

        return new ApolloError(`Something went wrong setting availability`)
      }
    }
>>>>>>> 70cbb7320484a201dc4f85b19c21bad2fe25dc3f
  })
  .addResolver({
    name: "createAvailabilityToggle",
    type: "String",
    args: {
      merchantId: "String!",
    },
    resolve: async ({ args }) => {
<<<<<<< HEAD
      const api = new CatalogApi();

      const upsertCatalogItemResponse = await api.upsertCatalogObject({
        idempotency_key: idempotencyKey,
        object: {
          id: "#is_available",
          type: "CUSTOM_ATTRIBUTE_DEFINITION",
          custom_attribute_definition_data: {
            allowed_object_types: ["ITEM", "ITEM_VARIATION"],
            name: "is_available",
            type: "BOOLEAN",
            key: "is_available",
          },
        },
      });

      if (upsertCatalogItemResponse.errors) {
        return new ApolloError(
          `Creating availability toggle failed: ${upsertCatalogItemResponse.errors}`
        );
      }

      return upsertCatalogItemResponse.catalog_object.id;
    },
=======
      const catalogApi = squareClient.catalogApi

      try {
        const {
          result: { catalogObject }
        } = await catalogApi.upsertCatalogObject({
          idempotencyKey: uuid(),
          object: {
            id: '#is_available',
            type: 'CUSTOM_ATTRIBUTE_DEFINITION',
            customAttributeValues: {
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

        return new ApolloError(`Something went wrong creating availability`)
      }
    }
>>>>>>> 70cbb7320484a201dc4f85b19c21bad2fe25dc3f
  })
  .addResolver({
    name: "batchAddAvailability",
    type: [ItemTC],
    args: {
      products: "[String!]!",
      availabilityId: "String",
    },
    resolve: async ({ args }) => {
      const { products, availabilityId } = args;

<<<<<<< HEAD
      const api = new CatalogApi();

      const batchRetrieveCatalogObjectsResponse = await api.batchRetrieveCatalogObjects(
        {
          object_ids: products,
        }
      );

      const upsertBatchObjects = batchRetrieveCatalogObjectsResponse.objects.map(
        (product) => ({
=======
      const catalogApi = squareClient.catalogApi

      try {
        const {
          result: { objects: catalogObjects }
        } = await catalogApi.batchRetrieveCatalogObjects({
          objectIds: products
        })

        const upsertBatchObjects = catalogObjects.map(product => ({
>>>>>>> 70cbb7320484a201dc4f85b19c21bad2fe25dc3f
          id: product.id,
          type: "ITEM",
          version: product.version,
          itemData: product.itemData,
          customAttributeValues: {
            is_available: {
<<<<<<< HEAD
              name: "Is it available?",
              key: "is_available",
              custom_attribute_definition_id: availabilityId,
              type: "BOOLEAN",
              boolean_value: true,
            },
          },
        })
      );
=======
              name: 'Is it available?',
              key: 'is_available',
              customAttributeDefinitionId: availabilityId,
              type: 'BOOLEAN',
              booleanValue: true
            }
          }
        }))
>>>>>>> 70cbb7320484a201dc4f85b19c21bad2fe25dc3f

        const {
          result: { objects }
        } = await catalogApi.batchUpsertCatalogObjects({
          idempotencyKey: uuid(),
          batches: [
            {
<<<<<<< HEAD
              objects: upsertBatchObjects,
            },
          ],
        }
      );

      const { objects } = batchUpsertCatalogObjectsResponse;

      // Step 1.5: Filter objects into distinct sets
      const categories = objects.filter((object) => object.type === "CATEGORY");
      const modifierLists = objects.filter(
        (object) => object.type === "MODIFIER_LIST"
      );
      const items = objects.filter((object) => object.type === "ITEM");

      // Step 1.7: Extract category names from categories
      const categoryId2Name = (id) =>
        categories.find((category) => category.id === id).category_data.name;
      const modifierListId2Data = (id) =>
        modifierLists.find((modifierList) => modifierList.id === id);

      // Step 2: Transform data into CMD
      return items.map((item) => {
        const {
          id: itemId,
          item_data: {
            name: baseItemName,
            description: baseItemDescription,
            variations,
            modifier_list_info,
            category_id,
          },
          custom_attribute_values: {
            is_available: { boolean_value: isAvailable },
          },
        } = item;

        // Step 2.25: Replace category IDs with names
        const categoryName = categoryId2Name(category_id);

        const returnedVariants = variations.map((variant) => {
          const {
            id: itemVariationId,
            item_variation_data: {
              item_id: parentItemId,
              name: itemVariationName,
              price_money,
            },
          } = variant;

          return {
            dataSourceId: itemVariationId,
            parentItemId,
            // Some variants do not have an associated price
            price: {
              amount: price_money ? price_money.amount : 0,
              currency: price_money ? price_money.currency : "USD",
            },
            // From interface
            name: itemVariationName,
            dataSource,
            merchant: "",
          };
        });

        const modifierLists = modifier_list_info
          ? modifier_list_info.map((info) =>
              modifierListId2Data(info.modifier_list_id)
            )
          : [];

        const returnedModifierLists = modifierLists.map((modifierList) => {
          const {
            id: parentListId,
            modifier_list_data: {
              name: modifierListName,
              selection_type,
              modifiers,
            },
          } = modifierList;

          const returnedModifiers = modifiers.map((modifier) => {
=======
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
>>>>>>> 70cbb7320484a201dc4f85b19c21bad2fe25dc3f
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
<<<<<<< HEAD
                modifier_list_id,
                price_money,
              },
            } = modifier;

            return {
              dataSourceId: modifierId,
              parentListId: modifier_list_id,
              // Some modifiers do not have an associated price
              price: {
                amount: price_money ? price_money.amount : 0,
                currency: price_money ? price_money.currency : "USD",
              },
              // For interface
              name: modifierName,
              dataSource,
              merchant: "",
            };
          });

          return {
            dataSourceId: parentListId,
            name: modifierListName,
            selectionType: selection_type,
            modifiers: returnedModifiers,
          };
        });

        return {
          dataSourceId: itemId,
          category: categoryName,
          variants: returnedVariants,
          modifierLists: returnedModifierLists,
          // From interface
          dataSource,
          name: baseItemName,
          description: baseItemDescription,
          merchant: "",
          isAvailable: isAvailable,
        };
      });
    },
  });
=======
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

        return new ApolloError(`Something went wrong creating availability`)
      }
    }
  })
>>>>>>> 70cbb7320484a201dc4f85b19c21bad2fe25dc3f

const ItemQueries = {
  getCatalog: ItemTC.getResolver("getCatalog"),
  getItem: ItemTC.getResolver("getItem"),
  getAvailability: ItemTC.getResolver("getAvailability"),
  getAvailabilities: ItemTC.getResolver("getAvailabilities"),
};

const ItemMutations = {
  setAvailability: ItemTC.getResolver("setAvailability"),
  createAvailabilityToggle: ItemTC.getResolver("createAvailabilityToggle"),
  batchAddAvailability: ItemTC.getResolver("batchAddAvailability"),
};

const ItemSubscriptions = {
  availabilityChanged: {
    type: ItemTC,

    subscribe: () => pubsub.asyncIterator("availabilityChanged"),
  },
};

export { ItemQueries, ItemMutations, ItemSubscriptions };
