import {
    OrdersApi,
    CreateOrderRequest,
    UpdateOrderRequest,
    SearchOrdersRequest,
} from "square-connect";
import { GraphQLNonNull, GraphQLString } from "graphql";
import { ApolloError } from "apollo-server-express";
import { CreateOrderInputTC, OrderTC } from "../models";
import pubsub from "../utils/pubsub";
import {
    FilterOrderInputTC,
    SortOrderInputTC,
    FindManyOrderPayloadTC,
} from "../models/OrderModel";

OrderTC.addResolver({
    name: "findOrders",
    type: FindManyOrderPayloadTC,
    args: {
        locations: "[String!]!",
        filter: FilterOrderInputTC,
        sort: SortOrderInputTC,
        limit: {
            type: "Int",
            defaultValue: 1000,
        },
        cursor: {
            type: "String",
            defaultValue: "",
        },
    },
    resolve: async ({ args }) => {
        const { locations, cursor, limit, filter, sort } = args;

        const api = new OrdersApi();

        const query = {};

        if (filter) {
            query.filter = filter;
        }

        if (sort) {
            query.sort = sort;
        }

        const searchOrderResponse = await api.searchOrders({
            ...new SearchOrdersRequest(),
            location_ids: locations,
            cursor,
            limit,
            query,
            return_entries: false,
        });

        if (searchOrderResponse.errors) {
            return new ApolloError(
                `Finding orders failed with errors: ${searchOrderResponse.errors}`,
            );
        }

        const { cursor: newCursor, orders } = searchOrderResponse;

        const returnedOrders = orders.map((order) => ({
            id: order.id,
            merchant: order.location_id,
            customer: order.customer_id,
            items: order.line_items,
            totalTax: order.total_tax_money,
            totalDiscount: order.total_discount_money,
            total: order.total_money,
            orderStatus: order.state,
            fulfillmentStatus: order.fulfillments[0].state,
        }));

        return {
            cursor: newCursor,
            orders: returnedOrders,
        };
    },
})
    .addResolver({
        name: "createOrder",
        type: OrderTC,
        args: {
            locationId: GraphQLNonNull(GraphQLString),
            record: CreateOrderInputTC.getTypeNonNull().getType(),
        },
        resolve: async ({ args }) => {
            const {
                locationId,
                record: { idempotencyKey, lineItems, recipient, pickupTime },
            } = args;

            const api = new OrdersApi();

            const orderResponse = await api.createOrder(locationId, {
                ...new CreateOrderRequest(),
                idempotency_key: idempotencyKey,
                order: {
                    line_items: lineItems,
                    customer_id: recipient,
                    fulfillments: [
                        {
                            type: "PICKUP",
                            state: "PROPOSED",
                            pickup_details: {
                                pickup_at: pickupTime,
                                recipient: {
                                    display_name: recipient,
                                },
                            },
                        },
                    ],
                    state: "OPEN",
                },
            });

            if (orderResponse.errors) {
                return new ApolloError(
                    `New order couldn't be created due to reason: ${orderResponse.errors}`,
                );
            }

            const {
                order: {
                    id,
                    location_id,
                    customer_id,
                    line_items,
                    total_tax_money,
                    total_discount_money,
                    total_money,
                    state,
                    fulfillments: [first],
                },
            } = orderResponse;

            const CDMOrder = {
                id,
                merchant: location_id,
                customer: customer_id,
                items: line_items,
                totalTax: total_tax_money,
                totalDiscount: total_discount_money,
                total: total_money,
                orderStatus: state,
                fulfillmentStatus: first.state,
            };

            pubsub.publish("orderCreated", {
                orderCreated: CDMOrder,
            });

            return CDMOrder;
        },
    })
    .addResolver({
        name: "updateOrder",
        type: OrderTC,
        args: {
            locationId: GraphQLNonNull(GraphQLString),
            orderId: GraphQLNonNull(GraphQLString),
            record: OrderTC.getITC().getType(),
        },
        resolve: async ({ args }) => {
            const {
                locationId,
                orderId,
                record: { orderStatus, fulfillmentStatus },
            } = args;

            const api = new OrdersApi();

            const updateOrderResponse = await api.updateOrder(
                locationId,
                orderId,
                {
                    ...new UpdateOrderRequest(),
                    order: {
                        state: orderStatus,
                        fulfillments: [
                            {
                                state: fulfillmentStatus,
                            },
                        ],
                    },
                },
            );

            if (updateOrderResponse.errors) {
                return new ApolloError(
                    `Order couldn't be updated due to reason: ${updateOrderResponse.errors}`,
                );
            }

            const {
                order: {
                    id,
                    location_id,
                    customer_id,
                    line_items,
                    total_tax_money,
                    total_discount_money,
                    total_money,
                    state,
                    fulfillments: [first],
                },
            } = updateOrderResponse;

            const CDMOrder = {
                id,
                merchant: location_id,
                customer: customer_id,
                items: line_items,
                totalTax: total_tax_money,
                totalDiscount: total_discount_money,
                total: total_money,
                orderStatus: state,
                fulfillmentStatus: first.state,
            };

            pubsub.publish("orderUpdated", {
                orderUpdated: CDMOrder,
            });

            return CDMOrder;
        },
    });

const OrderQueries = {
    findOrders: OrderTC.getResolver("findOrders"),
};

const OrderMutations = {
    createOrder: OrderTC.getResolver("createOrder"),
    updateOrder: OrderTC.getResolver("updateOrder"),
};

const OrderSubscriptions = {
    orderCreated: {
        type: OrderTC,

        subscribe: () => pubsub.asyncIterator("orderCreated"),
    },

    orderUpdated: {
        type: OrderTC,

        subscribe: () => pubsub.asyncIterator("orderUpdated"),
    },
};

export { OrderQueries, OrderMutations, OrderSubscriptions };
