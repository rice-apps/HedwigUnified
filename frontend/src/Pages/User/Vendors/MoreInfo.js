import styled, { keyframes } from 'styled-components/macro'
import { ModalBackground, StyledCancel } from './BottomAppBar'
import { useState } from 'react'
import { IoMdClose } from 'react-icons/io'

const appearanceAnimation = keyframes`

0%{height:10vh;
width:10vh;}

100%{
height: max-content;
max-height:55vh;
width:40vh;}
`
const StyledCross = styled(IoMdClose)`
  position: absolute;
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
  align-items: center;
  width: 40vh;
  height: max-content;
  max-height: 55vh;
  justify-content: flex-start;
  animation-name: ${appearanceAnimation};
  animation-iteration-count: 1;
  animation-duration: 0.2s;
  padding: 4vh 0vh 5vh 0vh;
  overflow: auto;
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

function MoreInfo (props) {
  const [showHours, setShowHours] = useState(false)
  return (
    <ModalBackground>
      <Modal>
        <StyledCross onClick={() => props.changeStatus(false)} />
        <ModalTitle>{props.name}</ModalTitle>
        <ModalSubTitle>{props.phone}</ModalSubTitle>
        <ModalSubTitle>{props.email}</ModalSubTitle>
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
