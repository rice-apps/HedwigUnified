import {
    BatchRetrieveCatalogObjectsRequest,
    CatalogApi,
    ListCatalogRequest,
} from "square-connect";
import { ApolloError } from "apollo-server-express";
import { ItemTC } from "../models";
import { DataSourceEnumTC } from "../models/CommonModels";
import { GraphQLString } from "graphql";
import fs from "fs";

ItemTC.addResolver({
    name: "getCatalog",
    args: {
        vendor: GraphQLString,
        dataSource: DataSourceEnumTC.getType(),
    },
    type: [ItemTC],
    resolve: async ({ args }) => {
        // Extract vendor name from args
        const { dataSource, vendor } = args;

        // Check for vendor; we cannot get a catalog without a specified vendor
        if (!vendor) {
            return new ApolloError("Vendor required.");
        }

        // Step 1: Make Square Request for Catalog
        const api = new CatalogApi();
        const listCatalogBody = new ListCatalogRequest();
        listCatalogBody.types = "ITEM,CATEGORY,MODIFIER_LIST";
        const catalogResponse = await api.listCatalog(listCatalogBody);
        // await fs.writeFile('example_catalog.json', JSON.stringify(catalogResponse), {}, () => console.log("Hi"));

        const { objects } = catalogResponse;

        // Step 1.5: Filter objects into distinct sets
        const categories = objects.filter(
            (object) => object.type == "CATEGORY",
        );
        const modifierLists = objects.filter(
            (object) => object.type == "MODIFIER_LIST",
        );
        const items = objects.filter((object) => object.type == "ITEM");

        // Step 1.7: Extract category names from categories
        const categoryId2Name = (id) =>
            categories.find((category) => category.id == id).category_data.name;
        const modifierListId2Data = (id) =>
            modifierLists.find((modifierList) => modifierList.id == id);

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
                    parentItemId: parentItemId,
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
                      modifierListId2Data(info.modifier_list_id),
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
                            currency: price_money
                                ? price_money.currency
                                : "USD",
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
            };
        });
    },
});

ItemTC.addResolver({
    name: "getItem",
    args: {
        dataSource: DataSourceEnumTC.getType(),
        dataSourceId: ItemTC.getFieldTC("dataSourceId"),
    },
    type: ItemTC,
    resolve: async ({ args }) => {
        // Extract data source to interact with as well as ID of product (as used inside data source)
        const { dataSource, dataSourceId } = args;

        // Check for data source ID - if missing, transaction cannot be completed
        if (!dataSource || !dataSourceId) {
            return new ApolloError("Data Source and Data Source ID required.");
        }

        // Step 1: Make request to Square to fetch this item ID
        const api = new CatalogApi();
        const retrievalResponse = await api.retrieveCatalogObject(dataSourceId);

        if (retrievalResponse.errors) {
            return new ApolloError(
                `Encountered the following errors while create payment: ${retrievalResponse.errors}`,
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
                parentItemId: parentItemId,
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
            (info) => info.modifier_list_id,
        );
        // Create request body for batch retrieval, using modifier list IDs
        const modifierRequestBody = new BatchRetrieveCatalogObjectsRequest();
        modifierRequestBody.object_ids = modifier_list_ids;

        // Make request for modifier lists
        const modifierListsData = await api.batchRetrieveCatalogObjects(
            modifierRequestBody,
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
        return {
            dataSourceId,
            variants: returnedVariants,
            modifierLists: returnedModifierLists,
            // From interface
            dataSource,
            name: baseItemName,
            description: baseItemDescription,
            merchant: "",
        };
    },
});

const ItemQueries = {
    getCatalog: ItemTC.getResolver("getCatalog"),
    getItem: ItemTC.getResolver("getItem"),
};

const ItemMutations = {};

export { ItemQueries, ItemMutations };
