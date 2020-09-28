import Client from 'shopify-buy'

import { SHOPIFY_DOMAIN, SHOPIFY_API_KEY } from './config'

const shopifyClient = Client.buildClient({
  domain: SHOPIFY_DOMAIN,
  storefrontAccessToken: SHOPIFY_API_KEY
})

export default shopifyClient
