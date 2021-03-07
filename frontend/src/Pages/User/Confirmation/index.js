import '../AlmostThere/almostThere.css'
import { P, Button, Div, MessageWrapper } from '../AlmostThere/index'

import { useNavigate } from 'react-router-dom'
import { ReactComponent as FailureSVG } from './alert-circle.svg'
import { ReactComponent as HedwigLogoSVG } from '../../Login/HedwigLogoFinal_02.svg'
import { resetOrderSummary } from '../Cart/util'
import moment from 'moment'

function Failure () {
  const navigate = useNavigate()
  const handleHomeClick = () => {
    return navigate('/eat')
  }
  return (
    <Div failure>
      <FailureSVG className='checkSvg' />
      <div>
        <P title>An item you ordered is not available.</P>
        <MessageWrapper>
          {' '}
          <P message>
            Please go back to your cart and make adjustments. Your order will{' '}
            <strong>not</strong> be placed at this time
          </P>
        </MessageWrapper>
      </div>
      <Div>
        <Button primary home onClick={handleHomeClick}>
          Home
        </Button>
      </Div>
    </Div>
  )
}

function Confirmation () {
  const order = JSON.parse(localStorage.getItem('order'))
  const time = moment(order.pickupTime).format('h:mm A')
  const navigate = useNavigate()
  localStorage.setItem('cartItems', JSON.stringify([]))
  const handleHomeClick = () => {
    resetOrderSummary()
    return navigate('/eat')
  }
  return (
    <div>
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
        {order.vendor.name != 'Test Account CMT'
          ? <P pickup time style={{ fontWeight: 'bold' }}>
            {' '}
            Pickup Time: {time}
          </P> : null}
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

export { Confirmation, Failure }
