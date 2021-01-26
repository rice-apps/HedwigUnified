import Client from 'shopify-buy/index.unoptimized.umd.js'
import fetch from 'node-fetch'

import Shopify from 'shopify-api-node'

import {
  SHOPIFY_DOMAIN,
  SHOPIFY_STOREFRONT_TOKEN,
  SHOPIFY_API_KEY,
  SHOPIFY_PASSWORD
} from '../config.js'

const shopifyClient = Client.buildClient(
  {
    domain: SHOPIFY_DOMAIN,
    storefrontAccessToken: SHOPIFY_STOREFRONT_TOKEN
  },
  fetch
)

const shopifyAdminClient = new Shopify({
  shopName: SHOPIFY_DOMAIN,
  apiKey: SHOPIFY_API_KEY,
  password: SHOPIFY_PASSWORD,
  apiVersion: '2021-01'
})

export { shopifyClient, shopifyAdminClient }
