import styled from 'styled-components/macro'

import { IoMdArrowRoundBack } from 'react-icons/io'
import { useNavigate } from 'react-router-dom'

const HeaderWrapper = styled.div`
  position: fixed;
  height: 8vh;
  font-size: 2.8vh;
  font-weight: 600;
  width: 100vw;
  top: 0;
  display: grid;
  align-items: center;
  grid-template-columns: 1fr;
  grid-template-rows: 1fr;
  background-color: white;
  z-index: 1;
  padding-top: 1vh;
  box-shadow: 0px 0px 15px 1px rgba(0, 0, 0, 0.2);
`

const HedwigWrapper = styled.div`
  font-weight: 600;
  display: flex;
  justify-content: center;
  align-items: center;
  color: black;
`

function CartHeader ({ vendorName, showBackButton }) {
  const navigate = useNavigate()
  const cart_menu = localStorage.getItem('cartItems')
    ? JSON.parse(localStorage.getItem('cartItems'))
    : null
  const order = localStorage.getItem('cartItems')
    ? JSON.parse(localStorage.getItem('order'))
    : null
  console.log(order)
  console.log(cart_menu)

  const backNav = !cart_menu
    ? '/eat'
    : order.vendor.name === 'Cohen House'
      ? '/eat/cohen/'
      : '/eat'

  const currVendor = order ? order.vendor.name : null

  return (
    <HeaderWrapper>
      <HedwigWrapper>
        {showBackButton ? (
          <IoMdArrowRoundBack
            onClick={() =>
              navigate(backNav, { state: { currentVendor: currVendor } })}
            style={{
              position: 'fixed',
              left: '22px',
              fontSize: '25px',
              verticalAlign: 'middle',
              cursor: 'pointer'
            }}
          />
        ) : null}
        Checkout: {vendorName}
      </HedwigWrapper>
    </HeaderWrapper>
  )
}

export default CartHeader
