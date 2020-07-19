let mongoose = require("mongoose"),
    ; var {Schema} = mongoose

import { composeWithMongoose } from "graphql-compose-mongoose";

import { schemaComposer } from "graphql-compose";

require("../db");

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
// export const Location = mongoose.model("Variants", VariantSchema);
// export const LocationTC = composeWithMongoose(Location);
