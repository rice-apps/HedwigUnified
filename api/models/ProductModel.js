import { schemaComposer } from "graphql-compose";

import { VendorTC } from "./VendorModel";

export const DataSourceEnum = schemaComposer.createEnumTC({
    name: "DataSourceEnum",
    values: {
        SQUARE: { value: "Square" },
        SHOPIFY: { value: "Shopify" },
        EXCEL: { value: "Excel" },
    },
});

const ProductInterface = schemaComposer.createInterfaceTC({
    name: "Product",
    description: "The base type for our products",
    fields: {
        name: "String!",
        description: "String!",
        vendor: () => VendorTC,
        dataSource: () => DataSourceEnum,
        category: "String",
        tags: "[String]",
        image: "String",
    },
});

const SquareProduct = schemaComposer
    .createObjectTC({
        name: "SquareProduct",
        description: "Products with Square as a data source",
        fields: {
            itemID: "String!",
        },
    })
    .addInterfaces([ProductInterface]);

const ShopifyProduct = schemaComposer
    .createObjectTC({
        name: "ShopifyProduct",
        description: "Products with Shopify as a data source",
        fields: {
            itemID: "String!",
        },
    })
    .addInterfaces([ProductInterface]);

const ExcelProduct = schemaComposer
    .createObjectTC({
        name: "ExcelProduct",
        description: "Products with Excel as a data source",
        fields: {
            daysOffered: "[String]",
        },
    })
    .addInterfaces([ProductInterface]);

ProductInterface.addTypeResolver(
    SquareProduct,
    (value) => value.dataSource === "Square",
)
    .addTypeResolver(ShopifyProduct, (value) => value.dataSource === "Shopify")
    .addTypeResolver(ExcelProduct, (value) => value.dataSource === "Excel");

export {
    DataSourceEnum,
    ProductInterface,
    SquareProduct,
    ShopifyProduct,
    ExcelProduct,
};
