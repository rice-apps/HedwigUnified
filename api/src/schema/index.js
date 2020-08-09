import { sc } from "graphql-compose";
import { PaymentMutations } from "./PaymentSchema";
import { UserQueries } from "./UserSchema";
import { ItemQueries } from "./ProductSchema";
import {
    OrderQueries,
    OrderMutations,
    OrderSubscriptions,
} from "./OrderSchema";
import { VendorQueries, VendorMutations } from "./VendorSchema";

sc.Query.addFields({
    ...UserQueries,
    ...ItemQueries,
    ...VendorQueries,
    ...OrderQueries,
});

sc.Mutation.addFields({
    ...PaymentMutations,
    ...OrderMutations,
    ...VendorMutations,
});

sc.Subscription.addFields({
    ...OrderSubscriptions,
});

const Schema = sc.buildSchema();

export default Schema;
