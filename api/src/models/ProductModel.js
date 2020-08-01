import { sc } from "graphql-compose";
import { GraphQLList, GraphQLNonNull, GraphQLString } from "graphql";

import { DataSourceEnumTC, MoneyTC } from "./CommonModels";

const ProductInterfaceTC = sc.createInterfaceTC({
    name: "Product",
    description: "The base product interface for the common data model",
    fields: {
        name: GraphQLNonNull(GraphQLString),
        description: GraphQLNonNull(GraphQLString),
        dataSource: () => DataSourceEnumTC,
        merchant: GraphQLNonNull(GraphQLString), // TODO: Add merchant data type
    },
});

const ItemVariantTC = sc
    .createObjectTC({
        name: "ItemVariant",
        description: "A variant of an existing Item",
        fields: {
            dataSourceId: GraphQLNonNull(GraphQLString),
            parentItemId: GraphQLNonNull(GraphQLString),
            price: GraphQLNonNull(MoneyTC.getType()),
        },
    })
    .addInterfaces([ProductInterfaceTC]);

const ItemModifierTC = sc
    .createObjectTC({
        name: "ItemModifier",
        description: "A modifier for Items",
        fields: {
            dataSourceId: GraphQLNonNull(GraphQLString),
            price: GraphQLNonNull(MoneyTC.getType()),
        },
    })
    .addInterfaces([ProductInterfaceTC]);

const ItemTC = sc
    .createObjectTC({
        name: "Item",
        description: "An item in the common data model",
        fields: {
            dataSourceId: GraphQLNonNull(GraphQLString),
            variants: GraphQLList(ItemVariantTC.getType()),
            modifiers: GraphQLList(ItemModifierTC.getType()),
        },
    })
    .addInterfaces([ProductInterfaceTC]);

export { ProductInterfaceTC, ItemTC };
