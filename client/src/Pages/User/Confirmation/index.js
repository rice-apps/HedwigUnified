import React, { useState } from 'react'
import { useQuery, gql } from '@apollo/client'
import { useHistory, useLocation } from 'react-router'
import './confirmation.css'
// import '../../fonts/style.css'
//fontawesome imports
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMapPin } from '@fortawesome/free-solid-svg-icons'
import { useNavigate } from 'react-router-dom'
import { ReactComponent as FailureSVG } from './alert-circle.svg'
import { ReactComponent as ConfirmationSVG } from './check-circle.svg'
import { cartItems } from '../../../apollo'

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
  const [availability, setAvailability] = useState(true)

  const vendor = {
    name: 'East West Tea',
    message:
      '“When your order is ready, wait in the tables in Sammy’s, and we will bring your order out to you”',
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
  // let vendorId = '5ecf473e41ccf22523280c3c'
  // let dataSourceIdTest = 'WCCTHDOMDN564YCZYPJP5DF3'
  const GET_CATALOG = gql`
    query GET_CATALOG($vendorName: String!) {
      getCatalog(vendor: $vendorName, dataSource: SQUARE) {
        dataSourceId
        variants {
          dataSourceId
        }
        isAvailable
      }
    }
  `

  const ewteaName = 'East West Tea'
  const {
    data: catalog,
    loading: catalogLoading,
    error: catalogError
  } = useQuery(GET_CATALOG, { variables: { vendorName: ewteaName } })

  if (catalogLoading) {
    return <p>loading...</p>
  }
  if (catalogError) {
    return <p>Error.</p>
  }
  console.log(catalog)
  // const FETCH_AVAILABILITY = gql`
  //   query FETCH_AVAILśBILITY($productId: String!){
  //     getAvailability(productId: $productId)
  //   }
  // `;

  // const { data: availability, loading, error } = useQuery(FETCH_AVAILABILITY, { variables: { productId: /*catalog.dataSourceId*/dataSourceIdTest } });
  // console.log(availability)
  const cartIds = cartItems().map(item => item.Id)
  catalog.getCatalog.forEach(element => {
    // if not, order not confirmed page
    if (cartIds.includes(element.dataSourceId)) {
      if (element.isAvailable !== true) {
        setAvailability(false)
      }
    }
    element.variants.forEach(variant => {
      if (cartIds.includes(variant.dataSourceId)) {
        if (element.isAvailable !== true) {
          setAvailability(false)
        }
      }
    })
  })

  cartItems().map(item => console.log(item))
  console.log(cartItems())
  // how do we get the current item in cart?
  // right now we hard coded vendor id and item
  function renderFailure() {
    return (
      <div className='mainDiv'>
        <FailureSVG className='checkSvg' />
        <div>
          <p className='orderConfirmed'>Order Failed</p>
          <p className='statusUpdate'>
            Please go back to your cart and make adjustments. Your order will{' '}
            <strong>not</strong> be placed at this time
          </p>
        </div>
        <div className='buttonsContainer'>
          <button className='bottomButton' onClick={handleCartClick}>
            View Cart
          </button>
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
          <p className='statusUpdate'>
            You will receive order status updates via <strong>text.</strong>
          </p>
        </div>
        <div className='vendorCard'>
          <FontAwesomeIcon icon={faMapPin} className='pinIcon' />
          <p className='vendorHeader'>{vendor.name}</p>
          <p className='vendorHeader'>Pick Up Instruction:</p>
          <p className='pickupInstructions'>{vendor.message}</p>
        </div>

        <div className='buttonsContainer'>
          <button className='bottomButton' onClick={handleMenuClick}>
            Main Menu
          </button>
          <button className='bottomButton' onClick={handleOrdersClick}>
            View Orders
          </button>
        </div>
      </div>
    )
  }
  if (catalogLoading) return <p>Loading...</p>
  return <div>{availability ? renderConfirmation() : renderFailure()}</div>
}

export default Confirmation
