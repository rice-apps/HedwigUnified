export const GRAPHQL_URL = process.env.REACT_APP_GRAPHQL_URL
export const GRAPHQL_WS_URL = process.env.REACT_APP_GRAPHQL_WS_URL
export const FIREBASE_API_KEY = process.env.REACT_APP_FIREBASE_API_KEY
export const FIREBASE_AUTH_DOMAIN = process.env.REACT_APP_AUTH_DOMAIN
export const HEDWIG_VENDOR_PERMISSIONS = process.env.REACT_APP_HEDWIG_VENDOR_PERMISSIONS.split(
  ';'
)
export const SQUARE_CLIENT_ID = process.env.REACT_APP_SQUARE_CLIENT_ID
export const SQUARE_CONNECTION_BASE_URL =
  process.env.REACT_APP_SQUARE_ENV === 'production'
    ? 'https://connect.squareup.com/'
    : 'https://connect.squareupsandbox.com/'
