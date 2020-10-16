import React, { Component, useEffect } from 'react'
import { gql, useQuery, useMutation } from '@apollo/client'
import { Redirect } from 'react-router'
import { userProfile } from '../../apollo'
import { Navigate } from 'react-router-dom'

const AUTHENTICATE_USER = gql`
  mutation AuthenticateMutation($ticket: String!) {
    authenticateUser(ticket: $ticket) {
      _id
      netid
      token
      recentUpdate
      phone
      name
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

function Auth () {
  // First parse out ticket from URL href
  let ticket = parseTicket(window.location.href)
  // Run query against backend to authenticate user
  const [
    authenticateUser,
    { data: authenticationData, loading, error }
  ] = useMutation(AUTHENTICATE_USER, { variables: { ticket: ticket } })

  useEffect(() => {
    // We only want this mutation to run once; if we hit any errors we redirect to login
    authenticateUser().catch(err => <p>{err.message}</p>)
  }, [authenticateUser])

  // if (error) return <Navigate to='/login' />
  if (error) return <p>{error.message}</p>
  if (loading) return <p>Loading...</p>
  if (!authenticationData) return <p>Bad.</p>

  let {
    token,
    employer,
    netid,
    _id,
    phone,
    isAdmin,
    vendor,
    recentUpdate,
    type
  } = authenticationData.authenticateUser
  userProfile({ netid, phone, _id, isAdmin, vendor, recentUpdate, type, token })

  // Set token in local storage
  localStorage.setItem('token', token)

  // Set recent update in client state
  if (!employer || employer === 0) {
    return <Navigate to='/contact' />
  }
  return <Navigate to='/vendor' />
}

export default Auth
