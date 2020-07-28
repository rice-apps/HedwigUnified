// import { ApolloError } from "apollo-server-express";
// import { Product, ProductTC, VendorTC, EntreeTC, Vendor } from "../models";

// /**
//  * Relations (necessary for any fields that link to other types in the schema)
//  * https://graphql-compose.github.io/docs/plugins/plugin-mongoose.html#how-to-build-nesting-relations
//  */
// ProductTC.addRelation("vendor", {
//     resolver: () => VendorTC.getResolver("findById"),
//     prepareArgs: {
//         _id: (source) => source.vendor,
//     },
//     projection: { vendor: 1 },
// });

// /**
//  * Custom Resolvers
//  */

// /**
//  * Used to find all products for a particular vendor
//  */
// EntreeTC.addResolver({
//     name: "findManyByVendor",
//     type: [ProductTC],
//     args: { _id: "ID!" },
//     resolve: async ({ source, args, context, info }) => {
//         return await Product.find({ vendor: args._id });
//     },
// });

// const noProductError = async (resolve, source, args, context, info) => {
//     const res = await resolve(source, args, context, info);
//     if (res === null) {
//         throw new ApolloError("Bogus product ID!", "NO_PRODUCT");
//     }
//     return res;
// };

// const ProductQuery = {
//     productOne: ProductTC.getResolver("findOne").withMiddlewares([
//         noProductError,
//     ]),
//     productMany: ProductTC.getResolver("findMany"),
//     entreeMany: EntreeTC.getResolver("findMany"),
// };

// const ProductMutation = {
//     productCreateOne: ProductTC.getResolver("createOne"),
// };

// export { ProductQuery, ProductMutation };
