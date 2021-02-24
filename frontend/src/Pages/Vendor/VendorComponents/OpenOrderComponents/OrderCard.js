import { useState, useEffect } from 'react'
import { IconContext } from 'react-icons'
import { BsFillClockFill } from 'react-icons/bs'
import { BiFoodMenu } from 'react-icons/bi'
import { IoIosAddCircleOutline } from 'react-icons/io'
import { IoIosArrowUp, IoIosArrowDown, IoMdMail } from 'react-icons/io'
import { ImPhone } from 'react-icons/im'
import { useQuery, useLazyQuery } from '@apollo/client'
import moment from 'moment'
import { GrRestaurant } from 'react-icons/gr'
import ORDER_TRACKER from '../../../../graphql/OrderTracker'
import VERIFY_PAYMENT from '../../../../graphql/VerifyPayment'
import { AiFillCheckCircle } from 'react-icons/ai'
import {
  OrderCardWrapper,
  OrderTitleSpaceWrapper,
  OrderTitleContactHidden,
  OrderTitleContactShown,
  OrderTitleContact,
  OrderTitleIconOneDiv,
  OrderTitleIconTwoDiv,
  OrderTitleContactIcon,
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
  ModalOrderDetailsWrapper,
  ModalButtonsWrapper,
  Background,
  ModalOrderWrapper,
  ModalOrderItem,
  ModalItemList,
  ModalSubtitle,
  ModalDetail,
  ModalCancelMessage
} from './OrderCard.styles'

const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD'
})

function MakeOrderTitle (props) {
  const [showContact, setShowContact] = useState(false)

  return (
    <>
      <OrderTitleSpaceWrapper>
        <OrderTitleIconOneDiv>
          <GrRestaurant />
        </OrderTitleIconOneDiv>

          {showContact 
            ?
              <OrderTitleContactShown
                onClick={() => {
                  setShowContact(!showContact)
                }}
              >
                <div>
                  {props.customerName} {' '}
                  <IoIosArrowUp />
                </div>

                <OrderTitleContact>
                  <OrderTitleContactIcon> <ImPhone /> </OrderTitleContactIcon>
                  <>
                    ({props.customerPhone.substring(0, 3)}) {props.customerPhone.substring(3, 6)}
                    -{props.customerPhone.substring(6)}
                  </>
                  <OrderTitleContactIcon> <IoMdMail /> </OrderTitleContactIcon>
                  {props.customerEmail}
                </OrderTitleContact>

              </OrderTitleContactShown>
            :  
              <OrderTitleContactHidden
                onClick={() => {
                  setShowContact(!showContact)
                }}
              >
                {props.customerName} {' '}
                <IoIosArrowDown />
              </OrderTitleContactHidden>
          }

        <OrderTitleIconTwoDiv>
          <BsFillClockFill />
        </OrderTitleIconTwoDiv>
        
      </OrderTitleSpaceWrapper>
    </>
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

// MakeOrderDetails makes the component for a single item on the order dashboard
function MakeOrderDetails (props) {
  return (
    <OrderDetailsItemWrapper>
      <div style={{ fontWeight: 'bold' }}>{props.quantity}</div>
      <ItemDescriptionWrapper>
        <div
          style={{
            textTransform: 'uppercase',
            fontWeight: 'bold',
            textAlign: 'left'
          }}
        >
          {props.itemName}
        </div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '2.5vh 1fr',
            alignItmes: 'center',
            textAlign: 'left'
          }}
        >
          <BiFoodMenu style={{ alignSelf: 'flex-start', marginTop: '0.3vh' }} />{' '}
          {props.variant}
        </div>
        {props.modifiers && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '2.5vh 1fr',
              alignItems: 'center',
              textAlign: 'left'
            }}
          >
            <IoIosAddCircleOutline
              style={{ alignSelf: 'flex-start', marginTop: '0.3vh' }}
            />{' '}
            {props.modifiers}
          </div>
        )}
      </ItemDescriptionWrapper>
      <div style={{ fontWeight: 'bold' }}>{formatter.format(props.price)}</div>
    </OrderDetailsItemWrapper>
  )
}

