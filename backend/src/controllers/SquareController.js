import { ApolloError } from 'apollo-server-express'
import { ApiError, Client, Environment } from 'square'
import { v4 as uuid } from 'uuid'

/**
 * Provides a unified interface to perform Square actions
 * compliant with our backend
 */
class SquareController {
  /**
   * Creates a new SquareController for the given vendor
   * @param {string} vendorName The name of the vendor
   * @param {string} accessToken The access token for the vendor's square account
   * @param {boolean} isProductionSquare Whether to use a production Square account
   */
  constructor (vendorName, accessToken, isProductionSquare) {
    this.vendorName = vendorName
    this.squareClient = new Client({
      accessToken: accessToken,
      environment: isProductionSquare
        ? Environment.Production
        : Environment.Sandbox
    })
  }

  /**
   * Gets the catalog for the current vendor
   * @returns a POJO conforming to `[ItemTC]`
   */
  async getCatalog () {
    try {
      const {
        result: { objects }
      } = await this.squareClient.catalogApi.listCatalog(
        undefined,
        'ITEM,CATEGORY,MODIFIER_LIST'
      )

      // Filter objects into distinct sets
      const categories = objects.filter(object => object.type === 'CATEGORY')
      const modifierLists = objects.filter(
        object => object.type === 'MODIFIER_LIST'
      )
      const items = objects.filter(object => object.type === 'ITEM')

      // Define functions for getting category and modifier list data from id
      const categoryId2Name = id =>
        categories.find(category => category.id === id)?.categoryData.name
      const modifierListId2Data = id =>
        modifierLists.find(modifierList => modifierList.id === id)

      return items.map(async item => {
        const {
          id: itemId,
          imageId,
          itemData: {
            name: baseItemName,
            description: baseItemDescription,
            variations,
            modifierListInfo,
            categoryId
          },
          customAttributeValues: {
            is_available: { booleanValue: isAvailable }
          }
        } = item

        let imageData
        try {
          const response = await this.squareClient.catalogApi.retrieveCatalogObject(
            imageId
          )
          imageData = response.result.object.imageData.url
        } catch (error) {
          imageData = null
        }

        return {
          dataSourceId: itemId,
          dataSource: 'SQUARE',
          image: imageData,
          category: categoryId2Name(categoryId),
          variants: variations.map(SquareController.parseVariations),
          modifierLists: this.parseModifierListInfoForVendor(
            modifierListInfo,
            modifierListId2Data
          ),
          name: baseItemName,
          description: baseItemDescription,
          merchant: this.vendorName,
          isAvailable
        }
      })
    } catch (error) {
      if (error instanceof ApiError) {
        throw new ApolloError(
          `Getting Square catalog failed: ${JSON.stringify(error.result)}`
        )
      }

      throw new ApolloError(
        `Something went wrong getting Square catalog: ${JSON.stringify(error)}`
      )
    }
  }

  /**
   * Gets a single item from Square
   * @param {string} itemId the Square ID to get
   * @returns a POJO conforming to `ItemTC`
   */
  async getItem (itemId) {
    try {
      const {
        result: { object }
      } = await this.squareClient.catalogApi.retrieveCatalogObject(itemId)

      const {
        imageId,
        itemData: {
          name: baseItemName,
          description: baseItemDescription,
          variations,
          modifierListInfo
        },
        customAttributeValues: {
          is_available: { booleanValue: isAvailable }
        }
      } = object

      let imageData
      try {
        const response = await this.squareClient.catalogApi.retrieveCatalogObject(
          imageId
        )
        imageData = response.result.object.imageData.url
      } catch (error) {
        imageData = null
      }

      return {
        dataSourceId: itemId,
        dataSource: 'SQUARE',
        image: imageData,
        variants: variations.map(SquareController.parseVariations),
        modifierLists: this.parseModifierListInfoForVendor(
          modifierListInfo,
          undefined
        ),
        name: baseItemName,
        description: baseItemDescription,
        merchant: this.vendorName,
        isAvailable
      }
    } catch (error) {
      if (error instanceof ApiError) {
        throw new ApolloError(
          `Retrieving item ${itemId} from Square failed because ${JSON.stringify(
            error.result
          )}`
        )
      }

      throw new ApolloError(
        `Something went wrong when retrieving item ${itemId}: ${JSON.stringify(
          error
        )}`
      )
    }
  }

