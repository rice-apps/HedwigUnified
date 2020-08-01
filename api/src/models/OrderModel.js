import { sc } from "graphql-compose";
import { GraphQLNonNull, GraphQLString } from "graphql";

import { MoneyTC } from "./CommonModels";

const OrderTC = sc.createObjectTC({
    name: "Order",
    description: "The common data model representation of orders",
    fields: {
        id: GraphQLNonNull(GraphQLString),
        merchant: GraphQLNonNull(GraphQLString),
        customer: GraphQLNonNull(GraphQLString),
        items: GraphQLNonNull(GraphQLString), // TODO: create new subtype for variants, modifiers, and items
        totalTax: GraphQLNonNull(MoneyTC.getType()),
        totalDiscount: GraphQLNonNull(MoneyTC.getType()),
        status: GraphQLNonNull(GraphQLString), // TODO: add custom Enum for the state
    },
});

export { OrderTC };
