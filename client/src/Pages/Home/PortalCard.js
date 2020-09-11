import React from 'react'
import { useHistory } from 'react-router'
import VendorImage from '../../images/vendorImage.jpg'
import UserImage from '../../images/userImage.jpeg'
import './portal.css'

const PortalCard = () => {
  const history = useHistory()

  const handleVendorClick = () => {
    return history.push(`/vendor/orders`)
  }
  const handleClientClick = () => {
    return history.push(`/user/vendors`)
  }

  return (
    <div className='portalcontainer'>
      <div className='portallist'>
        <div
          style={{ backgroundImage: `url(${VendorImage})` }}
          className='portalcard'
          onClick={handleVendorClick}
        >
          <h1>Vendor Portal</h1>
        </div>
        <div
          style={{ backgroundImage: `url(${UserImage})` }}
          className='portalcard'
          onClick={handleClientClick}
        >
          <h1>Client Portal</h1>
        </div>
      </div>
    </div>
  )
}
export default PortalCard
