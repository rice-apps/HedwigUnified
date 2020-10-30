/** @jsx jsx */

import { css, jsx } from '@emotion/core'
import React, { useEffect, useState } from 'react'
import { gql, useQuery, useMutation, useApolloClient } from '@apollo/client'
import { useParams, useHistory } from 'react-router'
import logo from '../../../images/cohenhouse.png'
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
import BottomAppBar from './../Vendors/BottomAppBar.js'
import BuyerHeader from './../Vendors/BuyerHeader.js'

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

const parseStoreHour = (hours) => {
  const start1 = moment(hours.start[0], 'HH:mm a A')
  const end1 = moment(hours.end[0], 'HH:mm a A')
  const start2 = moment(hours.start[1], 'HH:mm a A')
  const end2 = moment(hours.end[1], 'HH:mm a A')
  return {
    start1,
    end1,
    start2,
    end2
  }
}

const computeAvailableHours = (hours) => {
  const {start1, end1, start2, end2} = hours
  const hour = moment().hour()
  let i = 0
  const rtn = []
  while (i < 24) {
    if (i < start1.hour() 
        || i < hour 
        || (i > end1.hour() && i < start2.hour()) 
        || i > end2.hour()) {
      rtn.push(i)
    }
    i += 1
  }
  return rtn
}

const computeAvailableMinutes = (
  hr,
  hours
) => {
  const now = moment().minute()
  const {start1, end1, start2, end2} = hours
  let i = 0
  let rtn = []
  // console.log(end1.minute())
  while (i <= 59) {
    let test = moment(hr + ':' + i, 'HH:mm')
    if (test.isBefore(start1) 
        || test.isBefore(now) 
        || (end1.isBefore(test) && test.isBefore(start2)) 
        || end2.isBefore(test)) {
      rtn.push(i)
    }
    i += 1
  }
  return rtn
}

function CartDetail () {
  const [totals, setTotals] = useState(defaultTotals)
  const [pickupTime, setPickupTime] = useState(null)
  const { loading, error, data } = useQuery(GET_VENDOR)
  const navigate = useNavigate()
  const cart_menu = cartItems()

  const handleConfirmClick = () => {
    return navigate('/eat/cohen/payment')
  }

  const updateTotal = () => {
    const newSubtotal = cart_menu.reduce(
      (total, current) => total + current.price * current.quantity,
      0
    )
    setTotals({
      subtotal: newSubtotal,
      tax: newSubtotal * 0.0825
    })
  }

  const getTotal = () => {
    const total = cart_menu.reduce((total, current) => {
      return total + current.quantity
    }, 0)
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

  const businessHour = parseStoreHour(data.getVendors.filter(
    e => e['name'] == 'Cohen House'
  )[0].hours[0])

  const disabled = () => {
    let now = moment()
    const {start1, end1, start2, end2} = businessHour
    if (now.isBefore(start1) || (now.isBefore(start2) && now.isAfter(end1)) || now.isAfter(end2) || now.isoWeekday() > 5) {
      return true;
    }
    return false;
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
              return computeAvailableHours(businessHour)
            }}
            disabledMinutes={hour => {
              return computeAvailableMinutes(
                hour,
                businessHour
              )
            }}
          />
          {disabled() && (
            <p css={{ alignSelf: 'center', color: 'red' }}>
              {' '}
              No pickup time available today.{' '}
            </p>
            <div css={[centerCenter, row]}>
              <img src={logo} className='logo' alt='Logo' />
              <div>
                <p className='vendor-title'>Cohen House</p>
              </div>
            </div>

            <p css={{ alignSelf: 'center', marginTop: '2px' }}> Pickup Time:</p>
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
              inputReadOnly
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
            <hr className='breakline' />
            {cartItems().map(item => {
              return (
                <React.Fragment>
                  <CartProduct
                    product={item}
                    forceUpdate={setDummyDelete}
                    updateTotal={updateTotal}
                  />
                  <hr className='breakline' />
                </React.Fragment>
              )
            })}
          </div>

          <div className='float-bill'>
            {Object.keys(totals).map(type => {
              if (totals[type]) {
                const formatted = currency(totals[type]).format()
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
              title='Confirm'
              onClick={handleConfirmClick}
            >
              Next: Payment
              <div />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CartDetail
