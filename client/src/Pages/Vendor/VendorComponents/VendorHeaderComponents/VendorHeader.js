import React, { useState } from "react";
import styled, { css } from "styled-components";
import { FaUserCircle, FaClock } from "react-icons/fa";
import moment from "moment";
import Collapsible from "react-collapsible";
import {BiLogOut} from 'react-icons/bi';
import {AiOutlineUserSwitch} from 'react-icons/ai'
import { IconContext } from "react-icons";


const VendorHeaderWrapper = styled.div`
  font-family: "Futura", sans-serif;
  display: grid;
  width: 100%;
  height: 100%;
  grid-template-columns: 4fr 1fr;
  grid-template-rows: 1fr;
  grid-template-areas: "DateTimeDisplay UserDisplay";
  justify-items: center;
  align-items: center;
  font-size: 2.25vh;
`;

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
`;

const UserText = styled.div`
  margin-top: 3px;
`;

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
`;

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
`;
const LogoutItem = styled.div`
  font-size: 2.25vh;
  width:80%;
  background-color:white;
  padding:5px;
  cursor:pointer;
  border-radius:15px;
  margin:5px;
  display: flex;
  flex-direction:row;
  align-items: center;
  justify-content: center;
`;
function MakeLogoutPopup() {
  return (
    <LogoutPopup>
      <LogoutItem> <BiLogOut/>  Logout of Account</LogoutItem>
      <LogoutItem> <AiOutlineUserSwitch/>Switch to Buyer</LogoutItem>
    </LogoutPopup>
  );
}
function UpdateTime() {
  if (document.querySelector("#clockdisplay") !== null) {
    const headerclock = document.querySelector("#clockdisplay");
    const CurrentDisplayTime = moment().format("dddd, MMMM Do h:mm:ss A");
    headerclock.innerHTML = CurrentDisplayTime;
  }
}

function VendorHeader() {
  const [showLogout, setShowLogout] = useState(false);
  function toggleLogoutScreen(prevState) {
    const logoutShown = showLogout;
    setShowLogout(!logoutShown);
  }

  return (
    <IconContext.Provider value={{style: {marginRight: "7px"}}}>
    <VendorHeaderWrapper>
      <StyledUserDisplayWrapper onClick={toggleLogoutScreen}>
        <UserText>Newton Huynh</UserText>
        <FaUserCircle style={{ fontSize: "30px", marginLeft: "1vw" }} />
      </StyledUserDisplayWrapper>

      <DateTimeDisplayWrapper>
        <div id="clockdisplay">Loading...</div>
        <div hidden>{setInterval(UpdateTime, 1000)}</div>
      </DateTimeDisplayWrapper>
      {showLogout ? <MakeLogoutPopup /> : null}
    </VendorHeaderWrapper>
    </IconContext.Provider>
  );
}

export default VendorHeader;
