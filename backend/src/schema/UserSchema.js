import { User, UserTC } from '../models/index.js'
import {
  authenticateTicket,
  verifyToken,
  createToken
} from '../utils/authenticationUtils.js'

UserTC.addResolver({
  name: 'authenticate',
  type: UserTC,
  args: { idToken: 'String!' },
  resolve: async ({ args }) => {
    const authenticationResponse = await authenticateTicket(args.idToken)
    if (authenticationResponse.success) {
      let user // this will be used as the return object

      // Get the netid of the authenticated user
      const { netid, name, studentId } = authenticationResponse
      console.log(studentId)
      // Check if user exists based on netid
      const exists = await User.exists({ netid })
      if (!exists) {
        // Create user
        user = await User.create({ netid, name, studentId })
      } else {
        user = await User.findOne({ netid })
      }

      // Get a new token for the user
      const token = createToken(user)

      // Update the user's token and get their updated information
      return await User.findByIdAndUpdate(
        user._id,
        { token, studentId },
        { new: true }
      )
    }
    console.log('Bad auth!')
    throw Error('Bad authentication.')
  }
})

UserTC.addResolver({
  name: 'verify',
  type: UserTC,
  args: { token: UserTC.getFieldTC('token') },
  resolve: async ({ args }) => {
    const verificationResponse = await verifyToken(args.token)
    if (verificationResponse.success) {
      const { id } = verificationResponse
      // Return logged in user's info
      return await User.findById(id)
    }
    console.log('Bad verify!')
    throw Error('Bad Verification.')
  }
})

// Using auth middleware for sensitive info: https://github.com/graphql-compose/graphql-compose-mongoose/issues/158
const UserQueries = {
  userOne: UserTC.mongooseResolvers.findOne(),
  verifyUser: UserTC.getResolver('verify')
}

const UserMutations = {
  userCreateOne: UserTC.mongooseResolvers.createOne(),
  userUpdateOne: UserTC.mongooseResolvers.updateOne(),
  authenticateUser: UserTC.getResolver('authenticate')
}

export { UserQueries, UserMutations }
