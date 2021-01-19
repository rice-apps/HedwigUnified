import { ApolloServer } from 'apollo-server-express'
import cors from 'cors'
import express from 'express'
import http from 'http'
import log from 'loglevel'

import { DEV_PORT } from './config.js'
import './utils/db.js'

import Schema from './schema/index.js'

// Initialize connection to Square with API token
import './utils/square.js'

log.info(`Number of threads: ${process.env.UV_THREADPOOL_SIZE}`)

const app = express().use(cors())

const server = new ApolloServer({
  schema: Schema,
  subscriptions: { path: '/ws' }
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
