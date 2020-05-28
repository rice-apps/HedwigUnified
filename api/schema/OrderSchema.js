import { Order, OrderTC, UserTC, VendorTC, ProductTC } from '../models';
import { pubsub } from '../pubsub';

/**
 * Relations (necessary for any fields that link to other types in the schema)
 * https://graphql-compose.github.io/docs/plugins/plugin-mongoose.html#how-to-build-nesting-relations
 */
OrderTC.addRelation("user", {
    "resolver": () => UserTC.getResolver('findById'),
    prepareArgs: {
        _id: (source) => source.user,
    },
    projection: { user: 1 }
});

OrderTC.addRelation("vendor", {
    "resolver": () => VendorTC.getResolver('findById'),
    prepareArgs: {
        _id: (source) => source.vendor,
    },
    projection: { vendor: 1 }
});

/**
 * Add relation for a nested field: https://github.com/graphql-compose/graphql-compose/issues/2
 * But the .getByPath(path) method doesn't exist anymore, so to get the TypeComposer of the nested field (in this case, "items")
 * We need to use .getFieldTC(path)
 */
const ItemsTC = OrderTC.getFieldTC("items");
ItemsTC.addRelation("product", {
    "resolver": () => ProductTC.getResolver("findById"),
    prepareArgs: {
        _id: (source) => source.product
    },
    projection: { product: 1 }
});

ItemsTC.addRelation("addons", {
    "resolver": () => ProductTC.getResolver("findByIds"),
    prepareArgs: {
        _ids: (source) => source.addons
    },
    projection: { addons: 1 }
});

/**
 * Custom Resolvers
 */

/**
 * Used to find all products for a particular vendor
 */
OrderTC.addResolver({
    name: "findManyByVendor",
    type: [OrderTC],
    args: { _id: "ID!", fulfillmentStates: [OrderTC.getFieldTC("fulfillment")] },
    resolve: async ({ source, args, context, info }) => {
        return await Order.find({ vendor: args._id, fulfillment: { $in: args.fulfillmentStates } });
    }
});

const OrderQuery = {
    orderOne: OrderTC.getResolver('findOne'),
    orderMany: OrderTC.getResolver('findMany'),
    findManyByVendor: OrderTC.getResolver('findManyByVendor')
};

const OrderMutation = {
    // https://graphql-compose.github.io/docs/basics/what-is-resolver.html#via-resolverwrapresolve
    orderCreateOne: OrderTC.getResolver("createOne").wrapResolve(next => rp => {
        // Inspiration from: https://github.com/graphql-compose/graphql-compose/issues/60#issuecomment-354152014
        // First, execute the creation
        const createOne = next(rp);
        // We want to execute our pubsub AFTER the "createOne" resolver executes
        return createOne.then(payload => {
            pubsub.publish(['ORDER_ADDED'], payload);
            // This makes sure we still return the created object to the original mutation call
            return payload;
        });
    }),
    orderUpdateOne: OrderTC.getResolver("updateOne")
};

export { OrderQuery, OrderMutation };