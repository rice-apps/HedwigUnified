// vendors should be a list of vendors
import { useState } from 'react'
import styled, { keyframes } from 'styled-components/macro'
import { useNavigate } from 'react-router-dom'
import VendorSelect from '../Pages/Login/VendorCheck'
import { useQuery, useMutation } from '@apollo/client'
import gql from 'graphql-tag.macro'

const MainDiv = styled.div`
  font-family: 'Omnes', sans-serif;
  height: 100vh;
  width: 100vw;
  display: flex;
  align-items: center;
  justify-content: center;
  max-width: 100%;

  background-color: white;
`
const ButtonPane = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  align-items: space-evenly;
`

const CheckButton = styled.button`
  border-radius: 20px;
  border: 2.8px solid #f3725b;
  cursor: pointer;
  background-color: white;
  font-size: 1rem;
  font-weight: bold;
  padding: 1rem;
  width: 10rem;
  margin: 0.5rem;
  outline: none;

  :hover {
    background-color: #ffe6cc;
  }
`
const UPDATE_USER = gql`
  mutation UPDATE_USER($vendor: [String!], $netid: String!) {
    userUpdateOne(filter: { netid: $netid }, record: { vendor: $vendor }) {
      recordId
      record {
        name
        netid
        vendor
      }
    }
  }
`
const ChooseVendor = ({ vendors }) => {
  const navigate = useNavigate()
  const [back, setBack] = useState(false)
  const [updateUser, { data }] = useMutation(UPDATE_USER)

  if (back === true) {
    return <VendorSelect />
  }

  const vendorLogin = currVendor => {
    const vendorsCopy = [...vendors]
    const index = vendorsCopy.indexOf(currVendor)
    vendorsCopy.splice(index, 1)
    const vendor = [currVendor, ...vendorsCopy]
    updateUser({
      variables: {
        vendor: vendor,
        netid: JSON.parse(localStorage.getItem('userProfile')).netid
      }
    })

    const {
      netid,
      name,
      phone,
      studentId,
      _id,
      isAdmin,
      recentUpdate,
      type,
      token
    } = JSON.parse(localStorage.getItem('userProfile'))

    const updated = {
      netid,
      name,
      phone,
      studentId,
      _id,
      isAdmin,
      vendor,
      recentUpdate,
      type,
      token
    }

    localStorage.setItem('userProfile', JSON.stringify(updated))

    // localStorage.setItem("userProfile", JSON.stringify(updated));
    // we have to push the selected vendor to the very front of the array, and then we can
    // get the first element in the /employee page to get the correct vendor

    // do we have to run this mutation as well?.. YES

    navigate('/employee')
  }

  const vendorList = vendors.map(vendor => (
    <CheckButton onClick={() => vendorLogin(vendor)}>{vendor}</CheckButton>
  ))

  const goBack = () => {
    setBack(true)
  }

  // const vendorList = <CheckButton onClick = {vendorLogin}>{vendors}</CheckButton>
  return (
    <MainDiv>
      <ButtonPane>{vendorList}</ButtonPane>
      <CheckButton onClick={goBack}>Go Back</CheckButton>
    </MainDiv>
  )
}

export default ChooseVendor
