// Import all env vars from .env file
require('dotenv').config()

export const MONGODB_CONNECTION_STRING = process.env.MONGODB_CONNECTION_STRING;
export const SERVICE_URL = process.env.SERVICE_URL;
export const SECRET = process.env.SECRET;
export const PORT = process.env.PORT;