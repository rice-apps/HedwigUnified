import { composeWithMongoose } from 'graphql-compose-mongoose';

var mongoose = require('mongoose')
    , Schema = mongoose.Schema

require('../db')

var UserSchema = new Schema({
    name: String,
    netid: { type: String, required: true, unique: true }, // This will be our unique identifier across systems
    token: { type: String, default: "" }, // We will use this to store the user's JWT token
    recentUpdate: { type: Boolean, default: false }, // this field used for displaying banners/modals on version updates of our app
    phone: String,
    type: { type: String, enum: ['Undergraduate', 'Graduate', 'Faculty', 'Staff'], default: 'Undergraduate' },
    isAdmin: { type: Boolean, default: false }
})

export const User = mongoose.model("Users", UserSchema);
export const UserTC = composeWithMongoose(User);