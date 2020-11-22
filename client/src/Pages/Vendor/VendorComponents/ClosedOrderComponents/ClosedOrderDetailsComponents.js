import React from 'react';
import styled from 'styled-components'
import { AiFillPhone } from 'react-icons/ai'
import { MdEmail } from 'react-icons/md'
import { BiFoodMenu } from 'react-icons/bi'
import { IoIosAddCircleOutline } from 'react-icons/io'

const ClosedOrderDetailsWrapper = styled.div`
  height: max-content;
  width: 90%;
  display: grid;
  align-items: center;
  grid-template-columns: 0.45fr 1.8fr 2fr 3.5fr 1.5fr;
  grid-template-rows: 1fr;
  grid-template-areas: 'BlankSpace CustomerNameSpace OrderTimeSpace ItemDetailsSpace PriceSpace';
  font-size: 2.05vh;
  background-color: white;
  padding: 5px 0px;
  box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.2);
  padding-bottom: 7px;
  border-top: 1px darkgrey solid;
  border-bottom-left-radius: 20px;
  border-bottom-right-radius: 20px;
`

const DetailsCustomerNameWrapper = styled.div`
  grid-area: CustomerNameSpace;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  flex-wrap: wrap;
  width: 100%;
  height: 100%;
`

function MakeCustomerDetails(props) {
  return (
    <DetailsCustomerNameWrapper>
      <strong>Contact Info</strong>
      <div>
        <AiFillPhone /> {props.phoneNumber}
      </div>
      <div>
        <MdEmail /> {props.email}
      </div>
    </DetailsCustomerNameWrapper>
  )
}

const OrderTimeWrapper = styled.div`
  grid-area: OrderTimeSpace;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  flex-wrap: wrap;
  width: 100%;
  height: 100%;
`

function MakeOrderTimeDetails(props) {
  return (
    <OrderTimeWrapper>
      <strong>Pickup Time</strong>
      <div>{props.pickupTime}</div>
    </OrderTimeWrapper>
  )
}

const ItemDetailsWrapper = styled.div`
  grid-area: ItemDetailsSpace;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  flex-wrap: wrap;
  width: 100%;
  height: 100%;
`

const IndividualItemWrapper = styled.div`
  display: grid;
  grid-template-columns: 2fr 9fr 2.5fr;
  grid-template-rows: 1fr;
  width: 85%;
  height: max-content;
  font-size: 1.9vh;
`

const ItemDetailWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  font-size: 1.9vh;
  text-align: left;
`

function MakeOrderItem(props) {
  return (
    <IndividualItemWrapper>
      <strong>{props.quantity}</strong>
      <ItemDetailWrapper>
        <strong>{props.itemName}</strong>
        <div>
          <BiFoodMenu /> {props.variant}
        </div>
        <div>
          <IoIosAddCircleOutline />
          {props.modifiers}
        </div>
      </ItemDetailWrapper>
      <strong> {props.itemPrice}</strong>
    </IndividualItemWrapper>
  )
}

export {
  MakeOrderTimeDetails,
  MakeCustomerDetails,
  ClosedOrderDetailsWrapper,
  ItemDetailsWrapper,
  MakeOrderItem
}
