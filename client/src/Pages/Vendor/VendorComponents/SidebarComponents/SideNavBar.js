import { useState } from 'react'
import styled, { css } from 'styled-components'
import { useHistory } from 'react-router'
import { useNavigate } from 'react-router-dom'
import logo from '../../../../images/tealogo.png'
import SideBarVendorProfile from './SideBarVendorProfile.js'
import SideBarItems from './SideBarItems.js'

const SideBarWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`

const VendorPicture = styled.img`
  height: 110px;
  width: 110px;
  margin-top: 60px;
`

function SideNavBar () {
  return (
    <SideBarWrapper>
      <VendorPicture src={logo} />
      <SideBarVendorProfile />
      <SideBarItems />
    </SideBarWrapper>
  )
}

export default SideNavBar
