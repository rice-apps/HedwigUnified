import hedwigLogo from './HedwigLogoFinal.svg'
import { Component, useEffect, useState } from 'react'
import { gql, useQuery, useMutation, useLazyQuery } from '@apollo/client'
import { userProfile } from '../../apollo'
import {
  MainDiv,
  Logo,
  Title,
  SubTitle,
  LoginButton,
  BackgroundCover,
  ButtonPane,
  VendorButton,
  ClientButton,
  ExitButton,
  LoginQuestion,
  HedwigLogo
} from './Login.styles'
import { useNavigate } from 'react-router-dom'

const GET_VENDOR = gql`
  query GET_VENDORS($name: String!){
    getVendor(filter: {name: $name} ){
      name
      _id
      allowedNetid
    }
  }
`

const VendorSelect = () => {
  const navigate = useNavigate()
  const userData = userProfile();

  const {data: vendorData, loading: vendorLoading, error: vendorError} = 
    useQuery(GET_VENDOR, { variables: {name: userData.vendor}})

  if (vendorLoading) return <p>Loading...</p>
  if (vendorError) return <p>User broken</p> 

  const allowedUsers = vendorData.getVendor.allowedNetid;
  console.log(allowedUsers);

  // have to modify this with /contact
  if (!allowedUsers.includes(userData.netid)){
    navigate('/eat');
  }

  const clientLogin = () => {
    navigate('/eat')
  }

  const vendorLogin = () => {
    navigate('/employee')
  }

  return (
    <BackgroundCover>
      {/* <ExitButton onClick = {closeModal}>Close</ExitButton> */}
      <LoginQuestion>How do you want to access Hedwig?</LoginQuestion>
      <ButtonPane>
        <VendorButton onClick={vendorLogin}>Login as Vendor</VendorButton>
        <ClientButton onClick={clientLogin}>
          Login as Client
          <HedwigLogo src={hedwigLogo} />
        </ClientButton>
      </ButtonPane>
    </BackgroundCover>
  )
}

export default VendorSelect
