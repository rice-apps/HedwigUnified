import React from "react";
import { useQuery, gql } from "@apollo/client";
import { SERVICE_URL } from '../../config';

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

    return (
        <div style={{ height: '100vh', width: '100vw', display: 'flex', position: 'relative', textAlign: 'center', alignItems: 'center', justifyContent: 'center', backgroundColor: "#FBFBFB" }}>
            <div style={{ display: "inline-block", color: "#272D2D" }}>
                <h2>the app formerly known as _________</h2>
                <h4>brought to you by riceapps</h4>
            </div>
            <div style={{ position: 'absolute', marginTop: '75px' }}>
                <button style={{ color: "#272D2D", textTransform: "none" }} onClick={handleClick}>enter</button>
            </div>
        </div>
    )
}

export default Login;