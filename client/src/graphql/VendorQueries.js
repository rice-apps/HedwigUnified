import { gql } from '@apollo/client'

const VENDOR_QUERY = gql`
  query getVendorInfo($vendor: String!) {
    getVendor(filter: { name: $vendor }) {
      name
      hours {
        start
        end
        day
        isClosed
      }
      squareInfo {
        merchantId
        locationIds
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

const GET_VENDORS = gql`
 query GET_VENDORS{
  getVendors{
    name
    logoUrl
    website
    email
    hours{
      start
      end
      day
    }
    facebook
    phone
    cutoffTime
    pickupInstruction
  }
}
`

export { VENDOR_QUERY, GET_ALL_VENDORS, GET_VENDORS }
