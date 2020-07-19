import { composeWithMongoose } from "graphql-compose-mongoose";

import { schemaComposer } from "graphql-compose";

const mongoose = require("mongoose");

const { Schema } = mongoose;

require("../db");

const OptionTC = schemaComposer.createObjectTC({
    name: "Option",
    description: "",
    fields: {
        name: "String!",
        price: "Int",
    },
});

export const ModifierTC = schemaComposer.createObjectTC({
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
// export const Location = mongoose.model("Modifiers", ModifierSchema);
// export const LocationTC = composeWithMongoose(Location);
