import { BatchRetrieveCatalogObjectsRequest, CatalogApi } from "square-connect";
import { ApolloError } from "apollo-server-express";
import { ItemTC } from "../models";
import { DataSourceEnumTC } from "../models/CommonModels";

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
        const { item_data } = object;
        const {
            name: baseItemName,
            description: baseItemDescription,
            variations,
            modifier_list_info,
        } = item_data;

        // Parse variation data
        const returnedVariants = variations.map((variant) => {
            const { item_variation_data } = variant;
            const { item_id, name, price_money } = item_variation_data;

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
            const { id: parentListId, modifier_list_data } = modifierList;
            const { name, selection_type, modifiers } = modifier_list_data;

            const returnedModifiers = modifiers.map((modifier) => {
                const { id, modifier_data } = modifier;
                const { name, modifier_list_id } = modifier_data;

                return {
                    dataSourceId: id,
                    parentListId: modifier_list_id,
                    // Some modifiers do not have an associated price
                    price: {
                        amount: modifier_data.price_money
                            ? modifier_data.price_money.amount
                            : 0,
                        currency: modifier_data.price_money
                            ? modifier_data.price_money.currency
                            : "USD",
                    },
                    // For interface
                    name,
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
