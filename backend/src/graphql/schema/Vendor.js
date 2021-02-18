import {
  composeMongoose,
  convertSchemaToGraphQL
} from 'graphql-compose-mongoose'

import { sc } from 'graphql-compose'

import '../../utils/db.js'

import mongoose from 'mongoose'

const SquareInfo = new mongoose.Schema({
  merchantId: { type: String, required: true },
  refreshToken: { type: String, required: false },
  accessToken: { type: String, required: true },
  locationIds: { type: [String], required: true },
  loyaltyId: { type: String, unique: true }
})

const BusinessHours = new mongoose.Schema({
  start: { type: [String], required: true },
  end: { type: [String], required: true },
  day: {
    type: String,
    enum: [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday'
    ],
    required: true
  },
  isClosed: { type: Boolean, required: true }
})

convertSchemaToGraphQL(SquareInfo, 'VendorSquareInfo', sc)
convertSchemaToGraphQL(BusinessHours, 'VendorBusinessHours', sc)

const VendorSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  slug: { type: String, min: 3, max: 5, unique: true, required: true }, // short 3-5 letter slug that identifies this vendor
  phone: String,
  email: { type: String, required: false },
  logoUrl: String,
  squareInfo: SquareInfo,
  hours: { type: [BusinessHours], required: true },
  isOpen: { type: Boolean, required: false },
  allowedNetid: { type: [String], required: false }, // change this to required true later on
  pickupInstruction: { type: String, required: false },
  cutoffTime: { type: Number, required: false },
  website: { type: String, required: false },
  facebook: { type: String, required: false }
})

const Vendor = mongoose.model('Vendors', VendorSchema)
const VendorTC = composeMongoose(Vendor)

export { Vendor, VendorTC }
