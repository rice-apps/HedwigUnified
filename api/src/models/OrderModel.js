import { sc, toInputObjectType, InputTypeComposer } from "graphql-compose";
import {
    GraphQLNonNull,
    GraphQLString,
    GraphQLInt,
    GraphQLList,
} from "graphql";

import { Order } from "square-connect";
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

const FilterOrderInputTC = sc
    .createInputTC({
        name: "FilterOrderInput",
        description: "Input type for filter orders",
        fields: {
            ids: GraphQLList(GraphQLNonNull(GraphQLString)),
        },
    })
    .merge(toInputObjectType(OrderTC).removeField("id"));

const SortOrderEnumTC = sc.createEnumTC({
    name: "SortOrderInput",
    description: "Input type for sort orders",
    values: {
        PICKUP_TIME: { value: "PICKUP_TIME" },
    },
});

const FindManyOrderPayloadTC = sc.createObjectTC({
    name: "FindManyOrderPayload",
    description: "Payload for findMany resolver",
    fields: {
        cursor: "String",
        orders: OrderTC.getTypePlural().getType(),
    },
});

export {
    OrderTC,
    CreateOrderInputTC,
    FilterOrderInputTC,
    SortOrderEnumTC,
    FindManyOrderPayloadTC,
};
