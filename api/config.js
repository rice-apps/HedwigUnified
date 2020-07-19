// Import all env vars from .env file
require("dotenv").config();

export const { MONGODB_CONNECTION_STRING } = process.env;
export const { SERVICE_URL } = process.env;
export const { SECRET } = process.env;
export const { PORT } = process.env;
