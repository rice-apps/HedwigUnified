// This will be created when the user logs in
import axios from 'axios'

import jwt from 'jsonwebtoken'
import { Parser, processors } from 'xml2js'
import { SECRET, SERVICE_URL } from '../config'
import { User } from '../models'
import { firebaseApp } from '../firebase'

/**
 * Parser used for XML response by CAS
 */
const parser = new Parser({
  tagNameProcessors: [processors.stripPrefix],
  explicitArray: false
})

/**
 * Default failure response when authentication / verification doesn't work.
 */
const failureResponse = { success: false }

const config = {
  CASValidateURL: 'https://idp.rice.edu/idp/profile/cas/serviceValidate'
}

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
    const { id, netid, iat, exp } = await jwt.verify(token, SECRET)

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
        return {
          name,
          success: true,
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
