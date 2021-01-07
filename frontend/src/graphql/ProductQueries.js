import gql from 'graphql-tag.macro'

const GET_CATALOG = gql`
  query GET_CATALOG($vendor: String!) {
    getCatalog(dataSource: SQUARE, vendor: $vendor) {
      name
      image
      dataSourceId
      isAvailable
      category
      variants {
        name
        dataSourceId
        price {
          amount
          currency
        }
      }
    }
  }
`

const GET_ITEM = gql`
  query GET_ITEM($dataSourceId: String!) {
    getItem(dataSource: SQUARE, dataSourceId: $dataSourceId) {
      name
      description
      dataSourceId
      image
      variants {
        price {
          amount
          currency
        }
        name
        description
        image
        dataSourceId
        parentItemId
      }
      modifierLists {
        name
        selectionType
        dataSourceId
        modifiers {
          price {
            amount
            currency
          }
          dataSourceId
          parentListId
          name
          description
          image
        }
      }
      isAvailable
    }
  }
`

const GET_ITEM_AVAILABILITY = gql`
  query GET_ITEM_AVAILABILITY($productId: String!) {
    getAvailability(productId: $productId)
  }
`

const SET_ITEM_AVAILABILITY = gql`
  mutation SET_ITEM_AVAILABILITY(
    $productId: String!
    $isItemAvailable: Boolean!
  ) {
    setAvailability(
      productId: $productId
      isItemAvailable: $isItemAvailable
      dataSource: SQUARE
    ) {
      isAvailable
    }
  }
`

export { GET_CATALOG, GET_ITEM, GET_ITEM_AVAILABILITY, SET_ITEM_AVAILABILITY }