import { useEffect, useState } from 'react'
import styled from 'styled-components/macro'
import './Toggle.css'
import { useMutation, useQuery } from '@apollo/client'
import gql from 'graphql-tag.macro'

const VendorName = styled.div`
  font-size: 4.1vh;
  line-height: 4.3vh;
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
  const vendorName = JSON.parse(localStorage.getItem('userProfile')).vendor[0]

  const [, { error }] = useMutation(UPDATE_VENDOR_AVAILABILITY)

  // query to get the vendor... is it worth to cache the vendor merchant ID?

  const { data, loading, error: queryError, refetch } = useQuery(
    GET_VENDOR_DATA,
    {
      variables: { name: vendorName }
    }
  )

  console.log('NO', data)

  if (error || queryError) {
    return <p>Error</p>
  }
  if (loading) return <p>Waiting...</p>

  setLogo(data.getVendor.logoUrl)

  return (
    <div>
      <VendorName>{vendorName}</VendorName>
    </div>
  )
}

export default SideBarVendorProfile
