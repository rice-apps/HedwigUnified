import { useEffect, useState } from 'react'
import styled from 'styled-components/macro'
import './Toggle.css'
import { useMutation, useQuery } from '@apollo/client'
import gql from 'graphql-tag.macro'

const VendorName = styled.div`
  font-size: 2.1vw;
  margin-top: 10px;
  font-weight: 700;
  text-align: center;
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
  query getUser($token: String!) {
    userOne(filter: { token: $token }) {
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
// const merchantId = '5f836204280dd576b7e828ad'

function SideBarVendorProfile ({ setLogo }) {
  const token = localStorage.getItem('token')
  const [vendorName, setVendorName] = useState('Cohen House')

  const [, { error }] = useMutation(UPDATE_VENDOR_AVAILABILITY)

  // query to get the vendor... is it worth to cache the vendor merchant ID?
  const { data: userData, loading: userLoading, error: userError } = useQuery(
    GET_USER,
    {
      variables: { token: token }
    }
  )

  const { data, loading, error: queryError } = useQuery(GET_VENDOR_DATA, {
    variables: { name: 'Cohen House' }
  })

  useEffect(() => {
    setVendorName(userData?.userOne?.vendor)
  }, [userData])

  if (error || queryError || userError) {
    return <p>Error</p>
  }
  if (loading || userLoading) return <p>Waiting...</p>

  setLogo(data.getVendor.logoUrl)

  return (
    <div>
      <VendorName>{vendorName}</VendorName>
    </div>
  )
}

export default SideBarVendorProfile
