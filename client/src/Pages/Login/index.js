import React, { useState } from 'react'
import { useQuery, gql } from '@apollo/client'

import logo from './logo.svg'
import { SERVICE_URL } from '../../config'
import { MainDiv, Logo, Title, SubTitle, LoginButton } from './Login.styles'
// import './Transitions.css';
import { userProfile } from '../../apollo'
import { useNavigate } from 'react-router-dom'

// This import loads the firebase namespace along with all its type information.
import * as firebase from 'firebase/app'

// These imports load individual services into the firebase namespace.
import 'firebase/auth'

const casLoginURL = 'https://idp.rice.edu/idp/profile/cas/login'

const sStorage = window.sessionStorage

function Login () {
  const navigate = useNavigate()

  // const provider = new firebase.auth.SAMLAuthProvider("saml.jumpcloud-demo");
  const provider = new firebase.auth.SAMLAuthProvider('saml.rice-shibboleth')
  // Fetch service from cache since it depends on where this app is deployed
  // const { data } = useQuery(GET_SERVICE_LOCAL);

  const casLoginURL = 'https://idp.rice.edu/idp/profile/cas/login'

  // Handles click of login button
  const login = () => {
    // Redirects user to the CAS login page
    const redirectURL = casLoginURL + '?service=' + SERVICE_URL
    window.open(redirectURL, '_self')
  }

  const signInSAML = () => {
    firebase
      .auth()
      .signInWithRedirect(provider)
      .then(result => {
        console.log(result)
        console.log(result.user)
        console.log(result.additionalUserInfo)
      })
      .catch(error => console.log(error))
  }

  firebase
    .auth()
    .getRedirectResult()
    .then(result => {
      if (result.user) {
        console.log(result.additionalUserInfo)
        console.log(result.user)
        // redirect to auth page carrying state from IDP
        sStorage.setItem(
          'last name',
          result.additionalUserInfo.profile['urn:oid:2.5.4.4']
        )
        sStorage.setItem(
          'first name',
          result.additionalUserInfo.profile['urn:oid:2.5.4.42']
        )
        login()
      }
    })
    .catch(error => {
      console.log(error)
    })

  return (
    <MainDiv>
      <Logo src={logo} />
      <Title>HEDWIG</Title>
      <SubTitle>brought to you by riceapps</SubTitle>
      <LoginButton onClick={signInSAML}>Login with NetID</LoginButton>
    </MainDiv>
  )
}

export default Login
