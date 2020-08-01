import { sc } from "graphql-compose";
import { GraphQLNonNull, GraphQLString } from "graphql";
import { MoneyTC } from "./CommonModels";

const PaymentTC = sc.createObjectTC({
    name: "Payment",
    description: "Representation of payments in common data model",
    fields: {
        id: GraphQLNonNull(GraphQLString),
        order: GraphQLNonNull(GraphQLString),
        customer: GraphQLNonNull(GraphQLString),
        subtotal: GraphQLNonNull(MoneyTC.getType()),
        tip: GraphQLNonNull(MoneyTC.getType()),
        total: GraphQLNonNull(MoneyTC.getType()),
        status: GraphQLNonNull(GraphQLString),
    },
});

const CreatePaymentITC = sc.createInputTC({
    name: "CreatePaymentInput",
    description: "Input type for creating Payments",
    fields: {
        sourceId: GraphQLNonNull(GraphQLString),
        orderId: GraphQLNonNull(GraphQLString),
        customerId: GraphQLNonNull(GraphQLString),
        subtotal: GraphQLNonNull(MoneyTC.getITC().getType()),
        tip: MoneyTC.getITC().getType(),
    },
});

export { PaymentTC, CreatePaymentITC };
