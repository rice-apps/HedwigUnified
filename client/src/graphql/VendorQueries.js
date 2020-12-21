import { Fragment } from 'react'
import { useQuery, gql } from '@apollo/client'

const VENDOR_QUERY = gql`
  query getVendorInfo($vendor: String!) {
    getVendor(filter: { name: $vendor }) {
      name
      hours {
        start
        end
        day
        isClosed
<<<<<<< HEAD
=======
      }
      squareInfo {
        merchantId
        locationIds
>>>>>>> master
      }
    }
  }
`

const GET_ALL_VENDORS = gql`
  query getVendorsInfo {
    getVendors {
      name
      slug
      phone
      logoUrl
      squareInfo {
        merchantId
        locationIds
        loyaltyId
      }
      hours {
        start
        end
        day
        isClosed
      }
      _id
    }
  }
`

export { VENDOR_QUERY, GET_ALL_VENDORS }
