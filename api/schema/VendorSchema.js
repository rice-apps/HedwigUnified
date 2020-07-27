import { withFilter, ApolloError } from "apollo-server-express";
import {
    Vendor,
    VendorTC,
    OrderTC,
    Order,
    UserTC,
    LocationTC,
    EntreeTC,
} from "../models";
// import { pubsub } from '../pubsub';
import { pubsub } from "../pubsub";

/**
 * Custom GraphQL-only fields (essentially additional fields on top of our existing Mongoose-defined Schema)
 */

VendorTC.addFields({
    // products: [ProductTC],
    activeOrders: [OrderTC],
    completedOrders: [OrderTC],
    cancelledOrders: [OrderTC],
});

/**
 * Relations (necessary for any fields that link to other types in the schema)
 * https://graphql-compose.github.io/docs/plugins/plugin-mongoose.html#how-to-build-nesting-relations
 */

// Creates relation to user schema
VendorTC.addRelation("team", {
    resolver: () => UserTC.getResolver("findByIds"),
    prepareArgs: {
        _ids: (source) => source.team,
    },
    projection: { team: 1 },
});

// Creates relation to locations schema
VendorTC.addRelation("locations", {
    resolver: () => LocationTC.getResolver("findByIds"),
    prepareArgs: {
        _ids: (source) => source.locations,
    },
    projection: { locations: 1 },
});

// Creates relation to product schema
// VendorTC.addRelation("products", {
//     resolver: () => EntreeTC.getResolver("findMany"),
//     args: { filter: EntreeTC.getInputTypeComposer() },
//     prepareArgs: {
//         filter: (source) => ({
//             vendor: source._id, // Uses the vendor _id
//         }),
//     },
//     projection: { products: 1 },
// });

// Creates relation to order schema; grabs all ACTIVE orders
VendorTC.addRelation("activeOrders", {
    resolver: () => OrderTC.getResolver("findManyByVendor"),
    prepareArgs: {
        _id: (source) => source._id,
        fulfillmentStates: (source) => ["Placed", "Preparing"],
    },
    projection: { activeOrders: 1 },
});

// Creates relation to order schema; grabs all COMPLETED orders
VendorTC.addRelation("completedOrders", {
    resolver: () => OrderTC.getResolver("findManyByVendor"),
    prepareArgs: {
        _id: (source) => source._id,
        fulfillmentStates: (source) => ["Ready"],
    },
    projection: { completedOrders: 1 },
});

// Creates relation to order schema; grabs all CANCELLED orders
VendorTC.addRelation("cancelledOrders", {
    resolver: () => OrderTC.getResolver("findManyByVendor"),
    prepareArgs: {
        _id: (source) => source._id,
        fulfillmentStates: (source) => ["Cancelled"],
    },
    projection: { cancelledOrders: 1 },
});

/**
 * Custom Resolvers
 */

/**
 * Used to update a vendor's hours
 * Can either add or remove an interval from their operating hours
 */
VendorTC.addResolver({
    name: "vendorUpdateHourSet",
    type: VendorTC,
    // day is an enum, so we want to get its enum from the model directly
    args: {
        id: "ID!",
        push: "Boolean",
        start: "Int!",
        end: "Int!",
        day: VendorTC.getFieldTC("hours").getFieldType("day"),
    },
    resolve: async ({ source, args, context, info }) => {
        // This determines whether we add or remove from the array
        const operation = args.push ? "$addToSet" : "$pull";
        // Setup update based on operation
        const update = {};
        update[operation] = {
            hours: { start: args.start, end: args.end, day: args.day },
        };
        // Execute update
        const vendor = await Vendor.updateOne(
            { _id: args.id }, // find Vendor by id
            update,
        );
        if (!vendor) return null;
        return Vendor.findById(args.id); // Finally return the vendor object
    },
});

// Middleware to ensure that error is thrown when vendor isn't found.
const noVendorError = async (resolve, source, args, context, info) => {
    const res = await resolve(source, args, context, info);
    if (res === null) {
        throw new ApolloError("Vendor doesn't exist!", "NO_VENDOR");
    }
    return res;
};

const VendorQuery = {
    vendorOne: VendorTC.getResolver("findOne").withMiddlewares([noVendorError]),
    vendorMany: VendorTC.getResolver("findMany"),
};

const VendorMutation = {
    vendorCreateOne: VendorTC.getResolver("createOne"),
    vendorAddHourSet: VendorTC.getResolver("vendorUpdateHourSet").wrapResolve(
        (next) => (rp) => {
            rp.args.push = true;
            return next(rp);
        },
    ),
    vendorRemoveHourSet: VendorTC.getResolver(
        "vendorUpdateHourSet",
    ).wrapResolve((next) => (rp) => {
        rp.args.push = false;
        return next(rp);
    }),
    vendorUpdateOne: VendorTC.getResolver("updateOne"),
};

// Need a custom subscription resolver: https://github.com/graphql-compose/graphql-compose-subscription-boilerplate/blob/master/src/schema/index.js
const VendorSubscription = {
    // We want to subscribe to whenever an order is added or changes (such as fulfillment status changes)
    orderChanged: {
        // "type" field has to be a TypeComposer, not just a string.
        type: OrderTC,
        args: { vendor: "ID!" },
        /**
         * This is important: graphql-compose returns "record" and "recordId" as the top level parts of a payload; like so:
         * payload: {
         *  record: {},
         *  recordId: ""
         * }
         * Thus, the object we need (the new order) is INSIDE the .record portion
         */
        resolve: (payload) => (payload.record ? payload.record : payload),
        // withFilter wrapper https://www.apollographql.com/docs/graphql-subscriptions/setup/#filter-subscriptions
        subscribe: withFilter(
            () => pubsub.asyncIterator(["ORDER_ADDED", "ORDER_UPDATED"]),
            (payload, variables) => {
                return payload.record.vendor == variables.vendor;
            },
        ),
    },
};

export { VendorQuery, VendorMutation, VendorSubscription };
