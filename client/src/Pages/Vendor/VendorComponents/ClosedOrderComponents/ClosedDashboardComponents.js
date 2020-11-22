import React from 'react';

import { useState } from 'react'
import styled from 'styled-components'
import { FaAngleRight, FaAngleDown } from 'react-icons/fa'
import { IconContext } from 'react-icons'
import moment from 'moment'
import Collapsible from 'react-collapsible'
import './ClosedOrderCollapsible.css'
import {
  MakeOrderTimeDetails,
  MakeCustomerDetails,
  ClosedOrderDetailsWrapper,
  MakeOrderItem,
  ItemDetailsWrapper
} from './ClosedOrderDetailsComponents.js'

const DashboardWrapper = styled.div`
  height: 90%;
  width: 90%;
  /* background-color: #FAFAFA; */
  border-radius: 20px;
  display: grid;
  font-family: 'Futura', sans-serif;
  grid-template-columns: 1fr;
  grid-template-rows: 8vh minmax(5.5vh, max-content) auto;
  grid-template-areas:
    'TitleSpace'
    'LabelSpace'
    'OrdersSpace';
  align-items: center;
  justify-items: center;
  overflow: hidden;
`

const TitleWrapper = styled.div`
  grid-area: TitleSpace;
  font-size: 4vh;
  font-weight: bold;
  width: 100%;
  height: 100%;
  /* background-color: skyblue; */
  display: flex;
  margin-top: 7px;
  align-items: center;
  justify-content: center;
`
const LabelWrapper = styled.div`
  grid-area: LabelSpace;
  font-size: 2.5vh;
  height: 100%;
  width: 90%;
  display: grid;
  grid-template-columns: 0.45fr 1.8fr 2fr 1.5fr 2fr 1.5fr;
  grid-template-rows: 1fr;
  font-weight: bold;
  align-items: center;
  border-radius: 20px;
`

function MakeClosedDashboardLabels() {
  return (
    <LabelWrapper>
      <div />
      <div>Customer</div>
      <div>Order Time</div>
      <div>Status</div>
      <div>Payment Method</div>
      <div>Price</div>
    </LabelWrapper>
  )
}

const ClosedOrdersSpaceWrapper = styled.div`
  grid-area: OrdersSpace;
  display: flex;
  height: 100%;
  width: 100%;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  overflow: auto;
`

const IndividualClosedOrder = styled.div`
  height: max-content;
  width: 90%;
  display: grid;
  align-items: center;
  padding: 5px 0px;
  grid-template-columns: 0.45fr 1.8fr 2fr 1.5fr 2fr 1.5fr;
  font-size: 2.4vh;
  background-color: white;
  border-top-right-radius: 20px;
  border-top-left-radius: 20px;
  border-bottom-left-radius: ${props => (props.IsClosed ? '20px' : '0px')};
  border-bottom-right-radius: ${props => (props.IsClosed ? '20px' : '0px')};
  cursor: pointer;
  box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.2);
`

function ClosedOrderTrigger(props) {
  return (
    <IndividualClosedOrder IsClosed={props.IsClosed}>
      {props.IsClosed === true ? (
        <FaAngleRight style={{ marginLeft: '25px', color: '#EA907A' }} />
      ) : (
          <FaAngleDown style={{ marginLeft: '25px', color: '#EA907A' }} />
        )}
      <div>{props.customerName}</div>
      <div>{props.orderTime}</div>
      <div>{props.orderStatus}</div>
      <div>{props.paymentMethod}</div>
      <div>{props.price}</div>
    </IndividualClosedOrder>
  )
}

// We should iterate over each closed order and call the MakeIndividualClosedOrder
// function for each past order in the vendor's square account for the day

function MakeIndividualClosedOrder(props) {
  return (
    <Collapsible
      classParentString='ClosedOrderCollapsible'
      open={false}
      trigger={
        <ClosedOrderTrigger
          IsClosed
          customerName={props.customerName}
          orderTime={props.orderTime}
          orderStatus={props.orderStatus}
          paymentMethod={props.paymentMethod}
          price={props.price}
        />
      }
      triggerWhenOpen={
        <ClosedOrderTrigger
          IsClosed={false}
          customerName={props.customerName}
          orderTime={props.orderTime}
          orderStatus={props.orderStatus}
          paymentMethod={props.paymentMethod}
          price={props.price}
        />
      }
    >
      <ClosedOrderDetailsWrapper>
        <MakeCustomerDetails
          phoneNumber={props.phoneNumber}
          email={props.email}
        />
        <MakeOrderTimeDetails
          pickupTime={moment(props.pickupTime).format('MMMM Do, h:mm A')}
        />
        <ItemDetailsWrapper>
          <strong>Items</strong>
          {/* This is dummy data, the idea is to iterate over each item in an order and call the MakeOrderItem function with each item */}
          {/* {props.items.map((item) => <MakeOrderItem quanity={item.quantity} itemName={item.name} variant={item.variation_name} modifiers={item.modifiers} itemPrice={`$${item.total_money.amount / 100}`} />)} */}
        </ItemDetailsWrapper>
      </ClosedOrderDetailsWrapper>
    </Collapsible>
  )
}

export {
  DashboardWrapper,
  TitleWrapper,
  MakeClosedDashboardLabels,
  ClosedOrdersSpaceWrapper,
  MakeIndividualClosedOrder
}
