import { composeMongoose } from 'graphql-compose-mongoose'
import mongoose from 'mongoose'

const OrderTrackerSchema = new mongoose.Schema({
  merchantId: { type: String, required: false },
  locationId: { type: String, required: false },
  orderId: { type: String, required: false },
  paymentId: { type: String, required: false },
  paymentType: {
    type: String,
    required: false,
    enum: ['COHEN', 'TETRA', 'CREDIT', 'None']
  },
  pickupTime: { type: Date, required: false },
  submissionTime: { type: Date, required: false },
  status: {
    type: String,
    required: true,
    enum: ['PROPOSED', 'RESERVED', 'PREPARED', 'COMPLETED', 'CANCELED']
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Users',
    required: false
  },
  shopifyOrderId: { type: String, required: false },
  dataSource: {
    type: String,
    required: false,
    enum: ['SQUARE', 'SHOPIFY', 'EXCEL']
  },
  note: 'String',
  roomNumber: 'String',
  vendor: {
    type: String,
    required: false
  }
})

const OrderTracker = mongoose.model('OrderTracker', OrderTrackerSchema)
const OrderTrackerTC = composeMongoose(OrderTracker)

export { OrderTracker, OrderTrackerTC }
