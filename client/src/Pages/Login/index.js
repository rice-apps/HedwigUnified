import React, { useState } from 'react'
import { useQuery, gql } from '@apollo/client'

import logo from './logo.svg'
import LoginModal from './LoginModal';
import { MainDiv, Logo, Title, SubTitle, LoginButton } from './Login.styles'
// import './Transitions.css';

// const GET_SERVICE_LOCAL = gql`
//     query GetService {
//         service @client # @client indicates that this is a local field; we're just looking at our cache, NOT our backend!
//     }
// `;

function Login () {
  // Fetch service from cache since it depends on where this app is deployed
  // const { data } = useQuery(GET_SERVICE_LOCAL);
  const [modalOpen, setModalOpen] = useState(false);
  const [openStatus, setOpenStatus] = useState("exit");

  const openModal = () => { 
    setModalOpen(true); 
  }

  return (
    <MainDiv>
      <Logo src={logo} />
      <Title>HEDWIG</Title>
      <SubTitle>brought to you by riceapps</SubTitle>
      {modalOpen && 
        <LoginModal changeVisibility = {setModalOpen}></LoginModal>}
      <LoginButton onClick={openModal}>Login with NetID</LoginButton>
    </MainDiv>
  )
}

export default Login
