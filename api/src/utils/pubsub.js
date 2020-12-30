import { RedisPubSub } from 'graphql-redis-subscriptions'
import { PubSub } from 'apollo-server-express'

import { REDIS_OPTIONS } from '../config'

const Redis = require('ioredis')

let pubsub

if (process.env.NODE_ENV === 'production') {
  pubsub = new RedisPubSub({
    publisher: new Redis(REDIS_OPTIONS),
    subscriber: new Redis(REDIS_OPTIONS)
  })
} else {
  pubsub = new PubSub()
}

export { pubsub }
