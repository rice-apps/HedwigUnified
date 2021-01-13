import { useQuery } from '@apollo/client'

import './vendor.css'
import '../../../fonts/style.css'

// fontawesome imports

import { GET_VENDORS } from '../../../graphql/VendorQueries'
import VendorCard from './VendorCard'
import BuyerHeader from './BuyerHeader.js'
import BottomAppBar from './BottomAppBar'
import ProfilePane from './ProfilePane.js'

// const GET_VENDORS_QUERY = gql`
//     query VendorList {
//         vendorMany {
//             _id
//             name
//             slug
//             type
//             phone
//             locations {
//                 name
//             }
//             imageURL
//         }
//     }
// `

// query GET_VENDOR($name: String!) {
//   getVendor(filter: { name: $name }) {
//     name
//     logoUrl
//     website
//     email
//     facebook
//     phone
//     cutoffTime
//     pickupInstruction
//   }
// }

function VendorList ({}) {
  const { data, loading, error } = useQuery(GET_VENDORS)
  

  if (error) return <p>{error.message}</p>
  if (loading) return <p>Loading...</p>
  if (!data) return <p>No data...</p>

  const { getVendors } = data
  let localUser =JSON.parse(localStorage.getItem('userProfile'))
  console.log("LOCAL USER BEFORE", localUser)
  // Object.assign(localUser, {name: "Test"})
  // console.log("LOCAL USER AFTER", localUser)
  return (
    <>
      <ProfilePane />
      <div
        style={{ paddingTop: '10vh', paddingBottom: '10vh' }}
        className='vendorPage'
      >
        <BuyerHeader style={{}} />
        <div>
          {getVendors.map(vendor => {
            return <VendorCard key={vendor.name} vendor={vendor} />
          })}
        </div>
        <div>
          <BottomAppBar />
        </div>
      </div>
    </>
  )
}

export default VendorList
