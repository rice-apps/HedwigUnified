import React, { useState } from 'react'
import styled from 'styled-components'
import { IconContext } from 'react-icons'
import { BsFillClockFill } from 'react-icons/bs'
import { BiFoodMenu } from 'react-icons/bi'
import { IoIosAddCircleOutline } from 'react-icons/io'
import { FaIdCard } from 'react-icons/fa'
import Modal from 'react-modal'
import { gql, useMutation } from '@apollo/client'
import moment from 'moment'
import { GrRestaurant } from 'react-icons/gr'

const ACCEPT_ORDER = gql`
  mutation {
    updateOrder(
      orderId: "Pu4mWMvZJlkb2J0QdxIWapYVt9EZY"
      record: {
        fulfillment: { uid: "WXe2kpdIeO7phMhR7hY6GD", state: RESERVED }
      }
    ) {
      fulfillment {
        uid
        state
      }
    }
  }
`

const OrderCardWrapper = styled.div`
  background-color: white;
  border-radius: 20px;
  border-width: 2px;
  border-color: #cacaca;
  border-style: solid;
  justify-self: center;
  font-family: 'Futura', sans-serif;
  display: grid;
  width: 26vw;
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
  display: grid;
  grid-template-columns: 1fr 2fr 1fr;
  grid-template-rows: 1fr;
  font-size: 22px;
  justify-content: center;
  justify-items: center;
  padding-top: 8px;
  align-items: center;
  overflow: hidden;
  border-top-right-radius: 20px;
  border-top-left-radius: 20px;
`

