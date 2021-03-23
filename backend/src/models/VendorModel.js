import {
  composeMongoose,
  convertSchemaToGraphQL
} from 'graphql-compose-mongoose'

import { sc } from 'graphql-compose'

import '../utils/db.js'

import mongoose from 'mongoose'

const SquareInfo = new mongoose.Schema({
  merchantId: { type: String, required: true },
  refreshToken: { type: String, required: false },
  accessToken: { type: String, required: true },
  locationIds: { type: [String], required: true },
  loyaltyId: { type: String }
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

const defaultHours = [
  {
    start: ['12:00 a.m.'],
    end: ['11:59 p.m.'],
    day: 'Sunday',
    isClosed: false
  },
  {
    start: ['12:00 a.m.'],
    end: ['11:59 p.m.'],
    day: 'Monday',
    isClosed: false
  },
  {
    start: ['3:00 a.m.', '10:00 a.m.'],
    end: ['9:00 a.m.', '11:00 p.m.'],
    day: 'Tuesday',
    isClosed: false
  },
  {
    start: ['1:00 a.m.', '1:00 p.m.'],
    end: ['11:00 a.m.', '11:00 p.m.'],
    day: 'Wednesday',
    isClosed: false
  },
  {
    start: ['12:00 a.m.'],
    end: ['11:59 p.m.'],
    day: 'Thursday',
    isClosed: false
  },
  {
    start: ['12:00 a.m.'],
    end: ['11:59 p.m.'],
    day: 'Friday',
    isClosed: false
  },
  {
    start: ['12:00 a.m.'],
    end: ['11:59 p.m.'],
    day: 'Saturday',
    isClosed: false
  }
]

const VendorSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  slug: { type: String, min: 3, max: 5, unique: true, required: true }, // short 3-5 letter slug that identifies this vendor
  phone: String,
  dataSource: { type: String, required: true },
  email: { type: String, required: false },
  logoUrl: String,
  squareInfo: SquareInfo,
  hours: { type: [BusinessHours], required: false, default: defaultHours },
  isOpen: { type: Boolean, required: false },
  allowedNetid: { type: [String], required: false }, // change this to required true later on
  pickupInstruction: { type: String, required: false },
  orderOpeningTime: { type: String, required: false },
  cutoffTime: { type: Number, required: false },
  asapTime: { type: Number, required: false },
  website: { type: String, required: false },
  facebook: { type: String, required: false },
  availableItems: { type: [String], required: false },
  availableModifiers: { type: [String], required: false }
})

const Vendor = mongoose.model('Vendors', VendorSchema)
const VendorTC = composeMongoose(Vendor)

export { Vendor, VendorTC }
