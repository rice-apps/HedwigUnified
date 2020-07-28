import { sc } from "graphql-compose";

import { SquareMoneyTC } from "./Common";
import {
    SquareModifierTC,
    SquareModifierListTC,
    SquareModifierListInfoTC,
} from "./ModifiersModel";

const SquareCatalogObjectTC = sc.createObjectTC({
    name: "CatalogObject",
    description: "Catalog Object wrapper defined by Square",
    fields: {
        type: GraphQLNonNull(GraphQLString),
        id: GraphQLNonNull(GraphQLString),
        // NonNull if type matches; null otherwise
        itemData: () => SquareCatalogItemTC,
        itemVariationData: () => SquareCatalogItemVariationTC,
        modifierListData: () => SquareModifierListTC,
        modifierData: () => SquareModifierTC,
    },
});

const SquareCatalogItemVariationTC = sc.createObjectTC({
    name: "CatalogItemVariation",
    description: "Catalog item for Square",
    fields: {
        itemID: GraphQLNonNull(GraphQLString),
        name: GraphQLNonNull(GraphQLString),
        price_money: GraphQLNonNull(SquareMoneyTC.getType()),
    },
});

const SquareCatalogItemTC = sc
    .createObjectTC({
        name: "SquareProduct",
        description: "Products with Square as a data source",
        fields: {
            itemID: GraphQLNonNull(GraphQLString),
            modifierListInfo: GraphQLNonNull(
                GraphQLList(SquareModifierListInfoTC.getType()),
            ),
            variations: GraphQLNonNull(
                GraphQLList(SquareCatalogItemVariationTC.getType()),
            ),
        },
    })
    .addInterfaces([ProductInterface]);

export {
    SquareCatalogItemTC,
    SquareCatalogItemVariationTC,
    SquareCatalogObjectTC,
};
