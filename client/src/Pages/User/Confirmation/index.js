import React, {
  ToolBar,
  Container,
  Fragment,
  useContext,
  useEffect
} from 'react'
import { useQuery, gql } from '@apollo/client'
import { useHistory, useLocation } from 'react-router'
import {
  AppBar,
  Grid,
  Toolbar,
  BottomNavigation,
  Divider
} from '@material-ui/core'
import withStyles from '@material-ui/core/styles/withStyles'
import './confirmation.css'
// import '../../fonts/style.css'
//fontawesome imports

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faDoorOpen,
  faDoorClosed,
  faShoppingCart,
  faReceipt,
  faMapPin
} from '@fortawesome/free-solid-svg-icons'
import { PickupDropdown } from '../../../components/PickupDropdown'

import { useNavigate } from 'react-router-dom'
import {ReactComponent as ReactLogo} from './check-circle.svg';
// const GET_VENDORS_QUERY = gql`
//     query VendorList {
//         vendorMany {
//             _id
//             name
//         }
//     }
// `

const VendorCard = ({ vendor }) => {
  const { name, hours, keywords, image, closed } = vendor
  const navigate = useNavigate()

  const handleClick = () => {
    // Go to this particular vendor's detail page
    return navigate(`/eat/${vendor.slug}`)
  }

  return (
    <Fragment>
      <div className='vendorContainer' onClick={() => handleClick()}>
        <div className='vendorHeading'>
          <div className='vendorHeadingText'>
            <h3 class='vendorName'>{name}</h3>
            <p>Hours: {hours} </p>
          </div>
          <div className='vendorHoursIcon'>
            {closed ? (
              <FontAwesomeIcon className='door' icon={faDoorClosed} />
            ) : (
              <FontAwesomeIcon className='door' icon={faDoorOpen} />
            )}
          </div>
        </div>
        <div className='vendorImageContainer'>
          {/* {closed ? <span><p className="closedText">Closed</p></span>: null} */}
          <img
            className={closed ? `vendorImage closed` : `vendorImage`}
            src={image}
          />
        </div>
        <p className='vendorKeywords'>{keywords.join(', ')}</p>
      </div>
      {/* <div style={{ backgroundImage: `url(${vendor.imageURL})` }} className="vendorcard" onClick={handleClick}>
        </div> */}
      {/* <div>
            <ul>
                <li>Food</li>
                <li>Drink</li>
                <li>Snacks</li>
                <li>Coffee</li>
            </ul>
        </div> */}
    </Fragment>
  )
}

class HeaderExclusion extends React.Component {
  screenOptions = {
    headerShown: false
    // const history = useHistory();
  }
}

const BottomAppBar = ({}) => {
  return (
    <AppBar position='sticky' color='white'>
      <BottomNavigation className='stickToBottom'>
        <Grid container>
          <Toolbar className='bottomBar'>
            <div>
              <FontAwesomeIcon
                className='barIconCart'
                icon={faShoppingCart}
                flexItem
              />
              <p class='iconText'>Cart</p>
            </div>
            <Divider orientation='vertical' flexItem />
            <div>
              <FontAwesomeIcon
                className='barIconReceipt'
                icon={faReceipt}
                flexItem
              />
              <p class='iconText'>Orders</p>
            </div>
          </Toolbar>
        </Grid>
      </BottomNavigation>
    </AppBar>
  )
}

const Confirmation = ({ classes }) => {
  // const { data, loading, error } = useQuery(GET_VENDORS_QUERY)
  const vendor = {
      name: 'East West Tea',
      message: '“When your order is ready, wait in the tables in Sammy’s, and we will bring your order out to you”',
      slug: 'ewtea'
    }
  const navigate = useNavigate()
  const handleMenuClick = () => {
    return navigate(`/eat/${vendor.slug}`)
  }
  const handleOrdersClick = () => {
    return navigate(`/eat/orders`)
  }
  // if (error) return <p>Error...</p>
  // if (loading) return <p>Loading...</p>
  // if (!data) return <p>No data...</p>

  return (
  <div className='mainDiv'>
    <ReactLogo className='checkSvg'/>
    <div>
      <p className='orderConfirmed'>Order Confirmed!</p>
      <p className='statusUpdate'>You will receive order status updates via <strong>text.</strong></p>
    </div>
    <div className='vendorCard'>
      <FontAwesomeIcon icon={faMapPin} className='pinIcon' />
      <p className='vendorHeader'>{vendor.name}</p>
      <p className='vendorHeader'>Pick Up Instruction:</p>
      <p className='pickupInstructions'>{vendor.message}</p>
    </div>

    <div className='buttonsContainer'>
      <button className='bottomButton' onClick={handleMenuClick}>Main Menu</button>
      <button className='bottomButton' onClick={handleOrdersClick}>View Orders</button>
    </div>
  </div>
  )
}

export default Confirmation
