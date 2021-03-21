import './almostThere.css'
import { useNavigate } from 'react-router-dom'
import { ReactComponent as WarningSVG } from './alert-circle.svg'
import { resetOrderSummary } from '../Cart/util'
import styled, { css } from 'styled-components/macro'
import moment from 'moment'

export const Button = styled.div`
  font-size: 2.4vh;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  height: 5vh;
  cursor: pointer;
  background-color: #f3725b;
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
      position: fixed;
      margin-left: auto;
      margin-right: auto;
      left: 0;
      height: ${props => (props.almostthere ? '4vh' : '5vh')};
      right: 0;
      bottom: 4vh;
      width: 90px;
    `};
`

export const P = styled.p`
  font-size: 12pt;
  color: #5a5953;
  font-family: 'Proxima Nova', sans-serif;
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
      font-family: 'Proxima Nova';
      text-align: center;
    `};

  ${props =>
    props.pickup &&
    css`
      margin: 0.2vh 4vh;
      font-size: 2.3vh;
      line-height: 2.8vh;
      position: relative;
      top: 15px;
      text-align: center;
      font-family: 'Proxima Nova';
    `};
  ${props =>
    props.time &&
    css`
      font-size: 2.4vh;
      margin: 1vh 0vh;
      text-align: center;
    `}
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
      height: ${props => (props.almostthere ? '28vh' : '35vh')};
      width: 38vh;
      overflow: auto;
      margin: 2vh auto;
      box-shadow: 0px 3px 6px 0px #aaaaaa;
    `};

  ${props => props.button && css``}

  ${props =>
    props.failure &&
    css`
      display: flex;
      height: 80vh;
      background-color: white;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    `}
`

export const MessageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`

const AlmostThere = () => {
  localStorage.setItem('cartItems', JSON.stringify([]))
  const navigate = useNavigate()
  const handleHomeClick = () => {
    resetOrderSummary()
    return navigate('/eat')
  }

  const order = JSON.parse(localStorage.getItem('order'))
  const time = moment(order.pickupTime).format('h:mm A')
  const handlePayment = () => {
    window.open(order.url)
  }

  console.log(order)

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
        <P header>Pick Up Instructions:</P>
        <P pickup time style={{ fontWeight: 'bold' }}>
          {' '}
          Pickup Time: {time}
        </P>
        <P pickup>{order.pickupInstruction}</P>
      </Div>

      <Div button>
        <Button home almostthere onClick={handleHomeClick}>
          Home
        </Button>
      </Div>
    </div>
  )
}

export default AlmostThere
