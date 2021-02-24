import { useState } from 'react'
import { useQuery } from '@apollo/client'
import {
  BackgroundCover,
  ButtonPane,
  CheckButton,
  LoginQuestion,
  MainDiv
} from './Login.styles'
import { useNavigate } from 'react-router-dom'
import gql from 'graphql-tag.macro'
import { SmallLoadingPage  } from './../../components/LoadingComponents'
import ChooseVendor from './../../components/ChooseVendor'

const GET_VENDOR = gql`
  query GET_VENDORS($name: String!) {
    getVendor(filter: { name: $name }) {
      name
      _id
      allowedNetid
    }
  }
`
const GET_ALLOWED_VENDORS = gql`
  query GET_ALLOWED_VENDORS($name: String!){
    getAllowedVendors(name: $name){
      name
    }
  }
`

const VendorSelect = () => {
  const navigate = useNavigate()
  const [selectVendor, setSelectVendor] = useState(false);
  const [vendors, setVendors] = useState();
  const userData = JSON.parse(localStorage.getItem('userProfile'))

  // const {
  //   data: vendorData,
  //   loading: vendorLoading,
  //   error: vendorError
  // } = useQuery(GET_VENDOR, { variables: { name: userData.vendor[0] } })

  const {
    data: vendorData,
    loading: vendorLoading,
    error: vendorError
  } = useQuery(GET_ALLOWED_VENDORS, { variables: { name: userData.netid } })

  if (vendorLoading) return <SmallLoadingPage />
  if (vendorError) return <p>User broken</p>

  const allowedVendors = vendorData.getAllowedVendors.map(vendor => vendor.name);

  // have to modify this with /contact
  if (allowedVendors.length === 0) {
    const pattern = /^[0-9]{10}$/
    if (pattern.test(userData.phone)) {
      navigate('/eat')
    } else {
      navigate('/contact')
    }
  }

  if (selectVendor === true){
    return <ChooseVendor vendors = {vendors}/>
  }

  const clientLogin = () => {
    navigate('/eat')
  }

  // const vendorLogin = () => {
  //   navigate('/employee')
  // }

  const vendorLogin = () => {
    setSelectVendor(true);
    setVendors(allowedVendors);
  }


  return (
    <MainDiv>
      <BackgroundCover>
        <LoginQuestion>Sign in:</LoginQuestion>
        <ButtonPane>
          <CheckButton onClick={vendorLogin}>Vendor</CheckButton>
          <CheckButton onClick={clientLogin}>Customer</CheckButton>
        </ButtonPane>
      </BackgroundCover>
    </MainDiv>
  )
}

export default VendorSelect
