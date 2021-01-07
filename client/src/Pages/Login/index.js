import { useState } from 'react'
import { useQuery, gql } from '@apollo/client'

import logo from './HedwigLogoFinal_02.svg'
import { SERVICE_URL } from '../../config'
import { MainDiv, ElemDiv, Logo, Title, LoginButton } from './Login.styles'
// import './Transitions.css';
import { useNavigate } from 'react-router-dom'

// This import loads the firebase namespace along with all its type information.
import firebase from 'firebase/app'

// These imports load individual services into the firebase namespace.
import 'firebase/auth'

const sStorage = window.localStorage

function Login () {
  // const provider = new firebase.auth.SAMLAuthProvider("saml.jumpcloud-demo");
  const provider = new firebase.auth.SAMLAuthProvider('saml.rice-shibboleth')
  const navigate = useNavigate()
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
      <ElemDiv>
        <Logo src={logo} />
        <Title>hedwig</Title>
        <LoginButton onClick={signInSAML}>Login with NetID</LoginButton>
      </ElemDiv>
    </MainDiv>
  )
}

export default Login
