import { useState } from 'react';
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
const GET_AVAILABILITY = gql`
  query GET_AVAILABILITY($merchantId: MongoID!) {
    getVendor(filter: { _id: $merchantId }) {
      isOpen
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
const merchantId = '5f836204280dd576b7e828ad'

function SideBarVendorProfile () {
  const [vendorAvailability, { error }] = useMutation(
    UPDATE_VENDOR_AVAILABILITY
  )
  const { data, loading, error: queryError } = useQuery(GET_AVAILABILITY, {
    variables: { merchantId: merchantId }
  })
  if (error) {
    return <p>{error.message}</p>
  }
  if (loading) return <p>Waiting...</p>
  return (
    <div>
      <VendorName>East West Tea</VendorName>
      <StoreStatus>
        Store Status:
        <Toggle
          // checked={data.isOpen}
          onChange={e =>
            vendorAvailability({
              variables: { isOpen: e.target.checked, merchantId: merchantId }
            })
          }
        />
      </StoreStatus>
    </div>
  )
}

export default SideBarVendorProfile
