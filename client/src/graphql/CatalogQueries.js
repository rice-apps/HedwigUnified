import React, { Fragment } from 'react'
import { useQuery, gql } from '@apollo/client'

const GET_CATALOG = gql`
  query GET_CATALOG($vendor : String!) {
    getCatalog(dataSource: SQUARE, vendor: $vendor){
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

export {
  GET_CATALOG
}
