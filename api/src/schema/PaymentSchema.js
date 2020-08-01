import { sc } from "graphql-compose";
import { GraphQLNonNull, GraphQLString, GraphQLScalarType } from "graphql";
import { SquareMoneyTC } from "../legacy/square/Common";
import {
    PaymentsApi,
    CreatePaymentRequest,
    CompletePaymentRequest,
} from "square-connect";

sc.createResolver({
    name: "SquareCreatePayment",
    type: "type SquarePayment { id: ID, orderId: ID, total: Float }",
    args: {
        sourceId: GraphQLNonNull(GraphQLString),
        orderId: GraphQLNonNull(GraphQLString),
        amount_money: GraphQLNonNull(SquareMoneyTC.getITC().getType()),
    },
    resolve: async ({ args }) => {
        // TODO: add Square Connect API instance to context
        const apiInstance = new PaymentsApi();
        const body = new CreatePaymentRequest();

        const paymentResponse = await apiInstance.createPayment({
            ...body,
            source_id: args.sourceId,
            order_id: args.orderId,
            amount_money: args.amount_money,
            autocomplete: false,
        });

        return paymentResponse;
    },
});

sc.createResolver({
    name: "SquareCapturePayment",
    type: "type SquarePayment { id: ID, orderId: ID, total: Float }",
    args: {
        paymentId: GraphQLNonNull(GraphQLString),
    },
    resolve: async ({ args }) => {
        const apiInstance = new PaymentsApi();
        const body = new CompletePaymentRequest();

        const capturedPayment = await apiInstance.completePayment(
            args.paymentId,
            body,
        );

        return capturedPayment;
    },
});
