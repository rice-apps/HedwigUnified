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

const server = new ApolloServer({ schema: Schema })

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
