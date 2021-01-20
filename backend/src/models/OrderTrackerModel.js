import { composeMongoose } from 'graphql-compose-mongoose'
import { Schema, model } from 'mongoose'

const OrderTrackerSchema = new Schema({
  merchantId: { type: String, required: false },
  locationId: { type: String, required: false },
  orderId: { type: String, required: false },
  paymentId: { type: String, required: false },
  paymentType: {
    type: String,
    required: false,
    enum: ['COHEN', 'TETRA', 'CREDIT']
  },
  pickupTime: { type: Date, required: false },
  submissionTime: {type: Date, required: false},
  status: {
    type: String,
    required: true,
    enum: ['PROPOSED', 'RESERVED', 'PREPARED', 'COMPLETED', 'CANCELED']
  },
  customer: {
    type: Schema.Types.ObjectId,
    ref: 'Users',
    required: false
  },
  shopifyOrderId: { type: String, required: false },
  dataSource: {
    type: String,
    required: false,
    enum: ['SQUARE', 'SHOPIFY', 'EXCEL']
  }
})

const OrderTracker = model('OrderTracker', OrderTrackerSchema)
const OrderTrackerTC = composeMongoose(OrderTracker)

export { OrderTracker, OrderTrackerTC }
