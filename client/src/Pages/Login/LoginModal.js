import React from 'react';
import { SERVICE_URL } from '../../config'
import { MainDiv, Logo, Title, SubTitle, LoginButton, 
    BackgroundCover, ButtonPane, VendorButton, ClientButton, ExitButton } from './Login.styles'
import { Navigate } from 'react-router-dom'


const LoginModal = ({changeVisibility}) => {
    const casLoginURL = 'https://idp.rice.edu/idp/profile/cas/login'
    
    // Handles click of login button
    const login = () => {
        // Redirects user to the CAS login page
        let redirectURL = casLoginURL + '?service=' + SERVICE_URL
        window.open(redirectURL, '_self')
    }

    // maybe send a mutation to the backend that tells the authenticate_user payload
    // to include a field that describes its origin "as vendor or client"
    // create extra field and resolver for mutation that describes "origin", which should 
    // persist throughout the entire session.  when you have to re-login, the "origin" should reset
    

    // only reaosn we need this modal is for when vendors want to sign in as clients

    const closeModal = () => {changeVisibility(false);}

    return (
        <BackgroundCover>
            <ExitButton onClick = {closeModal}>Close</ExitButton>
            <ButtonPane>
                <VendorButton onClick={login}>
                    Login as Vendor
                </VendorButton>
                <ClientButton onClick={login}>
                    Login as Client
                </ClientButton>
            </ButtonPane>
        </BackgroundCover>
    );
}

export default LoginModal;
