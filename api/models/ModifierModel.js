import { sc } from "graphql-compose";
import { Money } from "./index";
import {
    GraphQLBoolean,
    GraphQLString,
    GraphQLInt,
    GraphQLNonNull,
} from "graphql";

const ModifierTC = sc.createObjectTC({
    name: "Modifier",
    description: "",
    fields: {
        name: GraphQLNonNull(GraphQLString),
        price: () => Money, // change to money
    },
});

const ModifierListTC = sc.createObjectTC({
    name: "ModifierList",
    description: "",
    fields: {
        name: GraphQLNonNull(GraphQLString),
        description: GraphQLNonNull(GraphQLString),
        displayQuestion: GraphQLNonNull(GraphQLString),
        selectionType: GraphQLNonNull(GraphQLBoolean),
        modifiers: () => ModifierTC,
        // From CatalogItemModifierListInfo
        minSelected: GraphQLNonNull(GraphQLInt),
        maxSelected: GraphQLNonNull(GraphQLInt),
        enabled: GraphQLNonNull(GraphQLBoolean),
    },
});

export { ModifierListTC, ModifierTC };
