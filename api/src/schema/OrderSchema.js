import { Order, OrderTC, UserTC, VendorTC, ProductTC } from "../models";
import { pubsub } from "../pubsub";

/**
 * Relations (necessary for any fields that link to other types in the schema)
 * https://graphql-compose.github.io/docs/plugins/plugin-mongoose.html#how-to-build-nesting-relations
 */
OrderTC.addRelation("user", {
    resolver: () => UserTC.getResolver("findById"),
    prepareArgs: {
        _id: (source) => source.user,
    },
    projection: { user: 1 },
});

OrderTC.addRelation("vendor", {
    resolver: () => VendorTC.getResolver("findById"),
    prepareArgs: {
        _id: (source) => source.vendor,
    },
    projection: { vendor: 1 },
});

/**
 * Add relation for a nested field: https://github.com/graphql-compose/graphql-compose/issues/2
 * But the .getByPath(path) method doesn't exist anymore, so to get the TypeComposer of the nested field (in this case, "items")
 * We need to use .getFieldTC(path)
 */
// const ItemsTC = OrderTC.getFieldTC("items");
// ItemsTC.addRelation("product", {
//     resolver: () => ProductTC.getResolver("findById"),
//     prepareArgs: {
//         _id: (source) => source.product,
//     },
//     projection: { product: 1 },
// });

// ItemsTC.addRelation("addons", {
//     resolver: () => ProductTC.getResolver("findByIds"),
//     prepareArgs: {
//         _ids: (source) => source.addons,
//     },
//     projection: { addons: 1 },
// });

/**
 * Custom Resolvers
 */

/**
 * Used to find all products for a particular vendor
 */
OrderTC.addResolver({
    name: "findManyByVendor",
    type: [OrderTC],
    args: {
        _id: "ID!",
        fulfillmentStates: [OrderTC.getFieldTC("fulfillment")],
    },
    resolve: async ({ source, args, context, info }) => {
        return await Order.find({
            vendor: args._id,
            fulfillment: { $in: args.fulfillmentStates },
        });
    },
});

OrderTC.addResolver({
    name: "findOrCreate",
    type: OrderTC,
    args: { record: OrderTC.getInputTypeComposer() },
    resolve: async ({ source, args, context, info }) => {
        // Check if the user already has a cart for this vendor
        const { user, vendor } = args.record;

        const order = await Order.findOne({
            user,
            vendor,
            fulfillment: "Cart",
        });

        if (order) return order;
        return await Order.create({
            user,
            vendor,
            fulfillment: "Cart",
        });
    },
});

OrderTC.addResolver({
    name: "updateItems",
    type: OrderTC,
    args: {
        _id: "ID!",
        push: "Boolean",
        item: OrderTC.getFieldTC("items").getInputTypeComposer(),
    },
    resolve: async ({ source, args, context, info }) => {
        // This determines whether we add or remove from the array
        const operation = args.push ? "$addToSet" : "$pull";
        // Setup update based on operation
        const update = {};
        update[operation] = { items: args.item };
        // Execute update
        await Order.updateOne(
            { _id: args._id }, // find Order by id
            update,
        );
        // Return the updated order
        return await Order.findById(args._id);
    },
});

OrderTC.addResolver({
    name: "updateItem",
    type: OrderTC,
    args: {
        _id: "ID!",
        item: OrderTC.getFieldTC("items").getInputTypeComposer(),
    },
    resolve: async ({ source, args, context, info }) => {
        // Update operation
        // Check that requested order and requesting user match
        // let match = checkOrderUserMatch(args._id, context.decodedJWT);
        // if (!match) {
        //     throw Error("Decoded user and Schedule do not match!");
        // }

        // We will update ONLY the keys that the request desires to update
        const update = {};
        for (const key of Object.keys(args.item)) {
            // For every key present, we will need to add to the update object
            update[`items.$[elem].${key}`] = args.item[key];
        }

        const options = {
            upsert: false,
            new: true,
            // We need to find the corresponding product
            arrayFilters: [{ "elem.product": args.item.product }],
        };

        // Perform update
        await Order.updateOne(
            { _id: args._id },
            update,
            // { "items.$[elem].quantity": args.item.quantity, "items.$[elem].comments": args.item.comments },
            options,
        );
        return await Order.findById(args._id);
    },
});

const OrderQuery = {
    orderOne: OrderTC.getResolver("findOne"),
    orderMany: OrderTC.getResolver("findMany", [queryAuthMiddleware]),
    findManyByVendor: OrderTC.getResolver("findManyByVendor"),
};

const OrderMutation = {
    findOrCreateCart: OrderTC.getResolver("findOrCreate", [authMiddleware]),
    // https://graphql-compose.github.io/docs/basics/what-is-resolver.html#via-resolverwrapresolve
    orderCreateOne: OrderTC.getResolver("createOne", [
        authMiddleware,
    ]).wrapResolve((next) => (rp) => {
        // Inspiration from: https://github.com/graphql-compose/graphql-compose/issues/60#issuecomment-354152014
        // First, execute the creation
        const createOne = next(rp);
        // We want to execute our pubsub AFTER the "createOne" resolver executes
        return createOne.then((payload) => {
            pubsub.publish(["ORDER_ADDED"], payload);
            // This makes sure we still return the created object to the original mutation call
            return payload;
        });
    }),
    orderAddItem: OrderTC.getResolver("updateItems").wrapResolve(
        (next) => (rp) => {
            rp.args.push = true;
            return next(rp);
        },
    ),
    orderRemoveItem: OrderTC.getResolver("updateItems").wrapResolve(
        (next) => (rp) => {
            rp.args.push = false;
            return next(rp);
        },
    ),
    orderUpdateItem: OrderTC.getResolver("updateItem"),
    orderUpdateOne: OrderTC.getResolver("updateOne").wrapResolve(
        (next) => (rp) => {
            // Inspiration from: https://github.com/graphql-compose/graphql-compose/issues/60#issuecomment-354152014
            // First, execute the creation
            const updateOne = next(rp);
            // We want to execute our pubsub AFTER the "updateOne" resolver executes
            return updateOne.then((payload) => {
                // We only want to publish events for a non-tentative order (i.e. a non-cart order)
                if (payload.record.fulfillment != "Cart") {
                    pubsub.publish(["ORDER_UPDATED"], payload);
                }
                // This makes sure we still return the updated object to the original mutation call
                return payload;
            });
        },
    ),
};

async function queryAuthMiddleware(resolve, source, args, context, info) {
    // Without header, throw error
    if (!context.decodedJWT) {
        throw new Error("You need to be logged in.");
    }

    // Pull out unique MongoDB User id (not the netid) from decoded JWT
    const { id } = context.decodedJWT;

    // Allows a user to only access info from THEIR user object, while maintaining any other filters/args they might have requested
    return resolve(
        source,
        { ...args, filter: { ...args.filter, user: id } },
        context,
        info,
    );
}

async function authMiddleware(resolve, source, args, context, info) {
    // Without header, throw error
    if (!context.decodedJWT) {
        throw new Error("You need to be logged in.");
    }

    // Pull out unique MongoDB User id (not the netid) from decoded JWT
    const { id } = context.decodedJWT;

    // Allows a user to only access THEIR user object, while maintaining any other filters/args they might have requested
    return resolve(
        source,
        { ...args, record: { ...args.record, user: id } },
        context,
        info,
    );
}

export { OrderQuery, OrderMutation };
