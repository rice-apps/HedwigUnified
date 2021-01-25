import { useState } from 'react'
import styled from 'styled-components/macro'
import { IconContext } from 'react-icons'
import { BsFillClockFill } from 'react-icons/bs'
import { BiFoodMenu } from 'react-icons/bi'
import { IoIosAddCircleOutline } from 'react-icons/io'
import { FaIdCard } from 'react-icons/fa'
import { GoVerified } from 'react-icons/go'
import Modal from 'react-modal'
import { useQuery, useLazyQuery } from '@apollo/client'
import moment from 'moment'
import gql from 'graphql-tag.macro'
import { GrRestaurant } from 'react-icons/gr'
import ORDER_TRACKER from '../../../../graphql/OrderTracker'
import VERIFY_PAYMENT from '../../../../graphql/VerifyPayment'
import {
  OrderCardWrapper,
  OrderTitleSpaceWrapper,
  OrderTimeSpaceWrapper,
  ExactTimeSpaceWrapper,
  TimeLeftSpaceWrapper,
  OrderDetailsSpaceWrapper,
  OrderDetailsItemWrapper,
  ItemDescriptionWrapper,
PaymentSpaceWrapper,
CostSpaceWrapper,
ButtonsSpaceWrapper,
AcceptButton,
CancelButton,
ReadyButton,
PickedUpButton,
ModalWrapper,
ModalHeaderWrapper,
ModalPaymentWrapper,
ModalParagraphWrapper,
ModalOrderDetailsWrapper,
ModalOrderDetailRow,
ModalButtonsWrapper
} from './OrderCard.styles'

const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD'
})

function MakeOrderTitle (props) {
  return (
    <OrderTitleSpaceWrapper>
      <GrRestaurant />
      <div>{props.customerName}</div>
      <BsFillClockFill />
    </OrderTitleSpaceWrapper>
  )
}

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
          Pickup time <br /> {props.pickupCountdown}
        </div>
      </TimeLeftSpaceWrapper>
    </OrderTimeSpaceWrapper>
  )
}


function MakeOrderDetails (props) {
  return (
    <OrderDetailsItemWrapper>
      <div style={{ fontWeight: 'bold' }}>{props.quantity}</div>
      <ItemDescriptionWrapper>
        <div style={{ textTransform: 'uppercase', fontWeight: 'bold', textAlign: 'left' }}>
          {props.itemName}
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'2.5vh 1fr', alignItmes:'center', textAlign:'left'}}>
          <BiFoodMenu style={{alignSelf:'flex-start', marginTop:'0.3vh'}} /> {props.variant}
        </div>
        {props.modifiers && (
          <div style={{ display:'grid', gridTemplateColumns:'2.5vh 1fr',alignItems:'center', textAlign:'left'}}>
            <IoIosAddCircleOutline style={{alignSelf:'flex-start', marginTop:'0.3vh'}} /> {props.modifiers}
          </div>
        )}
      </ItemDescriptionWrapper>
      <div style={{ fontWeight: 'bold' }}>{formatter.format(props.price)}</div>
    </OrderDetailsItemWrapper>
  )
}




function MakeModalHeader (props) {
  const paymentType = props.paymentType
  return (
    <ModalHeaderWrapper>
      <FaIdCard style={{ marginTop: '3px', marginRight: '12px' }} />
      {paymentType === 'TETRA' ? <div>Tetra</div> : null}
      {paymentType === 'COHEN' ? <div>Cohen House Membership ID </div> : null}
      {paymentType === 'CREDIT' ? <div>Credit Card </div> : null}
    </ModalHeaderWrapper>
  )
}


function isEmpty (obj) {
  for (var prop in obj) {
    if (obj.hasOwnProperty(prop)) {
      return false
    }
  }
}

