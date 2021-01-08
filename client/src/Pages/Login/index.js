import { useState } from 'react'
import { useQuery, gql } from '@apollo/client'

import logo from './HedwigLogoFinal_02.svg'
import { SERVICE_URL } from '../../config'
import { MainDiv, ElemDiv, Logo, Title, LoginButton } from './Login.styles'

// import './Transitions.css';
import { useNavigate } from 'react-router-dom'

// This import loads the firebase namespace along with all its type information.
import firebase from 'firebase/app'

function Login () {
  // const provider = new firebase.auth.SAMLAuthProvider("saml.jumpcloud-demo");
  const navigate = useNavigate()
  const provider = new firebase.auth.SAMLAuthProvider('saml.rice-shibboleth')
  const navigate = useNavigate()
  /* Lets user sign in in a pop-up tab, get the user's info then generates a token. */
  const signInSAML = () => {
    firebase.auth().signInWithRedirect(provider)
  }

  firebase
    .auth()
    .getRedirectResult()
    .then(result => result.user.getIdToken())
    .then(idToken => {
      localStorage.setItem('idToken', idToken)
      navigate('/auth')
    })
    .catch(error => console.log(error))

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
