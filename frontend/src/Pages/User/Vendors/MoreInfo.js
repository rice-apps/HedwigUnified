import styled, { keyframes } from 'styled-components/macro'
import { ModalBackground, StyledCancel } from './BottomAppBar'
import { useState } from 'react'
import { IoMdClose } from 'react-icons/io'

const appearanceAnimation = keyframes`

0%{height:10vh;
width:10vh;
opacity:0;}

100%{
height: 55vh;
max-height:55vh;
width:40vh;
opacity:1;}
`
const StyledCross = styled(IoMdClose)`
  position: fixed;
  top: 3vh;
  right: 3vh;
  font-size: 2.7vh;
`
const Modal = styled.div`
  position: fixed;
  z-index: 4;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -55%);
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  background-color: white;
  
  width: 40vh;
  height: 55vh;
  max-height: 55vh;
  justify-content: flex-start;
  align-items: center;
  animation-name: ${appearanceAnimation};
  animation-iteration-count: 1;
  animation-duration: 0.2s;
  padding: 4vh 0vh 5vh 0vh;
  overflow: auto;
  &::-webkit-scrollbar {
      -webkit-appearance:none;
      width:0vh;
  }
  text-align: center;
`

const ModalTitle = styled.div`
  font-size: 3.4vh;
  color: #f3725b;
  font-weight: bold;
  margin-bottom: 0.3vh;
`

const ModalSubTitle = styled.div`
  font-size: 2vh;
  line-height: 2.4vh;
  font-weight: 300;
  opacity: 0.7;
`

const ModalCutOff = styled.div`
  font-size: 1.8vh;
  font-style: italic;
  opacity: 0.7;
  width: 80%;
  margin: 2vh 0vh;
  line-height: 2.1vh;
`

const ModalPickupTitle = styled.div`
  font-size: 2.4vh;
  font-weight: bold;
`

const ModalPickupMessage = styled.div`
  font-size: 2vh;
  font-weight: 300;
  opacity: 0.7;
  line-height: 2.5vh;
  width: 85%;
`

const DayHourRow = styled.div`
display:grid;
width:90%;
grid-template-columns:20% 85%;
justify-content:center;
align-items:center;
text-transform: uppercase;
margin:0.45vh 0vh;
`
const DayInitials = styled.div`
width:100%;
margin-right:1.5vh;
font-weight: bold;
`
const HoursWrapper = styled.div`
height:max-content;
width:68%;
display:flex;
flex-direction:column;
align-items:center;
margin:2vh 0vh 0.2vh 0vh;
justify-content: center;

`
function dayDisplay (dayItem) {
    const start = dayItem.start
    const end = dayItem.end
    const time = start.map(function (e, i) {
      return [e, end[i]]
    })
    if (dayItem.start.length === 0) {
      return (
        <DayHourRow>
          <DayInitials>{dayItem.day.substring(0,3)} </DayInitials>
          <span>Closed</span>{' '}
        </DayHourRow>
      )
    } else {
      return (
        <DayHourRow>
          {' '}
          <DayInitials> {dayItem.day.substring(0,3)} </DayInitials>
          <span>
            {time.map(startend => {
              return (
                <div style={{lineHeight:'2.35vh', opacity:'0.7'}}>
                  <span>
                    {startend[0].replace('.', '').replace('.', '')} -{' '}
                    {startend[1].replace('.', '').replace('.', '')}
                  </span>
                </div>
              )
            })}
          </span>
          </DayHourRow>
      )
    }
  }


function SortHoursArray (currentDay, hours) {
    // let currentDay = props.currentDay
    // let hours = props.hours
    let hoursArray = []
    for (let i = 0; i < 7; i++){
        hoursArray.push(hours[currentDay])
        if (currentDay == 6){
            currentDay = 0
        }
        else {
            currentDay += 1
        }
    }
    console.log(hoursArray)
    return hoursArray
}



function DisplayWeekHours (props) {
    let currentDay = props.currentDay
    let hours = props.hours
    let hoursArray = SortHoursArray(currentDay, hours)
    return (
        <HoursWrapper>
        {hoursArray.map(dayItem => {return dayDisplay(dayItem)})}
        </HoursWrapper>
    )
}

function MoreInfo (props) {
  const [showHours, setShowHours] = useState(false)
  const current_date = new Date()
  const currentDay = current_date.getDay()
  return (
    <ModalBackground>
      <Modal>
        <StyledCross onClick={() => props.changeStatus(false)} />
        <ModalTitle>{props.name}</ModalTitle>
        <ModalSubTitle>{props.phone}</ModalSubTitle>
        <ModalSubTitle>{props.email}</ModalSubTitle>
      
        <DisplayWeekHours currentDay={currentDay} hours={props.hours}/>
        <ModalCutOff>
          New orders cannot be placed {props.cutoffTime} minutes before closing
          time.
        </ModalCutOff>
        <ModalPickupTitle>Pick Up Instructions:</ModalPickupTitle>
        <ModalPickupMessage>{props.pickupInstruction}</ModalPickupMessage>
      </Modal>
    </ModalBackground>
  )
}

export default MoreInfo
