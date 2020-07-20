import { schemaComposer } from "graphql-compose";

const VariantOptionTC = schemaComposer.createObjectTC({
    name: "VariantOption",
    description: "",
    fields: {
        name: "String!",
        price: "Int",
    },
});

const VariantTC = schemaComposer.createObjectTC({
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
