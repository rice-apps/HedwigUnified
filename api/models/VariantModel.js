import { schemaComposer } from "graphql-compose";

const OptionTC = schemaComposer.createObjectTC({
    name: "Option",
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
        options: () => OptionTC,
    },
});

export { OptionTC, VariantTC };
