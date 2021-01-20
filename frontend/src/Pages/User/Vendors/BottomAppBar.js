import styled from 'styled-components/macro'
import { GrCart } from 'react-icons/gr'
import { useNavigate } from 'react-router-dom'
import RalewayFont from '../../../fonts/GlobalFont.js'

const BottomNavigationWrapper = styled.div`
  position: fixed;
  bottom: 0px;
  height: 8.5vh;
  width: 100vw;
  background-color: white;
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 1fr;
  border-top: 1px solid darkgrey;
  align-items: center;
  justify-content: center;
  z-index: 1;
  font-size: 2.4vh;
`

const BottomNavigationItem = styled.div`
  height: 100%;
  width: 100%;
  color: #3d3d3d;
  background-color: white;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  font-weight: 500;
  &&:active {
    transform: scale(1.001);
    background-color: #fac8bb;
  }
`

const BottomNavigationText = styled.div`
  font-family: 'Raleway';
  margin-left: 8px;
`



function BottomAppBar () {
  const navigate = useNavigate()

  const CartItems = JSON.parse(localStorage.getItem('cartItems'))
  let cartAmount = 0
  CartItems.forEach(item => cartAmount += item.quantity)

  return (
    <BottomNavigationWrapper>
      <RalewayFont />
      <BottomNavigationItem onClick={() => navigate('/eat/cohen/cart')}>
        <GrCart style={{ fontSize: '2.8vh' }} />
        <BottomNavigationText>View Cart ({cartAmount})</BottomNavigationText>
      </BottomNavigationItem>
    </BottomNavigationWrapper>
  )
}

export default BottomAppBar
