import styled from 'styled-components'
import { GrCart } from 'react-icons/gr'
import { MdReceipt } from 'react-icons/md'
import { useNavigate } from 'react-router-dom'
import { AiFillHome } from 'react-icons/ai'
import RalewayFont from './../../../fonts/Raleway/RalewayFont.js'



const BottomNavigationWrapper = styled.div`
  position: fixed;
  bottom: 0px;
  height: 9vh;
  width: 100vw;
  background-color: white;
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 1fr;
  border-top: 1px solid darkgrey;
  align-items: center;
  justify-content: center;
  z-index: 2;
  font-size:2.4vh;
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
  font-weight:500;
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
  return (
    <BottomNavigationWrapper>
      <RalewayFont />
      <BottomNavigationItem onClick={() => navigate('/eat/cohen/cart')}>
        <GrCart style={{fontSize: "2.8vh"}}/>
        <BottomNavigationText>View Cart</BottomNavigationText>
      </BottomNavigationItem>
    </BottomNavigationWrapper>
  )
}

export default BottomAppBar
