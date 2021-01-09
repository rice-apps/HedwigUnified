import { User, UserTC } from '../models'
import {
  authenticateTicket,
  verifyToken,
  createToken
} from '../utils/authenticationUtils'

/**
 * Relations (necessary for any fields that link to other types in the schema)
 * https://graphql-compose.github.io/docs/plugins/plugin-mongoose.html#how-to-build-nesting-relations
 */

// Creates relation to carts (order schema)
// UserTC.addRelation("carts", {
//     "resolver": () => OrderTC.getResolver('findMany'),
//     prepareArgs: {
//         filter: (source) => ({
//             fulfillment: "Cart",
//             user: source._id
//         })
//     },
//     projection: { carts: 1 }
// });

// UserTC.addRelation("employer", {
//     "resolver": () => VendorTC.getResolver('findOne'),
//     args: { filter: VendorTC.getInputTypeComposer() },
//     prepareArgs: {
//         filter: (source) => ({
//             employer: source._id, // Uses the vendor _id
//         })
//     },
//     projection: { employer: 1 }
// });
/**
 * Custom Resolvers
 */

/**
 * Authentication-related resolvers
 */

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
      console.log(studentId);
      // Check if user exists based on netid
      const exists = await User.exists({ netid })
      if (!exists) {
        // Create user
        user = await User.create({ netid, name, studentId })
      } else {
        user = await User.findOne({ netid })
        console.log(user)
        // if (!user.studentId) {
          
        // }
      }

      // Get a new token for the user
      const token = createToken(user)

      // Update the user's token and get their updated information
      return await User.findByIdAndUpdate(user._id, { token, studentId }, { new: true })
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

async function authMiddleware (resolve, source, args, context, info) {
  // Without header, throw error
  if (!context.decodedJWT) {
    throw new Error('You need to be logged in.')
  }

  // Pull out unique MongoDB User id (not the netid) from decoded JWT
  const { id } = context.decodedJWT

  // Allows a user to only access THEIR user object, while maintaining any other filters/args they might have requested
  return resolve(
    source,
    { ...args, filter: { ...args.filter, _id: id } },
    context,
    info
  )
}

export { UserQueries, UserMutations }
