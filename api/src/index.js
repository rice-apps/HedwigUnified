import { ApolloServer } from 'apollo-server-express'
import cors from 'cors'
import express from 'express'
import http from 'http'
import log from 'loglevel'

import { DEV_PORT } from './config'
import './utils/db'

import Schema from './schema'

// Initialize connection to Square with API token
import './square'

const app = express().use(cors())

const server = new ApolloServer({
  schema: Schema,
  introspection: true,
  context: ({ req, res }) => {
    return {
      keyMap: {
        ZETW20E2NB4EG: process.env.SQUARE_ACCESS_TOKEN,
        FMXAFFWJR95WC: process.env.SQUARE_ACCESS_TOKEN
      }
    }
  }
})

server.applyMiddleware({ app })

const httpServer = http.createServer(app)

server.installSubscriptionHandlers(httpServer)

httpServer.listen({ port: DEV_PORT }, () => {
  log.info('Server running.')
  log.info(
    `🚀 Server ready at http://localhost:${DEV_PORT}${server.graphqlPath}`
  )
  log.info(
    `🚀 Subscriptions ready at http://localhost:${DEV_PORT}${server.subscriptionsPath}`
  )
})
