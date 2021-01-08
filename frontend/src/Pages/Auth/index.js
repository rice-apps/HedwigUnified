import { useEffect } from 'react'
import { useMutation } from '@apollo/client'

import gql from 'graphql-tag.macro'

import { Navigate } from 'react-router-dom'

const AUTHENTICATE_USER = gql`
  mutation AuthenticateMutation($idToken: String!) {
    authenticateUser(idToken: $idToken) {
      _id
      token
      netid
      recentUpdate
      vendor
      phone
      name
      isAdmin
      studentId
      type
    }
  }
`

// const allowedUsers = ['byz2']
const lstorage = localStorage

function Auth () {
  const idToken = lstorage.getItem('idToken')

  // Run query against backend to authenticate user
  const [
    authenticateUser,
    { data: authenticationData, loading, error }
  ] = useMutation(AUTHENTICATE_USER, { variables: { idToken: idToken } })

  useEffect(() => {
    // We only want this mutation to run once; if we hit any errors we redirect to login
    authenticateUser().catch(err => <p>{err.message}</p>)
  }, [authenticateUser])

  // if (error) return <Navigate to='/login' />
  if (error) return <p>{error.message}</p>
  if (loading) return <p>Loading...</p>
  if (!authenticationData) return <p>Bad.</p>

  const {
    _id,
    name,
    netid,
    phone,
    studentId,
    isAdmin,
    vendor,
    recentUpdate,
    type,
    token
  } = authenticationData.authenticateUser

  const userData = {
    netid,
    name,
    phone,
    studentId,
    _id,
    isAdmin,
    vendor,
    recentUpdate,
    type,
    token
  }
  console.log('DATA', userData)

  // Set token and user data in local storage
  lstorage.setItem('token', token)
  lstorage.setItem('userProfile', JSON.stringify(userData))

  // Set recent update in client state -- currently broken with wrong navigation
  // if (!employer || employer === 0) {
  //   return <Navigate to='/vendor' />
  // }

  // login page should appear after IDP sign in
  // we check if user is employee, if they are, we get to show the vendor/client button page
  // and they can select to view a page as employee or client and redirect them properly
  // if the vendor chooses client, they can't access /employee. they can only access the
  // normal catalog and menu via /eat.  We're going to also set some kinda of local storage
  // data that informs Hedwig that this employee is acting like a client.
  // we can't send a mutation and change backend b/c that'll permanently make the vendor
  // a client

  // else, if employee is a buyer, then we redirect them automatically to /eat and restrict
  // their access to /employee

  if (userProfile.vendor) {
    return <Navigate to='/vendor_choice' />
  }
  // Set recent update in client state.  if it gets to this point it's only clients
  if (/^[0-9]{10}$/.test(phone)) {
    return <Navigate to='/eat' />
  }
  return <Navigate to='/contact' />
}

export default Auth
