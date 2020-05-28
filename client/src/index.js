import './index.css'

import React, { Component } from "react"
import {render} from 'react-dom'

import { Router } from 'react-router';
import { Routes } from './components/Routes'

// Setup history
import { createBrowserHistory } from 'history';

// Setup Toast for Notifications
import { ToastProvider } from 'react-toast-notifications'

// Import apollo client for graphql
import { client } from './apollo';
import { ApolloProvider } from '@apollo/client'

export const history = createBrowserHistory();

render(
    <ApolloProvider client={client}>
        <Router history={history}>
            <ToastProvider>
                <Routes />
            </ToastProvider>
        </Router>
    </ApolloProvider>, 
    document.querySelector('#app')
);