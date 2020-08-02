import { SQUARE_ACCESS_TOKEN } from './config';

// For Square Integration
import { ApiClient } from 'square-connect';

export const defaultClient = ApiClient.instance;

// Set sandbox url
defaultClient.basePath = 'https://connect.squareupsandbox.com';

// Configure OAuth2 access token for authorization: oauth2
var oauth2 = defaultClient.authentications['oauth2'];

// Set sandbox access token
oauth2.accessToken = SQUARE_ACCESS_TOKEN;