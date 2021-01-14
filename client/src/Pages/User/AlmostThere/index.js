import './almostThere.css'
import { useNavigate } from 'react-router-dom'
import { ReactComponent as WarningSVG } from './alert-circle.svg'
import { resetOrderSummary } from '../Cart/util'
import styled, { css } from 'styled-components'
import moment from 'moment'

export const Button = styled.div`
  font-size: 20px;
  display:flex;
  align-items: center;
  justify-content: center;
  line-height: 27px;
  color: #f3725b;
  height: 5vh;
  cursor:pointer;
  background-color: #ffffff;
  border: 1px solid #f3725b;
  border-radius: 20px;
  margin: auto;
  padding: 5px 20px 5px 20px;

  ${props =>
    props.primary &&
    css`
      background: #f3725b;
      color: white;
    `};
  ${props =>
    props.home &&
    css`
      position: absolute;
      margin-left: auto;
      margin-right: auto;
      left: 0;
      right: 0;
      bottom: 6vh;
      width:15vw;
    `};
`

export const P = styled.p`
  font-size: 12pt;
  color: #5a5953;
  font-family: 'Avenir Book', 'Arial Book', sans-serif;
  text-align: center;
  margin: 8px 16px 8px 16px;

  ${props =>
    props.header &&
    css`
      margin: 0px 5px;
      font-size: 19pt;
      color: #5a5953;
      position: relative;
      top: 14px;
      line-height: 22pt;
      font-family: 'Avenir Black', 'Arial Black', sans-serif;
      text-align: center;
    `};

  ${props =>
    props.pickup &&
    css`
      margin: 0.2vh 1vw;
      font-size: 2.1vh;
      position: relative;
      top: 15px;
      font-family: 'Avenir Book', 'Arial Book', sans-serif;
    `};

  ${props =>
    props.title &&
    css`
      font-weight: 700;
      color: #f3725b;
      font-size: 20pt;
      margin: 8px 16px 8px 16px;
    `};

  ${props =>
    props.message &&
    css`
      font-size: 13.2pt;
      line-height: 16pt;
      width: 280px;
      margin: 0px 0px 15px 0px;
    `};
`

export const Div = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  background-color: #faf8f8;

  ${props =>
    props.vendorCard &&
    css`
      background-color: white;
      border-radius: 20pt;
      display: block;
      height: ${props => props.almostthere ? "25vh" : "35vh"};
      width: 290px;
      overflow:auto;
      margin: 2vh auto;
      box-shadow: 0px 3px 6px 0px #aaaaaa;
    `};
`

export const MessageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`

const AlmostThere = ({}) => {
  localStorage.setItem('cartItems', JSON.stringify([]))
  const navigate = useNavigate()
  const handleHomeClick = () => {
    resetOrderSummary()
    return navigate(`/eat`)
  }

  const order = JSON.parse(localStorage.getItem('order'))
  const time = moment(order.fulfillment.pickupAt)
  const handlePayment = () => {
    window.open(order.url)
  }

  return (
    <div className='mainDiv'>
      <WarningSVG className='checkSvg' />
      <MessageWrapper>
        <P title>Almost There!</P>
        <P message>
          You order is not complete until you enter payment details. You will
          receive a confirmation text once they are received.
        </P>
      </MessageWrapper>
      <Div>
        <Button primary onClick={handlePayment}>
          Enter Payment Details
        </Button>
      </Div>
      <Div vendorCard almostthere>
        <P header>{order.vendor.name}</P>
        <P header>Pick Up Instruction:</P>
        <P pickup>
          {order.pickupInstruction} {' '} at {' '}
          {time.hour()} {':'} 
          {time.minute()} {' '}
          {time.month() + 1} {'/'} {time.date()} {'/'} {time.year()}
        </P>
      </Div>

      <Div>
        <Button home onClick={handleHomeClick}>
          Home
        </Button>
      </Div>
    </div>
  )
}

export default AlmostThere
