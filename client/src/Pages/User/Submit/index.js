import { css, jsx } from '@emotion/react'
import { useEffect, useState } from 'react'
import { gql, useQuery, useMutation, useApolloClient } from '@apollo/client'
import { useParams, useHistory } from 'react-router'
import logo from '../../../images/tealogo.png'
import '../Cart/cart.scss'
import { centerCenter, row, column, endStart } from '../../../Styles/flex'
import currency from 'currency.js'
import { cartItems, orderSummary, userProfile } from '../../../apollo'
import dispatch from '../Products/FunctionalCart'
import moment from 'moment'
import { useNavigate } from 'react-router-dom'
import CartItem from './CartItem'

<<<<<<< HEAD
function Submit () {
  const navigate = useNavigate()
  const [totals, setTotals] = useState({})
  const cart_menu = cartItems()
  const pickupTime = orderSummary().time

  const handleSubmitClick = () => {
    return navigate('/eat/cohen/confirmation')
=======
const CREATE_ORDER = gql`mutation {
  createOrder(
    locationId: "FMXAFFWJR95WC"
    record: {
      studentId: "S01278961"
      idempotencyKey: "ABCDe"
      lineItems: [
        {
          catalog_object_id: "MCYMC2QEPJG4D3U46TM4RIOS"
          quantity: "2"
          modifiers: [
            { catalog_object_id: "5FV6ICILLCCVYZPCDG3FV6YJ" }
            { catalog_object_id: "O64CT2AHAS7RSDFHO6CRFMXC" }
          ]
        }
      ]
      recipient: {
        name: "Lorraine Lyu"
        phone: "1111111111"
        email: "111@rice.edu"
      }
      pickupTime: "2020-10-30T01:24:42.000Z"
    }
  ) {
    id
    total{
			amount
    }
    totalTax{
      amount
    }
    customer {
      name
    }
    items {
      name
      quantity
      modifiers {
        catalog_object_id
      }
    }
  }
}`
const sStorage = localStorage;
const getRecipient = () => {
  
  return {
    name: sStorage.getItem('first name') + ' ' + sStorage.getItem('last name'),
    phone: sStorage.getItem('phone'),
    email: sStorage.getItem('email')
  }
}

const getLineItems = (items) => {
  let rtn = []
  let item = null;
  for (item of items) {
    let modifierList = []
    for (const [k, m] of Object.entries(item.modifierLists)) {
      modifierList.push({
        name: m.name,
        catalog_object_id: m.dataSourceId
      })
    }
    rtn = {
      modifierLists: modifierList,
      catalog_object_id: item.dataSourceId,
      quantity: item.quantity,
      variation_name: item.variant.name,
    }
  }
  return rtn
}

const createRecord = (items) => {
  return {
    studentId: sStorage.getItem('id'),
    idempotencyKey: "ABCDe",
    lineItems: getLineItems(items),
    recipient: getRecipient(),
    pickupTime: orderSummary().time.format()
  }
}

const createMutation = (items) => {
  return gql`mutation {
    createOrder(
      locationId: "FMXAFFWJR95WC"
      record: ${JSON.toString(createRecord(items))} ){
      id
      total{
        amount
      }
      totalTax{
        amount
      }
      customer {
        name
      }
      items {
        name
        quantity
        modifiers {
          catalog_object_id
        }
      }
    }
  }`
}

function Submit () {
  const navigate = useNavigate()
  const [totals, setTotals] = useState({})
  let cart_menu = cartItems()
  const pickupTime = orderSummary().time;
  const [createOrder, {loading, error, data},] = useMutation(cart_menu);
  // const user = userProfile();

  const handleSubmitClick = () => {
    const q = createMutation(cart_menu)
    createOrder(q)
    // The path is hard coded temporarily. 
    return navigate(`/eat/cohen/confirmation`)
>>>>>>> feature/submit-2
  }

  const calculateTotal = () => {
    const newSubtotal = cart_menu.reduce(
      (total, current) => total + current.price * current.quantity,
      0
    )
    setTotals({
      subtotal: newSubtotal,
      tax: newSubtotal * 0.0825
    })
  }

  useEffect(() => {
    calculateTotal()
  }, [cart_menu])


  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error.message}</p>;


  return (
    <div className='float-cart'>
      <div className='float-cart__content'>
        <div className='float-cart__shelf-container'>
          <div css={[centerCenter, row]}>
            <img src={logo} className='logo' alt='Logo' />
            <div>
              <p css={{ margin: '16px 0 0 10px' }}>Cohen House</p>
              <p css={{ margin: '0 0 0 10px', color: 'grey' }}>Houston, TX</p>
            </div>
          </div>
<<<<<<< HEAD
          <p css={{ alignSelf: 'center' }}>
            {' '}
            Pickup Time: {orderSummary().time.format()}
          </p>
=======
          <p css={{ alignSelf: 'center' }}> Pickup Time: {orderSummary().time.format()}</p>
>>>>>>> feature/submit-2
          {cartItems().map(item => {
            return <CartItem product={item} />
          })}
        </div>

        <div className='float-bill'>
          <h1 className='header'>Bill Details</h1>
          {Object.keys(totals).map(type => {
            if (totals[type]) {
              let formatted = currency(totals[type]).format()
              return (
                <div className='subtotal-container'>
                  <p className='subheader'>{type}</p>
                  <p>{formatted}</p>
                </div>
              )
            }
          })}
          <div className='total-container'>
            <hr className='breakline' />
            <div className='total'>
              <p className='total__header'>Total</p>
              <p>{currency(totals.subtotal + totals.tax).format()}</p>
            </div>
            <hr className='breakline' />
          </div>
        </div>

        <div className='float-cart__footer'>
          <button
            disabled={cartItems().length == 0 || pickupTime == null}
            className='buy-btn'
            title='Submit'
            onClick={handleSubmitClick}
          >
            submit
          </button>
        </div>
      </div>
    </div>
  )
}

export default Submit
