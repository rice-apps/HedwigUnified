import { sc } from "graphql-compose";
import { GraphQLNonNull, GraphQLString, GraphQLInt, GraphQLList } from "graphql";

import { MoneyTC } from "./CommonModels";

const LineItemTC = sc.createObjectTC({
    name: "LineItem",
    description: "Common data model representation of line items, useful when placing an Order.",
    fields: {
        quantity: GraphQLNonNull(GraphQLInt),
        itemVariationId: GraphQLNonNull(GraphQLString),
        itemModifiersId: GraphQLList(GraphQLString),
    }
})

const OrderTC = sc.createObjectTC({
    name: "Order",
    description: "The common data model representation of orders",
    fields: {
        id: GraphQLNonNull(GraphQLString),
        merchant: GraphQLNonNull(GraphQLString),
        customer: GraphQLNonNull(GraphQLString),
        items: GraphQLNonNull(LineItemTC.getType()), // TODO: create new subtype for variants, modifiers, and items
        totalTax: GraphQLNonNull(MoneyTC.getType()),
        totalDiscount: GraphQLNonNull(MoneyTC.getType()),
        status: GraphQLNonNull(GraphQLString), // TODO: add custom Enum for the state
    },
});

const CreateOrderInputTC = sc.createInputTC({
    name: "CreateOrderInput",
    description: "Input type for creating orders",
    fields: {
        lineItems: GraphQLList(LineItemTC.getType()),
        fulfillments: GraphQLList,
    }
})

export { OrderTC };
