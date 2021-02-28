import styled, { css } from 'styled-components/macro'
import { useState } from 'react'
import { useQuery, useMutation } from '@apollo/client'
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
    $name: String
    $website: String
    $email: String
    $facebook: String
    $phone: String
    $cutoffTime: Float
    $pickupInstruction: String
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
      grid-template-rows: 2.8fr 0.8fr 0.8fr 0.8fr 1.2fr 2.3fr 1.2fr;
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
   ${props =>
     props.buttonwrapper &&
     css`
       grid-area: Button;
       height: 100%;
       width: 100%;
       display: flex;
       justify-content: center;
       align-items: center;
       font-size: 2.1vh;
       opacity: ${props => (props.disabled ? '0.3' : '1')};
     `}
    ${props =>
      props.flexWrapper &&
      css`
        height: 100%;
        width: 100%;
        display: flex;
        align-items: flex-start;
        flex-direction: column;
        grid-area: ${props => props.gridArea};
      `}
    ${props =>
      props.bottomTitle &&
      css`
        display: flex;
        margin-left:4.2rem;
        /* grid-template-columns: ${props =>
          props.pickup ? '1.0fr 3.6fr' : '0.6fr 4.6fr'}; */
        width: 100%;
        flex-direction: row;
        align-items: center;
        font-size: 2.35vh;
        font-weight: 500;
        text-align: left;
        margin-top: 1vh;
      `}
 
      ${props =>
        props.bottomSubtitle &&
        css`
          font-size: 2.1vh;
          text-align: left;
          margin-left: 2vh;
        `}

      ${props =>
        props.warning &&
        css`
          font-size: 1.8vh;
          opacity: 0.5;
          margin-top: 0.3rem;
          margin-left: 4.2rem;
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

  ${props =>
    props.number &&
    css`
      width: 7.6vh;
      margin-left: 0px;
      margin-right: 0.5rem;
    `}

`

const TextArea = styled.textarea`
  border-radius: 20px;
  background-color: #f1f1f1;
  width: 60%;
  height: 10vh;
  margin-top: 0.2rem;
  margin-left: 4.2rem;
  margin-right: 0.5rem;
  text-align: left;
  font-size: 2.2vh;
  padding-left: 15px;
  font-weight: 600;
  line-height:2.2vh;
  padding-top:1vh;
  border:none;
`

const Button = styled.div`
  border-radius: 16px;
  background-color: ${props => (props.filled ? '#F3725B' : null)};
  color: ${props => (props.filled ? 'white' : '#F3725B')};
  border: ${props => (props.filled ? null : '1px solid #F3725B')};
  padding: 0.2vh 4vh;
  margin: 0vh 2vh;
  cursor: pointer;
`

function BasicInfoDetail (props) {
  return (
    <Div detail gridArea={props.gridArea}>
      <Div detailTitle>{props.gridArea}:</Div>
      <Input
        class='input'
        type='text'
        placeholder={props.placeholder}
        onChange={props.onChange}
      />
    </Div>
  )
}

function isEmpty (obj) {
  for (const prop in obj) {
    if (obj.hasOwnProperty(prop)) {
      return false
    }
  }

  return JSON.stringify(obj) === JSON.stringify({})
}

function BasicInfoDashboard () {
  const currentUser = JSON.parse(localStorage.getItem('userProfile'))
  const [
    updateVendor,
    { loading: vendor_loading, error: vendor_error }
  ] = useMutation(UPDATE_VENDOR)
  const {
    data: vendorData,
    loading: vendorLoading,
    error: vendorError
  } = useQuery(GET_VENDOR_INFO, {
    variables: { name: currentUser.vendor[0] }
  })
  const [updatedInfo, setUpdatedInfo] = useState({})
  const [isDisabled, setIsDisabled] = useState(true)
  const [placeholderInfo, setPlaceholderInfo] = useState({})
  if (vendorError | vendor_error) {
    return <p>ErrorVendor...</p>
  }
  if (vendorLoading | vendor_loading) {
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

  function clearInputs () {
    const elements = document.getElementsByTagName('input')
    const areaelements = document.getElementsByTagName('textarea')
    for (let ii = 0; ii < elements.length; ii++) {
      if (elements[ii].type == 'text') {
        elements[ii].value = ''
      } else if (elements[ii].type == 'number') {
        elements[ii].value = ''
      }
    }
    areaelements[0].value = ''
  }

  function updateInfo (updatedField) {
    const orig = updatedInfo
    const updated = Object.assign(orig, updatedField)
    setUpdatedInfo(updated)
    console.log('UPDATED INFO CHANGED', updatedInfo)
    setIsDisabled(false)
  }

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

  if (isEmpty(placeholderInfo)) {
    setPlaceholderInfo(originalInfo)
  }

  const handleConfirmClick = async () => {
    // updates placeholders for input
    const updatedPlaceholder = Object.assign(placeholderInfo, updatedInfo)
    setPlaceholderInfo(updatedPlaceholder)
    // adds vendor name to the mutation
    const vendorField = { name: currentUser.vendor[0] }
    updateInfo(vendorField)
    await updateVendor({ variables: updatedInfo })

    // make buttons disabled
    setIsDisabled(true)
  }

  console.log('PLACEHOLDERS', placeholderInfo)

  return (
    <Div wrapper>
      {console.log(isDisabled)}
      <Img logo src={vendorData.getVendor.logoUrl} />
      <BasicInfoDetail
        gridArea='Name'
        placeholder={placeholderInfo.name}
        onChange={e => console.log(e.target.value)}
      />
      <BasicInfoDetail
        gridArea='Website'
        placeholder={placeholderInfo.website}
        onChange={e => updateInfo({ website: e.target.value })}
      />
      <BasicInfoDetail
        gridArea='Email'
        placeholder={placeholderInfo.email}
        onChange={e => updateInfo({ email: e.target.value })}
      />
      <BasicInfoDetail
        gridArea='Facebook'
        placeholder={placeholderInfo.facebook}
        onChange={e => updateInfo({ facebook: e.target.value })}
      />
      <BasicInfoDetail
        gridArea='Phone'
        placeholder={placeholderInfo.phone}
        onChange={e => updateInfo({ phone: e.target.value })}
      />

      {/* the cutoff section for set basic info  */}
      <Div flexWrapper gridArea='Cutoff'>
        <Div bottomTitle>
          <div>Cutoff Time:</div>
          <Div bottomSubtitle>
            <Input
              number
              class='input'
              type='number'
              min='0'
              placeholder={placeholderInfo.cutoffTime}
              onChange={e =>
                updateInfo({ cutoffTime: parseInt(e.target.value) })}
            />
            minutes before closing time{' '}
          </Div>
        </Div>
        <Div warning>*Orders will not be accepted after this time</Div>
      </Div>

      <Div flexWrapper gridArea='Pickup'>
        <Div bottomTitle pickup>
          Pickup Instructions:
        </Div>
        <Div warning>
          *These instructions are sent to the buyer when an order is submitted
        </Div>
        <TextArea
          placeholder={placeholderInfo.pickupInstruction}
          onChange={e => updateInfo({ pickupInstruction: e.target.value })}
        />
      </Div>

      <Div buttonwrapper disabled={isDisabled}>
        <Button
          onClick={() => {
            clearInputs()
            setUpdatedInfo({})
            setIsDisabled(true)
          }}
        >
          Discard
        </Button>
        <Button filled onClick={() => handleConfirmClick()}>
          Save
        </Button>
      </Div>
    </Div>
  )
}

export default BasicInfoDashboard