function MakeModalParagraph (props) {
  const { paymentType, cancel, isVerified } = props
  if (paymentType === 'TETRA') {
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
  } else if (paymentType === 'COHEN') {
    return (
      <ModalParagraphWrapper>
        <div>
          This order is paid with Cohen House <strong>Membership ID</strong>.
          Please <strong>manually</strong> enter the following buyer's
          information into the system.
        </div>
      </ModalParagraphWrapper>
    )
  } else if (paymentType === 'CREDIT') {
    return (
      <ModalParagraphWrapper>
        <div style={{ width: '100%' }}>
          This order is paid in <strong>Credit Card</strong>. <br />
          {isVerified ? (
            <ModalPaymentWrapper>
              Payment Status: Verified <GoVerified color={'#2CA1D5'} />
            </ModalPaymentWrapper>
          ) : (
            <>
              <div>
                Payment Status:{' '}
                <span style={{ color: '#EA907A', fontWeight: 'bold' }}>
                  Pending
                </span>
              </div>
              <div>
                Payment has not been completed yet. Please check back later
              </div>
            </>
          )}
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
    return (
      <ModalParagraphWrapper>PaymentType is not defined.</ModalParagraphWrapper>
    )
  }
}


function MakeModalOrderDetails (props) {
  const paymentType = props.paymentType
  return (
    <ModalOrderDetailsWrapper>
      <ModalOrderDetailRow>
        <div>Customer:</div>
        <div>{props.customerName}</div>
      </ModalOrderDetailRow>
      <ModalOrderDetailRow>
        {paymentType === 'TETRA' ? (
          <div>Student ID:</div>
        ) : paymentType === 'COHEN' ? (
          <div>Membership ID:</div>
        ) : null}
        {paymentType === 'TETRA' ? (
          <div>{props.studentId}</div>
        ) : paymentType === 'COHEN' ? (
          <div>{props.cohenId}</div>
        ) : null}
      </ModalOrderDetailRow>
      <ModalOrderDetailRow>
        <div>Amount:</div>
        <div>{formatter.format(props.orderTotal)}</div>
      </ModalOrderDetailRow>
    </ModalOrderDetailsWrapper>
  )
}



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

  const [verify_payment, { data: verifyPaymentResult, loading }] = useLazyQuery(
    VERIFY_PAYMENT
  )

  let isVerified = false

  if (!loading && verifyPaymentResult !== undefined) {
    isVerified = verifyPaymentResult.verifyPayment
  }

  function MakePaymentButtons (props) {
    let buttonStatus = props.buttonStatus

    return (
      <div>
        {buttonStatus === 'NEW' ? (
          <ButtonsSpaceWrapper>
            <CancelButton onClick={openCancelModal}>Cancel</CancelButton>
            <AcceptButton
              onClick={function () {
                verify_payment({
                  variables: {
                    paymentId: props.shopifyOrderId,
                    vendor: 'Cohen House',
                    source: 'SHOPIFY'
                  }
                })

                openAcceptModal()
              }}
            >
              Accept
            </AcceptButton>
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
          Tax:{' '}
          <strong>
            {props.orderTax
              ? formatter.format(props.orderTax)
              : formatter.format(0)}
          </strong>
        </div>
        <div>
          Total: <strong>{formatter.format(props.orderTotal)}</strong>
        </div>
      </CostSpaceWrapper>
      <ButtonsSpaceWrapper>
        <MakePaymentButtons
          handleClick={props.handleClick}
          buttonStatus={props.buttonStatus}
          shopifyOrderId={props.shopifyOrderId}
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
            borderRadius: '20px'
          }
        }}
      >
        <ModalWrapper>
          <MakeModalHeader
            paymentType={props.paymentType}
            orderNumber={props.orderNumber}
          />
          <MakeModalParagraph
            paymentType={props.paymentType}
            cancel={false}
            isVerified={isVerified}
          />
          <MakeModalOrderDetails
            paymentType={props.paymentType}
            orderTotal={props.orderTotal}
            customerName={props.customerName}
            studentId={props.studentId}
            cohenId={props.cohenId}
          />
          <ModalButtonsWrapper>
            <CancelButton
              onClick={() => {
                closeAcceptModal()
                cancelOrder()
              }}
            >
              Cancel
            </CancelButton>
            {(props.paymentType !== 'CREDIT') |
            ((props.paymentType === 'CREDIT') & isVerified) ? (
              <AcceptButton
                onClick={() => {
                  props.handleClick()
                  closeAcceptModal()
                }}
              >
                Accept
              </AcceptButton>
            ) : (
              <AcceptButton onClick={closeAcceptModal}>
                Return To Home
              </AcceptButton>
            )}
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
            borderRadius: '20px'
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
            <AcceptButton onClick={() => (closeCancelModal(), cancelOrder())}>
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
    submissionTime,
    items,
    orderCost,
    orderTotal,
    fulfillment,
    handleClick,
    buttonStatus,
    cancelClick,
    id
  } = props
  // RFC3339

  const {
    data: orderTrackerData,
    loading: orderTrackerLoading,
    error: orderTrackerError
  } = useQuery(ORDER_TRACKER, {
    variables: { orderId: id }
  })

  if (orderTrackerLoading) {
    return <p style={{ fontSize: '10px' }}> Loading...</p>
  }

  if (orderTrackerError) {
    return <p style={{ fontSize: '10px' }}> {orderTrackerError.message}.</p>
  }

  const pickupAt = moment(pickupTime).format('h:mm A')
  const submittedAt = submissionTime
    ? moment(submissionTime).format('h:mm A')
    : 'None'
  const timeLeft = moment(pickupTime).fromNow()

  return (
    <IconContext.Provider
      value={{ style: { verticalAlign: 'middle', marginBottom: '2px' } }}
    >
      {console.log(orderTrackerData.getOrderTracker)}
      <OrderCardWrapper>
        {/* Section of Order card with customer name, order number */}

        <MakeOrderTitle orderNumber='12' customerName={customerName} />

        {/* Section of order card with pick up time, order submission time, and payment method */}
        <MakeOrderTime
          pickupTime={pickupAt}
          submissionTime={submittedAt}
          paymentType={
            orderTrackerData.getOrderTracker === null
              ? 'None'
              : orderTrackerData.getOrderTracker.paymentType === null
              ? 'None'
              : orderTrackerData.getOrderTracker.paymentType
          }
          pickupCountdown={timeLeft}
        />
        {/* Section of order card with items ordered by customer with modifiers and variants listed as well as price */}
        <OrderDetailsSpaceWrapper>
          {/* Call MakeOrderDetails function for each unique item in the cart,
          can be called multiple times if multiple items are in order */}

          {items &&
            items.map(function (item) {
              let modifiers = item.modifiers?.map(modifier => modifier.name)

              return (
                <MakeOrderDetails
                  quantity={item.quantity}
                  itemName={item.name}
                  price={item.totalMoney.amount / 100}
                  variant={item.variationName}
                  modifiers={modifiers && [...modifiers].join(', ')}
                />
              )
            })}
        </OrderDetailsSpaceWrapper>
        <MakePaymentSpace
          buttonStatus={buttonStatus}
          orderCost={orderCost}
          studentId={props.studentId}
          cohenId={props.cohenId}
          orderTax={props.orderTax}
          orderTotal={orderTotal}
          fulfillment={fulfillment}
          paymentType={
            orderTrackerData.getOrderTracker === null
              ? 'None'
              : orderTrackerData.getOrderTracker.paymentType === null
              ? 'None'
              : orderTrackerData.getOrderTracker.paymentType
          }
          handleClick={handleClick}
          customerName={customerName}
          cancelClick={cancelClick}
          id={props.id}
          shopifyOrderId={
            orderTrackerData.getOrderTracker == null
              ? 'None'
              : orderTrackerData.getOrderTracker.shopifyOrderId
              ? orderTrackerData.getOrderTracker.shopifyOrderId
              : null
          }
        />
      </OrderCardWrapper>
    </IconContext.Provider>
  )
}

export default OrderCard
