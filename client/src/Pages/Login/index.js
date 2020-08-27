import React from 'react'
import styled from 'styled-components'
import { useQuery, gql } from '@apollo/client'
import { SERVICE_URL } from '../../config'
import logo from './logo.svg'

const casLoginURL = 'https://idp.rice.edu/idp/profile/cas/login'

// const GET_SERVICE_LOCAL = gql`
//     query GetService {
//         service @client # @client indicates that this is a local field; we're just looking at our cache, NOT our backend!
//     }
// `;

const Login = () => {
  // Fetch service from cache since it depends on where this app is deployed
  // const { data } = useQuery(GET_SERVICE_LOCAL);

  // Handles click of login button
  const handleClick = () => {
    // Redirects user to the CAS login page
    let redirectURL = casLoginURL + '?service=' + SERVICE_URL
    window.open(redirectURL, '_self')
  }

  const MainDiv = styled.div`
    height: 100vh;
    width: 100vw;
    display: grid;
    grid-template-rows: 25% 15% 30% 30%;
    text-align: center;
    align-items: center;
    justify-items: center;
    background-color: #f49f86;
    max-width: 100%;
    font-family: 'Raleway', sans-serif;
  `

  const Logo = styled.img`
    grid-row: 3/4;
    max-height: 100%;
    width: 80%;
  `
  const Title = styled.h1`
    color: white;
    grid-row: 1/2;
    font-size: 60pt;
  `
  const SubTitle = styled.div`
    color: white;
    grid-row: 2/3;
    align-self: start;
  `
  const LoginButton = styled.button`
    grid-row: 4/5;
    border-radius: 25pt;
    height: 37pt;
    width: 169pt;
    border: none;
    font-size: 17pt;
    font-weight: bold;
    color: #f49f86;
    :hover {
      text-decoration: underline;
      box-shadow: 2px 8px 5px -5px #9d7a96;
    }
  `

  return (
    <MainDiv>
      <Logo src={logo} />
      <Title>HEDWIG</Title>
      <SubTitle>brought to you by riceapps</SubTitle>
      <LoginButton onClick={handleClick}>Login with NetID</LoginButton>
    </MainDiv>
  )
}

export default Login
