import { useState } from 'react'
import { useQuery, gql } from '@apollo/client'

import logo from './HedwigLogoFinal_02.svg'
import { SERVICE_URL } from '../../config'
import { MainDiv, ElemDiv, Logo, Title, LoginButton } from './Login.styles'
<<<<<<< HEAD
=======

>>>>>>> 9580908c5ea5b32dfe81a52032d6261a6ac76322
// import './Transitions.css';
import { userProfile } from '../../apollo'
import { useNavigate } from 'react-router-dom'

// This import loads the firebase namespace along with all its type information.
import firebase from 'firebase/app'

// These imports load individual services into the firebase namespace.
import 'firebase/auth'

const casLoginURL = 'https://idp.rice.edu/idp/profile/cas/login'

const sStorage = window.localStorage

function Login () {
  const navigate = useNavigate()

  // const provider = new firebase.auth.SAMLAuthProvider("saml.jumpcloud-demo");
  const provider = new firebase.auth.SAMLAuthProvider('saml.rice-shibboleth')
<<<<<<< HEAD
  // Fetch service from cache since it depends on where this app is deployed
  // const { data } = useQuery(GET_SERVICE_LOCAL);

  const casLoginURL = 'https://idp.rice.edu/idp/profile/cas/login'

  // Handles click of login button
  const login = () => {
    // Redirects user to the CAS login page
    const redirectURL = casLoginURL + '?service=' + SERVICE_URL
    window.open(redirectURL, '_self')
  }

  const navigate = useNavigate()
=======
>>>>>>> 9580908c5ea5b32dfe81a52032d6261a6ac76322
  /* Lets user sign in in a pop-up tab, get the user's info then generates a token. */
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
        const profile = result.additionalUserInfo.profile
        // redirect to auth page carrying state from IDP
        sStorage.setItem('last name', profile['urn:oid:2.5.4.4'])
        sStorage.setItem('first name', profile['urn:oid:2.5.4.42'])
        sStorage.setItem('email', profile['urn:oid:0.9.2342.19200300.100.1.3'])
        sStorage.setItem('id', profile['urn:oid:1.3.6.1.4.1.134.1.1.1.1.19'])
        login()
      }
    })
    .catch(error => {
      console.log(error)
    })

  return (
    <MainDiv>
      <ElemDiv>
        <Logo src={logo} />
        <Title>hedwig</Title>
        <LoginButton onClick={signInSAML}>Login with NetID</LoginButton>
      </ElemDiv>
    </MainDiv>
  )
}

export default Login
