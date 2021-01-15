import hedwigLogo from './HedwigLogoFinal.svg'
import { gql, useQuery } from '@apollo/client'
import {
  BackgroundCover,
  ButtonPane,
  CheckButton,
  LoginQuestion,
  MainDiv
} from './Login.styles'
import { useNavigate } from 'react-router-dom'

const GET_VENDOR = gql`
  query GET_VENDORS($name: String!) {
    getVendor(filter: { name: $name }) {
      name
      _id
      allowedNetid
    }
  }
`

const VendorSelect = () => {
  const navigate = useNavigate()
  const userData = JSON.parse(localStorage.getItem('userProfile'))

  const {
    data: vendorData,
    loading: vendorLoading,
    error: vendorError
  } = useQuery(GET_VENDOR, { variables: { name: userData.vendor } })

  if (vendorLoading) return <p>Loading...</p>
  if (vendorError) return <p>User broken</p>

  const allowedUsers = vendorData.getVendor.allowedNetid

  // have to modify this with /contact
  if (!allowedUsers.includes(userData.netid)) {
    var pattern = /^[0-9]{10}$/
    if (pattern.test(userData.phone)) {
      navigate('/eat')
    } else {
      navigate('/contact')
    }
  }

  const clientLogin = () => {
    navigate('/eat')
  }

  const vendorLogin = () => {
    navigate('/employee')
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
