import React from 'react';

import styled from 'styled-components'
import { FaShoppingCart } from 'react-icons/fa'
import { MdReceipt } from 'react-icons/md'
import { useNavigate } from 'react-router-dom'
import { AiFillHome } from 'react-icons/ai'
import RalewayFont from './../../../fonts/Raleway/RalewayFont.js'

const BottomNavigationWrapper = styled.div`
  position: fixed;
  bottom: 0px;
  height: 10vh;
  width: 100vw;
  background-color: white;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr;
  border-top: 1px solid darkgrey;
  align-items: center;
  justify-content: center;
  z-index: 2;
`

const BottomNavigationItem = styled.div`
  height: 100%;
  width: 100%;
  color: #3d3d3d;
  background-color: white;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  font-family: 'Raleway';
  font-weight: 500;
  &&:active {
    transform: scale(1.001);
    background-color: #fac8bb;
  }
`

const BottomNavigationText = styled.div`
  font-family: 'Raleway';
`

function BottomAppBar() {
  const navigate = useNavigate()
  return (
    <BottomNavigationWrapper>
      <RalewayFont />
      <BottomNavigationItem
        style={{ borderRight: '0.1px solid #D0D0D0' }}
        onClick={() => navigate('/eat')}
      >
        <AiFillHome />
        <BottomNavigationText>Home</BottomNavigationText>
      </BottomNavigationItem>
      <BottomNavigationItem onClick={() => navigate('/eat/cohen/cart')}>
        <FaShoppingCart />
        <BottomNavigationText>Cart</BottomNavigationText>
      </BottomNavigationItem>
    </BottomNavigationWrapper>
  )
}

export default BottomAppBar
