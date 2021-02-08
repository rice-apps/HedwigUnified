// Apollo Client Setup
import { ApolloClient, HttpLink, InMemoryCache, split } from '@apollo/client'
import { getMainDefinition } from '@apollo/client/utilities'
import { setContext } from '@apollo/link-context'

// Apollo Subscriptions Setup
import { WebSocketLink } from '@apollo/link-ws'
import { GRAPHQL_URL, GRAPHQL_WS_URL, SERVICE_URL } from './config'

import gql from 'graphql-tag.macro'

import { resetOrderSummary } from './Pages/User/Cart/util'

if (!localStorage.getItem('order')) {
  resetOrderSummary()
}

// Wraps our requests with a token if one exists
// Copied from: https://www.apollographql.com/docs/react/v3.0-beta/networking/authentication/
const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = localStorage.getItem('token')
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

// Setup cache
export const cache = new InMemoryCache()

// Initialize Client
export const client = new ApolloClient({
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
      }
    }
  }),
  link: authLink.concat(splitLink)
})

// Initial local state
const initialState = {
  service: SERVICE_URL,
  user: {
    recentUpdate: false,
    _id: ''
  }
}

// Initialize cache with a state
cache.writeQuery({
  query: gql`
    query InitialState {
      service
      user {
        recentUpdate
        _id
      }
    }
  `,
  data: initialState
})
