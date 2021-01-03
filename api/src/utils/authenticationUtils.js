// This will be created when the user logs in
import axios from 'axios'

import jwt from 'jsonwebtoken'
import { Parser, processors } from 'xml2js'
import { SECRET, SERVICE_URL } from '../config'
import { User } from '../models'
import {firebaseApp} from '../firebase'

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
    // // validate our ticket against the CAS server
    // const url = `${config.CASValidateURL}?ticket=${ticket}&service=${SERVICE_URL}`

    // // First validate ticket against CAS, get a data object back
    // const { data } = await axios.get(url)

    // // Parse returned XML data with xml2js parser
    // return parser.parseStringPromise(data).then(
    //   parsedResponse => {
    //     const { serviceResponse } = parsedResponse
    //     // This object contains the information as to whether this login was successful
    //     const authSucceded = serviceResponse.authenticationSuccess
    //     if (authSucceded) {
    //       // authSucceded.user is the netid
    //       const netid = authSucceded.user
    //       return { success: true, netid }
    //     }
    //     return failureResponse
    //   },
    //   err => {
    //     console.log('Error!')
    //     return failureResponse
    //   }
    // )
    // idToken = JSON.parse(idToken)
    // firebaseApp.getExplicitProjectId().then(id => console.log(id))
    return firebaseApp
      .auth()
      .verifyIdToken(idToken)
      .then((decodedToken) => {
        const uid = decodedToken.uid;
        console.log(decodedToken);
        return {success: true, netid: decodedToken.firebase.sign_in_attributes['urn:oid:0.9.2342.19200300.100.1.1']}
    }).catch((error) => {
        console.log("cannot verify token")
        console.log(error)
        return failureResponse
    });
  } catch (e) {
    console.log(e)
    console.log('Something went wrong.')
    return failureResponse
  }
}
