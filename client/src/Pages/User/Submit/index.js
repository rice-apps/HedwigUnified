/** @jsx jsx */

import { css, jsx } from '@emotion/core'
import React, { useEffect, useState } from 'react'
import { gql, useQuery, useMutation, useApolloClient } from '@apollo/client'
import { useParams, useHistory } from 'react-router'
import logo from '../../../images/tealogo.png'
import { centerCenter, row, column, endStart } from '../../../Styles/flex'
import currency from 'currency.js'
import { cartItems, orderSummary} from '../../../apollo'
import dispatch from '../Products/FunctionalCart'
import moment from 'moment'
import { useNavigate } from 'react-router-dom'
import CartItem from './CartItem'

const CREATE_ORDER = gql`mutation {
  createOrder(
    locationId: "FMXAFFWJR95WC"
    record: {
      studentId: "S01325598"
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
        name: "Newton Test"
        phone: "8324334741"
        email: "nth8@rice.edu"
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

const getRecipient = () => {
  return {
    name: 'Yun Lyu',
    phone: '4137689449',
    email: 'yl191@rice.edu'
  }
}

const getLineItems = (items) => {
  let rtn = []
  let item = null;
  for (item of items) {
    let modifierList = []
    let m = null;
    for (m of item.modifiers) {

    }
    console.log({
      id: item.Id,
      variation_name: item.variant.name,
    })
  }
}

function Submit () {
  const navigate = useNavigate()
  const [totals, setTotals] = useState({})
  let cart_menu = cartItems()
  console.log(cart_menu);
  const pickupTime = orderSummary().time;
  // const user = userProfile();

  const handleSubmitClick = () => {
    return navigate(`/eat/confirmation`)
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
          <p css={{ alignSelf: 'center' }}> Pickup Time: {}</p>
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
