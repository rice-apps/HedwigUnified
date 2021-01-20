import styled from 'styled-components/macro'

import HedwigLogoFinal from './../../../images/HedwigLogoFinal.png'
import RalewayFont from './../../../fonts/GlobalFont'
import { IoMdArrowRoundBack } from 'react-icons/io'
import { useNavigate, useLocation } from 'react-router-dom'

import { useQuery } from '@apollo/client'
import { VENDOR_QUERY } from '../../../graphql/VendorQueries'

const HeaderWrapper = styled.div`
  position: fixed;
  height: 8vh;
  font-size: 2.8vh;
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

const HedwigLogo = styled.img`
  height: 4.5vh;
  width: 4.5vh;
  margin-right: 5px;
  margin-top: 0l5vh;
`

const HedwigWrapper = styled.div`
  font-family: 'avenirbold';
  font-weight: 500;
  display: flex;
  justify-content: center;
  align-items: center;
  color: black;
`

function CartHeader ({vendorName, backLink, showBackButton}) {
  const navigate = useNavigate()
  const cart_menu = localStorage.getItem('cartItems')
  ? JSON.parse(localStorage.getItem('cartItems'))
  : null
const order = localStorage.getItem('cartItems')
  ? JSON.parse(localStorage.getItem('order'))
  : null
console.log(order)
console.log(cart_menu)

const backNav = !cart_menu ? '/eat' : order.vendor.name === 'Cohen House' ? '/eat/cohen/' : null 
const currVendor = order ? order.vendor.name : null 

  return (
    <HeaderWrapper>
      <RalewayFont />
      <HedwigWrapper>
        {showBackButton ? (
          <IoMdArrowRoundBack
            onClick={() => navigate(backNav, {state:{ currentVendor: currVendor}})}
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
