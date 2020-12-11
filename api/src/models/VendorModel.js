import {
  composeMongoose,
  convertSchemaToGraphQL
} from 'graphql-compose-mongoose'

import { sc } from 'graphql-compose'

import '../utils/db'

import { Schema, model } from 'mongoose'

const SquareInfo = new Schema({
  merchantId: { type: String, required: true },
  locationIds: { type: [String], required: true },
  loyaltyId: { type: String, unique: true }
})

const BusinessHours = new Schema({
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
  isClosed: { type: [Boolean], required: true }
})

convertSchemaToGraphQL(SquareInfo, 'VendorSquareInfo', sc)
convertSchemaToGraphQL(BusinessHours, 'VendorBusinessHours', sc)

const VendorSchema = new Schema({
  name: { type: String, required: true, unique: true },
  slug: { type: String, min: 3, max: 5, unique: true, required: true }, // short 3-5 letter slug that identifies this vendor
  phone: String,
  logoUrl: String,
  squareInfo: SquareInfo,
  hours: { type: [BusinessHours], required: true },
  isOpen: { type: Boolean, required: false }
})

const Vendor = model('Vendors', VendorSchema)
const VendorTC = composeMongoose(Vendor)

export { Vendor, VendorTC }
