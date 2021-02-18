import { composeMongoose } from 'graphql-compose-mongoose'

import '../../utils/db.js'

import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema({
  name: String,
  netid: { type: String, required: true, unique: true }, // This will be our unique identifier across systems
  token: { type: String, default: '' }, // We will use this to store the user's JWT token
  recentUpdate: { type: Boolean, default: false }, // this field used for displaying banners/modals on version updates of our app
  phone: String,
  studentId: String,
  type: {
    type: String,
    enum: ['Undergraduate', 'Graduate', 'Faculty', 'Staff'],
    default: 'Undergraduate'
  },
  isAdmin: { type: Boolean, default: false },
  vendor: { type: String, required: false }
})

const User = mongoose.model('Users', UserSchema)
const UserTC = composeMongoose(User)

export { User, UserTC }
