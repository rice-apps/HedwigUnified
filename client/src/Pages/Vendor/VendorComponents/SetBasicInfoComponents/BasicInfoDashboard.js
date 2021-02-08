import styled, { css } from 'styled-components/macro'
import { useState, useEffect } from 'react'
import { useQuery, useMutation, useApolloClient } from '@apollo/client'
import gql from 'graphql-tag.macro'

const GET_VENDOR_INFO = gql`
  query GET_AVAILABILITY($name: String!) {
    getVendor(filter: { name: $name }) {
      name
      logoUrl
      website
      email
      facebook
      phone
      cutoffTime
      pickupInstruction
    }
  }
`

const UPDATE_VENDOR = gql`
  mutation UPDATE_VENDOR(
    $name: String!
    $website: String!
    $email: String!
    $facebook: String!
    $phone: String!
    $cutoffTime: Float!
    $pickupInstruction: String!
  ) {
    updateVendor(
      record: {
        website: $website
        email: $email
        facebook: $facebook
        phone: $phone
        cutoffTime: $cutoffTime
        pickupInstruction: $pickupInstruction
      }
      filter: { name: $name }
    ) {
      record {
        website
        email
        facebook
        phone
        cutoffTime
        pickupInstruction
      }
    }
  }
`

const Div = styled.div`
  font-size: 2.8vh;
  ${props =>
    props.wrapper &&
    css`
      height: 90%;
      width: 90%;
      background-color: white;
      border-radius: 15px;
      display: grid;
      grid-template-columns: 1fr 1fr;
      grid-template-rows: 2.8fr 0.8fr 0.8fr 0.8fr 1.5fr 2fr 1.2fr;
      grid-template-areas:
        'ImageSpace ImageSpace'
        'Name Website'
        'Email Facebook'
        'Phone Blank'
        'Cutoff Cutoff'
        'Pickup Pickup'
        'Button Button';
      justify-items: center;
      align-items: center;
    `}
  ${props =>
    props.detail &&
    css`
      display: grid;
      grid-area: ${props => props.gridArea};
      grid-template-rows: 1fr;
      grid-template-columns: 0.6fr 2fr;
      height: 100%;
      width: 100%;
      align-items: center;
    `}
 ${props =>
   props.detailTitle &&
   css`
     font-size: 2.35vh;
     font-weight: 500;
     text-align: right;
   `}
`

const Img = styled.img`
  ${props =>
    props.logo &&
    css`
      grid-area: ImageSpace;
      height: 18vh;
      width: 18vh;
      border-radius: 50%;
      margin-top: 10px;
    `}
`

const Input = styled.input`
  height: 4.5vh;
  border: none;
  border-radius: 20px;
  background-color: #f1f1f1;
  width: 85%;
  margin-left: 1rem;
  font-size: 2.2vh;
  padding-left: 15px;
  font-weight: 600;
`

function BasicInfoDetail (props) {
  return (
    <Div detail gridArea={props.gridArea}>
      <Div detailTitle>{props.gridArea}:</Div>
      <Input
        type='text'
        placeholder={props.placeholder}
        onChange={e => console.log(e.target.value)}
      ></Input>
    </Div>
  )
}

function isEmpty (obj) {
  for (var prop in obj) {
    if (obj.hasOwnProperty(prop)) return false
  }

  return true
}

function BasicInfoDashboard () {
  const [updateBasicInfo, { data, loading, error }] = useMutation(UPDATE_VENDOR)
  const {
    data: vendorData,
    loading: vendorLoading,
    error: vendorError
  } = useQuery(GET_VENDOR_INFO, {
    variables: { name: 'Cohen House' }
  })
  const [updatedInfo, setUpdatedInfo] = useState({})

  if (vendorError) {
    return <p>Error</p>
  }
  if (vendorLoading) {
    return <p>Waiting...</p>
  }
  const {
    name,
    logoUrl,
    website,
    email,
    facebook,
    phone,
    cutoffTime,
    pickupInstruction
  } = vendorData.getVendor

  console.log(
    'vendorData ',
    name,
    logoUrl,
    website,
    email,
    facebook,
    phone,
    cutoffTime,
    pickupInstruction
  )

  const originalInfo = {
    name: name,
    logoUrl: logoUrl,
    website: website,
    email: email,
    facebook: facebook,
    phone: phone,
    cutoffTime: cutoffTime,
    pickupInstruction: pickupInstruction
  }

  if (isEmpty(updatedInfo)) {
    setUpdatedInfo(originalInfo)
  }

  console.log('UPDATED', updatedInfo)

  // All fields are filled

  // Click save button

  // Add variables to the mutation:
  // updateBasicInfo({
  //   variables: {
  //     name: updatedInfo.name,
  //     website: updatedInfo.website,
  //     email: updatedInfo.email,
  //     facebook: updatedInfo.facebook,
  //     phone: updatedInfo.phone,
  //     cutoffTime: updatedInfo.cutoffTime,
  //     pickupInstruction: updatedInfo.pickupInstruction,
  //   },
  // });

  // Reload window
  // window.location.reload();

  // ------------------------
  // Original data (TEST):
  //   updateBasicInfo({
  //     variables: {
  //       name: 'Cohen House',
  //       website: 'https://facultyclub.rice.edu/contact-us',
  //       email: 'club@rice.edu',
  //       facebook: 'facebook.com/rice',
  //       phone: '713-348-4000',
  //       cutoffTime: 15,
  //       pickupInstruction: 'test'
  //     }
  //   })
  //   console.log(data)
  // ------------------------
  return (
    <Div wrapper>
      <Img logo src={vendorData.getVendor.logoUrl} />
      <BasicInfoDetail gridArea='Name' placeholder={updatedInfo.name} />
      <BasicInfoDetail gridArea='Website' placeholder={updatedInfo.website} />
      <BasicInfoDetail gridArea='Email' placeholder={updatedInfo.email} />
      <BasicInfoDetail gridArea='Facebook' placeholder={updatedInfo.facebook} />
      <BasicInfoDetail gridArea='Phone' placeholder={updatedInfo.phone} />
    </Div>
  )
}

export default BasicInfoDashboard
