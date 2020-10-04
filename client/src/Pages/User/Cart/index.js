/** @jsx jsx */

import { css, jsx } from '@emotion/core'
import React, { useEffect, useState } from 'react'
import { gql, useQuery, useMutation, useApolloClient } from '@apollo/client'
import { useParams, useHistory } from 'react-router'
import logo from '../../../images/tealogo.png'
import './cart.scss'
import { centerCenter, row, column } from '../../../Styles/flex'
import CartProduct from './CartProducts'
import Payments from './Payments.js'
import currency from 'currency.js'
import { cartItems } from '../../../apollo'
import dispatch from '../Products/FunctionalCart'
import Select from 'react-select'
import { TimePicker } from 'antd'
import moment from 'moment'
import { useNavigate } from 'react-router-dom'

const defaultTotals = {
  subtotal: 0,
  tax: 0,
  discount: null
}

const GET_VENDOR = gql`
  query {
    getVendors {
      name
      hours {
        day
        start
        end
      }
      squareInfo {
        merchantId
        locationIds
      }
    }
  }
`

const computeAvailableHours = (startHour, endHour) => {
  const hour = moment().hour()
  let i = 0
  let rtn = []
  while (i < 24) {
    if (i < startHour || i < hour || i > endHour) {
      rtn.push(i)
      i += 1
      continue
    }
    i += 1
  }
  return rtn
}

const computeAvailableMinutes = (
  hr,
  startHour,
  startMinute,
  endHour,
  endMinute
) => {
  const hour = moment().hour()
  const minute = moment().minute()
  let start = 0
  let end = 0
  if (hr == startHour) {
    if (hr == hour) {
      end = Math.max(minute, startMinute)
    } else {
      end = startMinute
    }
  } else if (hr == endHour) {
    start = endMinute
    end = 59
  } else if (hr == hour) {
    end = minute
  }
  let i = start
  let rtn = []
  while (i <= end) {
    rtn.push(i)
    i += 1
  }
  return rtn
}

function CartDetail () {
  const [totals, setTotals] = useState(defaultTotals)
  const [pickupTime, setPickupTime] = useState({})
  const { loading, error, data } = useQuery(GET_VENDOR)
  const navigate = useNavigate()
  let cart_menu = cartItems()

  const handleConfirmClick = () => {
    return navigate(`/eat/ewtea/payment`)
  }

  const updateTotal = () => {
    let newSubtotal = cart_menu.reduce(
      (total, current) => total + current.price * current.quantity,
      0
    )
    setTotals({
      subtotal: newSubtotal,
      tax: newSubtotal * 0.05
    })
  }

  useEffect(() => {
    updateTotal()
  }, [cart_menu])

  //	This is to make the page re-render so that updated state is shown when item
  //  is deleted.
  const [dummyDelete, setDummyDelete] = useState(0)
  
  if (loading) return <p>'Loading vendor's business hour ...'</p>
  if (error) return <p>`Error! ${error.message}`</p>

  const businessHour = data.getVendors.filter(
    e => e['name'] == 'Coffeehouse'
  )[0].hours[0]
  const startHour = parseInt(businessHour.start.split(':')[0])
  const endHour = parseInt(businessHour.end.split(':')[0])
  const startMinute = parseInt(businessHour.start.split(':')[1].substring(0, 2))
  const endMinute = parseInt(businessHour.end.split(':')[1].substring(0, 2))
  if (businessHour.start.includes('p.m.')) {
    startHour += 12
  }
  if (businessHour.end.includes('p.m.')) {
    endHour += 12
  }

  return (
    <div className='float-cart'>
      <div className='float-cart__content'>
        <div className='float-cart__shelf-container'>
          <div css={[centerCenter, row]}>
            <img src={logo} className='logo' alt='Logo' />
            <div>
              <p css={{ margin: '16px 0 0 10px' }}>East West Tea</p>
              <p css={{ margin: '0 0 0 10px', color: 'grey' }}>Houston, TX</p>
            </div>
          </div>
          <p css={{ alignSelf: 'center' }}> Pickup Time:</p>
          <TimePicker
            defaultOpenValue={moment('11:11', 'HH:mm')}
            css={{ marginTop: '-10px', width: '200px', alignSelf: 'center' }}
            format='HH:mm'
            onChange={e => {
              if (e != null) {
                document.getElementsByClassName('buy-btn')[0].disabled = false
                setPickupTime({ hour: e.hour(), minute: e.minute() })
              }
            }}
            bordered={false}
            disabledHours={() => {
              return computeAvailableHours(startHour, endHour)
            }}
            disabledMinutes={hour => {
              return computeAvailableMinutes(
                hour,
                startHour,
                startMinute,
                endHour,
                endMinute
              )
            }}
          />
          {cartItems().map(item => {
            return <CartProduct product={item} deleteItem={setDummyDelete} updateTotal={updateTotal}/>
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
          <div
            className='buy-btn'
            title={'Confirm'}
            onClick={handleConfirmClick}
          >
            Make Payment
          </div>
        </div>
      </div>
    </div>
  )
}

export default CartDetail