  /**
   * Gets the last 500 orders for this merchant
   * @param {string} cursor The cursor to the last order viewed
   * @param {string[]} locations The locations IDs to view orders for
   * @param {any} query The Square-compatible filter/sort query to pass in
   */
  async getOrders (cursor, locations, query) {
    try {
      const {
        result: { cursor: newCursor, orders }
      } = await this.squareClient.ordersApi.searchOrders({
        cursor: cursor,
        locationIds: locations,
        query: query
      })

      const filteredOrders = orders.filter(
        order => typeof order.fulfillments !== 'undefined'
      )

      return {
        cursor: newCursor,
        orders: filteredOrders.map(SquareController.orderParse)
      }
    } catch (error) {
      if (error instanceof ApiError) {
        throw new ApolloError(
          `Finding orders using Square failed because ${JSON.stringify(
            error.result
          )}`
        )
      }

      throw new ApolloError(
        `Something went wrong finding orders: ${JSON.stringify(error)}`
      )
    }
  }

  /**
   * Creates a new Order for this vendor
   * @param {string} locationId Vendor location ID to create order for
   * @param {string} idempotencyKey keeps requests idempotent
   * @param {any[]} lineItems list of `LineItemTC` objects
   * @param {{name: string, email: string, phone: string}} recipient information about the recipient
   * @param {string} pickupTime The RFC compliant time this order is to be picked up at
   * @param {string} submissionTime The RFC compliant time this order is submitted at
   * @param {string=} cohenId Optional Cohen House membership ID
   * @param {string=} studentId Optional student ID
   * @returns a POJO conforming to `OrderTC`
   */
  async createOrder (
    locationId,
    idempotencyKey,
    lineItems,
    recipient,
    pickupTime,
    submissionTime,
    cohenId,
    studentId
  ) {
    try {
      const {
        result: { order: newOrder }
      } = await this.squareClient.ordersApi.createOrder({
        idempotencyKey: idempotencyKey,
        order: {
          locationId: locationId,
          lineItems: lineItems,
          metadata: {
            cohenId: cohenId || 'N/A',
            studentId: studentId || 'N/A',
            submissionTime: submissionTime || 'N/A'
          },
          fulfillments: [
            {
              type: 'PICKUP',
              state: 'PROPOSED',
              pickupDetails: {
                pickupAt: pickupTime,
                recipient: {
                  displayName: recipient.name,
                  emailAddress: recipient.email,
                  phoneNumber: recipient.phone
                }
              }
            }
          ],
          state: 'OPEN'
        }
      })

      return SquareController.orderParse(newOrder)
    } catch (error) {
      if (error instanceof ApiError) {
        throw new ApolloError(
          `Creating new order on Square failed because ${JSON.stringify(
            error.result
          )}`
        )
      }

      throw new ApolloError(
        `Something went wrong when creating new order ${JSON.stringify(error)}`
      )
    }
  }

  /**
   * Updates an order with the given state
   *
   * @param {string} orderId The Order to modify
   * @param {('PROPOSED'|'RESERVED'|'PREPARED'|'COMPLETED'|'CANCELED')} state The state to update the order to
   * @returns a POJO conforming to `OrderTC`
   */
  async updateOrder (orderId, state) {
    try {
      const {
        result: { order: oldOrder }
      } = await this.squareClient.ordersApi.retrieveOrder(orderId)

      oldOrder.fulfillments[0].state = state

      if (state === 'COMPLETED' || state === 'CANCELED') {
        oldOrder.state = state
      }

      const {
        result: { order: newOrder }
      } = await this.squareClient.ordersApi.updateOrder(orderId, {
        idempotencyKey: uuid(),
        order: {
          version: oldOrder.version,
          fulfillments: oldOrder.fulfillments,
          state: oldOrder.state
        }
      })

      return SquareController.orderParse(newOrder)
    } catch (error) {
      if (error instanceof ApiError) {
        throw new ApolloError(
          `Updating order on Square failed because ${JSON.stringify(
            error.result
          )}`
        )
      }

      throw new ApolloError(
        `Something went wrong when updating order ${JSON.stringify(error)}`
      )
    }
  }

