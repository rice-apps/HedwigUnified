import { useQuery, gql } from '@apollo/client'
import { useHistory, useLocation } from 'react-router'

import withStyles from '@material-ui/core/styles/withStyles'
import './vendor.css'
import '../../../fonts/style.css'

// fontawesome imports

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser } from '@fortawesome/free-solid-svg-icons'
import { PickupDropdown } from '../../../components/PickupDropdown'
import { VENDOR_QUERY, GET_ALL_VENDORS } from '../../../graphql/VendorQueries'
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

function VendorList ({ classes }) {
  const { data, loading, error } = useQuery(GET_ALL_VENDORS)

  if (error) return <p>{error.message}</p>
  if (loading) return <p>Loading...</p>
  if (!data) return <p>No data...</p>

  const { getVendors } = data

  return (
    <>
    <ProfilePane />
      <div
        style={{ paddingTop: '8vh', paddingBottom: '10vh' }}
        className='vendorPage'
      >
        <BuyerHeader
          style={{
            
          }}
        />
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
