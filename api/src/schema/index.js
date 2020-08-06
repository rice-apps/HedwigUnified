import { sc } from "graphql-compose";
import { PaymentMutations } from "./PaymentSchema";
import { UserQueries } from "./UserSchema";
import { ItemQueries } from "./ProductSchema";
import { OrderMutations } from "./OrderSchema";
import { VendorQueries, VendorMutations } from "./VendorSchema";

sc.Query.addFields({
    ...UserQueries,
    ...ItemQueries,
    ...VendorQueries
});

sc.Mutation.addFields({
    ...PaymentMutations,
    ...OrderMutations,
    ...VendorMutations
});

const Schema = sc.buildSchema();

export default Schema;
