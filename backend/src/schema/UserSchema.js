import { User, UserTC } from '../models/index.js'
import {
  authenticateTicket,
  verifyToken,
  decodeFirebaseToken
} from '../utils/authenticationUtils.js'

import { AuthenticationError } from 'apollo-server-express'
import log from 'loglevel'

UserTC.addResolver({
  name: 'authenticate',
  type: UserTC,
  args: { idToken: 'String!' },
  resolve: async ({ args }) => {
    const authRes = await decodeFirebaseToken(args.idToken)

    if (authRes.success) {
      const isNewUser = !(await User.exists({ netid: authRes.netid }))

      return isNewUser
        ? User.create({
            name: authRes.fullName,
            netid: authRes.netid,
            token: authRes.token
          })
        : User.findOne({ netid: authRes.netid }).then(doc => {
            if (doc.token !== authRes.token) {
              doc.token = authRes.token
            }

            return doc.save()
          })
    }

    return new AuthenticationError('User login failed!')
  }
})

UserTC.addResolver({
  name: 'verify',
  type: UserTC,
  args: { idToken: UserTC.getFieldTC('token') },
  resolve: async ({ args }) => {
    const { netid, success } = await decodeFirebaseToken(args.idToken)

    if (success) {
      return User.findOne({ netid: netid })
    }

    return new AuthenticationError('User verification failed!')
  }
})

// Using auth middleware for sensitive info: https://github.com/graphql-compose/graphql-compose-mongoose/issues/158
const UserQueries = {
  verifyUser: UserTC.getResolver('verify')
}

const UserMutations = {
  userUpdateOne: UserTC.mongooseResolvers
    .updateOne()
    .withMiddlewares([checkLoggedIn]),
  authenticateUser: UserTC.getResolver('authenticate')
}

export { UserQueries, UserMutations }
