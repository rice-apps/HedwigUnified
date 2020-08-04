import { sc } from "graphql-compose";
import {
    GraphQLNonNull,
    GraphQLString,
    GraphQLInt,
    GraphQLList,
} from "graphql";

import {
    MoneyTC,
    OrderStatusEnumTC,
    FulfillmentStatusEnumTC,
} from "./CommonModels";

const LineItemTC = sc.createObjectTC({
    name: "LineItem",
    description:
        "Common data model representation of line items, useful when placing an Order.",
    fields: {
        quantity: GraphQLNonNull(GraphQLInt),
        itemVariationId: GraphQLNonNull(GraphQLString),
        itemModifiersId: GraphQLList(GraphQLString),
    },
});

const OrderTC = sc.createObjectTC({
    name: "Order",
    description: "The common data model representation of orders",
    fields: {
        id: GraphQLNonNull(GraphQLString),
        merchant: GraphQLNonNull(GraphQLString),
        customer: GraphQLNonNull(GraphQLString),
        items: LineItemTC.getTypeNonNull().getType(),
        totalTax: MoneyTC.getTypeNonNull().getType(),
        totalDiscount: MoneyTC.getTypeNonNull().getType(),
        total: MoneyTC.getTypeNonNull().getType(),
        orderStatus: OrderStatusEnumTC.getTypeNonNull().getType(),
        fulfillmentStatus: FulfillmentStatusEnumTC.getTypeNonNull().getType(),
    },
});

const CreateOrderInputTC = sc.createInputTC({
    name: "CreateOrderInput",
    description: "Input type for creating orders",
    fields: {
        idempotencyKey: GraphQLNonNull(GraphQLString),
        lineItems: LineItemTC.getITC()
            .getTypePlural()
            .getTypeNonNull()
            .getType(),
        recipient: GraphQLNonNull(GraphQLString),
    },
});

export { OrderTC, CreateOrderInputTC };
