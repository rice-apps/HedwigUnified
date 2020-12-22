import './almostThere.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMapPin } from '@fortawesome/free-solid-svg-icons'
import { useNavigate } from 'react-router-dom'
import { ReactComponent as WarningSVG } from './alert-circle.svg'
import { orderSummary } from '../../../apollo'
import styled, { css } from 'styled-components'

export const Button = styled.button`
  font-size: 20px;
  line-height: 27px;
  color: #db6142;
  height: 5vh;
  background-color: #ffffff;
  border: 1px solid #db6142;
  border-radius: 20px;
  margin: auto;
  padding: 5px 20px 5px 20px;

  ${props =>
    props.primary &&
    css`
      background: #db6142;
      color: white;
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
      top: -30px;
      font-family: 'Avenir Black', 'Arial Black', sans-serif;
      text-align: center;
    `};

    ${props =>
      props.pickup &&
      css`
        margin: 0.2vh 1vw;
        font-size: 14pt;
        position: relative;
        top: -30px;
        font-family: 'Avenir Book', 'Arial Book', sans-serif;
    `};

    ${props =>
      props.title &&
      css`
        font-size: 20pt;
        margin: 8px 16px 8px 16px;
    `};
}
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
      height: 180px;
      width: 290px;
      margin: 2vh auto;
      box-shadow: 0px 3px 6px 0px #aaaaaa;
    `};
`

const AlmostThere = ({ classes }) => {

  const navigate = useNavigate()
  const handleHomeClick = () => {
    return navigate(`/eat`)
  }

  console.log(orderSummary());
  const order = orderSummary();
  const handlePayment = () => {
    window.open(order.url)
  }
  
    return (
      <div className='mainDiv'>
        <WarningSVG className='checkSvg' />
        <div>
          <P title>Almost There!</P>
          <P>
            You order is not complete until you enter payment details. 
            You will receive a confirmation text once they are received.
          </P>
        </div>
        <Div> 
          <Button primary onClick={handlePayment}>
            Enter Payment Details
          </Button>
        </Div>
        <Div vendorCard>
          <FontAwesomeIcon icon={faMapPin} className='pinIcon' />
          <P header>{order.vendor.name}</P>
          <P header>Pick Up Instruction:</P>
          <P pickup>Pick up at {order.fulfillment.placedAt} at 
            {order.fulfillment.pickupAt}
          </P>
        </Div>

        <Div>
          <Button onClick={handleHomeClick}>
            Home
          </Button>
        </Div>
      </div>
    )
}

export default AlmostThere
