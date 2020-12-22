import '../AlmostThere/almostThere.css'
import {P, Button, Div} from '../AlmostThere/index'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMapPin } from '@fortawesome/free-solid-svg-icons'
import { useNavigate } from 'react-router-dom'
import { ReactComponent as FailureSVG } from './alert-circle.svg'
import { ReactComponent as ConfirmationSVG } from './check-circle.svg'
import { orderSummary } from '../../../apollo'


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
          <P className='orderConfirmed'>
            An item you ordered is not available.
          </P>

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
    const order = orderSummary()
    const navigate = useNavigate()
    const handleHomeClick = () => {
      return navigate(`/eat`)
    }
    return (
      <div className='mainDiv'>
        <ConfirmationSVG className='checkSvg' />
        <div>
          <P title>Order Confirmed!</P>
          <P>
            You will receive order status updates via <strong>text.</strong>
          </P>
        </div>
        <div className='vendorCard'>
          <FontAwesomeIcon icon={faMapPin} className='pinIcon' />
          <P header>{order.vendor.name}</P>
          <P header>Pick Up Instruction:</P>
          <P pickup>Pick up at {order.fulfillment.placedAt} at 
            {order.fulfillment.pickupAt}
          </P>
        </div>

        <Div>
          <Button onClick={handleHomeClick}>
            Home
          </Button>
        </Div>
      </div>
    )
  }

export default Confirmation
