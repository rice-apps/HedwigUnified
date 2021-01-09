import firebaseAdmin from './firebase'
import log from 'loglevel'
import { AuthenticationError } from 'apollo-server-express'

/**
 * Decodes an ID token and returns the SAML attributes of said user
 *
 * @param {string} token the Firebase ID token to get user attributes from
 */
async function decodeFirebaseToken (token) {
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
const authenticateTicket = async token => {
  try {
    const decodedToken = await firebaseAdmin.auth().verifyIdToken(token)
    const fullName =
      decodedToken.firebase.sign_in_attributes['urn:oid:2.5.4.42'] +
      decodedToken.firebase.sign_in_attributes['urn:oid:2.5.4.4']
    const netid =
      decodedToken.firebase.sign_in_attributes[
        'urn:oid:0.9.2342.19200300.100.1.1'
      ]
    const idNumber =
      decodedToken.firebase.sign_in_attributes[
        'urn:oid:1.3.6.1.4.1.134.1.1.1.1.19'
      ]
    const role =
      decodedToken.firebase.sign_in_attributes[
        'urn:oid:1.3.6.1.4.1.5923.1.1.1.5'
      ]
    return {
      fullName,
      netid,
      idNumber,
      role,
      token: token,
      success: true
    }
  } catch (error) {
    log.error('Firebase ID verification failed because ' + error)
    return {
      success: false
    }
  }
}

/**
 * Middleware that hecks if the user is logged in (if netID is present in the context) and throws and error otherwise
 *
 * @param {(source: TSource, args: TArgs, context: TContext, info: GraphQLResolveInfo) => any} resolve the next resolver in the chain
 * @param {TSource} source the previous object or field from which the call originated
 * @param {TArgs} args the arguments to the resolver
 * @param {TContext} context the global context (contains stuff like auth)
 * @param {import('graphql').GraphQLResolveInfo} info holds field-specific information relevant to the current query as well as the schema details
 *
 * @return {any | AuthenticationError} returns the result of the next resolver in the sequence or an auth error
 */
function checkLoggedIn (resolve, source, args, context, info) {
  if (context.idNumber) {
    return resolve(source, args, context, info)
  }

  return new AuthenticationError('Not logged in')
}

export { decodeFirebaseToken, checkLoggedIn, authenticateTicket }
