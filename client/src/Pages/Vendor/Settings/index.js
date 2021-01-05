import { useQuery, gql } from '@apollo/client'

import { VENDOR_QUERY } from '../../../graphql/VendorQueries'

const VendorSettings = () => {
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
