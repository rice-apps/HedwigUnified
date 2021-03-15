import styled, { keyframes } from 'styled-components/macro'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { FcCancel } from 'react-icons/fc'

const BottomNavigationWrapper = styled.div`
  position: fixed;
  bottom: 0px;
  height: 9.5vh;
  width: 100vw;
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 1fr;
  align-items: center;
  justify-items: center;
  z-index: 1;
  font-size: 2.4vh;
`

const BottomNavigationItem = styled.div`
  height: 5vh;
  margin-bottom: 2vh;
  width: 23vh;
  border-radius: 5px;
  color: white;
  background-color: ${props => (props.notEmpty ? '#343330' : '#9A9998')};
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  font-weight: 600;
  position: relative;
  box-shadow: 1.5px 1.5px 5px 0.9px rgba(0, 0, 0, 0.2);
  opacity: ${props => (props.notEmpty ? '1' : '0.85')};
  /* display:${props => (props.notEmpty ? null : 'none')}; */
`

const BottomNavigationText = styled.div``

const Counter = styled.div`
  background-color: #56b48e;
  border-radius: 50%;
  display: flex;
  position: absolute;
  top: -1.3vh;
  right: -1.4vh;
  align-items: center;
  justify-content: center;
  font-size: 1.9vh;
  color: white;
  height: 3.2vh;
  width: 3.2vh;
  margin-left: 1vh;
`
export const ModalBackground = styled.div`
  position: fixed;
  height: 92vh;
  width: 100vw;
  backdrop-filter: blur(4px) brightness(75%);
  z-index: 3;
  bottom: 0px;
  left: 0px;
`

const appearanceAnimation = keyframes`
0%{
height:20vh;
width:20vh;
opacity:0;
}
100%{
  opacity:1;
  width:40vh;
  height:40vh;
}
`
export const Modal = styled.div`
  position: fixed;
  z-index: 4;
  left: 50%;
  top: 50%;
  border-radius: 20px;
  transform: translate(-50%, -50%);
  background-color: white;
  width: 40vh;
  height: 40vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  animation-name: ${appearanceAnimation};
  animation-iteration-count: 1;
  animation-duration: 0.2s;
`
export const ModalMessage = styled.div`
  font-size: 2.5vh;
  text-align: center;
  width: 80%;
  line-height: 3vh;
`
export const StyledCancel = styled.div`
  position: absolute;
  cursor: pointer;
  bottom: 3vh;
  color: white;
  border-radius: 20px;
  font-size: 2vh;
  letter-spacing: 0.2vh;
  background-color: #f3725b;
  padding: 0.2vh 1.9vh;
  left: 50%;
  transform: translateX(-50%);
`
function cartIsNotEmpty () {
  const cart_menu = localStorage.getItem('cartItems')
    ? JSON.parse(localStorage.getItem('cartItems'))
    : []
  return cart_menu.length != 0
}

function BottomAppBar () {
  const [showWarning, setShowWarning] = useState(false)
  const navigate = useNavigate()
  const cartExists = cartIsNotEmpty()
  console.log(cartExists)
  const CartItems = JSON.parse(localStorage.getItem('cartItems'))
  let cartAmount = 0
  if (CartItems) {
    CartItems.forEach(item => (cartAmount += item.quantity))
  }
  console.log('CART AMOUNT', cartAmount)
  return (
    <BottomNavigationWrapper>
      <BottomNavigationItem
        notEmpty={cartExists}
        onClick={() => {
          if (cartIsNotEmpty()) {
            navigate('/eat/cart')
          } else {
            setShowWarning(true)
          }
        }}
      >
        <BottomNavigationText>View Cart</BottomNavigationText>
        {cartAmount > 0 && <Counter>{cartAmount}</Counter>}
      </BottomNavigationItem>
      {showWarning && (
        <ModalBackground>
          <Modal>
            <FcCancel
              style={{
                fontSize: '15.5vh',
                marginTop: '-4.7vh',
                opacity: '0.6'
              }}
            />
            <ModalMessage>
              Your cart is empty! <br />
              Add items to your cart to checkout.
            </ModalMessage>
            <StyledCancel onClick={() => setShowWarning(false)}>
              close
            </StyledCancel>
          </Modal>
        </ModalBackground>
      )}
    </BottomNavigationWrapper>
  )
}

export default BottomAppBar
