import { sc } from "graphql-compose";
import { PaymentQueries, PaymentMutations } from "./PaymentSchema";
import { UserQueries } from "./UserSchema";
import { ItemQueries, ItemMutations } from "./ProductSchema";
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
    ...PaymentQueries,
});

sc.Mutation.addFields({
    ...PaymentMutations,
    ...OrderMutations,
    ...VendorMutations,
    ...ItemMutations,
});

sc.Subscription.addFields({
    ...OrderSubscriptions,
});

const Schema = sc.buildSchema();

export default Schema;
