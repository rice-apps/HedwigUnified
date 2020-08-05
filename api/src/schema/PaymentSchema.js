import {
    PaymentsApi,
    CreatePaymentRequest,
    CompletePaymentRequest,
} from "square-connect";
import { GraphQLString, GraphQLNonNull } from "graphql";
import { v4 as uuid } from "uuid";
import { ApolloError } from "apollo-server-express";
import { CreatePaymentITC, PaymentTC } from "../models";

PaymentTC.addResolver({
    name: "createPayment",
    args: {
        record: CreatePaymentITC.getTypeNonNull().getType(),
    },
    type: PaymentTC,
    resolve: async ({ args }) => {
        const {
            record: { sourceId, subtotal, tip, orderId, customerId },
        } = args;

        // TODO: Add shopify payment flow
        const api = new PaymentsApi();
        const paymentBody = new CreatePaymentRequest();

        const paymentResponse = await api.createPayment({
            ...paymentBody,
            source_id: sourceId,
            idempotency_key: uuid(),
            amount_money: subtotal,
            tip_money: tip,
            order_id: orderId,
            customer_id: customerId,
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

        const {
            payment: {
                id,
                order_id,
                customer_id,
                amount_money,
                tip_money,
                total_money,
                status,
            },
        } = paymentResponse;

        return {
            id,
            order: order_id,
            customer: customer_id,
            subtotal: amount_money,
            tip: tip_money,
            total: total_money,
            status,
        };
    },
});

const PaymentMutations = {
    createPayment: PaymentTC.getResolver("createPayment"),
    completePayment: PaymentTC.getResolver("completePayment"),
};

export { PaymentMutations };
