import {
  SHOPIFY_DOMAIN,
  SHOPIFY_STOREFRONT_TOKEN,
  SHOPIFY_API_KEY,
  SHOPIFY_PASSWORD
} from '../config.js'
import ShopifyController from '../controllers/ShopifyController.js'

const shopifyController = new ShopifyController(
  'Cohen House',
  SHOPIFY_DOMAIN,
  SHOPIFY_API_KEY,
  SHOPIFY_PASSWORD,
  SHOPIFY_STOREFRONT_TOKEN
)

/**
 *
 * @param {string} _vendorName The name of the vendor to get Shopify controller for
 */
const getShopify = _vendorName => shopifyController

export default getShopify
