import { ApolloServer, AuthenticationError } from 'apollo-server-express'
import cors from 'cors'
import express from 'express'
import http from 'http'
import log from 'loglevel'

import { DEV_PORT } from './config.js'
import './utils/db.js'

import Schema from './graphql/resolvers/index.js'

// Initialize connection to Square with API token
import './utils/square.js'
import firebaseAdmin from './utils/firebase.js'

const app = express().use(cors())

const server = new ApolloServer({
  schema: Schema,
  context: async ({ req }) => {
    if (!req) {
      return
    }
    const token = req.headers.authorization
      ? req.headers.authorization.split(' ')[1]
      : ''

    const decodedToken = await firebaseAdmin
      .auth()
      .verifyIdToken(token)
      .catch(_ => null)

    return {
      idNumber: decodedToken
        ? decodedToken.firebase.sign_in_attributes[
            'urn:oid:1.3.6.1.4.1.134.1.1.1.1.19'
          ]
        : null,
      netid: decodedToken
        ? decodedToken.firebase.sign_in_attributes[
            'urn:oid:0.9.2342.19200300.100.1.1'
          ]
        : null
    }
  },
  subscriptions: {
    onConnect: connectionParams => {
      if (connectionParams.authToken) {
        return firebaseAdmin
          .auth()
          .verifyIdToken(connectionParams.authToken)
          .then(decodedToken => ({
            idNumber:
              decodedToken.firebase.sign_in_attributes[
                'urn:oid:1.3.6.1.4.1.134.1.1.1.1.19'
              ],
            netid:
              decodedToken.firebase.sign_in_attributes[
                'urn:oid:0.9.2342.19200300.100.1.1'
              ]
          }))
      }

      throw new AuthenticationError('Missing auth token!')
    },
    path: '/ws'
  }
})

server.applyMiddleware({ app })

const httpServer = http.createServer(app)

server.installSubscriptionHandlers(httpServer)

httpServer.listen({ port: DEV_PORT }, () => {
  log.info(
    `🚀 Server ready at http://localhost:${DEV_PORT}${server.graphqlPath}`
  )
  log.info(
    `🚀 Subscriptions ready at ws://localhost:${DEV_PORT}${server.subscriptionsPath}`
  )
})
