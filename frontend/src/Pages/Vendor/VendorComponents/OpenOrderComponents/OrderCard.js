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

const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD'
})

const OrderCardWrapper = styled.div`
  background-color: white;
  border-radius: 20px;
  border-width: 2px;
  border-color: #cacaca;
  border-style: solid;
  justify-self: center;

  display: grid;
  width: 26vw;
  height: max-content;
  margin: 10px;
  margin-right: 14px;
  overflow: visible;
  grid-template-columns: 1fr;
  grid-template-rows: max-content max-content max-content 92px;
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
  line-height: 23.5px;
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
  color: #2d2d2d;
  font-size: 13px;
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
          Pickup time <br /> {props.pickupCountdown}
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
        {props.modifiers && (
          <div>
            <IoIosAddCircleOutline /> {props.modifiers}
          </div>
        )}
      </ItemDescriptionWrapper>
      <div style={{ fontWeight: 'bold' }}>{formatter.format(props.price)}</div>
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
  font-family: 'Metropolis';
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
      {paymentType === 'TETRA' ? <div>Tetra</div> : null}
      {paymentType === 'COHEN' ? <div>Cohen House Membership ID </div> : null}
      {paymentType === 'CREDIT' ? <div>Credit Card </div> : null}
    </ModalHeaderWrapper>
  )
}

const ModalParagraphWrapper = styled.div`
  /* background-color: blue; */
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  text-align: center;
  font-size: 16px;
  grid-area: ModalParagraph;
  border-bottom: 1px solid grey;
`

const ModalPaymentWrapper = styled.div`
  color: #3d3d3d;
  font-weight: bold;
`

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
  const submittedAt = submissionTime ? moment(submissionTime).format('h:mm A') : "None"
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
            orderTrackerData.getOrderTracker === null ? "None" :
            orderTrackerData.getOrderTracker.paymentType === null 
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
            orderTrackerData.getOrderTracker === null ? "None" :
            orderTrackerData.getOrderTracker.paymentType === null 
              ? 'None'
              : orderTrackerData.getOrderTracker.paymentType
          }
          handleClick={handleClick}
          customerName={customerName}
          cancelClick={cancelClick}
          id={props.id}
          shopifyOrderId={
            orderTrackerData.getOrderTracker == null ? "None" :
            orderTrackerData.getOrderTracker.shopifyOrderId ? orderTrackerData.getOrderTracker.shopifyOrderId : null
          }
        />
      </OrderCardWrapper>
    </IconContext.Provider>
  )
}

export default OrderCard
