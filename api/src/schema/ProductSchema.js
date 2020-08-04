import { BatchRetrieveCatalogObjectsRequest, CatalogApi } from "square-connect";
import { ApolloError } from "apollo-server-express";
import { ItemTC } from "../models";
import { DataSourceEnumTC } from "../models/CommonModels";
import { GraphQLNonNull } from "graphql";

ItemTC.addResolver({
    name: "getItem",
    args: {
        dataSource: GraphQLNonNull(DataSourceEnumTC.getType()),
        dataSourceId: GraphQLNonNull(ItemTC.getFieldTC("dataSourceId").getType()),
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
                item_variation_data: { item_id, name, price_money },
            } = variant;

            return {
                dataSourceId: item_id,
                parentItemId: dataSourceId,
                price: {
                    amount: price_money.amount,
                    currency: price_money.currency,
                },
                // From interface
                name,
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
                modifier_list_data: { name, selection_type, modifiers },
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
                    modifierName,
                    dataSource,
                    merchant: "",
                };
            });

            return {
                dataSourceId: parentListId,
                name,
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
    // getCatalog: ItemTC.getResolver("")
    getItem: ItemTC.getResolver("getItem"),
};

const ItemMutations = {};

export { ItemQueries, ItemMutations };
