import { useQuery } from '@apollo/client'

import './vendor.css'
import '../../../fonts/style.css'

// fontawesome imports

import { GET_ALL_VENDORS } from '../../../graphql/VendorQueries'
import VendorCard from './VendorCard'
import BuyerHeader from './BuyerHeader.js'
import BottomAppBar from './BottomAppBar'
import ProfilePane from './ProfilePane.js'
import { SmallLoadingPage } from './../../../components/LoadingComponents'

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

function VendorList ({ updateLogin }) {
  const { data, loading, error } = useQuery(GET_ALL_VENDORS)

  if (error) return <p>{error.message}</p>
  if (loading) return <SmallLoadingPage />
  if (!data) return <p>No data...</p>

  const { getVendors } = data
  const localUser = JSON.parse(localStorage.getItem('userProfile'))
  console.log('LOCAL USER BEFORE', localUser)
  // Object.assign(localUser, {name: "Test"})
  // console.log("LOCAL USER AFTER", localUser)

  return (
    <>
      <ProfilePane updateLogin={updateLogin} />
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
