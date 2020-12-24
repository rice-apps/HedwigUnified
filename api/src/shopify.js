import Client from 'shopify-buy/index.unoptimized.umd'
import fetch from 'node-fetch'

import Shopify from 'shopify-api-node'

import {
  SHOPIFY_DOMAIN,
  SHOPIFY_STOREFRONT_TOKEN,
  SHOPIFY_API_KEY,
  SHOPIFY_PASSWORD
} from './config'

const shopifyClient = Client.buildClient(
  {
    domain: SHOPIFY_DOMAIN,
    storefrontAccessToken: SHOPIFY_STOREFRONT_TOKEN
  },
  fetch
)

console.log('Shop name: ', SHOPIFY_DOMAIN)
console.log('Shopify API key: ', SHOPIFY_API_KEY)
console.log('Shopify password: ', SHOPIFY_PASSWORD)

const shopifyAdminClient = new Shopify({
  shopName: SHOPIFY_DOMAIN,
  apiKey: SHOPIFY_API_KEY,
  password: SHOPIFY_PASSWORD,
  apiVersion: '2020-10'
})

export { shopifyClient, shopifyAdminClient }
