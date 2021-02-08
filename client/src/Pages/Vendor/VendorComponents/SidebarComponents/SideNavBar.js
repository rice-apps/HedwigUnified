import { useState } from 'react'
import styled from 'styled-components/macro'
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
  const [logoUrl, setLogoUrl] = useState('')

  return (
    <SideBarWrapper>
      <VendorPicture src={logoUrl} />
      <SideBarVendorProfile setLogo={setLogoUrl} />
      <SideBarItems />
    </SideBarWrapper>
  )
}

export default SideNavBar
