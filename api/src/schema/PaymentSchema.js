import { CreatePaymentITC, PaymentTC } from "../models";
import {
    PaymentsApi,
    CreatePaymentRequest,
    CompletePaymentRequest,
} from "square-connect";
import { GraphQLString, GraphQLNonNull } from "graphql";
import { v4 as uuid } from "uuid";
import { ApolloError } from "apollo-server-express";

PaymentTC.addResolver({
    name: "createPayment",
    args: {
        record: GraphQLNonNull(CreatePaymentITC.getType()),
    },
    type: PaymentTC,
    resolve: async ({ args }) => {
        // TODO: Add shopify payment flow
        const api = new PaymentsApi();
        const paymentBody = new CreatePaymentRequest();

        const paymentResponse = await api.createPayment({
            ...paymentBody,
            source_id: args.record.sourceId,
            idempotency_key: uuid(),
            amount_money: args.record.subtotal,
            tip_money: args.record.tip,
            order_id: args.record.orderId,
            customer_id: args.record.customerId,
            autocomplete: false,
        });

        if (paymentResponse.errors) {
            return new ApolloError(
                `Encounter the following errors while create payment: ${paymentResponse.errors}`,
            );
        }

        const { payment } = paymentResponse;

        return {
            id: payment.id,
            order: payment.order_id,
            customer: payment.customer_id,
            subtotal: payment.amount_money,
            tip: payment.tip_money,
            total: payment.total_money,
            status: payment.status,
        };
    },
}).addResolver({
    name: "completePayment",
    args: {
        // TODO: add fields for Shopify
        paymentId: GraphQLNonNull(GraphQLString),
    },
    type: PaymentTC,
    resolve: async ({ args }) => {
        const api = new PaymentsApi();
        const paymentBody = new CompletePaymentRequest();

        const paymentResponse = await api.completePayment(
            args.paymentId,
            paymentBody,
        );

        if (paymentResponse.errors) {
            return new ApolloError(
                `Encounter the following errors while complete payment: ${paymentResponse.errors}`,
            );
        }

        const { payment } = paymentResponse;

        return {
            id: payment.id,
            order: payment.order_id,
            customer: payment.customer_id,
            subtotal: payment.amount_money,
            tip: payment.tip_money,
            total: payment.total_money,
            status: payment.status,
        };
    },
});

const PaymentMutations = {
    createPayment: PaymentTC.getResolver("createPayment"),
    completePayment: PaymentTC.getResolver("completePayment"),
};

export { PaymentMutations };
