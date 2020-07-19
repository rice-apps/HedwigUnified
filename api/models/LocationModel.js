import { composeWithMongoose } from "graphql-compose-mongoose";

const mongoose = require("mongoose");

const { Schema } = mongoose;

require("../db");

const LocationSchema = new Schema({
    name: String,
});

export const Location = mongoose.model("Locations", LocationSchema);
export const LocationTC = composeWithMongoose(Location);
