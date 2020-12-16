import { useEffect, useState } from 'react'
import styled, { css } from 'styled-components'
import Toggle from 'react-toggle'
import './Toggle.css'
import { gql, useMutation, useQuery } from '@apollo/client'

const VendorName = styled.div`
  font-size: 2.1vw;
  margin-top: 10px;

  text-align: center;
`

const StoreStatus = styled.div`
  font-size: 1.25vw;
  margin-top: 2px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-content: center;
  margin-left: 5px;
`
const GET_VENDOR_DATA = gql`
  query GET_AVAILABILITY($name: String!) {
    getVendor(filter: { name: $name }) {
      name
      isOpen
      logoUrl
      _id
    }
  }
`
const GET_USER = gql`
query getUser($token: String!){
  userOne(filter: {token: $token}){
    name
    netid
    token
    vendor
    _id
  }
}
`
const UPDATE_VENDOR_AVAILABILITY = gql`
  mutation UPDATE_VENDOR_AVAILABILITY(
    $isOpen: Boolean!
    $merchantId: MongoID!
  ) {
    updateVendor(filter: { _id: $merchantId }, record: { isOpen: $isOpen }) {
      record {
        isOpen
      }
    }
  }
`
const SideBarVendorProfileWrapper = styled.div``
// const merchantId = '5f836204280dd576b7e828ad'

function SideBarVendorProfile ({setLogo}) {
  const token = localStorage.getItem("token");
  const [vendorName, setVendorName] = useState("");

  const [vendorAvailability, { error }] = useMutation(
    UPDATE_VENDOR_AVAILABILITY
  )

  // query to get the vendor... is it worth to cache the vendor merchant ID?
  const { data: userData, loading: userLoading, error: userError } = useQuery(GET_USER, {
    variables: { token: token }
  })

  const { data, loading, error: queryError } = useQuery(GET_VENDOR_DATA, {
    variables: { name: vendorName }
  })

  useEffect(() => {
    setVendorName(userData?.userOne.vendor);
  }, [userData]);
  
  if (error || queryError || userError) {
    return <p>Error</p>
  }
  if (loading || userLoading) return <p>Waiting...</p>

  setLogo(data.getVendor.logoUrl);

  return (
    <div>
      <VendorName>{vendorName}</VendorName>
      <StoreStatus>
        Store Status:
        <Toggle
          // checked={data.getVendor.isOpen}
          onChange={e =>
            vendorAvailability({
              variables: { isOpen: e.target.checked, merchantId: data.getVendor._id }
            })
          }
        />
      </StoreStatus>
    </div>
  )
}

export default SideBarVendorProfile
