import Client from 'shopify-buy/index.unoptimized.umd.js'
import fetch from 'node-fetch'

import Shopify from 'shopify-api-node'
import { OrderTracker } from '../graphql/schema/index.js'

import { ApolloError } from 'apollo-server-express'

/**
 * Provides a unified interface for the Shopify Admin and Storefront APIs
 */
class ShopifyController {
  /**
   * Initializes a Shopify Controller to manage both Storefront and Admin APIs
   * @param {string} vendorName the name of the vendor
   * @param {string} shopifyDomain The domain of the Shopify store
   * @param {string} shopifyApiKey
   * @param {string} shopifyPassword
   * @param {string} shopifyStorefrontToken
   */
  constructor (
    vendorName,
    shopifyDomain,
    shopifyApiKey,
    shopifyPassword,
    shopifyStorefrontToken
  ) {
    this.vendorName = vendorName
    this.shopifyClient = Client.buildClient(
      {
        domain: shopifyDomain,
        storefrontAccessToken: shopifyStorefrontToken
      },
      fetch
    )

    this.shopifyAdminClient = new Shopify({
      shopName: shopifyDomain,
      apiKey: shopifyApiKey,
      password: shopifyPassword,
      apiVersion: '2021-01'
    })
  }

  /**
   * Creates a payment on Shopify
   * @param {{amount: number, currency: string}} subtotal Subtotal of payment
   * @param {string} orderId Square order ID we're paying for
   * @returns POJO conforming to `PaymentTC`
   */
  async createPayment (subtotal, orderId) {
    const unitProduct = await this.shopifyClient.product.fetchByHandle(
      'unit-product'
    )
    const createCheckoutMutation = this.shopifyClient.graphQLClient.mutation(
      root => {
        root.add(
          'checkoutCreate',
          {
            args: {
              input: {
                lineItems: {
                  quantity: subtotal.amount,
                  variantId: unitProduct.variants[0].id
                }
              }
            }
          },
          checkoutCreate => {
            checkoutCreate.add('checkout', checkout => {
              checkout.add('id')
              checkout.add('webUrl')
              checkout.add('order', order => {
                order.add('id')
              })
              checkout.add('paymentDueV2', payment => {
                payment.add('amount')
                payment.add('currencyCode')
              })
            })
          }
        )
      }
    )

    const checkout = await this.shopifyClient.graphQLClient.send(
      createCheckoutMutation
    )

    await OrderTracker.findOneAndUpdate(
      { orderId: orderId },
      { shopifyOrderId: checkout.data.checkoutCreate.checkout.id }
    ).exec()

    return {
      id: checkout.data.checkoutCreate.checkout.id,
      total: subtotal,
      url: checkout.data.checkoutCreate.checkout.webUrl,
      source: 'SHOPIFY'
    }
  }

  /**
   * Completes the Shopify payment corresponding to the checkout ID
   * @param {string} paymentId The Shopify Checkout ID
   * @param {{amount: number, currency: string}} money The amount to capture
   * @returns POJO conforming to `PaymentTC`
   */
  async completePayment (paymentId, money) {
    const checkoutOrderQuery = this.shopifyClient.graphQLClient.query(root => {
      root.add('node', { args: { id: paymentId } }, node => {
        node.addInlineFragmentOn('Checkout', checkout => {
          checkout.add('id')
          checkout.add('order', order => {
            order.add('id')
          })
        })
      })
    })

    const checkout = await this.shopifyClient.graphQLClient.send(
      checkoutOrderQuery
    )

    const transactionQuery = `
      query GetOrder($id: ID!) {
        node(id: $id) {
          ...on Order {
            transactions {
              id
            }
          }
        }
      }
    `

    if (checkout.data.node.order === undefined) {
      throw new ApolloError(
        'Cannot complete payment for transaction with no authorization'
      )
    }

    const transactions = await this.shopifyAdminClient.graphql(
      transactionQuery,
      {
        id: checkout.data.node.order.id
      }
    )

    const completePayment = `
      mutation CompletePayment($input: OrderCaptureInput!) {
        orderCapture(input: $input) {
          transaction {
            id
          }
          userErrors {
            field
            message
          }
        }
      }
    `

    await this.shopifyAdminClient.graphql(completePayment, {
      input: {
        amount: money.amount / 100,
        currency: money.currency,
        id: checkout.data.node.order.id,
        parentTransactionId: transactions.node.transactions[0].id
      }
    })

    return {
      id: checkout.data.node.id,
      order: checkout.data.node.order.id
    }
  }

  /**
   * Checks if the customer has authorized the charge
   * @param {string} paymentId This is the Checkout ID from Shopify
   * @returns {Promise<boolean>} whether the payment is verified or not
   */
  async verifyPayment (paymentId) {
    const checkoutOrderQuery = this.shopifyClient.graphQLClient.query(root => {
      root.add('node', { args: { id: paymentId } }, node => {
        node.addInlineFragmentOn('Checkout', checkout => {
          checkout.add('id')
          checkout.add('order', order => {
            order.add('id')
          })
          checkout.add('paymentDueV2', payment => {
            payment.add('amount')
            payment.add('currencyCode')
          })
        })
      })
    })

    const checkout = await this.shopifyClient.graphQLClient.send(
      checkoutOrderQuery
    )

    const orderQuery = `
      query GetOrder($id: ID!) {
        node(id: $id) {
          ...on Order {
            fullyPaid
            totalCapturableSet {
              presentmentMoney {
                amount
                currencyCode
              }
              shopMoney {
                amount
                currencyCode
              }
            }
            transactions {
              id
            }
          }
        }
      }
    `

    if (checkout.data.node.order != null) {
      const order = await this.shopifyAdminClient.graphql(orderQuery, {
        id: checkout.data.node.order.id
      })

      return (
        order.node.fullyPaid ||
        (checkout.data.node.paymentDueV2.amount ===
          order.node.totalCapturableSet.presentmentMoney.amount &&
          checkout.data.node.paymentDueV2.currencyCode ===
            order.node.totalCapturableSet.presentmentMoney.currencyCode)
      )
    }

    return false
  }

  /**
   * Cancels the payment
   * @param {string} paymentId the Checkout ID of the order
   * @returns POJO for the cancelled payment
   */
  async cancelPayment (paymentId) {
    const checkoutOrderQuery = this.shopifyClient.graphQLClient.query(root => {
      root.add('node', { args: { id: paymentId } }, node => {
        node.addInlineFragmentOn('Checkout', checkout => {
          checkout.add('id')
          checkout.add('order', order => {
            order.add('id')
          })
        })
      })
    })

    const checkout = await this.shopifyClient.graphQLClient.send(
      checkoutOrderQuery
    )

    const orderCloseMutation = `
      mutation CloseOrder($id: ID!) {
        orderClose(input: { id: $id }) {
          order {
            id
          }
        }
      }
    `

    const order = await this.shopifyAdminClient.graphql(orderCloseMutation, {
      id: checkout.data.node.order.id
    })

    return {
      id: paymentId,
      order: order.orderClose.order.id
    }
  }
}

export default ShopifyController
