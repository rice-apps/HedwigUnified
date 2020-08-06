import { composeWithMongoose } from "graphql-compose-mongoose";

import "../utils/db";

const mongoose = require("mongoose");

const { Schema } = mongoose;

const SquareInfo = new Schema({
    merchantId: { type: String, required: true, unique: true },
    locationId: { type: String, required: true },
    loyaltyId: { type: String, unique: true },
});

const VendorSchema = new Schema({
    name: { type: String, required: true, unique: true },
    slug: { type: String, min: 3, max: 5, unique: true, required: true }, // short 3-5 letter slug that identifies this vendor
    phone: String,
    logoUrl: String,
    squareInfo: SquareInfo,
});

export const Vendor = mongoose.model("Vendors", VendorSchema);
export const VendorTC = composeWithMongoose(Vendor);
