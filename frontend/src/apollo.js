// Apollo Client Setup
import { ApolloClient, HttpLink, InMemoryCache, split } from '@apollo/client'
import { getMainDefinition } from '@apollo/client/utilities'
import { setContext } from '@apollo/link-context'

// Apollo Subscriptions Setup
import { WebSocketLink } from '@apollo/link-ws'
import { GRAPHQL_URL, GRAPHQL_WS_URL } from './config'

import { resetOrderSummary } from './Pages/User/Cart/util'

<<<<<<< HEAD:frontend/src/apollo.js
if (!localStorage.getItem('order')) {
  resetOrderSummary()
}
=======
const cartItems = makeVar([])

const orderSummary = makeVar({ vendor: {}, time: null, fulfillment: {} })

const userProfile = makeVar({})
>>>>>>> Getting ready to fix auth:client/src/apollo.js

// Wraps our requests with a token if one exists
// Copied from: https://www.apollographql.com/docs/react/v3.0-beta/networking/authentication/
const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = localStorage.getItem('idToken')
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : ''
    }
  }
})

// HTTP Backend Link
const httpLink = new HttpLink({
  uri: GRAPHQL_URL
})

// WebSocket Backend Link
const wsLink = new WebSocketLink({
  uri: GRAPHQL_WS_URL,
  options: {
    reconnect: true
  }
})

// Uses wsLink for subscriptions, httpLink for queries & mutations (everything else)
const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query)
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    )
  },
  wsLink,
  httpLink
)

// Initialize Client
const client = new ApolloClient({
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          cartItems: {
            read () {
              return localStorage.getItem('cartItems')
            }
          },
          orderSummary: {
            read () {
              return orderSummary()
            }
          },
          userProfile: {
            read () {
              return userProfile()
            }
          }
        }
      }
    }
  }),
  link: authLink.concat(splitLink)
})
<<<<<<< HEAD:frontend/src/apollo.js
=======

export { cartItems, orderSummary, userProfile, client }
>>>>>>> Getting ready to fix auth:client/src/apollo.js
