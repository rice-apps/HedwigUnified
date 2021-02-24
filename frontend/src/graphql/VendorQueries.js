import gql from 'graphql-tag.macro'

const VENDOR_QUERY = gql`
  query getVendorInfo($vendor: String!) {
    getVendor(filter: { name: $vendor }) {
      name
      availableItems
      slug
      logoUrl
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
      facebook
      phone
      cutoffTime
      pickupInstruction
      email
    }
  }
`

export { VENDOR_QUERY, GET_ALL_VENDORS }
