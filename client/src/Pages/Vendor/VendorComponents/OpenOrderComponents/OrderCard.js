import React from 'react'
import styled from 'styled-components'
import { IconContext } from 'react-icons'
import { BsFillClockFill } from 'react-icons/bs'
import { BiFoodMenu } from 'react-icons/bi'
import { IoIosAddCircleOutline } from 'react-icons/io'
import moment from "moment";

const OrderCardWrapper = styled.div`


  background-color: white;
  border-radius: 20px;
  border-width: 2px;
  border-color: #cacaca;
  border-style: solid;
  justify-self: center;
  font-family: 'Futura', sans-serif;
  display: grid;
  width: 94%;
  height: max-content;
  margin: 10px;
  margin-right: 14px;
  overflow: visible;
  grid-template-columns: 1fr;
  grid-template-rows: 35px max-content max-content 92px;
  grid-template-areas:
    'OrderTitleSpace'
    'OrderTimeSpace'
    'OrderDetailsSpace'
    'PaymentSpace';
`

const OrderTitleSpaceWrapper = styled.div`
  background-color: white;
  font-weight: bolder;
  grid-area: OrderTitleSpace;
  display: flex;
  flex-direction: row;
  font-size: 21px;
  align-items: flex-end;
  justify-content: space-around;
  padding-bottom: 0px;

  overflow: hidden;
  border-top-right-radius: 20px;
  border-top-left-radius: 20px;
`

function MakeOrderTitle (props) {
  return (
    <OrderTitleSpaceWrapper>
      <div>No.{props.orderNumber} </div>
      <div style={{ marginRight: '35px' }}>{props.customerName}</div>
      <BsFillClockFill />
    </OrderTitleSpaceWrapper>
  )
}

const OrderTimeSpaceWrapper = styled.div`
  background-color: white;
  grid-area: OrderTimeSpace;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr;
  font-size: 14px;
  grid-template-areas: 'ExactTimeSpace TimeLeftSpace';
  font-weight: 500;
`

const ExactTimeSpaceWrapper = styled.div`
  grid-area: ExactTimeSpace;
  display: flex;
  flex-direction: column;
  text-align: left;
  margin-top: 7px;
  margin-left: 10px;
  line-height: 18px;
`
const TimeLeftSpaceWrapper = styled.div`
  grid-area: TimeLeftSpace;
  text-align: right;
  color: #9d9d9d;
`

function MakeOrderTime (props) {
  return (
    <OrderTimeSpaceWrapper>
      <ExactTimeSpaceWrapper>
        <div> Pick up time: {props.pickupTime}</div>
        <div> Order Submitted: {props.submissionTime}</div>
        <div style={{ marginTop: '4px' }}>
          Payment: <strong>{props.paymentType}</strong>
        </div>
      </ExactTimeSpaceWrapper>
      <TimeLeftSpaceWrapper>
        <div
          style={{
            marginTop: '8px',
            marginRight: '20px',
            textDecoration: 'underline'
          }}
        >
          Pickup time {props.pickupCountdown}
        </div>
      </TimeLeftSpaceWrapper>
    </OrderTimeSpaceWrapper>
  )
}

const OrderDetailsSpaceWrapper = styled.div`
  background-color: #fafafa;
  grid-area: OrderDetailsSpace;
  display: flex;
  flex-direction: column;
`
const OrderDetailsItemWrapper = styled.div`
  background-color: #fafafa;
  margin: 3px 0px;
  display: grid;
  grid-template-columns: 1.1fr 10fr 3fr;
  grid-template-rows: 1fr;
  font-size: 14px;
`
const ItemDescriptionWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-left: 6px;
`

function MakeOrderDetails (props) {
  return (
    <OrderDetailsItemWrapper>
      <div style={{ fontWeight: 'bold' }}>{props.quantity}</div>
      <ItemDescriptionWrapper>
        <div style={{ textTransform: 'uppercase', fontWeight: 'bold' }}>
          {props.itemName}
        </div>
        <div>
          <BiFoodMenu /> {props.variant}
        </div>
        <div>
          <IoIosAddCircleOutline /> {props.modifiers}
        </div>
      </ItemDescriptionWrapper>
      <div style={{ fontWeight: 'bold' }}>${props.price}</div>
    </OrderDetailsItemWrapper>
  )
}

const PaymentSpaceWrapper = styled.div`
  background-color: white;
  border-top: 1px solid grey;
  width: 90%;
  justify-self: center;
  grid-area: PaymentSpace;
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 1fr 1.2fr;
  font-size: 14px;
`

const CostSpaceWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-end;
  text-align: right;
  margin-right: 5px;
  margin-bottom: 7px;
  margin-top: 3px;
`
const ButtonsSpaceWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`
const ButtonWrapper = styled.div`
  border-radius: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 5px 30px;
  margin: 0px 25px;
  margin-bottom: 15px;
`

const AcceptButton = styled(ButtonWrapper)`
  background-color: #f9ddd7;
`

const CancelButton = styled(ButtonWrapper)`
  background-color: #dedede;
`
function MakePaymentSpace (props) {
  return (
    <PaymentSpaceWrapper>
      <CostSpaceWrapper>
        <div>
          Tax: <strong>{props.orderTax}</strong>
        </div>
        <div>
          Total: <strong>{props.orderTotal}</strong>
        </div>
      </CostSpaceWrapper>
      <ButtonsSpaceWrapper>
        <CancelButton>Cancel</CancelButton>
        <AcceptButton>{props.fulfillment === "PROPOSED" ? 'Accept': 'Complete' }</AcceptButton>
      </ButtonsSpaceWrapper>
    </PaymentSpaceWrapper>
  )
}

function OrderCard (props) {
  const {
    customerName, 
    pickupTime,
    items,
    orderCost,
    orderTotal,
    fulfillment
} = props
  //RFC3339
  const pickupAt = moment(pickupTime).format('h:mm A')
  const timeLeft = moment(pickupTime).fromNow()
  return (
    <IconContext.Provider
      value={{ style: { verticalAlign: 'middle', marginBottom: '2px' } }}
    >


      <OrderCardWrapper>


        {/* Section of Order card with customer name, order number */}
        <MakeOrderTitle orderNumber='12' customerName={customerName} />

        {/* Section of order card with pick up time, order submission time, and payment method */}
        <MakeOrderTime
          pickupTime={pickupAt}
          submissionTime='4:35pm'
          paymentType='Tetra'
          pickupCountdown={timeLeft}
        />
        {/* Section of order card with items ordered by customer with modifiers and variants listed as well as price */}
        <OrderDetailsSpaceWrapper>
          {/* Call MakeOrderDetails function for each unique item in the cart, 
          can be called multiple times if multiple items are in order */}
          {items && (items.map(item => <MakeOrderDetails
            quantity={item.quantity}
            itemName={item.name}
            price={item.total_money.amount / 100}
            variant={item.variation_name}
            // modifiers={[...item.modifiers.name].join(', ')}
          />
          ))}
        </OrderDetailsSpaceWrapper>
        <MakePaymentSpace 
      orderCost={orderCost} 
      orderTotal={orderTotal} 
      fulfillment={fulfillment} />
      </OrderCardWrapper>
    </IconContext.Provider>
  )
}

export default OrderCard
