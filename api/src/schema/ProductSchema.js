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
import pubsub from "../utils/pubsub";

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
          const {
            id: modifierId,
            modifier_data: {
              name: modifierName,
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
      console.log("modifier_list_info is null", modifier_list_info);
      let returnedModifierLists;
      if (modifier_list_info) {
        console.log("Actually fired?");
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
  })
  .addResolver({
    name: "getAvailability",
    args: {
      productId: "String!",
    },
    type: "Boolean",
    resolve: async ({ args }) => {
      const { productId } = args;

      const api = new CatalogApi();

      const retrieveCatalogObjectResponse = await api.retrieveCatalogObject(
        productId
      );

      if (retrieveCatalogObjectResponse.errors) {
        return new ApolloError(
          `Updating availability failed: ${retrieveCatalogObjectResponse.errors}`
        );
      }

      return retrieveCatalogObjectResponse.object.custom_attribute_values
        .is_available.boolean_value;
    },
  })
  .addResolver({
    name: "getAvailabilities",
    args: {
      productIds: "[String!]",
    },
    type: "Boolean",
    resolve: async ({ args }) => {
      const { productIds } = args;

      const api = new CatalogApi();

      const batchRetrieveResponse = await api.batchRetrieveCatalogObjects({
        object_ids: productIds,
      });

      if (batchRetrieveResponse.errors) {
        return new ApolloError(
          `Batch retrieving availabilities failed: ${batchRetrieveResponse.errors}`
        );
      }

      return batchRetrieveResponse.objects.every(
        (value) => value.custom_attribute_values.is_available.boolean_value
      );
    },
  })
  .addResolver({
    name: "setAvailability",
    args: {
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
  })
  .addResolver({
    name: "createAvailabilityToggle",
    type: "String",
    args: {
      merchantId: "String!",
    },
    resolver: async ({ args }) => {
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

      const api = new CatalogApi();

      const batchRetrieveCatalogObjectsResponse = await api.batchRetrieveCatalogObjects(
        {
          object_ids: products,
        }
      );

      const upsertBatchObjects = batchRetrieveCatalogObjectsResponse.objects.map(
        (product) => ({
          id: product.id,
          type: "ITEM",
          version: product.version,
          item_data: product.item_data,
          custom_attribute_values: {
            is_available: {
              name: "Is it available?",
              key: "is_available",
              custom_attribute_definition_id: availabilityId,
              type: "BOOLEAN",
              boolean_value: true,
            },
          },
        })
      );

      const batchUpsertCatalogObjectsResponse = await api.batchUpsertCatalogObjects(
        {
          idempotency_key: uuid(),
          batches: [
            {
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
            const {
              id: modifierId,
              modifier_data: {
                name: modifierName,
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
