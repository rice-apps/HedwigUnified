import { useState } from 'react'
import { useQuery, gql } from '@apollo/client'

import logo from './logo.svg'
import { SERVICE_URL } from '../../config'
import { MainDiv, Logo, Title, SubTitle, LoginButton } from './Login.styles'
// import './Transitions.css';
import { userProfile } from '../../apollo'
import { useNavigate } from 'react-router-dom'

// This import loads the firebase namespace along with all its type information.
import firebase from 'firebase/app'

// These imports load individual services into the firebase namespace.
import 'firebase/auth'

const sStorage = window.localStorage

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
      .signInWithPopup(provider)
      .then(result => {
        const profile = result.additionalUserInfo.profile
        sStorage.setItem('netid', profile['urn:oid:0.9.2342.19200300.100.1.1'])
        sStorage.setItem('last name', profile['urn:oid:2.5.4.4'])
        sStorage.setItem('first name', profile['urn:oid:2.5.4.42'])
        sStorage.setItem('email', profile['urn:oid:0.9.2342.19200300.100.1.3'])
        sStorage.setItem('id', profile['urn:oid:1.3.6.1.4.1.134.1.1.1.1.19'])
        firebase.auth().currentUser.getIdToken(/* forceRefresh */ true).then(function(idToken) {
          // Send token to your backend via HTTPS
          // ...
          console.log(idToken)
          sStorage.setItem('idToken', idToken)

        }).catch(function(error) {
          // Handle error
        });
      })
      .catch(error => console.log(error))

      return navigate('/auth')
  }

  

  // firebase
  //   .auth()
  //   .getPopupResult()
  //   .then(result => {
  //     if (result.user) {
  //       console.log(result.user.getIdToken())
  //       const profile = result.additionalUserInfo.profile
  //       // redirect to auth page carrying state from IDP
  //       console.log(profile)
  //       sStorage.setItem('netid', profile['urn:oid:0.9.2342.19200300.100.1.1'])
  //       sStorage.setItem('last name', profile['urn:oid:2.5.4.4'])
  //       sStorage.setItem('first name', profile['urn:oid:2.5.4.42'])
  //       sStorage.setItem('email', profile['urn:oid:0.9.2342.19200300.100.1.3'])
  //       sStorage.setItem('id', profile['urn:oid:1.3.6.1.4.1.134.1.1.1.1.19'])
  //       // login()
  //       // await firebase.auth().currentUser.getIdToken(/* forceRefresh */ false).then(function(idToken) {
  //       //   sStorage.setItem('token', idToken)
  //       //   console.log(idToken)
  //       // }).catch(function(error) {
  //       //   console.log(error)
  //       // });
  //       return navigate('/auth')
  //     }
  //   })
  //   .catch(error => {
  //     console.log(error)
  //   })

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
