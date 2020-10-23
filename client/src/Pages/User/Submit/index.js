/** @jsx jsx */

import { css, jsx } from '@emotion/core'
import React, { useEffect, useState } from 'react'
import { gql, useQuery, useMutation, useApolloClient } from '@apollo/client'
import { useParams, useHistory } from 'react-router'
import logo from '../../../images/tealogo.png'
import { centerCenter, row, column, endStart } from '../../../Styles/flex'
import currency from 'currency.js'
import { cartItems, orderSummary, userProfile } from '../../../apollo'
import dispatch from '../Products/FunctionalCart'
import moment from 'moment'
import { useNavigate } from 'react-router-dom'
import CartItem from './CartItem'
import { v4 as uuidv4 } from 'uuid'

const CREATE_ORDER = gql`
  mutation(
    $studentId: String!
    $name: String!
    $phone: String!
    $email: String!
    $time: String!
    $key: String!
    $lineItems: [LineItemInput]!
  ) {
    createOrder(
      locationId: "FMXAFFWJR95WC"
      record: {
        studentId: $studentId
        idempotencyKey: $key
        lineItems: $lineItems
        recipient: { name: $name, phone: $phone, email: $email }
        pickupTime: $time
      }
    ) {
      id
      total {
        amount
      }
      totalTax {
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
  }
`

const CREATE_PAYMENT = gql`
  mutation($orderId: String!, $subtotal: Int!, $currency: String!) {
    createPayment(
      record: {
        source: SQUARE
        sourceId: "cnon:card-nonce-ok"
        orderId: $orderId
        locationId: "FMXAFFWJR95WC"
        subtotal: { amount: $subtotal, currency: $currency }
      }
    ) {
      id
      total {
        amount
        currency
      }
    }
  }
`

const COMPLETE_PAYMENT = gql`mutation ($id: String!){
  completePayment(
    paymentId: $id
  ){
    id
    total {
      amount
      currency
    }
  }
}`

const sStorage = localStorage
const getRecipient = () => {
  return {
    name: sStorage.getItem('first name') + ' ' + sStorage.getItem('last name'),
    phone: sStorage.getItem('phone'),
    email: sStorage.getItem('email')
  }
}

const getLineItems = items => {
  let rtn = []
  let item = null
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
      quantity: item.quantity.toString()
      // variation_name: item.variant.name,
    }
    rtn.push(i)
  }
  return rtn
}

const createRecord = items => {
  const recipient = getRecipient()
  return {
    studentId: sStorage.getItem('id'),
    key: uuidv4(),
    lineItems: getLineItems(items),
    name: recipient.name,
    phone: recipient.phone,
    email: recipient.email,
    time: orderSummary().time.format()
  }
}

function Submit() {
  const navigate = useNavigate()
  const [totals, setTotals] = useState({})
  let cart_menu = cartItems()
  const pickupTime = orderSummary().time
  const [
    createOrder,
    { loading: order_loading, error: order_error, data: order_data }
  ] = useMutation(CREATE_ORDER)
  const [
    createPayment,
    { loading: payment_loading, error: payment_error, data: payment_data }
  ] = useMutation(CREATE_PAYMENT)
  const [
    completePayment,
    { loading: pay_loading, error: pay_error, data: pay_data }
  ] = useMutation(COMPLETE_PAYMENT)
  // const user = userProfile();

  const handleSubmitClick = async () => {
    const q = {
      variables: createRecord(cart_menu)
    }
    const orderResponse = await createOrder(q)
    const orderJson = orderResponse.data.createOrder
    const createPaymentResponse = await createPayment({
      variables: {
        orderId: orderJson.id,
        subtotal: totals.subtotal * 100,
        currency: 'USD'
      }
    })
    const paymentId = createPaymentResponse.data.createPayment.id
    completePayment({ variables: { id: paymentId } })
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

  if (order_loading) return <p>Loading...</p>
  if (order_error) {
    return <p>{order_error.message}</p>
  }
  if (payment_loading) return <p>Loading...</p>
  if (payment_error) {
    return <p>{payment_error.message}</p>
  }
  if (pay_loading) return <p>Loading...</p>
  if (pay_error) {
    return <p>{pay_error.message}</p>
  }

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
          <p css={{ alignSelf: 'center' }}>
            {' '}
            Pickup Time: {orderSummary().time.format()}
          </p>
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
