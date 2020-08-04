import { OrdersApi, CreateOrderRequest } from "square-connect";
import { GraphQLNonNull, GraphQLString } from "graphql";
import { ApolloError } from "apollo-server-express";
import { CreateOrderInputTC, OrderTC } from "../models";

OrderTC.addResolver({
    name: "createOrder",
    type: OrderTC,
    args: {
        locationId: GraphQLNonNull(GraphQLString),
        record: () => GraphQLNonNull(CreateOrderInputTC.getType()),
    },
    resolve: async ({ args }) => {
        const {
            idempotencyKey,
            locationId,
            record: { lineItems, recipient },
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
                            recipient: {
                                customer_id: recipient,
                            },
                        },
                    },
                ],
                state: "OPEN",
            },
        });

        if (orderResponse.errors) {
            return new ApolloError(
                `New order couldn't be created due to reason: ${errors}`,
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
                fulfillments: [first, ...rest],
            },
        } = orderResponse;

        return {
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
    },
});

const OrderMutations = {
    createOrder: OrderTC.getResolver("createOrder"),
};

export { OrderMutations };
