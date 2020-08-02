import { ItemTC } from "../models";
import { BatchRetrieveCatalogObjectsRequest, CatalogApi } from "square-connect";
import { DataSourceEnumTC } from "../models/CommonModels";
import { ApolloError } from "apollo-server-express";

ItemTC.addResolver({
    name: "getItem",
    args: {
        dataSource: DataSourceEnumTC.getType(),
        dataSourceId: ItemTC.getFieldTC("dataSourceId"),
    },
    type: ItemTC,
    resolve: async ({ args }) => {
        // Extract data source to interact with as well as ID of product (as used inside data source)
        let { dataSource, dataSourceId } = args;

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
        let { item_data } = object;
        let { name: baseItemName, description: baseItemDescription, variations, modifier_list_info } = item_data;

        // Parse variation data
        let returnedVariants = [];
        for (let variant of variations) {
            let { item_variation_data } = variant;
            let { item_id, name, price_money } = item_variation_data;
            const ItemVariant = {
                dataSourceId: item_id,
                parentItemId: dataSourceId,
                price: {
                    amount: price_money.amount,
                    currency: price_money.currency,
                },
                // From interface
                name: name,
                dataSource: dataSource,
                merchant: "",
            };
            returnedVariants.push(ItemVariant);
        }

        // Get all modifier list IDs that correspond to this item
        let modifier_list_ids = modifier_list_info.map(
            (info) => info.modifier_list_id,
        );
        // Create request body for batch retrieval, using modifier list IDs
        var modifierRequestBody = new BatchRetrieveCatalogObjectsRequest();
        modifierRequestBody.object_ids = modifier_list_ids;

        // Make request for modifier lists
        let modifierListsData = await api.batchRetrieveCatalogObjects(modifierRequestBody);
        let { objects: modifierObjects } = modifierListsData;

        // Parse modifier lists data
        let returnedModifierLists = [];
        for (let modifierList of modifierObjects) {
            let { id: parentListId, modifier_list_data } = modifierList;
            let { name, selection_type, modifiers } = modifier_list_data;

            // For each modifier in list, create ItemModifier
            let returnedModifiers = [];
            for (let modifier of modifiers) {
                let { id, modifier_data } = modifier;
                let { name, modifier_list_id } = modifier_data;
                const ItemModifier = {
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
                    name: name,
                    dataSource: dataSource,
                    merchant: "",
                };
                returnedModifiers.push(ItemModifier);
            }

            // Return modifier list in CMD (Common Data Model) format
            const ItemModifierList = {
                dataSourceId: parentListId,
                name: name,
                selectionType: selection_type,
                modifiers: returnedModifiers,
            };
            returnedModifierLists.push(ItemModifierList);
        }

        // Step 3: Return product in common data model format
        const Item = {
            dataSourceId: dataSourceId,
            variants: returnedVariants,
            modifierLists: returnedModifierLists,
            // From interface
            dataSource: dataSource,
            name: baseItemName,
            description: baseItemDescription,
            merchant: "",
        };

        return Item;
    },
});

const ItemQueries = {
    // getCatalog: ItemTC.getResolver("")
    getItem: ItemTC.getResolver("getItem"),
};

const ItemMutations = {};

export { ItemQueries, ItemMutations };
