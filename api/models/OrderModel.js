let mongoose = require("mongoose"),
    ; var {Schema} = mongoose

import { composeWithMongoose } from "graphql-compose-mongoose";

import { User, UserTC } from "./UserModel";
import { Vendor, VendorTC } from "./VendorModel";
import { Product, ProductTC } from "./ProductModel";

require("../db");

export var OrderItemSchema = new Schema({
    product: { type: Schema.Types.ObjectId, ref: Product },
    addons: [{ type: Schema.Types.ObjectId, ref: Product }],
    quantity: Number,
    comments: String, // special requests, etc
});

let OrderSchema = new Schema(
    {
        user: { type: Schema.Types.ObjectId, ref: User },
        vendor: { type: Schema.Types.ObjectId, ref: Vendor, required: true },
        items: [OrderItemSchema],
        discount: { type: Number, min: 1, max: 100 }, // Percentage
        fulfillment: {
            type: String,
            enum: ["Cart", "Placed", "Preparing", "Ready", "Cancelled"],
            default: "Cart",
        },
    },
    { timestamps: true },
);

export const Order = mongoose.model("Orders", OrderSchema);
export const OrderTC = composeWithMongoose(Order);
