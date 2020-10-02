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
import { ReactComponent as FailureSVG } from './alert-circle.svg';
import { ReactComponent as ConfirmationSVG } from './check-circle.svg';
// const GET_VENDORS_QUERY = gql`
//     query VendorList {
//         vendorMany {
//             _id
//             name
//         }
//     }
// `

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
  const handleCartClick = () => {
    return navigate(`/eat/${vendor.slug}/cart`)
  }
  // if (error) return <p>Error...</p>
  // if (loading) return <p>Loading...</p>
  // if (!data) return <p>No data...</p>
  let vendorId = '5ecf473e41ccf22523280c3c'
  let dataSourceIdTest = 'WCCTHDOMDN564YCZYPJP5DF3'

  // const GET_CATALOG = gql`
  //   query GET_CATALOG($item: String!){
  //     getCatalog(dataSource: SQUARE, vendor: $item){
  //       name
  //       dataSourceId
  //       isAvailable
  //     }
  //   }
  // `;

  // const { data: catalog, loading: catalogLoading, error: catalogError } = useQuery(GET_CATALOG, { variables: { item: vendorId } });

  const FETCH_AVAILABILITY = gql`
    query FETCH_AVAILABILITY($productId: String!){
      getAvailability(productId: $productId)
    }
  `;

  const { data: availability, loading, error } = useQuery(FETCH_AVAILABILITY, { variables: { venID: /*catalog.dataSourceId*/dataSourceIdTest } });

  // how do we get the current item in cart? 
  // right now we hard coded vendor id and item
  // also availability is undefined
  function renderFailure() {
    return (
      <div className='mainDiv'>
        <FailureSVG className='checkSvg' />
        <div>
          <p className='orderConfirmed'>Order Failed</p>
          <p className='statusUpdate'>Please go back to your cart and make adjustments. Your order will <strong>not</strong> be placed at this time</p>
        </div>
        <div className='buttonsContainer'>
          <button className='bottomButton' onClick={handleCartClick}>View Cart</button>
        </div>
      </div>
    )
  }
  function renderConfirmation() {

    return (
      <div className='mainDiv'>
        <ConfirmationSVG className='checkSvg' />
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

  return (
    <div>

      {(availability === false) ? renderConfirmation() : renderFailure()}

    </div>
  )
}

export default Confirmation
