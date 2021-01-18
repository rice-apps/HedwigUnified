// This will be created when the user logs in

import jwt from 'jsonwebtoken'
import { SECRET } from '../config.js'
import { User } from '../models/index.js'
import { firebaseApp } from '../utils/firebase.js'

/**
 * Default failure response when authentication / verification doesn't work.
 */
const failureResponse = { success: false }

/**
 * Given a user, creates a new token for them.
 */
export const createToken = user => {
  const token = jwt.sign(
    {
      id: user._id,
      netid: user.netid
    },
    SECRET,
    { expiresIn: 129600 }
  )
  return token
}

/**
 * Given a token, finds the associated user.
 */
export const getUserFromToken = async token => {
  const user = await User.find({ token })
  return user
}

/**
 * Given a token, verifies that it is still valid.
 */
export const verifyToken = async token => {
  try {
    // In the future, we may need the other properties...
    const { id } = await jwt.verify(token, SECRET)

    return { success: true, id }
  } catch (e) {
    return failureResponse
  }
}

/**
 * Given a ticket, authenticates it and returns the corresponding netid of the now-authenticated user.
 */
export const authenticateTicket = async idToken => {
  try {
    // validate the idToken via firebase, extract netid and user's name
    // The user's name is needed if they're new to Hedwig
    return firebaseApp
      .auth()
      .verifyIdToken(idToken)
      .then(decodedToken => {
        const name =
          decodedToken.firebase.sign_in_attributes['urn:oid:2.5.4.42'] +
          ' ' +
          decodedToken.firebase.sign_in_attributes['urn:oid:2.5.4.4']
        const id =
          decodedToken.firebase.sign_in_attributes[
            'urn:oid:1.3.6.1.4.1.134.1.1.1.1.19'
          ]
        return {
          name,
          success: true,
          studentId: id,
          netid:
            decodedToken.firebase.sign_in_attributes[
              'urn:oid:0.9.2342.19200300.100.1.1'
            ]
        }
      })
      .catch(error => {
        console.log('cannot verify token')
        console.log(error)
        return failureResponse
      })
  } catch (e) {
    console.log(e)
    console.log('Something went wrong.')
    return failureResponse
  }
}