  /**
   * Gets the payments for the current vendor's current location
   *
   * @param {string=} cursor Pagination cursor
   * @param {string=} locationId Location ID to get payments for
   * @returns POJO conforming to `PaymentTC[]`
   */
  async getPayments (cursor, locationId) {
    try {
      const {
        result: { cursor: newCursor, payments }
      } = await this.squareClient.paymentsApi.listPayments(
        undefined,
        undefined,
        undefined,
        cursor,
        locationId
      )
      const paymentsList = payments.map(payment => ({
        id: payment.id,
        order: payment.orderId,
        customer: payment.customerId,
        subtotal: payment.amountMoney,
        tip: payment.tipMoney,
        total: payment.totalMoney,
        status: payment.status
      }))

      return {
        cursor: newCursor,
        payments: paymentsList
      }
    } catch (error) {
      if (error instanceof ApiError) {
        throw new ApolloError(
          `Retrieving list of payments from Square failed because ${JSON.stringify(
            error.result
          )}`
        )
      }

      throw new ApolloError(
        `Something went wrong while retrieving list of payments from Square: ${JSON.stringify(
          error
        )}`
      )
    }
  }

  /**
   *
   * @param {string} idempotencyKey
   * @param {string} sourceId Typically the nonce generated by Square
   * @param {{amount: number, currency: string}} subtotal The subtotal to charge
   * @param {{amount: number, currency: string}} tip The tip to charge
   * @param {string} orderId Order this payment is for
   * @param {string=} customerId Customer this payment is from
   * @param {string} locationId location this payment is made for
   * @returns POJO conforming to `PaymentTC`
   */
  async createPayment (
    idempotencyKey,
    sourceId,
    subtotal,
    tip,
    orderId,
    customerId,
    locationId
  ) {
    try {
      const {
        result: { payment }
      } = await this.squareClient.paymentsApi.createPayment({
        locationId: locationId,
        sourceId: sourceId,
        idempotencyKey: idempotencyKey,
        amountMoney: subtotal,
        tipMoney: tip,
        orderId: orderId,
        customerId: customerId,
        autocomplete: false
      })

      return {
        id: payment.id,
        order: payment.orderId,
        customer: payment.customerId,
        subtotal: payment.amountMoney,
        tip: payment.tipMoney,
        total: payment.totalMoney,
        status: payment.status
      }
    } catch (error) {
      if (error instanceof ApiError) {
        throw new ApolloError(
          `Creating payment in Square failed because ${JSON.stringify(
            error.result
          )}`
        )
      } else {
        throw new ApolloError(
          `Something went wrong while creating a payment in Square ${JSON.stringify(
            error
          )}`
        )
      }
    }
  }

  /**
   * Captures a Square payment
   *
   * @param {string} paymentId The payment ID to complete payment for
   * @returns POJO conforming to `PaymentTC`
   */
  async completePayment (paymentId) {
    try {
      const {
        result: { payment }
      } = await this.squareClient.paymentsApi.completePayment(paymentId)

      return {
        id: payment.id,
        order: payment.orderId,
        customer: payment.customerId,
        subtotal: payment.amountMoney,
        tip: payment.tipMoney,
        total: payment.totalMoney,
        status: payment.status
      }
    } catch (error) {
      if (error instanceof ApiError) {
        throw new ApolloError(
          `Completing payment ${paymentId} using Square failed because ${JSON.stringify(
            error.result
          )}`
        )
      } else {
        throw new ApolloError(
          `Something went wrong when completing payment ${paymentId}: ${JSON.stringify(
            error
          )}`
        )
      }
    }
  }

