import { ApolloError } from 'apollo-server-express'
import { ApiError, Client, Environment } from 'square'
import { Vendor } from '../models/index.js'
import vault from './vault.js'

/**
 * @type {Map<string, import('square').Client>}
 */
const squareClients = await Vendor.find()
  .exec()
  .then(res => {
    const squareClientsMap = new Map()
    res.forEach(async vendor => {
      squareClientsMap.set(
        vendor.name,
        new Client({
          environment:
            process.env.NODE_ENV === 'production'
              ? Environment.Production
              : Environment.Sandbox,
          accessToken: await vault
            .read(`cubbyhole/${vendor.slug.toLowerCase()}`)
            .then(res => res.data['square-access'])
        })
      )
    })
    return squareClientsMap
  })

/**
 * Fetches order by ID and parses it into
 * our GraphQL data format
 *
 * @param {import('square').Client} squareClient
 * @param {string} orderId
 */
async function orderFetchAndParse (squareClient, orderId) {
  try {
    const {
      result: { order }
    } = await squareClient.ordersApi.retrieveOrder(orderId)

    return orderParse(order)
  } catch (error) {
    if (error instanceof ApiError) {
      throw new ApolloError(
        `Fetching order ${orderId} from Square failed because ${JSON.stringify(
          error.result
        )}`
      )
    }

    throw new ApolloError(
      `Something went wrong when fetching order ${orderId}. Reason is ${JSON.stringify(
        error
      )}`
    )
  }
}
/**
 * Parses a Square Order into our GraphQL data
 * format
 *
 * @param {import('square').Order} order
 */
function orderParse (order) {
  return {
    id: order.id,
    merchant: order.locationId,
    customer: {
      name: order.fulfillments[0].pickupDetails.recipient.displayName,
      email: order.fulfillments[0].pickupDetails.recipient.emailAddress,
      phone: order.fulfillments[0].pickupDetails.recipient.phoneNumber
    },
    items: order.lineItems.map(lineItem => ({
      name: lineItem.name,
      quantity: lineItem.quantity,
      catalogObjectId: lineItem.catalogObjectId,
      variationName: lineItem.variationName,
      totalMoney: lineItem.totalMoney,
      totalTax: lineItem.totalTaxMoney,
      modifiers: lineItem.modifiers?.map(modifier => ({
        uid: modifier.uid,
        catalogObjectId: modifier.catalogObjectId,
        name: modifier.name,
        basePriceMoney: modifier.basePriceMoney,
        totalPriceMoney: modifier.totalPriceMoney
      }))
    })),
    totalTax: order.totalTaxMoney,
    totalDiscount: order.totalDiscountMoney,
    total: order.totalMoney,
    orderStatus: order.state,
    cohenId: order.metadata?.cohenId,
    studentId: order.metadata?.studentId,
    submissionTime: order.metadata?.submissionTime,
    fulfillment: {
      uid: order.fulfillments[0].uid,
      state: order.fulfillments[0].state,
      pickupDetails: {
        pickupAt: order.fulfillments[0].pickupDetails.pickupAt,
        placedAt: order.fulfillments[0].pickupDetails.placedAt,
        recipient: {
          name: order.fulfillments[0].pickupDetails.recipient.displayName,
          email: order.fulfillments[0].pickupDetails.recipient.emailAddress,
          phone: order.fulfillments[0].pickupDetails.recipient.phoneNumber
        }
      }
    }
  }
}

export { squareClients, orderParse, orderFetchAndParse }
