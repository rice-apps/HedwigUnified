var mongoose = require('mongoose')
    , Schema = mongoose.Schema

import { composeWithMongooseDiscriminators } from 'graphql-compose-mongoose';

import { Vendor, VendorTC } from './VendorModel';

require('../db');

// Uses mongoose discriminator: https://github.com/graphql-compose/graphql-compose-mongoose/blob/master/README.md#working-with-mongoose-collection-level-discriminators

const DKey = "type";

const enumProductType = {
    ENTREE: "Entree",
    ADDON: "Addon"
}

var ProductSchema = new Schema({
    name: String,
    description: String,
    vendor: { type: Schema.Types.ObjectId, ref: Vendor },
    price: Number,
    type: { type: String, required: true, enum: Object.keys(enumProductType) },
    category: String
});

ProductSchema.set("discriminatorKey", DKey);

export const Product = mongoose.model("Products", ProductSchema);

var EntreeSchema = new Schema({
    random: String
});
var AddonSchema = new Schema({
    products: { type: Schema.Types.ObjectId, ref: Product }
});

var Entree = Product.discriminator("Entree", EntreeSchema);
var Addon = Product.discriminator("Addon", AddonSchema);

export const ProductTC = composeWithMongooseDiscriminators(Product);
export const EntreeTC = ProductTC.discriminator(Entree);
export const AddonTC = ProductTC.discriminator(Addon);
