import { DataSourceEnumTC, ItemTC } from '../schema/index.js'
import pubsub from '../../utils/pubsub.js'
import getSquare from '../../utils/square.js'

ItemTC.addResolver({
  name: 'getCatalog',
  args: {
    vendor: 'String!',
    dataSource: DataSourceEnumTC
  },
  type: [ItemTC],
  resolve: async ({ args }) => {
    const { vendor } = args

    const squareController = getSquare(vendor)

    return squareController.getCatalog()
  }
})
  .addResolver({
    name: 'getItem',
    args: {
      vendor: 'String!',
      dataSource: DataSourceEnumTC,
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
  .addResolver({
    name: 'getAvailability',
    args: {
      vendor: 'String!',
      productId: 'String!'
    },
    type: 'Boolean',
    resolve: async ({ args }) => {
      const { vendor, productId } = args

      const squareController = getSquare(vendor)

      return squareController.getAvailability([productId])
    }
  })
  .addResolver({
    name: 'getAvailabilities',
    args: {
      vendor: 'String!',
      productIds: '[String!]'
    },
    type: 'Boolean',
    resolve: async ({ args }) => {
      const { vendor, productIds } = args

      const squareController = getSquare(vendor)

      return squareController.getAvailability([productIds])
    }
  })

const ItemQueries = {
  getCatalog: ItemTC.getResolver('getCatalog'),
  getItem: ItemTC.getResolver('getItem'),
  getAvailability: ItemTC.getResolver('getAvailability'),
  getAvailabilities: ItemTC.getResolver('getAvailabilities')
}

const ItemMutations = {}

const ItemSubscriptions = {
  availabilityChanged: {
    type: ItemTC,

    subscribe: () => pubsub.asyncIterator('availabilityChanged')
  }
}

export { ItemQueries, ItemMutations, ItemSubscriptions }
