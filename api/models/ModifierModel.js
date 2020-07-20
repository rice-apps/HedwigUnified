import { schemaComposer } from "graphql-compose";

const OptionTC = schemaComposer.createObjectTC({
    name: "Option",
    description: "",
    fields: {
        name: "String!",
        price: "Int",
    },
});

const ModifierTC = schemaComposer.createObjectTC({
    name: "Product",
    description: "",
    fields: {
        name: "String!",
        description: "String",
        displayQuestion: "String!",
        multiSelect: "Boolean!",
        options: () => OptionTC,
    },
});

export { ModifierTC };
