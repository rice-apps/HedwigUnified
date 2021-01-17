import { Fragment, useEffect, useState } from 'react'
import { gql, useQuery, useMutation, useApolloClient } from '@apollo/client'
import {
  checkNullFields,
  createRecord,
  CREATE_ORDER,
  CREATE_PAYMENT,
  GET_VENDOR
} from './util'
import { centerCenter, row, column, endStart } from '../../../Styles/flex'
import CartProduct from './CartProducts'
import currency from 'currency.js'
import Select from 'react-select'
import moment from 'moment'
import { useNavigate, useLocation } from 'react-router-dom'
import CartHeader from './CartHeader'
import styled, { css } from 'styled-components'
import {
  FloatCartWrapper,
  SpaceWrapper,
  Title,
  Bill,
  SubmitButton
} from './CartStyledComponents'
// new dropdown imports:
import Modal from 'react-modal'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { AiOutlineExclamationCircle } from 'react-icons/ai'

const styles = {
  color: 'blue'
}
const Div = styled.div`
  text-align: right;
  line-height: 15px;
  font-size: 13px;
  margin-right: 5vw;
  grid-column-start: 2;
  padding-bottom: 10px;
`

const OptionWrapper = styled.div`
  display: grid;
  grid-template-columns: 7fr 4fr;
  grid-template-rows: 1fr;
  align-items: center;
  padding: 15px 0px;
  height: 100%;
  width: 100%;
`

const GET_AVAILABILITIES = gql`
  query GET_AVAILABILITIES($productIds: [String!]) {
    getAvailabilities(productIds: $productIds)
  }
`

const defaultTotals = {
  subtotal: 0,
  tax: 0,
  discount: null
}

function generatePickupTimes (
  currHour,
  currMinute,
  endHour,
  endMinute,
  isFirst
) {
  let pickupTimes = []
  let pickupMinute = Math.ceil(currMinute / 15) * 15
  let pickupHour = currHour
  while (pickupHour <= endHour) {
    while (
      pickupMinute <= 45 &&
      !(pickupHour === endHour && pickupMinute >= endMinute)
    ) {
      pickupMinute += 15
      let strPickupMinute = ''
      let strPickupHour = ''
      if (pickupMinute === 60) {
        strPickupMinute += '00'
        strPickupHour +=
          pickupHour >= 12
            ? (pickupHour - Math.floor(pickupHour / 12) * 12 + 1).toString()
            : (pickupHour + 1).toString()
      } else {
        strPickupMinute += pickupMinute.toString()
        strPickupHour +=
          pickupHour === 12
            ? '12'
            : (pickupHour - Math.floor(pickupHour / 12) * 12).toString()
      }
      if (pickupHour >= 12 || (pickupHour === 11 && pickupMinute === 60)) {
        strPickupMinute += ' p.m.'
      } else {
        strPickupMinute += ' a.m.'
      }
      const pickupTime = strPickupHour + ':' + strPickupMinute
      pickupTimes.push(pickupTime)
    }
    pickupMinute = 0
    pickupHour += 1
  }
  const pickupObjs = pickupTimes.map(time => {
    return { value: moment(time, 'h:mm a').format(), label: time }
  })
  if (isFirst && pickupObjs.length > 0) {
    pickupObjs.unshift({ value: moment().add(15, 'minutes'), label: 'ASAP' })
  }
  return pickupObjs
}

function calculateNextHours (
  currHour,
  currMinute,
  startHours,
  startMinutes,
  endHours,
  endMinutes
) {
  const currTime = currHour + currMinute / 60
  const endTimes = []
  for (let i = 0; i < endHours.length; i++) {
    endTimes.push(endHours[i] + endMinutes[i] / 60)
  }
  const startTimes = []
  for (let i = 0; i < startHours.length; i++) {
    startTimes.push(startHours[i] + startMinutes[i] / 60)
  }
  let idx = 0
  while (currTime >= startTimes[idx]) {
    idx += 1
  }
  let timeIntervals = []
  let newIdx = 0
  //When restaurant is closed for the day
  if (idx === endTimes.length && currTime >= endTimes[idx - 1]) {
    return [[0, 0, 0, 0]]
  }
  //When restaurant is not open currently for orders, but open later in the day
  else if (
    idx === 0 ||
    (idx > 0 && currTime >= endTimes[idx - 1]) ||
    currTime >= endTimes[idx - 1] - 0.25
  ) {
    timeIntervals.push([
      startHours[idx],
      startMinutes[idx],
      endHours[idx],
      endMinutes[idx]
    ])
    newIdx = idx + 1
  }
  //When the restaurant is currently open for orders
  else {
    timeIntervals.push([
      currHour,
      currMinute,
      endHours[idx - 1],
      endMinutes[idx - 1]
    ])
    newIdx = idx
  }
  while (newIdx < endTimes.length) {
    timeIntervals.push([
      startHours[newIdx],
      startMinutes[newIdx],
      endHours[newIdx],
      endMinutes[newIdx]
    ])
    newIdx += 1
  }
  return timeIntervals
}

