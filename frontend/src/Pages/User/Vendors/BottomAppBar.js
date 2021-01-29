import styled from 'styled-components/macro'
import { useNavigate } from 'react-router-dom'

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
  background-color: #343330;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  font-weight: 600;
  position: relative;
  box-shadow: 1.5px 1.5px 5px 0.9px rgba(0, 0, 0, 0.2);
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

function BottomAppBar () {
  const navigate = useNavigate()

  const CartItems = JSON.parse(localStorage.getItem('cartItems'))
  let cartAmount = 0
  if (CartItems) {
    CartItems.forEach(item => (cartAmount += item.quantity))
  }
  console.log('CART AMOUNT', cartAmount)
  return (
    <BottomNavigationWrapper>
      <BottomNavigationItem onClick={() => navigate('/eat/cohen/cart')}>
        <BottomNavigationText>View Cart</BottomNavigationText>
        {cartAmount > 0 && <Counter>{cartAmount}</Counter>}
      </BottomNavigationItem>
    </BottomNavigationWrapper>
  )
}

export default BottomAppBar
