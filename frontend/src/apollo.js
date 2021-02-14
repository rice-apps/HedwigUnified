// Apollo Client Setup
import { ApolloClient, HttpLink, InMemoryCache, split } from '@apollo/client'
import { getMainDefinition } from '@apollo/client/utilities'
import { setContext } from '@apollo/client/link/context'

// Apollo Subscriptions Setup
import { WebSocketLink } from '@apollo/client/link/ws'

import firebase from 'firebase/app'
import 'firebase/auth'

import { GRAPHQL_URL, GRAPHQL_WS_URL } from './config'

import { resetOrderSummary } from './Pages/User/Cart/util'

if (!localStorage.getItem('order')) {
  resetOrderSummary()
}

// Wraps our requests with a token if one exists
// Copied from: https://www.apollographql.com/docs/react/v3.0-beta/networking/authentication/
const authLink = setContext(async (_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = await firebase.auth().currentUser?.getIdToken()
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
    reconnect: true,
    connectionParams: async () => ({
      authToken: await firebase.auth().currentUser?.getIdToken()
    })
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
          }
        }
      },
      Subscription: {
        fields: {
          orderUpdated: {
            merge (_existing, incoming) {
              return incoming
            }
          }
        }
      }
    }
  }),
  link: authLink.concat(splitLink)
})

export { client }
