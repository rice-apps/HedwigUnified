import React, { useState } from 'react'
import { useQuery, gql } from '@apollo/client'

import logo from './logo.svg'
import { SERVICE_URL } from '../../config'
import { MainDiv, Logo, Title, SubTitle, LoginButton } from './Login.styles'
// import './Transitions.css';

// const GET_SERVICE_LOCAL = gql`
//     query GetService {
//         service @client # @client indicates that this is a local field; we're just looking at our cache, NOT our backend!
//     }
// `;

function Login () {
  // Fetch service from cache since it depends on where this app is deployed
  // const { data } = useQuery(GET_SERVICE_LOCAL);
  
  const casLoginURL = 'https://idp.rice.edu/idp/profile/cas/login'

  // Handles click of login button
  const login = () => {
      // Redirects user to the CAS login page
      let redirectURL = casLoginURL + '?service=' + SERVICE_URL
      window.open(redirectURL, '_self')
  }

  return (
    <MainDiv>
      <Logo src={logo} />
      <Title>HEDWIG</Title>
      <SubTitle>brought to you by riceapps</SubTitle>
      <LoginButton onClick={login}>Login with NetID</LoginButton>
    </MainDiv>
  )
}

export default Login
