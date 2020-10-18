import React from 'react';

import hedwigLogo from './HedwigLogoFinal.svg'
import { MainDiv, Logo, Title, SubTitle, LoginButton, 
    BackgroundCover, ButtonPane, VendorButton, ClientButton, ExitButton, 
    LoginQuestion, HedwigLogo } from './Login.styles'
import { useNavigate } from 'react-router-dom'


const VendorSelect = () => {
    const navigate = useNavigate();

    const clientLogin = () => {
        navigate('/eat');
    }

    const vendorLogin = () => {
        navigate('/employee');
    }

    return (
        <BackgroundCover>
            {/* <ExitButton onClick = {closeModal}>Close</ExitButton> */}
            <LoginQuestion>How do you want to access Hedwig?</LoginQuestion>
            <ButtonPane>
                <VendorButton onClick={vendorLogin}>
                    Login as Vendor
                </VendorButton>
                <ClientButton onClick={clientLogin}>
                    Login as Client
                    <HedwigLogo src={hedwigLogo} />
                </ClientButton>
            </ButtonPane>
        </BackgroundCover>
    );
}

export default VendorSelect;
