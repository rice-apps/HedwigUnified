import { sc } from "graphql-compose";
import { GraphQLID } from "graphql";

sc.createResolver({
    name: "SquareCreatePayment",
    type: "type SquarePayment { id: ID, orderId: ID, total: Float }",
    args: {
        orderId: GraphQLID,
    },
    resolve: async ({ args }) => {
        
    }
})