function CartDetail () {
  const [totals, setTotals] = useState(defaultTotals)
  const [pickupTime, setPickupTime] = useState(null)
  const [paymentMethod, setPaymentMethod] = useState(null)
  const [cohenId, setCohenId] = useState(null)
  const [nullError, setNullError] = useState(null)
  // eval to a field string if user's name, student id, or phone number is null
  const options = [
    { value: 'CREDIT', label: 'Credit Card' },
    { value: 'TETRA', label: 'Tetra' },
    { value: 'COHEN', label: 'Cohen House' }
  ]
  // const defaultPaymentOption = options[0];

  const { loading, error, data } = useQuery(GET_VENDOR, {
    variables: { filter: { name: 'Cohen House' } }
  })
  const [
    createOrder,
    { loading: order_loading, error: order_error }
  ] = useMutation(CREATE_ORDER)
  const [
    createPayment,
    { loading: payment_loading, error: payment_error }
  ] = useMutation(CREATE_PAYMENT)

  const navigate = useNavigate()
  // add catch statement
  const cart_menu =  localStorage.getItem('cartItems') ? JSON.parse(localStorage.getItem('cartItems')) : null
  const order = localStorage.getItem('cartItems') ? JSON.parse(localStorage.getItem('order')) : null

  const product_ids = cart_menu ? cart_menu.map(item => {
    return item.dataSourceId
  }) : null

  const {
    loading: avail_loading,
    error: avail_error,
    refetch: avail_refetch
  } = useQuery(GET_AVAILABILITIES, {
    variables: { productIds: product_ids },
    fetchPolicy: 'network-only'
  })

  const { state } = useLocation()
  const { vendor} = state;

  const handleClickCredit = async () => {
    // Get url and embed that url
    return navigate(`/eat/almostThere`)
  }

  const handleConfirmClick = async () => {
    console.log("HI")
    const currTimeVal = moment().hour() + moment().minutes() / 60
    const pickupTimeVal =
      moment(pickupTime).hour() + moment(pickupTime).minutes() / 60
    if (pickupTimeVal < currTimeVal + 0.25) {
      alert(
        'The time you have selected is no longer valid. Please choose a later time.'
      )
      return
    }
    const newRes = await avail_refetch()
    while (newRes.loading) {}
    if (newRes.data.getAvailabilities === false) {
      return navigate('/eat/confirmation')
    } else {
      const rec = {
        variables: createRecord(cart_menu, paymentMethod, cohenId)
      }
      const emptyField = checkNullFields(rec)
      if (checkNullFields(rec)) {
        setNullError(emptyField)
        return
      }
      const orderResponse = await createOrder(rec)
      const orderJson = orderResponse.data.createOrder
      const createPaymentResponse = await createPayment({
        variables: {
          sourceId: 'cnon:card-nonce-ok',
          orderId: orderJson.id,
          location: order.vendor.locationIds[0],
          subtotal: totals.subtotal * 100,
          currency: 'USD'
        }
      })
      localStorage.setItem('order', 
        JSON.stringify(Object.assign(order, {
          orderId: orderJson.id,
          pickupInstruction: data.getVendor.pickupInstruction,
          fulfillment: {
            uid: orderJson.fulfillment.uid,
            state: orderJson.fulfillment.state,
            pickupAt: orderJson.fulfillment.pickupDetails.pickupAt,
            placedAt: orderJson.fulfillment.pickupDetails.placedAt
          },
          url: createPaymentResponse.data.createPayment.url
        }))
      )
      if (paymentMethod === 'CREDIT') {
        // navigate to Almost there page
        return handleClickCredit()
      }
      if (paymentMethod === 'COHEN') {
        // navigate to order confirmation page
        return navigate('/eat/confirmation')
      }
      if (paymentMethod === 'TETRA') {
        // navigate to order confirmation page
        return navigate('/eat/confirmation')
      }
    }
  }

  const updateTotal = () => {
    const newSubtotal = cart_menu ? cart_menu.reduce(
      (total, current) => total + current.price * current.quantity,
      0
    ): 0
    if (newSubtotal != totals.subtotal) {
      setTotals({
        subtotal: newSubtotal,
        tax: newSubtotal * 0.0825
      })
    }
  }

  const getTotal = () => {
    const total = cart_menu.reduce((total, current) => {
      return total + current.price * current.quantity
    }, 0)
    return total
  }

  useEffect(() => {
      updateTotal()
  }, [cart_menu])

  //	This is to make the page re-render so that updated state is shown when item
  //  is deleted.
  const [, setDummyDelete] = useState(0)

  if (loading) return <p>'Loading vendor's business hour ...'</p>
  if (error) return <p>`Error! ${error.message}`</p>

  if (order_loading) return <p>Creating new order. Please wait ...</p>
  if (order_error) {
    return <p>{order_error.message}</p>
  }
  if (payment_loading) return <p>Creating new payment. Please wait ...</p>
  if (payment_error) {
    return <p>{payment_error.message}</p>
  }

  // if (avail_loading) return <p>'Loading availabilities...'</p>;
  // if (avail_error & (cart_menu.length != 0))
  //   return <p>`Error! ${avail_error.message}`</p>;

  const currDay = moment().day()
  const currHour = moment().hour()
  const currMinute = moment().minutes()

  const {
    getVendor: { hours: businessHours }
  } = data
  const businessHour = businessHours[currDay]

  // const businessHour = {start: '8:30 a.m.', end:'11:00 p.m.'}
  const startHours = businessHours[currDay]
    ? businessHour.start.map(startHour => {
        let hour = startHour.split(':')[0]
        if (startHour.includes('p.m.')) {
          return parseInt(hour) + 12
        } else {
          return parseInt(hour)
        }
      })
    : []
  const endHours = businessHours[currDay]
    ? businessHour.end.map(endHour => {
        let hour = endHour.split(':')[0]
        if (endHour.includes('p.m.')) {
          return parseInt(hour) + 12
        } else {
          return parseInt(hour)
        }
      })
    : []

  const startMinutes = businessHour.start.map(startHour => {
    return parseInt(startHour.split(' ')[0].split(':')[1])
  })
  const endMinutes = businessHour.end.map(endHour => {
    return parseInt(endHour.split(' ')[0].split(':')[1])
  })

  const timeIntervals = calculateNextHours(
    currHour,
    currMinute,
    startHours,
    startMinutes,
    endHours,
    endMinutes
  )
  let pickupTimes = []
  for (let i = 0; i < timeIntervals.length; i++) {
    const interval = timeIntervals[i]
    i === 0
      ? (pickupTimes = [
          ...pickupTimes,
          ...generatePickupTimes(
            interval[0],
            interval[1],
            interval[2],
            interval[3],
            true
          )
        ])
      : (pickupTimes = [
          ...pickupTimes,
          ...generatePickupTimes(
            interval[0],
            interval[1],
            interval[2],
            interval[3],
            false
          )
        ])
  }

  // pickupTimes = pickupTimes.forEach(t => t.value = moment().set(
  //   {'year': moment().year(),
  //   'month': moment().month(),
  //   'date': moment().date(),
  //   'hour': t.value.split(':')[0],
  //   'minute': t.value.split(':')[1]}))

  function changePaymentType (newPayment) {
    setPaymentMethod(newPayment.value)
  }

  function changePickupTime (newTime) {
    setPickupTime(newTime.value)
    localStorage.setItem('order', JSON.stringify(Object.assign(order, { time: newTime.value })))
  }
 console.log(JSON.parse(localStorage.getItem('userProfile')))
  return (

    <div>
      <CartHeader showBackButton vendor={vendor} />
      <FloatCartWrapper>
        <SpaceWrapper orderSummary>
          <Title>Order Summary:</Title>
          <div>
            {cart_menu ? cart_menu.map(item => {
              return (
                <CartProduct
                  key={item}
                  product={item}
                  forceUpdate={setDummyDelete}
                  updateTotal={updateTotal}
                />
              )
            }): "Your cart is empty!"}
          </div>
          <Bill wrapper>
            {Object.keys(totals).map(type => {
              if (totals[type]) {
                const formatted = currency(totals[type]).format()
                console.log(type + 'Title', formatted)
                return (
                  <Bill subwrapper>
                    <Bill subtitle gridArea={type + 'Title'}>
                      {type}:
                    </Bill>
                    <Bill subtitle price gridArea={type + 'Number'}>
                      {formatted}
                    </Bill>
                  </Bill>
                )
              }
            })}
            <Bill totalWrapper>
              <Bill title gridArea='totalTitle'>
                Total:
              </Bill>
              <Bill price title gridrea='totalNumber'>
                {' '}
                {currency(totals.subtotal + totals.tax).format()}
              </Bill>
            </Bill>
          </Bill>
        </SpaceWrapper>
        <SpaceWrapper pickUpTime>
          <Title>Pick Up Time:</Title>
          <Select
            options={pickupTimes}
            placeholder={'Select...'}
            onChange={changePickupTime}
            clearable={false}
            style={styles.select}
            className='float-cart__dropdown'
          />
        </SpaceWrapper>
        <SpaceWrapper paymentMethod>
          <Title>Payment Method:</Title>
          <Select
            options={options}
            onChange={changePaymentType}
            placeholder={'Select...'}
            clearable={false}
            style={styles.select}
            className='float-cart__dropdown'
          />
          {paymentMethod === 'COHEN' && (
            <Div>
              <label>Enter your Cohen House Membership ID: </label>
              <input onChange={e => setCohenId(e.target.value)}></input>
            </Div>
          )}
          {nullError && (
            <Div css={{ alignSelf: 'center', color: 'red' }}>
              {' '}
              Error! Submission form contains null value for {nullError}. Please
              complete your profile and order.{' '}
            </Div>
          )}
        </SpaceWrapper>
        <SpaceWrapper footer>
          <SubmitButton
            onClick={ cart_menu?.length === 0 ? null : handleConfirmClick}
          >
            Submit Order
          </SubmitButton>
        </SpaceWrapper>
      </FloatCartWrapper>
    </div>
  )
}

export default CartDetail
