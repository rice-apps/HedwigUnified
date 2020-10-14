/** @jsx jsx */

import { css, jsx } from '@emotion/core'
import React, { useEffect, useState } from 'react'
import { gql, useQuery, useMutation, useApolloClient } from '@apollo/client'
import { useParams, useHistory } from 'react-router'
import logo from '../../../images/tealogo.png'
import './cart.scss'
import { centerCenter, row, column, endStart } from '../../../Styles/flex'
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
  let end = -1
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
  const [pickupTime, setPickupTime] = useState(null)
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
      tax: newSubtotal * 0.0825
    })
  }

  const getTotal = () => {
    const total = cart_menu.reduce(
      (total, current) => {
        return total + current.quantity
      }, 0
    )
    return parseInt(total)
  }

  useEffect(() => {
    updateTotal()
  }, [cart_menu])

  //	This is to make the page re-render so that updated state is shown when item
  //  is deleted.
  const [dummyDelete, setDummyDelete] = useState(0)

  if (loading) return <p>'Loading vendor's business hour ...'</p>
  if (error) return <p>`Error! ${error.message}`</p>
  console.log(moment('8:30 a.m.', 'H HH:mm a A'))
  console.log(data)
  const businessHour = data.getVendors.filter(
    e => e['name'] == 'Cohen House'
  )[0].hours[0]
  // const businessHour = {start: '8:30 a.m.', end:'11:00 p.m.'}
  let startHour1 = parseInt(businessHour.start[0].split(':')[0])
  let endHour1 = parseInt(businessHour.end[0].split(':')[0])
  let startHour2 = parseInt(businessHour.start[0].split(':')[1])
  let endHour2 = parseInt(businessHour.end[0].split(':')[1])
  if (businessHour.start[0].includes('p.m.')) {
    startHour1 += 12
  }
  if (businessHour.end[0].includes('p.m.')) {
    endHour1 += 12
  }
  if (businessHour.start[1].includes('p.m.')) {
    startHour2 += 12
  }
  if (businessHour.end[1].includes('p.m.')) {
    endHour2 += 12
  }
  const startMinute1 = parseInt(businessHour.start[0].split(':')[1].substring(0, 2))
  const endMinute1 = parseInt(businessHour.end[0].split(':')[1].substring(0, 2))

  const disabled = () =>
    moment().hour() > endHour1 ||
    (moment().hour() == endHour1 && moment().minute() >= endMinute1)
  return (
    <div className='float-cart'>
      <div className='float-cart__content'>
        <div className='float-cart__shelf-container'>
          <p className='cart-title'>My Cart {getTotal()>0 ? "("+getTotal().toString()+")":""}</p>
          <div css={[centerCenter, row]}>
            <img src={logo} className='logo' alt='Logo' />
            <div>
              <p className='vendor-title'>Cohen House</p>
            </div>
          </div>
          <p css={{ alignSelf: 'center' }}> Pickup Time:</p>
          <TimePicker
            disabled={disabled()}
            defaultValue={moment()}
            css={{ marginTop: '-10px', width: '200px', alignSelf: 'center' }}
            format='HH:mm'
            onChange={e => {
              if (e) {
                document.getElementsByClassName('buy-btn')[0].disabled = false
                setPickupTime({ hour: e.hour(), minute: e.minute() })
              }
            }}
            showNow={false}
            bordered={false}
            inputReadOnly={true}
            disabledHours={() => {
              return computeAvailableHours(startHour1, endHour1)
            }}
            disabledMinutes={hour => {
              return computeAvailableMinutes(
                hour,
                startHour1,
                startMinute1,
                endHour1,
                endMinute1
              )
            }}
          />
          {disabled() && (
            <p css={{ alignSelf: 'center', color: 'red' }}>
              {' '}
              No pickup time available today.{' '}
            </p>
          )}
          <hr className='breakline'/>
          {cartItems().map(item => {
            return (
              <React.Fragment>
                <CartProduct
                  product={item}
                  forceUpdate={setDummyDelete}
                  updateTotal={updateTotal}
                />
                <hr className='breakline'/>
              </React.Fragment>
            )
          })}
        </div>

        <div className='float-bill'>
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
          </div>
        </div>

        <div className='float-cart__footer'>
          <button
            disabled={cartItems().length == 0 || pickupTime == null}
            className='buy-btn'
            title={'Confirm'}
            onClick={handleConfirmClick}
          >
            Next: Payment
            <div>
            </div>
          </button>
        </div>
      </div>
    </div>
  )
}

export default CartDetail
