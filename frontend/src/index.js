// import './index.css'
import 'antd/dist/antd.css'

import { render } from 'react-dom'

// import { Router } from 'react-router';
import { BrowserRouter } from 'react-router-dom'

// Setup history
// //import { createBrowserHistory } from 'history';

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
      <App />
    </BrowserRouter>
  </ApolloProvider>,
  document.querySelector('#app')
)
