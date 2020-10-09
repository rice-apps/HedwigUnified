import React from 'react'
import styled, { css } from 'styled-components'
import { FaUserCircle, FaClock } from 'react-icons/fa'
import moment from 'moment'

const VendorHeaderWrapper = styled.div`
  font-family: 'Futura', sans-serif;
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

function VendorHeader () {
  function UpdateTime () {
    if (document.querySelector('#clockdisplay') !== null){
    const headerclock = document.querySelector('#clockdisplay')
    const CurrentDisplayTime = moment().format("dddd, MMMM Do h:mm:ss A")
    headerclock.innerHTML = CurrentDisplayTime
    }
  }
  

  return (
    <VendorHeaderWrapper>
      <StyledUserDisplayWrapper>
        <UserText>Newton Huynh</UserText>
        <FaUserCircle style={{ fontSize: '30px', marginLeft: '1vw' }} />
      </StyledUserDisplayWrapper>
      <DateTimeDisplayWrapper>

<div id="clockdisplay">Loading...</div>
<div hidden>{setInterval(UpdateTime, 1000)}</div>

      </DateTimeDisplayWrapper>
    </VendorHeaderWrapper>
  )
}

export default VendorHeader
