import { sc } from "graphql-compose";
import { GraphQLNonNull, GraphQLString, GraphQLInt } from "graphql";

const DataSourceEnumTC = sc.createEnumTC({
    name: "DataSourceEnum",
    description: "The various types of data sources",
    values: {
        SQUARE: { value: "SQUARE" },
        SHOPIFY: { value: "SHOPIFY" },
        EXCEL: { value: "EXCEL" },
    },
});

const MoneyTC = sc.createObjectTC({
    name: "Money",
    description: "Common data model money representation",
    fields: {
        amount: GraphQLNonNull(GraphQLInt),
        currency: GraphQLNonNull(GraphQLString),
    },
});

export { DataSourceEnumTC, MoneyTC };
