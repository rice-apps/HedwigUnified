import React from 'react'
import styled, { css } from 'styled-components'
import { useHistory } from 'react-router'
import { useNavigate } from 'react-router-dom'

const Primary = css`
  @import url('https://fonts.googleapis.com/css2?family=Poppins&display=swap');
  font-family: 'Raleway', sans-serif;
  font-weight: 500;
  /* background-color: #6fffe9; */
  color: #0b132b;
`

const HeaderDiv = styled.div`
  ${Primary}
  width: 100vw;
  height: 8vh;
  display: grid;
  grid-template-columns: 25% 75%;
  font-size: 15pt;
`

const LinksDiv = styled.div`
  display: grid;
  grid-template-columns: 33% 33% 33%;
  grid-template-areas: 'Vendors Profile Cart';
`

const Logo = styled.div`
  justify-self: center;
  align-self: center;
  grid-column: 1/2;
  :hover {
    cursor: pointer;
  }
`

const OrdersLink = styled.a`
  grid-column: 2/3;
  :hover {
    color: red;
    cursor: pointer;
  }
  align-self: center;
`
const VendorsLink = styled.a`
  grid-column: Vendors
  :hover {
    color: red;
    cursor: pointer;
  }
  align-self: center;
  justify-self: center;
`

const ProfileLink = styled.a`
  grid-column: Profile
  :hover {
    color: red;
    cursor: pointer;
  }
  align-self: center;
  justify-self: center;
`

const CartLink = styled.a`
  grid-area: Cart;
  :hover {
    color: red;
    cursor: pointer;
  }
  align-self: center;
  justify-self: center;
`

const SettingsLink = styled.a`
  grid-column: 4/5;
  :hover {
    color: red;
    cursor: pointer;
  }
  align-self: center;
`

const Header = () => {
  const navigate = useNavigate()

  return (
    <HeaderDiv>
      <Logo onClick={() => navigate('/home')}>Hedwig</Logo>
      <LinksDiv>
        <VendorsLink onClick={() => navigate('/eat')}>Vendors</VendorsLink>
        <ProfileLink onClick={() => navigate('/eat/profile')}>Profile</ProfileLink>
        <CartLink onClick={() => navigate('/eat/cohen/cart')}>Cart</CartLink>
        {/*<OrdersLink onClick={() => navigate('/eat/orders')}>Orders</OrdersLink>*/}
        
        {/*
        <SettingsLink onClick={() => navigate('/user/settings')}>
          Settings
        </SettingsLink>
        */}
      </LinksDiv>
    </HeaderDiv>
  )
}

export default Header
