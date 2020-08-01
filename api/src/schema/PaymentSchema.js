import { sc } from "graphql-compose";
import { GraphQLString } from "graphql";
import { SquareMoneyTC } from "../models/square/Common";
import { PaymentsApi, CreatePaymentRequest } from "square-connect";

sc.createResolver({
    name: "SquareCreatePayment",
    type: "type SquarePayment { id: ID, orderId: ID, total: Float }",
    args: {
        sourceId: GraphQLString,
        orderId: GraphQLString,
        amount_money: SquareMoneyTC.getITC(),
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
