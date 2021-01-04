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

  /* Lets user sign in in a pop-up tab, get the user's info then generates a token. */
  const signInSAML = () => {
    firebase
      .auth()
      .signInWithPopup(provider)
      .then(result => {
        const profile = result.additionalUserInfo.profile
        firebase.auth().currentUser.getIdToken(/* forceRefresh */ true).then(function(idToken) {
          sStorage.setItem('idToken', idToken)

        }).catch(function(error) {
          console.log(error)
        });
      })
      .catch(error => console.log(error))

      return navigate('/auth')
  }

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
