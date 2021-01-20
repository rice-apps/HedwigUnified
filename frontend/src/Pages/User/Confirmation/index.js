import '../AlmostThere/almostThere.css'
import { P, Button, Div, MessageWrapper } from '../AlmostThere/index'

import { useNavigate } from 'react-router-dom'
import { ReactComponent as FailureSVG } from './alert-circle.svg'
import { ReactComponent as HedwigLogoSVG } from '../../Login/HedwigLogoFinal.svg'
import { resetOrderSummary } from '../Cart/util'
import moment from 'moment'

function Failure () {
  const navigate = useNavigate()
  const handleHomeClick = () => {
    return navigate(`/eat`)
  }
  return (
    <div className='mainDiv'>
      <FailureSVG className='checkSvg' />
      <div>
        <P className='orderConfirmed'>Oops!</P>
        <P className='orderConfirmed'>An item you ordered is not available.</P>

        <P className='statusUpdate'>
          Please go back to your cart and make adjustments. Your order will{' '}
          <strong>not</strong> be placed at this time
        </P>
      </div>
      <Div>
        <Button className='bottomButton' onClick={handleHomeClick}>
          Home
        </Button>
      </Div>
    </div>
  )
}

function Confirmation () {
  const order = JSON.parse(localStorage.getItem('order'))
  const time = moment(order.fulfillment.pickupAt).format('h:mm A')
  const navigate = useNavigate()
  localStorage.setItem('cartItems', JSON.stringify([]))
  const handleHomeClick = () => {
    resetOrderSummary()
    return navigate(`/eat`)
  }
  return (
    <div className='mainDiv'>
      <HedwigLogoSVG className='checkSvg' />
      <div>
        <P title>Order Submitted!</P>
        <MessageWrapper>
          <P message>We'll text you updates on your order's status!</P>
        </MessageWrapper>
      </div>
      <Div vendorCard>
        <P header>{order.vendor.name}</P>
        <P header>Pick Up Instruction:</P>
        <P pickup time style={{ fontWeight: 'bold' }}>
          {' '}
          Pickup Time: {time}
        </P>
        <P pickup>{order.pickupInstruction}</P>
      </Div>

      <Div>
        <Button primary home onClick={handleHomeClick}>
          Home
        </Button>
      </Div>
    </div>
  )
}

export default Confirmation
