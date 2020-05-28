var mongoose = require('mongoose')
    , Schema = mongoose.Schema

import { composeWithMongoose } from 'graphql-compose-mongoose';

require('../db');

var LocationSchema = new Schema({
    name: String,
});

export const Location = mongoose.model("Locations", LocationSchema);
export const LocationTC = composeWithMongoose(Location);