function MakeModalOrder (props) {
  return (
    <ModalOrderItem>
      <div>{props.quantity}</div>
      <ItemDescriptionWrapper>
        <div
          style={{
            textTransform: 'uppercase',
            textAlign: 'left'
          }}
        >
          {props.itemName}
        </div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '2.5vh 1fr',
            alignItmes: 'center',
            textAlign: 'left'
          }}
        >
          <BiFoodMenu style={{ alignSelf: 'flex-start', marginTop: '0.3vh' }} />{' '}
          {props.variant}
        </div>
        {props.modifiers && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '2.5vh 1fr',
              alignItems: 'center',
              textAlign: 'left'
            }}
          >
            <IoIosAddCircleOutline
              style={{ alignSelf: 'flex-start', marginTop: '0.3vh' }}
            />{' '}
            {props.modifiers}
          </div>
        )}
      </ItemDescriptionWrapper>
      <div style={{ textAlign: 'right' }}>{formatter.format(props.price)}</div>
    </ModalOrderItem>
  )
}

function MakeModalHeader (props) {
  return (
    <ModalHeaderWrapper>New Order: {props.customerName}</ModalHeaderWrapper>
  )
}

function MakeModalDetails (props) {
  const phone = props.phone
  const formattedPhone = phone.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3')

  return (
    <ModalOrderDetailsWrapper>
      <ModalSubtitle>Buyer Contact:</ModalSubtitle>
      <ModalDetail>
        <div>Phone: {formattedPhone}</div>
        <div>Email: {props.email}</div>
      </ModalDetail>
      <ModalSubtitle>Payment Details: </ModalSubtitle>
      <ModalDetail>
        <div>
          Type: <span style={{ fontWeight: 'bold' }}>{props.paymentType}</span>
        </div>
        {props.paymentType === 'CREDIT' ? (
          <div>
            Status:{' '}
            <span
              style={{
                color: props.isVerified ? '#1cc57f' : '#EA907A',
                fontWeight: 'bold'
              }}
            >
              {props.isVerified ? (
                <span>
                  Verified <AiFillCheckCircle />{' '}
                </span>
              ) : (
                <span>Pending</span>
              )}
            </span>
          </div>
        ) : props.paymentType === 'TETRA' ? (
          <div>
            Student ID:{' '}
            <span style={{ fontWeight: 'bold', letterSpacing: '1px' }}>
              {props.studentId}
            </span>
          </div>
        ) : props.paymentType === 'COHEN' ? (
          <div>
            Cohen ID:{' '}
            <span style={{ fontWeight: 'bold', letterSpacing: '1px' }}>
              {props.cohenId}
            </span>
          </div>
        ) : (
          <div>Error!</div>
        )}
      </ModalDetail>
      <ModalSubtitle>Pickup Details:</ModalSubtitle>
      <ModalDetail>
        <div>
          Submitted: <span> {props.submissionTime}</span>
        </div>
        <div>
          Pick Up:{' '}
          <span style={{ fontWeight: 'bold' }}>{props.pickupTime}</span>
        </div>
      </ModalDetail>
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

  const { items } = props
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
            {props.pastPickup ? null : (
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
                View Payment
              </AcceptButton>
            )}
          </ButtonsSpaceWrapper>
        ) : buttonStatus === 'ACCEPTED' ? (
          <ButtonsSpaceWrapper>
            <CancelButton onClick={openCancelModal}>Cancel</CancelButton>
            <ReadyButton onClick={props.handleClick}>Order Ready</ReadyButton>
          </ButtonsSpaceWrapper>
        ) : (
          (buttonStatus = 'READY' ? (
            <ButtonsSpaceWrapper>
              <CancelButton onClick={openCancelModal}>Cancel</CancelButton>
              <PickedUpButton onClick={props.handleClick}>
                Pick Up Complete
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
          Total:{' '}
          <strong>{formatter.format(props.orderTotal + props.orderTax)}</strong>
        </div>
      </CostSpaceWrapper>
      <ButtonsSpaceWrapper>
        <MakePaymentButtons
          handleClick={props.handleClick}
          buttonStatus={props.buttonStatus}
          shopifyOrderId={props.shopifyOrderId}
          pastPickup={props.pastPickup}
        />
      </ButtonsSpaceWrapper>

      {acceptModalIsOpen && (
        <Background>
          <ModalWrapper>
            <MakeModalHeader customerName={props.customerName} />
            <ModalOrderWrapper>
              <ModalItemList>
                {items &&
                  items.map(function (item) {
                    const modifiers = item.modifiers?.map(
                      modifier => modifier.name
                    )

                    return (
                      <MakeModalOrder
                        quantity={item.quantity}
                        itemName={item.name}
                        price={item.totalMoney.amount / 100}
                        variant={item.variationName}
                        modifiers={modifiers && [...modifiers].join(', ')}
                      />
                    )
                  })}
              </ModalItemList>
              <ModalPaymentWrapper>
                <div>Tax:</div>
                <div>{formatter.format(props.orderTax)}</div>
                <div> Total:</div>
                <div style={{ fontWeight: 'bold' }}>
                  {formatter.format(props.orderTotal + props.orderTax)}
                </div>
              </ModalPaymentWrapper>
            </ModalOrderWrapper>
            <MakeModalDetails
              paymentType={props.paymentType}
              isVerified={isVerified}
              phone={props.phone}
              email={props.email}
              studentId={props.studentId}
              cohenId={props.cohenId}
              submissionTime={props.submissionTime}
              pickupTime={props.pickupTime}
            />
            <ModalButtonsWrapper>
              <CancelButton
                onClick={() => {
                  openCancelModal()
                  closeAcceptModal()
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
        </Background>
      )}

      {cancelModalIsOpen && (
        <Background>
          <ModalWrapper cancel>
            <MakeModalHeader customerName={props.customerName} />
            <ModalOrderWrapper>
              <ModalItemList>
                {items &&
                  items.map(function (item) {
                    const modifiers = item.modifiers?.map(
                      modifier => modifier.name
                    )

                    return (
                      <MakeModalOrder
                        quantity={item.quantity}
                        itemName={item.name}
                        price={item.totalMoney.amount / 100}
                        variant={item.variationName}
                        modifiers={modifiers && [...modifiers].join(', ')}
                      />
                    )
                  })}
              </ModalItemList>
              <ModalPaymentWrapper>
                <div>Tax:</div>
                <div>{formatter.format(props.orderTax)}</div>
                <div> Total:</div>
                <div style={{ fontWeight: 'bold' }}>
                  {formatter.format(props.orderTotal + props.orderTax)}
                </div>
              </ModalPaymentWrapper>
            </ModalOrderWrapper>
            <MakeModalDetails
              paymentType={props.paymentType}
              isVerified={isVerified}
              phone={props.phone}
              email={props.email}
              studentId={props.studentId}
              cohenId={props.cohenId}
              submissionTime={props.submissionTime}
              pickupTime={props.pickupTime}
            />
            {/* <ModalCancelMessage>Are you sure you want to cancel?</ModalCancelMessage> */}
            <ModalButtonsWrapper>
              <CancelButton onClick={closeCancelModal}>Back</CancelButton>
              <AcceptButton onClick={() => (closeCancelModal(), cancelOrder())}>
                Cancel
              </AcceptButton>
            </ModalButtonsWrapper>
            <ModalCancelMessage>
              Are you sure you want to cancel this order?
            </ModalCancelMessage>
          </ModalWrapper>
        </Background>
      )}
    </PaymentSpaceWrapper>
  )
}

function isPastPickup (pickupTime, currentTime) {
  const pickupTimeBuffer = 0
  const pastPickup = currentTime.diff(pickupTime, 'minutes') > pickupTimeBuffer
  return pastPickup
}

function OrderCard (props) {
  const [currentTime, setCurrentTime] = useState(moment())

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(moment())
    }, 1000)
    return () => {
      clearInterval(timer)
    }
  }, [])
  const {
    customerName,
    email,
    phone,
    pickupTime,
    submissionTime,
    items,
    orderCost,
    orderTotal,
    fulfillment,
    handleClick,
    buttonStatus,
    cancelClick,
    id,
    newOrder
  } = props

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

  // pastPickup is true if current time has past an order's pickuptime + buffer
  const pastPickup = isPastPickup(pickupTime, currentTime) && newOrder

  const pickupAt = moment(pickupTime).format('h:mm A')
  const submittedAt = submissionTime
    ? moment(submissionTime).format('h:mm A')
    : 'None'
  const timeLeft = moment(pickupTime).fromNow()

  return (
    <IconContext.Provider
      value={{ style: { verticalAlign: 'middle', marginBottom: '2px' } }}
    >
      <OrderCardWrapper pastPickup={pastPickup}>
        {/* Section of Order card with customer name, order number */}

        <MakeOrderTitle
         customerName={customerName}
         customerPhone={phone}
         customerEmail={email}
        />

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
              const modifiers = item.modifiers?.map(modifier => modifier.name)

              return (
                <MakeOrderDetails
                  key={id + item.name}
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
          pastPickup={pastPickup}
          items={items}
          email={email}
          phone={phone}
          buttonStatus={buttonStatus}
          orderCost={orderCost}
          studentId={props.studentId}
          cohenId={props.cohenId}
          orderTax={props.orderTotal * 0.0825}
          orderTotal={orderTotal}
          fulfillment={fulfillment}
          pickupTime={pickupAt}
          submissionTime={submittedAt}
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
