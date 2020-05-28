import React, { Component, useEffect } from "react";
import { gql, useQuery, useMutation } from "@apollo/client";
import { Redirect } from "react-router";

const AUTHENTICATE_USER = gql`
    mutation AuthenticateMutation($ticket: String!) {
        authenticateUser(ticket:$ticket) {
            _id
            netid
            token
            recentUpdate
        }
    }
`;

const parseTicket = (url) => {
    // Ex: http://example.com/auth?ticket=ST-1590205338989-7y7ojqvDfvGIFDLyjahEqIp2F
    // Get the ticket query param
    let ticketParamName = "ticket=";
    // We're searching for the part of the string AFTER ticket=
    let ticketStartIndex = url.indexOf(ticketParamName) + ticketParamName.length;
    // Only returns the ticket portion
    return url.substring(ticketStartIndex);
}

const Auth = ({}) => {
    // First parse out ticket from URL href
    let ticket = parseTicket(window.location.href);

    // Run query against backend to authenticate user
    const [ authenticateUser, { data, loading, error } ] = useMutation(
        AUTHENTICATE_USER,
        { variables: { ticket: ticket } }
    );

    useEffect(() => {
        // We only want this mutation to run once; if we hit any errors we redirect to login
        authenticateUser().catch(err => <Redirect path={"/login"} />);
    }, []);

    if (error) return <Redirect path={"/login"} />;
    if (loading) return <p>Bad.</p>;
    if (!data) return <p>Bad.</p>;

    let { netid, token, recentUpdate } = data.authenticateUser;

    // Set token in local storage
    localStorage.setItem('token', token);

    // Set recent update in client state
    return (
        <Redirect path={"/home"} />
    )
}

export default Auth;