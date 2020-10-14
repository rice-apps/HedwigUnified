import React, { Component, useEffect } from 'react'
import { gql, useQuery, useMutation } from '@apollo/client'
import { Redirect } from 'react-router'
import { Navigate } from 'react-router-dom'

const AUTHENTICATE_USER = gql`
  mutation AuthenticateMutation($ticket: String!) {
    authenticateUser(ticket: $ticket) {
      _id
      netid
      token
      recentUpdate
      vendor
    }
  }
`
const parseTicket = url => {
  // Ex: http://example.com/auth?ticket=ST-1590205338989-7y7ojqvDfvGIFDLyjahEqIp2F
  // Get the ticket query param
  let ticketParamName = 'ticket='
  // We're searching for the part of the string AFTER ticket=
  let ticketStartIndex = url.indexOf(ticketParamName) + ticketParamName.length
  // Only returns the ticket portion
  return url.substring(ticketStartIndex)
}

const allowedUsers = ["by3z2"];

function Auth () {
  // First parse out ticket from URL href
  let ticket = parseTicket(window.location.href)

  // Run query against backend to authenticate user
  const [
    authenticateUser,
    { data: authenticationData, loading, error }
  ] = useMutation(AUTHENTICATE_USER, { variables: { ticket: ticket } })

  console.log(authenticationData);
  useEffect(() => {
    // We only want this mutation to run once; if we hit any errors we redirect to login
    authenticateUser().catch(err => <Navigate to='/login' />)
  }, [authenticateUser])

  if (error) return <Navigate to='/login' />
  if (loading) return <p>Loading...</p>
  if (!authenticationData) return <p>Bad.</p>

  let { token, employer } = authenticationData.authenticateUser

  // Set token in local storage
  localStorage.setItem('token', token)

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

  const userNetID = authenticationData.authenticateUser.netid;
  const vendor = authenticationData.authenticateUser.vendor;
  if (allowedUsers.includes(userNetID) || vendor){
    return <Navigate to='/vendor_choice' />
  }
  return <Navigate to='/eat' />
}

export default Auth
