import { ItemTC } from '../schema/index.js'
import pubsub from '../../utils/pubsub.js'
import getSquare from '../../utils/square.js'

ItemTC.addResolver({
  name: 'getCatalog',
  args: {
    vendor: 'String!'
  },
  type: [ItemTC],
  resolve: async ({ args }) => {
    const { vendor } = args

    const squareController = getSquare(vendor)

    return squareController.getCatalog()
  }
}).addResolver({
  name: 'getItem',
  args: {
    vendor: 'String!',
    dataSourceId: ItemTC.getFieldTC('dataSourceId')
      .getTypeNonNull()
      .getType()
  },
  type: ItemTC,
  resolve: async ({ args }) => {
    const { vendor, dataSourceId } = args

    const squareController = getSquare(vendor)

    return squareController.getItem(dataSourceId)
  }
})

const ItemQueries = {
  getCatalog: ItemTC.getResolver('getCatalog'),
  getItem: ItemTC.getResolver('getItem')
}

const ItemMutations = {}

const ItemSubscriptions = {
  availabilityChanged: {
    type: ItemTC,

    subscribe: () => pubsub.asyncIterator('availabilityChanged')
  }
}

export { ItemQueries, ItemMutations, ItemSubscriptions }
