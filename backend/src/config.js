import 'dotenv/config.js'
import log from 'loglevel'

if (process.env.NODE_ENV === 'development') {
  log.setLevel('trace')
}

// const ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS.split(',')
const DEV_PORT = parseInt(process.env.DEV_PORT, 10)
const {
  MONGODB_URL,
  SQUARE_ACCESS_TOKEN,
  SECRET,
  SHOPIFY_DOMAIN,
  SHOPIFY_STOREFRONT_TOKEN,
  SHOPIFY_API_KEY,
  SHOPIFY_PASSWORD,
  TWILIO_ACCOUNT_SID,
  TWILIO_AUTH_TOKEN,
  REDISHOST,
  REACT_APP_FIREBASE_API_KEY,
  REACT_APP_FIREBASE_AUTH_DOMAIN
} = process.env
const REDISPORT = parseInt(process.env.REDISPORT, 10)

const MONGOOSE_CONFIG = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false
}

const REDIS_OPTIONS = {
  host: REDISHOST,
  port: REDISPORT,
  retryStrategy: times => Math.min(times * 50, 2000)
}

export {
  // ALLOWED_ORIGINS,
  DEV_PORT,
  MONGODB_URL,
  MONGOOSE_CONFIG,
  SQUARE_ACCESS_TOKEN,
  SECRET,
  SHOPIFY_DOMAIN,
  SHOPIFY_STOREFRONT_TOKEN,
  SHOPIFY_API_KEY,
  SHOPIFY_PASSWORD,
  TWILIO_ACCOUNT_SID,
  TWILIO_AUTH_TOKEN,
  REDIS_OPTIONS,
  REACT_APP_FIREBASE_API_KEY as FIREBASE_API_KEY,
  REACT_APP_FIREBASE_AUTH_DOMAIN as FIREBASE_AUTH_DOMAIN
}

export const GOOGLE_APPLICATION_CREDENTIALS = REACT_APP_FIREBASE_API_KEY