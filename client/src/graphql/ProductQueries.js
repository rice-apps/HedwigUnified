import React, { Fragment } from 'react'
import { useQuery, gql } from '@apollo/client'

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
      variants {
        price {
          amount
          currency
        }
        name
        description
        image
      }
      modifierLists {
        name
        selectionType
        modifiers {
          price {
            amount
            currency
          }
          name
          description
          image
        }
      }
      isAvailable
    }
  }
`

export { GET_CATALOG, GET_ITEM }
