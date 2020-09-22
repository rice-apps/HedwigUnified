import React, { Fragment } from 'react'
import { useQuery, gql } from '@apollo/client'


const VENDOR_QUERY = gql`
  {
    vendorOne(filter: { name: "East-West Tea" }) {
      _id
      name
      phone
      hours {
        start
        end
        day
      }
      locations {
        name
      }
      team {
        name
        netid
        phone
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
      squareInfo{
        merchantId
        locationIds
        loyaltyId
      }
      hours{
        start
        end
        day
      }
      _id
    }
  }
`

export {
    VENDOR_QUERY,
    GET_ALL_VENDORS
}
