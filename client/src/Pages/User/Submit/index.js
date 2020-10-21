/** @jsx jsx */

import { css, jsx } from '@emotion/core'
import React, { useEffect, useState } from 'react'
import { gql, useQuery, useMutation, useApolloClient } from '@apollo/client'
import { useParams, useHistory } from 'react-router'
import logo from '../../../images/tealogo.png'
import { centerCenter, row, column, endStart } from '../../../Styles/flex'
import currency from 'currency.js'
import { cartItems, orderSummary, userProfile} from '../../../apollo'
import dispatch from '../Products/FunctionalCart'
import moment from 'moment'
import { useNavigate } from 'react-router-dom'
import CartItem from './CartItem'
import { v4 as uuidv4 } from 'uuid';

const CREATE_ORDER = gql`mutation ($studentId: String!, $name: String!,
  $phone: String!, $email: String!, $time:String!, $key: String!,
  $lineItems: [LineItemInput]!
  ){
  createOrder(
    locationId: "FMXAFFWJR95WC"
    record: {
      studentId: $studentId
      idempotencyKey: $key
      lineItems: $lineItems
      recipient: {
        name: $name
        phone: $phone
        email: $email
      }
      pickupTime: $time
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
  for (const [v, item] of Object.entries(items)) {
    let modifierList = []
    for (const [k, m] of Object.entries(item.modifierLists)) {
      modifierList.push({
        catalog_object_id: m.dataSourceId
      })
    }
    let i = {
      modifiers: modifierList,
      catalog_object_id: item.variant.dataSourceId,
      quantity: item.quantity.toString(),
      // variation_name: item.variant.name,
    }
    rtn.push(i);
  }
  return rtn
}

const createRecord = (items) => {
  const recipient =  getRecipient()
  return {
    studentId: sStorage.getItem('id'),
    key: uuidv4(),
    lineItems: getLineItems(items),
    name: recipient.name,
    phone: recipient.phone,
    email:recipient.email,
    time: orderSummary().time.format()
  }
}


function Submit () {
  const navigate = useNavigate()
  const [totals, setTotals] = useState({})
  let cart_menu = cartItems()
  const pickupTime = orderSummary().time;
  const [createOrder, {loading, error, data},] = useMutation(CREATE_ORDER);
  // const user = userProfile();

  const handleSubmitClick = () => {
    const q = {
      variables: createRecord(cart_menu)
    }
    console.log(q)
    createOrder(q)
    // The path is hard coded temporarily. 
    return navigate(`/eat/cohen/confirmation`)
  }

  const calculateTotal = () => {
    let newSubtotal = cart_menu.reduce(
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
if (error) {console.log(error); return <p>error</p>};


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
          <p css={{ alignSelf: 'center' }}> Pickup Time: {orderSummary().time.format()}</p>
          {cartItems().map(item => {
            return (
              <CartItem
                product={item}
              />
            )
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
            title={'Submit'}
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
