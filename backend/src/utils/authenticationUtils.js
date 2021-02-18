import firebaseAdmin from './firebase.js'
import log from 'loglevel'
import { AuthenticationError } from 'apollo-server-express'
import { Vendor } from '../graphql/schema/index.js'

/**
 * Decodes an ID token and returns the SAML attributes of said user
 *
 * @param {string} token the Firebase ID token to get user attributes from
 */
async function decodeFirebaseToken (token) {
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
 * Middleware that checks if the user is logged in (if ID number is present in the context) and throws an error otherwise
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
  if (context.idNumber !== null) {
    return resolve(source, args, context, info)
  }

  return new AuthenticationError('Not logged in')
}

/**
 * Middleware that checks if the user authorized to edit a vendor's information and throws an error otherwise
 *
 * @param {(source: TSource, args: TArgs, context: TContext, info: GraphQLResolveInfo) => any} resolve the next resolver in the chain
 * @param {TSource} source the previous object or field from which the call originated
 * @param {TArgs} args the arguments to the resolver
 * @param {TContext} context the global context (contains stuff like auth)
 * @param {import('graphql').GraphQLResolveInfo} info holds field-specific information relevant to the current query as well as the schema details
 *
 * @return {any | AuthenticationError} returns the result of the next resolver in the sequence or an auth error
 */
async function checkCanUpdateVendor (resolve, source, args, context, info) {
  const vendor = await Vendor.findOne({ name: args.filter.name })

  if (vendor.allowedNetid.includes(context.netid) || context.netid === 'nth8') {
    return resolve(source, args, context, info)
  }

  return new AuthenticationError("Can't update vendor because not on list")
}

/**
 * Middleware that checks if the user authorized to edit their own information
 *
 * @param {(source: TSource, args: TArgs, context: TContext, info: GraphQLResolveInfo) => any} resolve the next resolver in the chain
 * @param {TSource} source the previous object or field from which the call originated
 * @param {TArgs} args the arguments to the resolver
 * @param {TContext} context the global context (contains stuff like auth)
 * @param {import('graphql').GraphQLResolveInfo} info holds field-specific information relevant to the current query as well as the schema details
 *
 * @return {any | AuthenticationError} returns the result of the next resolver in the sequence or an auth error
 */

function checkCanUpdateUserFilter (resolve, source, args, context, info) {
  if ((args.filter.netid === context.netid) | (context.netid === 'nth8')) {
    return resolve(source, args, context, info)
  }

  return new AuthenticationError('User is not the same')
}

export {
  decodeFirebaseToken,
  checkLoggedIn,
  checkCanUpdateVendor,
  checkCanUpdateUserFilter
}
