import { GraphQLInt, GraphQLNonNull, GraphQLString } from "graphql";
import { sc } from "graphql-compose";

const SquareMoneyTC = sc.createObjectTC({
    name: "SquareMoney",
    description: "Square's representation of money",
    fields: {
        amount: GraphQLNonNull(GraphQLInt),
        currency: GraphQLNonNull(GraphQLString),
    },
});

export { SquareMoneyTC };
