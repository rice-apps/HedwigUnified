import { SquareProductTC } from "../models";
import { getProducts, getProduct } from "../utils/squareUtils";

const SquareProductQuery = {
    squareProduct: {
        type: SquareProductTC,
        args: { id: "String!" },
        resolve: async (_, args) => {
            let product = await getProduct(args.id);
            return product;
        },
    },
    squareProductMany: {
        type: SquareProductTC, // need to change to listcatalog output
        args: {},
        resolve: async (_, args) => {
            let products = await getProducts();
            return products;
        },
    },
};

const SquareProductMutation = {};

export { SquareProductQuery, SquareProductMutation };
