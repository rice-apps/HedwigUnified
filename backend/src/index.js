import { ApolloServer } from 'apollo-server-express'
import cors from 'cors'
import express from 'express'
import http from 'http'
import log from 'loglevel'

import { DEV_PORT } from './config.js'
import './utils/db.js'

import Schema from './schema/index.js'

// Initialize connection to Square with API token
import './utils/square'
import firebaseAdmin from './utils/firebase'

const app = express().use(cors())

const server = new ApolloServer({
  schema: Schema,
  context: async ({ req }) => {
    const token = req.headers.authorization
      ? req.headers.authorization.split(' ')[1]
      : ''

    const idNumber = await firebaseAdmin
      .auth()
      .verifyIdToken(token)
      .then(
        decodedToken =>
          decodedToken.firebase.sign_in_attributes[
            'urn:oid:1.3.6.1.4.1.134.1.1.1.1.19'
          ]
      )
      .catch(_ => null)

    return {
      idNumber: idNumber
    }
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