function MakeOrderTitle (props) {
  return (
    <OrderTitleSpaceWrapper>
      <GrRestaurant />
      <div>{props.customerName}</div>
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
const ButtonWrapper = styled.button`
  font-family: 'Futura', sans-serif;
  border-radius: 20px;
  cursor: pointer;
  border: 0px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 5px 20px;
  margin: 0px 15px;
  margin-bottom: 15px;
`

const AcceptButton = styled(ButtonWrapper)`
  background-color: #f9ddd7;
`

const CancelButton = styled(ButtonWrapper)`
  background-color: #dedede;
`

const ReadyButton = styled(ButtonWrapper)`
  background-color: #fadfbe;
`
const PickedUpButton = styled(ButtonWrapper)`
  background-color: #deeee7;
`

const ModalWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 2fr 4fr 5fr 3fr;
  grid-template-areas:
    'ModalHeader'
    'ModalParagraph'
    'ModalOrderDetails'
    'ModalButtons';
  height: 100%;
  width: 100%;
  align-items: center;
  color: black;
`

const ModalHeaderWrapper = styled.div`
  grid-area: ModalHeader;
  height: 100%;
  width: 100%;
  font-size: 30px;
  align-items: center;
  display: flex;
  flex-direction: row;
  justify-content: center;
`

function MakeModalHeader (props) {
  const paymentType = props.paymentType
  return (
    <ModalHeaderWrapper>
      <FaIdCard style={{ marginTop: '3px', marginRight: '12px' }} />
      {paymentType === 'Tetra' ? (
        <div>Tetra Pay (No.{props.orderNumber})</div>
      ) : null}
      {paymentType === 'Membership' ? (
        <div>Cohen House Membership ID (No.{props.orderNumber})</div>
      ) : null}
      {paymentType === 'Credit' ? (
        <div>Credit Card (No.{props.orderNumber})</div>
      ) : null}
    </ModalHeaderWrapper>
  )
}

const ModalParagraphWrapper = styled.div`
  /* background-color: blue; */
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  font-size: 16px;
  grid-area: ModalParagraph;
  border-bottom: 1px solid grey;
`
function MakeModalParagraph (props) {
  const paymentType = props.paymentType
  const cancel = props.cancel
  if (paymentType === 'Tetra') {
    return (
      <ModalParagraphWrapper>
        <div>
          This order is paid in <strong>Tetra</strong>. <br />
          Please <strong>manually</strong> enter the following buyer's
          information into the
          <strong> Tetra Reader</strong>.
        </div>
      </ModalParagraphWrapper>
    )
  } else if (paymentType === 'Membership') {
    return (
      <ModalParagraphWrapper>
        <div>
          This order is paid with Cohen House <strong>Membership ID</strong>.
          Please <strong>manually</strong> enter the following buyer's
          information into the system.
        </div>
      </ModalParagraphWrapper>
    )
  } else if (paymentType === 'Credit') {
    return (
      <ModalParagraphWrapper>
        <div>
          This order is paid in <strong>Credit Card</strong>. <br />
          You can proceed to accept the order.
        </div>
      </ModalParagraphWrapper>
    )
  } else if (cancel === true) {
    return (
      <ModalParagraphWrapper style={{ justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', fontSize: '20px' }}>
          Are you sure you want to <strong>cancel</strong> this order?
        </div>
      </ModalParagraphWrapper>
    )
  } else {
    return <ModalParagraphWrapper>error</ModalParagraphWrapper>
  }
}

const ModalOrderDetailsWrapper = styled.div`
  grid-area: ModalOrderDetails;
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  border-bottom: 1px solid grey;
`

const ModalOrderDetailRow = styled.div`
  width: 35%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin: 1.2px 0px;
`
function MakeModalOrderDetails (props) {
  const paymentType = props.paymentType
  return (
    <ModalOrderDetailsWrapper>
      <ModalOrderDetailRow>
        <div>Customer:</div>
        <div>{props.customerName}</div>
      </ModalOrderDetailRow>
      <ModalOrderDetailRow>
        {paymentType === 'Tetra' ? (
          <div>Student ID:</div>
        ) : paymentType === 'Membership' ? (
          <div>Membership ID:</div>
        ) : null}
        {paymentType === 'Tetra' || paymentType === 'Membership' ? (
          <div> *******</div>
        ) : null}
      </ModalOrderDetailRow>
      <ModalOrderDetailRow>
        <div>Amount:</div>
        <div>${props.orderTotal}</div>
      </ModalOrderDetailRow>
    </ModalOrderDetailsWrapper>
  )
}

const ModalButtonsWrapper = styled.div`
  grid-area: ModalButtons;
  margin-top: 4vh;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`

function MakePaymentSpace (props) {
  const [acceptModalIsOpen, setAcceptModalIsOpen] = useState(false)
  const [cancelModalIsOpen, setCancelModalIsOpen] = useState(false)
  function openAcceptModal () {
    setAcceptModalIsOpen(true)
  }
  function closeAcceptModal () {
    setAcceptModalIsOpen(false)
  }
  function openCancelModal () {
    setCancelModalIsOpen(true)
  }
  function closeCancelModal () {
    setCancelModalIsOpen(false)
  }

  const cancelOrder = props.cancelClick

  function MakePaymentButtons (props) {
    let buttonStatus = props.buttonStatus

    return (
      <div>
        {buttonStatus === 'NEW' ? (
          <ButtonsSpaceWrapper>
            <CancelButton onClick={openCancelModal}>Cancel</CancelButton>
            <AcceptButton onClick={openAcceptModal}>Accept</AcceptButton>
          </ButtonsSpaceWrapper>
        ) : buttonStatus === 'ACCEPTED' ? (
          <ButtonsSpaceWrapper>
            <CancelButton onClick={openCancelModal}>Cancel</CancelButton>
            <ReadyButton onClick={props.handleClick}>Ready</ReadyButton>
          </ButtonsSpaceWrapper>
        ) : (
          (buttonStatus = 'READY' ? (
            <ButtonsSpaceWrapper>
              <CancelButton onClick={openCancelModal}>Cancel</CancelButton>
              <PickedUpButton onClick={props.handleClick}>
                Picked Up
              </PickedUpButton>
            </ButtonsSpaceWrapper>
          ) : (
            'error'
          ))
        )}
      </div>
    )
  }

  return (
    <PaymentSpaceWrapper>
      <CostSpaceWrapper>
        <div>
          Tax: <strong>${props.orderTax}</strong>
        </div>
        <div>
          Total: <strong>${props.orderTotal}</strong>
        </div>
      </CostSpaceWrapper>
      <ButtonsSpaceWrapper>
        <MakePaymentButtons
          handleClick={props.handleClick}
          buttonStatus={props.buttonStatus}
        />
      </ButtonsSpaceWrapper>

      <Modal
        isOpen={acceptModalIsOpen}
        style={{
          content: {
            backgroundColor: 'white',
            height: '44vh',
            width: '44vw',
            position: 'absolute',
            top: '28%',
            left: '28%',
            borderRadius: '20px',
            fontFamily: 'Futura'
          }
        }}
      >
        <ModalWrapper>
          <MakeModalHeader
            paymentType={props.paymentType}
            orderNumber={props.orderNumber}
          />
          <MakeModalParagraph paymentType={props.paymentType} cancel={false} />
          <MakeModalOrderDetails
            paymentType={props.paymentType}
            orderTotal={props.orderTotal}
            customerName={props.customerName}
          />
          <ModalButtonsWrapper>
            <CancelButton onClick={closeAcceptModal}>Cancel</CancelButton>
            <AcceptButton onClick={props.handleClick}> Accept </AcceptButton>
          </ModalButtonsWrapper>
        </ModalWrapper>
      </Modal>

      <Modal
        isOpen={cancelModalIsOpen}
        style={{
          content: {
            backgroundColor: 'white',
            height: '44vh',
            width: '44vw',
            position: 'absolute',
            top: '28%',
            left: '28%',
            borderRadius: '20px',
            fontFamily: 'Futura'
          }
        }}
      >
        <ModalWrapper>
          <MakeModalHeader
            paymentType={props.paymentType}
            orderNumber={props.orderNumber}
          />
          <MakeModalParagraph cancel />
          <MakeModalOrderDetails
            paymentType={props.paymentType}
            orderTotal={props.orderTotal}
            customerName={props.customerName}
          />
          <ModalButtonsWrapper>
            <CancelButton onClick={closeCancelModal}>Back</CancelButton>
            <AcceptButton onClick={(closeCancelModal, cancelOrder)}>
              Cancel
            </AcceptButton>
          </ModalButtonsWrapper>
        </ModalWrapper>
      </Modal>
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
    fulfillment,
    handleClick,
    buttonStatus,
    cancelClick
  } = props
  // RFC3339
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

          {items &&
            items.map(item => (
              <MakeOrderDetails
                quantity={item.quantity}
                itemName={item.name}
                price={item.total_money.amount / 100}
                variant={item.variation_name}
                // modifiers={[...item.modifiers.name].join(', ')}
              />
            ))}
        </OrderDetailsSpaceWrapper>
        <MakePaymentSpace
          buttonStatus={buttonStatus}
          orderCost={orderCost}
          orderTax={props.orderTax}
          orderTotal={orderTotal}
          fulfillment={fulfillment}
          paymentType={props.paymentType}
          handleClick={handleClick}
          customerName={customerName}
          cancelClick={cancelClick}
        />
      </OrderCardWrapper>
    </IconContext.Provider>
  )
}

export default OrderCard