  /**
   * Verifies a payment
   * @param {string} paymentId The payment to verify
   * @returns {boolean} whether the payment is good
   */
  async verifyPayment (paymentId) {
    try {
      const {
        result: { payment }
      } = await this.squareClient.paymentsApi.getPayment(paymentId)

      return payment.status !== 'CANCELED' && payment.status !== 'FAILED'
    } catch (error) {
      if (error instanceof ApiError) {
        throw new ApolloError(
          `Verifying payment ${paymentId} on Square failed because ${JSON.stringify(
            error.result
          )}`
        )
      } else {
        throw new ApolloError(
          `Something went wrong when verifying payment ${paymentId} on Square: ${JSON.stringify(
            error
          )}`
        )
      }
    }
  }

  /**
   * Cancels a payment through Square
   * @param {string} paymentId The payment to cancel
   * @returns POJO conforming to `PaymentTC`
   */
  async cancelPayment (paymentId) {
    try {
      const {
        result: { payment }
      } = await this.squareClient.paymentsApi.cancelPayment(paymentId)

      return {
        id: payment.id,
        order: payment.orderId,
        customer: payment.customerId,
        subtotal: payment.amountMoney,
        tip: payment.tipMoney,
        total: payment.totalMoney,
        status: payment.status
      }
    } catch (error) {
      if (error instanceof ApiError) {
        throw new ApolloError(
          `Cancelling payment ${paymentId} using Square failed because ${JSON.stringify(
            error.result
          )}`
        )
      }

      throw new ApolloError(
        `Something went wrong cancelling payment ${paymentId} using Square: ${JSON.stringify(
          error
        )}`
      )
    }
  }

  /**
   * Gets or renews OAuth tokens for this vendor
   *
   * @param {string=} authCode The auth code to exchange. Used for first time setup
   * @param {string=} refreshToken The refresh token to get a new auth token
   * @returns {{oauthToken: string, refreshToken: string}} The OAuth and refresh tokens
   */
  async getTokens (authCode, refreshToken) {
    const APPLICATION_INFO = {
      clientId: 'OUR ID',
      clientSecret: 'OUR SECRET'
    }

    if (authCode !== undefined) {
      try {
        const { result } = await this.squareClient.oAuthApi.obtainToken({
          code: authCode,
          grantType: 'authorization_code',
          ...APPLICATION_INFO
        })

        return {
          oauthToken: result.accessToken,
          refreshToken: result.refreshToken
        }
      } catch (error) {
        if (error instanceof ApiError) {
          throw new ApolloError(
            `Exchanging auth code with Square failed: ${JSON.stringify(
              error.result
            )}`
          )
        }

        throw new ApolloError(
          `Something went wrong exchanging auth code: ${JSON.stringify(error)}`
        )
      }
    } else if (refreshToken !== undefined) {
      try {
        const { result } = await this.squareClient.oAuthApi.obtainToken({
          refreshToken: refreshToken,
          grantType: 'refresh_token',
          ...APPLICATION_INFO
        })

        return {
          oauthToken: result.accessToken,
          refreshToken: result.refreshToken
        }
      } catch (error) {
        if (error instanceof ApiError) {
          throw new ApolloError(
            `Refreshing token with Square failed: ${JSON.stringify(
              error.result
            )}`
          )
        }

        throw new ApolloError(
          `Something went wrong refreshing token: ${JSON.stringify(error)}`
        )
      }
    } else {
      throw new ApolloError('Need to provide auth code or refresh token')
    }
  }

