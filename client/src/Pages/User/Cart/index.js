import { css, jsx } from '@emotion/react'
import { Fragment, useEffect, useState } from 'react'
import { gql, useQuery, useMutation, useApolloClient } from '@apollo/client'
import { useParams, useHistory } from 'react-router'
import { createRecord, CREATE_ORDER, CREATE_PAYMENT, GET_VENDOR } from './util'
import logo from '../../../images/cohenhouse.png'
import './cart.scss'
import { centerCenter, row, column, endStart } from '../../../Styles/flex'
import CartProduct from './CartProducts'
import Payments from './Payments.js'
import currency from 'currency.js'
import { cartItems, orderSummary } from '../../../apollo'
import dispatch from '../Products/FunctionalCart'
import Select from 'react-select'
import { TimePicker } from 'antd'
import moment from 'moment'
import { useNavigate } from 'react-router-dom'
import BottomAppBar from './../Vendors/BottomAppBar.js'
import BuyerHeader from './../Vendors/BuyerHeader.js'

// new dropdown imports:
import Dropdown from 'react-dropdown';
// import 'react-dropdown/style.css';

const defaultTotals = {
  subtotal: 0,
  tax: 0,
  discount: null
}

const computeUnavailableHours = (startHour, endHour) => {
  const hour = moment().hour()
  let i = 0
  const rtn = []
  while (i < 24) {
    if (i < startHour || i < hour || i > endHour) {
      rtn.push(i)
    }
    i += 1
  }
  return rtn
}

const computeUnavailableMinutes = (
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
  const rtn = []
  while (i <= end) {
    rtn.push(i)
    i += 1
  }
  return rtn
}

function CartDetail () {
  const [totals, setTotals] = useState(defaultTotals)
  const [pickupTime, setPickupTime] = useState(null)

  // Add payment method picker:
  const [paymentMethod, setPaymentMethod] = useState('Credit Card')
  const options = ['Credit Card', 'Tetra', 'Cohen House'];
  // const defaultPaymentOption = options[0];

  const { loading, error, data } = useQuery(GET_VENDOR, {variables: {filter: {name: "Cohen House"}}})
  const [
    createOrder,
    { loading: order_loading, error: order_error, data: order_data }
  ] = useMutation(CREATE_ORDER)
  const [
    createPayment,
    { loading: payment_loading, error: payment_error, data: payment_data }
  ] = useMutation(CREATE_PAYMENT)

  const navigate = useNavigate()
  const cart_menu = cartItems()

  const handleConfirmClick = async () => {
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

  if (order_loading) return <p>Loading...</p>
  if (order_error) {
    return <p>{order_error.message}</p>
  }
  if (payment_loading) return <p>Loading...</p>
  if (payment_error) {
    return <p>{payment_error.message}</p>
  }

  const currDay = new Date().getDay()
  const {getVendor: {hours: businessHours}} = data
  const businessHour = businessHours[currDay]
  console.log(businessHour)
  
  // const businessHour = {start: '8:30 a.m.', end:'11:00 p.m.'}
  const startHours = businessHour.start.map((startHour)=>{
    let hour = startHour.split(':')[0]
    if(startHour.includes('p.m.')){
      return parseInt(hour)+12
    }
    else{
      return parseInt(hour)
    }
  })
  const endHours = businessHour.end.map((endHour)=>{
    let hour = endHour.split(':')[0]
    if(endHour.includes('p.m.')){
      return parseInt(hour)+12
    }
    else{
      return parseInt(hour)
    }
  })

  const startMinutes = businessHour.start.map((startHour)=>{
     return startHour.split(':')[1].substring(0, 2)
  })
  const endMinutes = businessHour.end.map((endHour)=>{
    return endHour.split(':')[1].substring(0, 2)
 })

  const disabled = () => false // uncomment the codde below for prod mode.
  // moment().hour() > endHour1 ||
  // (moment().hour() == endHour1 && moment().minute() >= endMinute1);

  const onChangeDropdown = e => {
    setPaymentMethod(e.value);
    console.log("payment method: ", paymentMethod);
  }

  return (
    <div>
      <BuyerHeader showBackButton backLink='/eat' />
      <div className='float-cart'>
        <div className='float-cart__content'>
          <div className='float-cart__shelf-container'>
            <p className='cart-title'>
              My Cart {getTotal() > 0 ? '(' + getTotal().toString() + ')' : ''}
            </p>
            <div css={[centerCenter, row]}>
              <div>
                <p className='vendor-title'>Order Summary: </p>
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
                  orderSummary({ time: e })
                }
              }}
              showNow={false}
              bordered={false}
              inputReadOnly
              disabledHours={() => {
                return computeUnavailableHours(startHours[0], endHours[0])
              }}
              disabledMinutes={hour => {
                return computeUnavailableMinutes(
                  hour,
                  startHours[0],
                  startMinutes[0],
                  endHours[0],
                  endMinutes[0]
                )
              }}
            />
            <div>
              <Dropdown 
                options={options} 
                onChange={e => onChangeDropdown(e)} 
                value={paymentMethod} 
                placeholder="Select a Payment method" 
              />;
            </div>
            {disabled() && (
              <p css={{ alignSelf: 'center', color: 'red' }}>
                {' '}
                No pickup time available today.{' '}
              </p>
            )}
            <hr className='breakline' />
            {cartItems().map(item => {
              return (
                <>
                  <CartProduct
                    product={item}
                    forceUpdate={setDummyDelete}
                    updateTotal={updateTotal}
                  />
                  <hr className='breakline' />
                </>
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
              <div className='total' style={{ marginBottom: '9vh' }}>
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
