import { sc } from "graphql-compose";

const VariantOptionTC = sc.createObjectTC({
    name: "VariantOption",
    description: "",
    fields: {
        name: "String!",
        price: "Int",
    },
});

const VariantTC = sc.createObjectTC({
    name: "Variant",
    description: "",
    fields: {
        name: "String!",
        description: "String",
        displayQuestion: "String!",
        options: () => VariantOptionTC,
    },
});

export { VariantOptionTC, VariantTC };
