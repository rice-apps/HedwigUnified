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
  query GET_ITEM($dataSourceId: String!, $vendor: String!) {
    getItem(dataSource: SQUARE, dataSourceId: $dataSourceId, vendor: $vendor) {
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
        minModifiers
        maxModifiers
      }
      isAvailable
    }
  }
`

const GET_ITEM_AVAILABILITY = gql`
  query GET_ITEM_AVAILABILITY($productId: String!, $vendor: String!) {
    getAvailability(productId: $productId, vendor: $vendor)
  }
`

const SET_ITEM_AVAILABILITY = gql`
  mutation SET_ITEM_AVAILABILITY(
    $vendor: String!
    $productId: String!
    $isItemAvailable: Boolean!
  ) {
    setAvailability(
      vendor: $vendor
      productId: $productId
      isItemAvailable: $isItemAvailable
      dataSource: SQUARE
    ) {
      isAvailable
    }
  }
`

const GET_MODIFIER_LISTS = gql`
  query GET_MODIFIER_LISTS($vendor: String!) {
    getModifierLists(dataSource: SQUARE, vendor: $vendor) {
      dataSourceId
      name
      selectionType
      modifiers {
        dataSourceId
        parentListId
        price {
          amount
          currency
        }
        name
        description
        dataSource
        merchant
        image
      }
      minModifiers
      maxModifiers
    }
  }
`

export { GET_CATALOG, GET_ITEM, GET_ITEM_AVAILABILITY, SET_ITEM_AVAILABILITY, GET_MODIFIER_LISTS }
