import {
    GraphQLInt,
    GraphQLString,
    GraphQLNonNull,
    GraphQLList,
} from "graphql";
import { sc } from "graphql-compose";

import { VendorTC } from "./VendorModel";
import { ModifierListTC, ModifierTC } from "./ModifierModel";

const DataSourceEnum = sc.createEnumTC({
    name: "DataSourceEnum",
    values: {
        SQUARE: { value: "Square" },
        SHOPIFY: { value: "Shopify" },
        EXCEL: { value: "Excel" },
    },
});

const ProductInterface = sc.createInterfaceTC({
    name: "Product",
    description: "The base type for our products",
    fields: {
        name: GraphQLNonNull(GraphQLString),
        description: GraphQLNonNull(GraphQLString),
        vendor: () => VendorTC,
        dataSource: () => DataSourceEnum,
        category: GraphQLNonNull(GraphQLString),
        tags: GraphQLNonNull(GraphQLList(GraphQLString)),
        image: GraphQLNonNull(GraphQLString),
    },
});

const MoneyTC = sc.createObjectTC({
    name: "Money",
    description: "Square's representation of money",
    fields: {
        amount: GraphQLNonNull(GraphQLInt),
        currency: GraphQLNonNull(GraphQLString),
    },
});

const SquareCatalogObject = sc.createObjectTC({
    name: "CatalogObject",
    description: "Catalog Object wrapper defined by Square",
    fields: {
        type: GraphQLNonNull(GraphQLString),
        id: GraphQLNonNull(GraphQLString),
        // NonNull if type matches; null otherwise
        itemData: () => SquareCatalogItem,
        itemVariationData: () => SquareCatalogItemVariation,
        modifierListData: () => ModifierListTC,
        modifierData: () => ModifierTC,
    },
});

const SquareCatalogItemVariation = sc.createObjectTC({
    name: "CatalogItemVariation",
    description: "Catalog item for Square",
    fields: {
        itemID: GraphQLNonNull(GraphQLString),
        name: GraphQLNonNull(GraphQLString),
        price_money: GraphQLNonNull(MoneyTC.getType()),
    },
});

const SquareCatalogItem = sc
    .createObjectTC({
        name: "SquareProduct",
        description: "Products with Square as a data source",
        fields: {
            itemID: GraphQLNonNull(GraphQLString),
            modifierListInfo: GraphQLNonNull(
                GraphQLList(ModifierListTC.getType()),
            ),
            variations: GraphQLNonNull(
                GraphQLList(SquareCatalogItemVariation.getType()),
            ),
        },
    })
    .addInterfaces([ProductInterface]);

// go victor!! go victor!! and will! and will!
const ShopifyProduct = sc
    .createObjectTC({
        name: "ShopifyProduct",
        description: "Products with Shopify as a data source",
        fields: {
            itemID: "String!",
        },
    })
    .addInterfaces([ProductInterface]);

const ExcelProduct = sc
    .createObjectTC({
        name: "ExcelProduct",
        description: "Products with Excel as a data source",
        fields: {
            daysOffered: "[String]",
        },
    })
    .addInterfaces([ProductInterface]);

ProductInterface.addTypeResolver(
    SquareCatalogItem,
    (value) => value.dataSource === "Square",
)
    .addTypeResolver(ShopifyProduct, (value) => value.dataSource === "Shopify")
    .addTypeResolver(ExcelProduct, (value) => value.dataSource === "Excel");

export {
    DataSourceEnum,
    MoneyTC,
    ProductInterface,
    SquareCatalogItem,
    ShopifyProduct,
    ExcelProduct,
    SquareCatalogObject,
};
