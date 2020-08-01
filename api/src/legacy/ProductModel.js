import { sc } from "graphql-compose";
import { GraphQLNonNull, GraphQLString } from "graphql";

const DataSourceEnumTC = sc.createEnumTC({
    name: "DataSourceEnum",
    description: "The various types of data sources",
    values: {
        SQUARE: { value: "SQUARE" },
        SHOPIFY: { value: "SHOPIFY" },
        EXCEL: { value: "EXCEL" },
    },
});

const ProductInterfaceTC = sc.createInterfaceTC({
    name: "Product",
    description: "The base product interface for the common data model",
    fields: {
        name: GraphQLNonNull(GraphQLString),
        description: GraphQLNonNull(GraphQLString),
        dataSource: () => DataSourceEnumTC,
        category: GraphQLNonNull(GraphQLString),
    },
});

export { ProductInterfaceTC };
