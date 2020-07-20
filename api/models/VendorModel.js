import mongoose from "mongoose";

import { composeWithMongoose } from "graphql-compose-mongoose";

import { User, UserTC } from "./UserModel";
import { Location, LocationTC } from "./LocationModel";

require("../db");

const OpenIntervalSchema = new mongoose.Schema({
    day: { type: String, enum: ["M", "T", "W", "R", "F", "S", "U"] },
    start: Number,
    end: Number,
});

const VendorSchema = new mongoose.Schema({
    name: String,
    imageURL: String,
    slug: { type: String, min: 3, max: 5, unique: true, required: true }, // short 3 letter slug that identifies this vendor
    phone: String,
    type: { type: String, enum: ["SRB", "Retail", "Servery"] },
    team: [{ type: Schema.Types.ObjectId, ref: User }],
    hours: [OpenIntervalSchema],
    locations: [{ type: Schema.Types.ObjectId, ref: Location }],
});

export const Vendor = mongoose.model("Vendors", VendorSchema);
export const VendorTC = composeWithMongoose(Vendor);
