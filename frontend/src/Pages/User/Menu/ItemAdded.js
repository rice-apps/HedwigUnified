import styled, { keyframes } from 'styled-components/macro'
import {useState} from 'react'

const appearanceAnimation = keyframes`
0%{
    width:0vh;
    height:0vh;
    display:none;
}
5%{
    width:46vh;
    height:50vh;
    display:block;
}
90%{
    width:46vh;
    height:50vh;
    display:block;
}
95%{
    width:0vh;
    height:0vh;
    display:none;
}
`

const ModalWrapper = styled.div`
  background-color: white;
  border-radius: 15px;
  position: fixed;
  right: 0;
  left: 0;
  top: 25vh;
  display:none;
  margin-right: auto;
  margin-left: auto;
  z-index: 2;
  display: grid;
  align-items: center;
  justify-content: center;
  animation-name: ${appearanceAnimation};
  animation-duration:1.5s;
  animation-iteration-count:1;
`

const PageWrapper = styled.div`
  height: 100vh;
  position: fixed;
  z-index: 2;
  display:${props => props.timeout ? 'none' : 'block'};
  width: 100vw;
  backdrop-filter: blur(5px) brightness(80%);
`

function ItemAddedModal (props) {
    const [timeOut, setTimeOut] =useState(false)
    setTimeout(function(){ setTimeOut(true) }, 1500);
  return (
    <PageWrapper timeout={timeOut}>
      <ModalWrapper>{props.item} added!</ModalWrapper>
    </PageWrapper>
  )
}

export default ItemAddedModal
