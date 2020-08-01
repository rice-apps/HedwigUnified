import {
    GraphQLBoolean,
    GraphQLID,
    GraphQLInt,
    GraphQLList,
    GraphQLNonNull,
    GraphQLString,
} from "graphql";
import { sc } from "graphql-compose";

import { SquareMoneyTC } from "./Common";

const SquareModifierListSelectionTypeTC = sc.createEnumTC({
    name: "SquareModifierListSelectionType",
    description:
        "Indicates whether multiple options from the modifier list can be applied to a single CatalogItem",
    values: {
        SINGLE: { value: 0 },
        MULTIPLE: { value: 1 },
    },
});

const SquareModifierTC = sc.createObjectTC({
    name: "SquareModifier",
    description: "Square's base item modifiers",
    fields: {
        id: GraphQLNonNull(GraphQLID),
        name: GraphQLNonNull(GraphQLString),
        price: () => SquareMoneyTC,
    },
});

const SquareModifierOverrideTC = sc.createObjectTC({
    name: "SquareModifierOverride",
    description:
        "A set of CatalogModifierOverride objects that override whether a given CatalogModifier is enabled by default.",
    fields: {
        modifierId: GraphQLNonNull(GraphQLID),
        onByDefault: GraphQLNonNull(GraphQLBoolean),
    },
});

const SquareModifierListTC = sc.createObjectTC({
    name: "SquareModifierList",
    description: "Square's list of modifiers",
    fields: {
        id: GraphQLNonNull(GraphQLID),
        name: GraphQLNonNull(GraphQLString),
        selectionType: () => SquareModifierListSelectionTypeTC,
        modifiers: GraphQLNonNull(GraphQLList(SquareModifierTC.getType())),
    },
});

const SquareModifierListInfoTC = sc.createObjectTC({
    name: "SquareModifierListInfo",
    description: "Square's CatalogItemModifierListInfo",
    fields: {
        modifierListId: GraphQLNonNull(GraphQLID),
        modifierOverrides: GraphQLNonNull(
            GraphQLList(SquareModifierOverrideTC.getType()),
        ),
        minSelectedModifiers: GraphQLNonNull(GraphQLInt),
        maxSelectedModifiers: GraphQLNonNull(GraphQLInt),
        enabled: GraphQLNonNull(GraphQLBoolean),
    },
});

export { SquareModifierTC, SquareModifierListTC, SquareModifierListInfoTC };
