import React from "react";
import styled from 'styled-components';
import { useQuery, gql } from "@apollo/client";
import { SERVICE_URL } from '../../config';
import logo from '../../assets/logo.svg';
import CreateProfile from './CreateProfile.js';
const casLoginURL = "https://idp.rice.edu/idp/profile/cas/login";

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
            let redirectURL = casLoginURL + "?service=" + SERVICE_URL;
            window.open(redirectURL, "_self");
        }

    const MainDiv = styled.div`
    height: 100vh;
    width: 100vw;
    display: grid;
    grid-template-rows: 45% 25% 30%;
    text-align: center;
    align-items: center;
    justify-items: center;
    background-image: linear-gradient(180deg,#EAC8C3 0%,#ED533D 100%);
    max-width: 100%;
    font-family: 'Raleway', sans-serif;
    `

    const Logo = styled.img`
    grid-row: 1/2;
    max-height: 80%;
    width: 80%;
    align-self: end;
    `
    const Title = styled.p`
    font-family: 'Raleway', sans-serif;
    color: white;
    grid-row: 2/3;
    font-size: 8vh;
    font-weight: 600;
    display: block;
    margin-block-start: 0.67em;
    margin-block-end: 0.67em;
    margin-inline-start: 0px;
    margin-inline-end: 0px;
    
    `
    // const SubTitle = styled.div`
    // color: white;
    // grid-row: 2/3;
    // align-self: start;
    // `
    const LoginButton = styled.button`
    grid-row: 3/4;
    border-radius: 25pt;
    border: none;
    padding-left: 10px;
    padding-right: 10px;
    font-size: 3vh;
    font-weight: bold;
    font-family: Avenir;
    align-self: start;
    color: #ED533D;
    :hover {
        color: white;
        background-color: #ED533D;
        box-shadow: 2px 8px 5px -5px #9D7A96;
    }
    outline: none;
    `
    
    

    return (
        <MainDiv>
            <Logo src={logo}/>
            <Title>Hedwig</Title>
            {/* <SubTitle>brought to you by riceapps</SubTitle> */}
            <LoginButton onClick={handleClick}>Login with NetID</LoginButton>
        </MainDiv>
        
    )
}

export default Login;