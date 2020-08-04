import { sc } from "graphql-compose";
import { PaymentMutations } from "./PaymentSchema";
import { UserQueries } from "./UserSchema";
import { ItemQueries } from "./ProductSchema";
import { OrderMutations } from "./OrderSchema";

sc.Query.addFields({
    ...UserQueries,
    ...ItemQueries,
});

sc.Mutation.addFields({
    ...PaymentMutations,
    ...OrderMutations,
});

const Schema = sc.buildSchema();

export default Schema;
