import { Fragment } from 'react'
import { useQuery, gql } from '@apollo/client'

import { VENDOR_QUERY, GET_ALL_VENDORS } from '../../../graphql/VendorQueries'

const PRODUCTS_QUERY = gql`
  query Products($vendorID: MongoID!) {
    productMany(filter: { vendor: $vendorID }) {
      name
      description
      type
      category
      price
    }
  }
`

const ADD_VENDOR_HOURS = gql`
  mutation AddHourSet(
    $id: ID!
    $start: Int!
    $end: Int!
    $day: EnumVendorsHoursDay
  ) {
    vendorAddHourSet(id: $id, start: $start, end: $end, day: $day) {
      name
      hours {
        start
        end
        day
      }
    }
  }
`

const REMOVE_VENDOR_HOURS = gql`
  mutation RemoveHourSet(
    $id: ID!
    $start: Int!
    $end: Int!
    $day: EnumVendorsHoursDay
  ) {
    vendorRemoveHourSet(id: $id, start: $start, end: $end, day: $day) {
      name
      hours {
        start
        end
        day
      }
    }
  }
`

const VendorSettings = () => {
  const vendorID = '5ebcc4a6a55cea938d503174'
  const { loading, error, data } = useQuery(VENDOR_QUERY)
  // const { loading, error, data } = useQuery(PRODUCTS_QUERY);

  if (loading) return <p>Loading...</p>
  if (error) return <p>Error :(</p>
  if (!data) return <p>No Data...</p>

  console.log(data)

  return (
    <>
      Vendor: {data.vendorOne.name}
      <h3>Product List</h3>
    </>
  )
}

export default VendorSettings