  /**
   * @param {import('square').CatalogObject} variant A CatalogObject with type `ITEM_VARIATION`
   * @returns a POJO conforming to `ItemVariantTC`
   */
  static parseVariations (variant) {
    const {
      id: itemVariationId,
      itemVariationData: {
        itemId: parentItemId,
        name: itemVariationName,
        priceMoney
      }
    } = variant

    return {
      dataSourceId: itemVariationId,
      parentItemId,
      price: {
        amount: priceMoney ? priceMoney.amount : 0,
        currency: priceMoney ? priceMoney.currency : 'USD'
      },
      name: itemVariationName,
      dataSource: 'SQUARE',
      merchant: ''
    }
  }

  /**
   *
   * @param {import('square').CatalogItemModifierListInfo[]} modifierListInfo The modifier list info lists to get modifiers for
   * @param {(function(string): import('square').CatalogObject)=} listId2ModifierList An optional function to get modifier data from id
   * @returns a POJO conforming to `ItemModifierListTC`
   */
  async parseModifierListInfoForVendor (modifierListInfo, listId2ModifierList) {
    if (listId2ModifierList === undefined) {
      const modifierListIds = modifierListInfo.map(info => info.modifierListId)
      let modifierLists = null

      try {
        const {
          result
        } = await this.squareClient.catalogApi.batchRetrieveCatalogObjects({
          objectIds: modifierListIds
        })

        modifierLists = result.objects
      } catch (error) {
        if (error instanceof ApiError) {
          throw new ApolloError(
            `Retrieving modifier lists from Square failed: ${JSON.stringify(
              error.result
            )}`
          )
        }

        throw new ApolloError(`Something went wrong: ${JSON.stringify(error)}`)
      }

      listId2ModifierList = id =>
        modifierLists.find(modifierList => modifierList.id === id)
    }

    const modifierLists = modifierListInfo
      ? modifierListInfo.map(info => ({
          data: listId2ModifierList(info.modifierListId),
          min: info.minSelectedModifiers,
          max: info.maxSelectedModifiers
        }))
      : []

    return modifierLists.map(modifierList => {
      const {
        id: parentListId,
        modifierListData: { name: modifierListName, selectionType, modifiers }
      } = modifierList.data

      const returnedModifiers = modifiers.map(modifier => {
        const {
          id: modifierId,
          modifierData: { name: modifierName, modifierListId, priceMoney }
        } = modifier

        return {
          dataSourceId: modifierId,
          parentListId: modifierListId,
          price: {
            amount: priceMoney ? priceMoney.amount : 0,
            currency: priceMoney ? priceMoney.currency : 'USD'
          },
          name: modifierName,
          dataSource: 'SQUARE',
          merchant: ''
        }
      })

      return {
        dataSourceId: parentListId,
        name: modifierListName,
        selectionType: selectionType,
        modifiers: returnedModifiers,
        minModifiers: modifierList.min,
        maxModifiers: modifierList.max
      }
    })
  }

  /**
   *
   * @param {string[]} orderIds array of orderIds to fetch
   * @returns POJO conforming to `OrderTC[]`
   */
  async batchOrderFetchParse (orderIds) {
    try {
      const {
        result: { orders }
      } = await this.squareClient.ordersApi.batchRetrieveOrders({
        orderIds: orderIds
      })

      return orders.map(SquareController.orderParse)
    } catch (error) {
      if (error instanceof ApiError) {
        throw new ApolloError(
          `Fetching orders ${JSON.stringify(
            orderIds
          )} from Square failed because ${JSON.stringify(error.result)}`
        )
      }

      throw new ApolloError(
        `Something went wrong when fetching orders ${JSON.stringify(
          orderIds
        )}. Reason is ${JSON.stringify(error)}`
      )
    }
  }

  /**
   * Fetches order by ID and parses it into
   * our GraphQL data format
   * @deprecated Use batch fetching instead
   * @param {string} orderId
   */
  async orderFetchAndParse (orderId) {
    try {
      const {
        result: { order }
      } = await this.squareClient.ordersApi.retrieveOrder(orderId)

      return SquareController.orderParse(order)
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
   * @param {import('square').Order} order
   */
  static orderParse (order) {
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
}

export default SquareController
