import { sc } from "graphql-compose";
import { GraphQLList, GraphQLNonNull, GraphQLString } from "graphql";

import { DataSourceEnumTC, MoneyTC } from "./CommonModels";

const ProductInterfaceTC = sc.createInterfaceTC({
    name: "Product",
    description: "The base product interface for the common data model",
    fields: {
        name: {
            type: GraphQLNonNull(GraphQLString),
            description: "The vendor's name for the product",
        },
        description: {
            type: GraphQLNonNull(GraphQLString),
            description: "The vendor's description of the product",
        },
        dataSource: {
            type: () => DataSourceEnumTC,
            description:
                "The data source for this product. Must be one of SQUARE, SHOPIFY, or EXCEL",
        },
        merchant: {
            type: GraphQLNonNull(GraphQLString),
            description:
                "Must be a merchant supported by Hedwig; check the list before using this field.",
        }, // TODO: Add merchant data type
    },
});

const ItemVariantTC = sc
    .createObjectTC({
        name: "ItemVariant",
        description: "A variant of an existing Item",
        fields: {
            dataSourceId: {
                type: GraphQLNonNull(GraphQLString),
                description:
                    "The ID of the item variant in the data source. Up to developer to verify correctness.",
            },
            parentItemId: {
                type: GraphQLNonNull(GraphQLString),
                description:
                    "The ID of the item of which this is a variant. May not be applicable for all data sources.",
            },
            price: {
                type: GraphQLNonNull(MoneyTC.getType()),
                description: "The base price of this variant.",
            },
        },
    })
    .addInterfaces([ProductInterfaceTC]);

const ItemModifierTC = sc
    .createObjectTC({
        name: "ItemModifier",
        description: "A modifier for Items",
        fields: {
            dataSourceId: {
                type: GraphQLNonNull(GraphQLString),
                description:
                    "The ID of the item modifier in the data source. Up to developer to verify correctness.",
            },
            price: {
                type: GraphQLNonNull(MoneyTC.getType()),
                description: "The base price of this variant.",
            },
        },
    })
    .addInterfaces([ProductInterfaceTC]);

const ItemTC = sc
    .createObjectTC({
        name: "Item",
        description: "An item in the common data model",
        fields: {
            dataSourceId: {
                type: GraphQLNonNull(GraphQLString),
                description:
                    "The ID of the item in the data source. Up to developer to verify correctness.",
            },
            variants: {
                type: GraphQLList(ItemVariantTC.getType()),
                description: "A list of variants of this item",
            },
            modifiers: {
                type: GraphQLList(ItemModifierTC.getType()),
                description: "A list of modifiers application to this item",
            },
        },
    })
    .addInterfaces([ProductInterfaceTC]);

export { ProductInterfaceTC, ItemTC };
