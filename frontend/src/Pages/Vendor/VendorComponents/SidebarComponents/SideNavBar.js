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
  height: 20vh;
  border-radius:50%;
  object-fit:cover;
  width: 20vh;
  margin-top: 6.7vh;
  object-position:80% 100%;
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
