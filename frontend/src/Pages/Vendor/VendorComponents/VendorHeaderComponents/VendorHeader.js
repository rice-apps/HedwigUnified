import { useState } from 'react'
import styled from 'styled-components/macro'
import { FaUserCircle } from 'react-icons/fa'
import moment from 'moment'
import { BiLogOut } from 'react-icons/bi'
import { AiOutlineUserSwitch } from 'react-icons/ai'
import { IconContext } from 'react-icons'
import { useApolloClient } from '@apollo/client'
import gql from 'graphql-tag.macro'
import { useNavigate } from 'react-router-dom'

const VendorHeaderWrapper = styled.div`
  font-weight: 600;
  display: grid;
  width: 100%;
  height: 100%;
  grid-template-columns: 4fr 1fr;
  grid-template-rows: 1fr;
  grid-template-areas: 'DateTimeDisplay UserDisplay';
  justify-items: center;
  align-items: center;
  font-size: 2.25vh;
`

const StyledUserDisplayWrapper = styled.div`
  grid-area: UserDisplay;
  justify-self: end;
  margin-right: 2vw;
  align-self: center;
  text-align: center;
  display: flex;
  line-height: 2.1vh;
  flex-direction: row;
  align-items: center;
  cursor: pointer;
  position: relative;
`

const UserText = styled.div`
  margin-top: 3px;
`

const DateTimeDisplayWrapper = styled.div`
  grid-area: DateTimeDisplay;
  background-color: white;
  text-align: center;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
`
const LogoutPopup = styled.div`
  background-color: #d0d0d0;
  height: 16vh;
  width: 20vw;
  position: absolute;
  right: 15px;
  top: 6.5vh;
  border-radius: 20px;
  z-index: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`
const LogoutItem = styled.div`
  font-size: 2.25vh;
  width: 80%;
  background-color: white;
  padding: 5px;
  cursor: pointer;
  border-radius: 15px;
  margin: 5px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`
const GET_USER_INFO = gql`
  query GetUserInfo {
    user @client {
      _id
      recentUpdate
      name
      netid
      phone
    }
  }
`
function VendorHeader () {
  const [showLogout, setShowLogout] = useState(false)
  const user = JSON.parse(localStorage.getItem('userProfile'))
  const navigate = useNavigate()
  function toggleLogoutScreen () {
    const logoutOpen = showLogout
    setShowLogout(!logoutOpen)
  }

  function UpdateTime () {
    const clock = document.getElementById('clockdisplay')
    const CurrentTime = moment().format('dddd, MMMM Do h:mm:ss A')
    if (clock) {
      clock.textContent = CurrentTime
    }
  }

  function MakeLogoutPopup () {
    const client = useApolloClient()
    const handleLogout = () => {
      window.localStorage.clear()
      client
        .clearStore()
        .then(() =>
          window.open('https://idp.rice.edu/idp/profile/cas/logout', '_self')
        )
    }

    return (
      <LogoutPopup>
        <LogoutItem onClick={handleLogout}>
          {' '}
          <BiLogOut /> Logout of Account
        </LogoutItem>
        <LogoutItem onClick={() => navigate('/eat')}>
          {' '}
          <AiOutlineUserSwitch />
          Switch to Buyer
        </LogoutItem>
      </LogoutPopup>
    )
  }

  setInterval(UpdateTime, 1000)

  return (
    <IconContext.Provider value={{ style: { marginRight: '7px' } }}>
      <VendorHeaderWrapper>
        <StyledUserDisplayWrapper onClick={toggleLogoutScreen}>
          <UserText>{user.name}</UserText>
          <FaUserCircle style={{ fontSize: '30px', marginLeft: '1vw' }} />
        </StyledUserDisplayWrapper>

        <DateTimeDisplayWrapper>
          <div id='clockdisplay'>Loading...</div>
          <div hidden>{setInterval(UpdateTime, 1000)}</div>
        </DateTimeDisplayWrapper>
        {showLogout ? <MakeLogoutPopup /> : null}
      </VendorHeaderWrapper>
    </IconContext.Provider>
  )
}

export default VendorHeader
