import { useEffect, useState } from 'react'
import { useQuery, useMutation } from '@apollo/client'
import gql from 'graphql-tag.macro'
import {
  checkNullFields,
  createRecord,
  CREATE_ORDER,
  CREATE_PAYMENT,
  GET_VENDOR
} from './util'
import CartProduct from './CartProducts'
import currency from 'currency.js'
import Select from 'react-select'
import moment from 'moment'
import { useNavigate } from 'react-router-dom'
import CartHeader from './CartHeader'
import styled from 'styled-components/macro'
import {
  FloatCartWrapper,
  Input,
  SpaceWrapper,
  TextArea,
  Title,
  Bill,
  SubmitButton
} from './CartStyledComponents'
import { GET_ITEM_AVAILABILITIES } from './../../../graphql/ProductQueries'
// new dropdown imports:

const styles = {
  color: 'blue',
  select: {
    display: 'inline-block'
  }
}
const Div = styled.div`
  text-align: right;
  line-height: 15px;
  font-size: 13px;
  margin-right: 5vw;
  grid-column-start: 2;
  padding-bottom: 10px;
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
  cutoffTime
) {
  const pickupTimes = []
  let pickupMinute = Math.ceil(currMinute / 15) * 15
  let pickupHour = currHour
  while (pickupHour <= endHour) {
    while (
      pickupMinute <= 45 &&
      !(pickupHour + pickupMinute / 60 > endHour + (endMinute - 15) / 60)
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
      if (pickupHour === 23 && pickupMinute === 60) {
        strPickupMinute += ' a.m.'
      } else if (
        pickupHour >= 12 ||
        (pickupHour === 11 && pickupMinute === 60)
      ) {
        strPickupMinute += ' p.m.'
      } else {
        strPickupMinute += ' a.m.'
      }
      const pickupTime = strPickupHour + ':' + strPickupMinute
      console.log(pickupTime)
      pickupTimes.push(pickupTime)
    }
    pickupMinute = 0
    pickupHour += 1
  }
  const pickupObjs = pickupTimes.map(time => {
    if (time[0] === '0') {
      time = '12' + time.substring(1)
    }
    return { value: moment(time, 'h:mm a').format(), label: time }
  })
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
  const timeIntervals = []
  let newIdx = 0
  // When restaurant is closed for the day
  if (idx === endTimes.length && currTime >= endTimes[idx - 1]) {
    return [[0, 0, 0, 0]]
  }
  // When restaurant is not open currently for orders, but open later in the day
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
  // When the restaurant is currently open for orders
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
  const [room, setRoom] = useState(null)
  const [note, setNote] = useState(null)
  const [characterCount, setCharacterCount] = useState(0)
  const [nullError, setNullError] = useState(null)
  const [currentTime, setCurrentTime] = useState(moment())
  // eval to a field string if user's name, student id, or phone number is null
  const options = [
    { value: 'None', label: 'Credit Card' },
    { value: 'TETRA', label: 'Tetra' },
    { value: 'COHEN', label: 'Cohen House' }
  ]

  // const defaultPaymentOption = options[0];
  const cart_menu = localStorage.getItem('cartItems')
    ? JSON.parse(localStorage.getItem('cartItems'))
    : null
  const order = localStorage.getItem('cartItems')
    ? JSON.parse(localStorage.getItem('order'))
    : null

  const { loading, error, data } = useQuery(GET_VENDOR, {
    variables: { filter: { name: order.vendor.name } }
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

  console.log(cart_menu)

  const product_ids = cart_menu
    ? cart_menu.map(item => {
        return item.dataSourceId
      })
    : null

  const { refetch: avail_refetch } = useQuery(GET_ITEM_AVAILABILITIES, {
    variables: { productIds: product_ids, vendor: order.vendor.name },
    fetchPolicy: 'network-only'
  })

  const handleClickCredit = async () => {
    // Get url and embed that url
    return navigate('/eat/almostThere')
  }

  const setLocalStorage = (order, orderJson, url, totals) => {
    localStorage.setItem(
      'order',
      JSON.stringify(
        Object.assign(order, {
          orderId: orderJson.id,
          pickupInstruction: data.getVendor.pickupInstruction,
          fulfillment: {
            uid: orderJson.fulfillment.uid,
            state: orderJson.fulfillment.state,
            pickupAt: orderJson.fulfillment.pickupDetails.pickupAt,
            placedAt: orderJson.fulfillment.pickupDetails.placedAt
          },
          url: url,
          totals: totals
        })
      )
    )
  }

  const handleConfirmClick = async asapTime => {
    const currTimeVal = moment().hour() + moment().minutes() / 60
    const pickupTimeVal =
      moment(pickupTime).hour() + moment(pickupTime).minutes() / 60
    if (pickupTimeVal < currTimeVal + asapTime / 60) {
      alert(
        'The time you have selected is no longer valid. Please choose a later time.'
      )
      return
    }
    const newRes = await avail_refetch()
    while (newRes.loading) {}
    if (newRes.data.getAvailabilities === false) {
      console.log('Availability: ', newRes.data.getAvailabilities)
      return navigate('/eat/failure')
    } else {
      const rec = {
        variables: createRecord(cart_menu, paymentMethod, cohenId, note, room)
      }
      console.log(rec)
      const emptyField = checkNullFields(rec, order.vendor.name)
      if (emptyField) {
        setNullError(emptyField)
        return
      }
      const orderResponse = await createOrder(rec)
      const orderJson = orderResponse.data.createOrder
      if (order.vendor.dataSource === 'SHOPIFY' && paymentMethod === 'CREDIT') {
        const createPaymentResponse = await createPayment({
          variables: {
            vendor: order.vendor.name,
            source: 'SHOPIFY',
            sourceId: 'cnon:card-nonce-ok',
            orderId: orderJson.id,
            location: order.vendor.locationIds[0],
            subtotal: totals.subtotal * 100,
            currency: 'USD'
          }
        })
        setLocalStorage(
          order,
          orderJson,
          createPaymentResponse.data.createPayment.url,
          totals
        )
      }
      if (paymentMethod === 'CREDIT') {
        // navigate to Almost there page
        if (order.vendor.name === 'Cohen House') {
          return handleClickCredit()
        } else {
          setLocalStorage(order, orderJson, '', totals)
          return navigate('/eat/square')
        }
      }
      if (paymentMethod === 'COHEN') {
        setLocalStorage(order, orderJson, '', totals)
        return navigate('/eat/confirmation')
      }
      if (
        !paymentMethod ||
        paymentMethod === 'TETRA' ||
        paymentMethod === 'None'
      ) {
        setLocalStorage(order, orderJson, '', totals)
        return navigate('/eat/confirmation')
      }
    }
  }

  const updateTotal = () => {
    const newSubtotal = cart_menu
      ? cart_menu.reduce(
          (total, current) => total + current.price * current.quantity,
          0
        )
      : 0
    if (newSubtotal !== totals.subtotal) {
      setTotals({
        subtotal: newSubtotal,
        tax: newSubtotal * 0.0825
      })
    }
  }

  useEffect(() => {
    updateTotal()
  }, [cart_menu])

  //	This is to make the page re-render so that updated state is shown when item
  //  is deleted.

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(moment())
    }, 1000)
    return () => {
      clearInterval(timer)
    }
  }, [])
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
  const currHour = moment(currentTime).hour()
  const currMinute = moment(currentTime).minutes()

  const {
    getVendor: { hours: businessHours }
  } = data
  const businessHour = businessHours[currDay]

  // const businessHour = {start: '8:30 a.m.', end:'11:00 p.m.'}
  const startHours = businessHours[currDay]
    ? businessHour.start.map(startHour => {
        return moment(startHour, 'h:mm a').hour()
      })
    : []
  const endHours = businessHours[currDay]
    ? businessHour.end.map(endHour => {
        return moment(endHour, 'h:mm a').hour()
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
  const asapDuration = data.getVendor.asapTime
  const cutoffTime = data.getVendor.cutoffTime
  for (let i = 0; i < timeIntervals.length; i++) {
    const interval = timeIntervals[i]
    const currNumTime = currHour + currMinute / 60
    const startNumTime = timeIntervals[0][0] + timeIntervals[0][1] / 60
    if (i === 0 && currNumTime >= startNumTime) {
      const asapTime = moment().add(asapDuration, 'minutes')
      const pickupIntervalHour = asapTime.hour()
      const pickupIntervalMinute = Math.floor(asapTime.minutes() / 15) * 15
      const asapDisplay = {
        value: moment(asapTime, 'h:mm a').format(),
        label: 'ASAP' + ' (~' + moment(asapTime).format('h:mm A') + ')'
      }
      pickupTimes = [
        asapDisplay,
        ...generatePickupTimes(
          pickupIntervalHour,
          pickupIntervalMinute,
          interval[2],
          interval[3],
          cutoffTime
        )
      ]
    } else {
      pickupTimes = [
        ...pickupTimes,
        ...generatePickupTimes(
          interval[0],
          interval[1],
          interval[2],
          interval[3],
          cutoffTime
        )
      ]
    }
  }
  console.log('Pickup Times: ', pickupTimes)

  function changePaymentType (newPayment) {
    setPaymentMethod(newPayment.value)
  }

  function changePickupTime (newTime) {
    setPickupTime(newTime.value)
    localStorage.setItem(
      'order',
      JSON.stringify(Object.assign(order, { pickupTime: newTime.value }))
    )
    console.log('NEW PICKUP TIME', order)
  }
  return (
    <div>
      <CartHeader
        showBackButton
        backLink='/eat'
        vendorName={order ? order.vendor.name : null}
      />
      <FloatCartWrapper>
        <SpaceWrapper orderSummary>
          <Title>Order Summary:</Title>
          <div>
            {cart_menu
              ? cart_menu.map(item => {
                  return (
                    <CartProduct
                      key={item}
                      product={item}
                      forceUpdate={setDummyDelete}
                      updateTotal={updateTotal}
                    />
                  )
                })
              : 'Your cart is empty!'}
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
        {order.vendor.name != 'Test Account CMT' && (
          <SpaceWrapper pickUpTime>
            <Title>Pick Up Time:</Title>
            <Select
              options={pickupTimes}
              placeholder='Select...'
              onChange={changePickupTime}
              clearable={false}
              style={styles.select}
              className='float-cart__dropdown'
            />
          </SpaceWrapper>
        )}
        {order.vendor.name != 'Test Account CMT' && (
          <SpaceWrapper paymentMethod>
            <Title>Payment Method:</Title>
            <Select
              options={options}
              onChange={changePaymentType}
              placeholder='Select...'
              clearable={false}
              style={styles.select}
              className='float-cart__dropdown'
            />
            {paymentMethod === 'COHEN' && (
              <Div>
                <label>Enter your Cohen House Membership ID: </label>
                <input onChange={e => setCohenId(e.target.value)} />
              </Div>
            )}
          </SpaceWrapper>
        )}
        {order.vendor.name === 'Cohen House' && (
          <SpaceWrapper cohenNote>
            <div>
              <Title>
                Coupon Code:{' '}
                <span
                  style={{
                    opacity: '0.6',
                    fontStyle: 'italic',
                    fontSize: '2vh'
                  }}
                >
                  (optional)
                </span>
              </Title>
              <div
                style={{
                  color: 'grey',
                  lineHeight: '2vh',
                  width: '80vw',
                  margin: '0.5vh 6vw 0.9vh 6vw'
                }}
              >
                *Vendor will verify coupon code. Price subject to change.
              </div>
              <TextArea
                maxLength='150'
                note
                onChange={e => {
                  setNote(e.target.value)
                  setCharacterCount(e.target.value.length)
                }}
              />
            </div>
          </SpaceWrapper>
        )}
        {order.vendor.name === 'Test Account CMT' && (
          <SpaceWrapper college>
            <Title isolation>Room Number: </Title>
            <Input roomNumber onChange={e => setRoom(e.target.value)} />
          </SpaceWrapper>
        )}
        {order.vendor.name === 'Test Account CMT' && (
          <SpaceWrapper note>
            <div>
              <Title isolation note>
                Order Notes:{' '}
                <span
                  style={{
                    opacity: '0.6',
                    fontStyle: 'italic',
                    fontSize: '2vh'
                  }}
                >
                  ({characterCount.toString()}/100)
                </span>{' '}
              </Title>
              <TextArea
                maxLength='150'
                note
                onChange={e => {
                  setNote(e.target.value)
                  setCharacterCount(e.target.value.length)
                }}
                placeholder='Type any additional dietary restrictions or concerns here (100 character limit)'
              />
            </div>
          </SpaceWrapper>
        )}
        {nullError && (
          <SpaceWrapper warning css={{ alignSelf: 'center', color: 'red' }}>
            {' '}
            Error! Submission form contains null value for {nullError}. Please
            complete your profile and order.{' '}
          </SpaceWrapper>
        )}
        <SpaceWrapper footer>
          <SubmitButton
            onClick={
              cart_menu?.length === 0
                ? null
                : () => {
                    handleConfirmClick(asapDuration)
                  }
            }
          >
            Submit Order
          </SubmitButton>
        </SpaceWrapper>
      </FloatCartWrapper>
    </div>
  )
}

export default CartDetail
