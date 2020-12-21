import './index.css'
import 'antd/dist/antd.css'

import { Component } from 'react'
import { render } from 'react-dom'

// import { Router } from 'react-router';
import { BrowserRouter } from 'react-router-dom'
import { RoutesComponent } from './components/Routes'

// Setup history
// //import { createBrowserHistory } from 'history';

// Setup Toast for Notifications
import { ToastProvider } from 'react-toast-notifications'

// Import apollo client for graphql
import { client } from './apollo'
import { ApolloProvider } from '@apollo/client'
import App from './App'

import './fonts/style.css'
import './firebase'

// export const history = createBrowserHistory();

render(
  <ApolloProvider client={client}>
    <BrowserRouter>
      <ToastProvider>
        <App />
      </ToastProvider>
    </BrowserRouter>
  </ApolloProvider>,
  document.querySelector('#app')
)
