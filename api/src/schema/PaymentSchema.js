import { sc } from "graphql-compose";
import { GraphQLString } from "graphql";
import { SquareMoneyTC } from "../models/square/Common";

sc.createResolver({
    name: "SquareCreatePayment",
    type: "type SquarePayment { id: ID, orderId: ID, total: Float }",
    args: {
        sourceId: GraphQLString,
        orderId: GraphQLString,
        amount_money: () => SquareMoneyTC,
    },
    resolve: async ({ args, context }) => {
        // TODO: add Square Connect API instance to context
    }
})
