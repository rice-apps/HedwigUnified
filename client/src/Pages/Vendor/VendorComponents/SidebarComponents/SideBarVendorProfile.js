import React, { useState } from 'react'
import styled, { css } from 'styled-components'
import Toggle from 'react-toggle'
import './Toggle.css'

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

const SideBarVendorProfileWrapper = styled.div``

function SideBarVendorProfile () {
  return (
    <div>
      <VendorName>East West Tea</VendorName>
      <StoreStatus>
        Store Status:
        <Toggle />
      </StoreStatus>
    </div>
  )
}

export default SideBarVendorProfile
