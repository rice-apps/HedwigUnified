import { ApiClient } from 'square-connect'
import { SQUARE_ACCESS_TOKEN } from './config'

// For Square Integration

export const defaultClient = ApiClient.instance

// Set sandbox url
defaultClient.basePath = 'https://connect.squareupsandbox.com'

// Configure OAuth2 access token for authorization: oauth2
const { oauth2 } = defaultClient.authentications

// Set sandbox access token
oauth2.accessToken = SQUARE_ACCESS_TOKEN
