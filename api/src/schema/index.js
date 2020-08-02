import { sc } from "graphql-compose";
import { PaymentMutations } from "./PaymentSchema";
import { UserQueries } from "./UserSchema";
import { ItemQueries } from "./ProductSchema";

sc.Query.addFields({
    ...UserQueries,
    ...ItemQueries
})

sc.Mutation.addFields({
    ...PaymentMutations,
});

const Schema = sc.buildSchema();

export default Schema;
