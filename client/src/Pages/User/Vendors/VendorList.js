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
import Profile from '../Profile'

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

  if (error) return <p>Error...</p>
  if (loading) return <p>Loading...</p>
  if (!data) return <p>No data...</p>

  const { getVendors } = data
  /*
  const vendors = [
    {
      name: 'East West Tea',
      hours: '7:00pm - 10:00pm',
      keywords: ['Boba Tea', 'Snacks', 'Vegan / Non-Dairy'],
      image:
        'https://images.squarespace-cdn.com/content/v1/58559451725e25a3d8206027/1486710333727-C3OXR7PA5G2YGEZHNK6R/ke17ZwdGBToddI8pDm48kCHChmuivJZ1Va5ov3ZJeg17gQa3H78H3Y0txjaiv_0fDoOvxcdMmMKkDsyUqMSsMWxHk725yiiHCCLfrh8O1z4YTzHvnKhyp6Da-NYroOW3ZGjoBKy3azqku80C789l0ouw-8l5B_J38LMU7OZFvYcSGirBhY_3j1yQtntvGS73bypqQ-qjSV5umPUlGbQFAw/DSC_0064.jpg?format=1500w',
      closed: false
    },
    {
      name: 'Coffeehouse',
      hours: '7:30am - 5:00pm',
      keywords: ['Coffee', 'Snacks', 'Decaf'],
      image:
        'https://lh5.googleusercontent.com/p/AF1QipNZ0aMBlyVAc6GXs1dVZTMOu6rn0I9G1ZBVJPJz',
      closed: true
    },
    {
      name: 'Grillosophy',
      hours: '7:00pm - 10:00pm',
      keywords: ['Hamburgers', 'Sandwiches', 'Milkshakes', 'Agua Fresca'],
      image:
        'https://images.unsplash.com/photo-1522244451342-a41bf8a13d73?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1650&q=80',
      closed: false
    }
  ]
  */

  return (

    <div
      style={{ paddingTop: '8vh', paddingBottom: '10vh' }}
      className='vendorPage'
    >
      <BuyerHeader />
      <div>
        {getVendors.map(vendor => {
          return <VendorCard key={vendor.name} vendor={vendor} />
        })}
      </div>
      <div>
        <BottomAppBar />
      </div>
    </div>
  )
}

export default VendorList
