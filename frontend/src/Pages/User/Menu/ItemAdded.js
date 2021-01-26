import styled, { keyframes } from 'styled-components/macro'
import { useState } from 'react'
import { AiOutlineCheckCircle } from 'react-icons/ai'
const appearanceAnimation = keyframes`
0%{
    width:0vh;
    height:0vh;
    display:none;
    font-size:0vh;
}
23%{
    width:42vh;
    height:50vh;
    display:block;
    font-size:2.5vh;
}
90%{
    width:42vh;
    height:50vh;
    display:block;
    font-size:2.5vh;
}
95%{
    width:0vh;
    height:0vh;
    display:none;
    font-size:0vh;
}
`

const imageAppearanceAnimation = keyframes`
0%{
    width:0vh;
    height:0vh;
    display:none;
}
23%{
    width:22vh;
    height:22vh;
    display:block;

}
90%{
    width:22vh;
    height:22vh;
    display:block;

}
95%{
    width:0vh;
    height:0vh;
    display:none;
}
`

const checkAnimation = keyframes`
0%{
   font-size:0vh;
}
23%{
    font-size:4.5vh;
}
90%{
    font-size:4.5vh;
}
95%{
    font-size:0vh
}
`

const ModalWrapper = styled.div`
  background-color: white;
  border-radius: 15px;
  position: fixed;
  right: 0;
  left: 0;
  top: 25vh;
  display: none;
  font-size: 0vh;
  margin-right: auto;
  margin-left: auto;
  z-index: 2;
  display: grid;
  align-items: center;
  justify-items: center;
  grid-template-columns: 1fr;
  grid-template-rows: 0.4fr 1.7fr 0.6fr 0.7fr;
  grid-template-areas:
    'blank'
    'imageSpace'
    'textSpace'
    'blank2';
  animation-name: ${appearanceAnimation};
  animation-duration: 1.7s;
  animation-iteration-count: 1;
`

const PageWrapper = styled.div`
  height: 100vh;
  position: fixed;
  z-index: 2;
  display: ${props => (props.timeout ? 'none' : 'block')};
  width: 100vw;
  backdrop-filter: blur(4px) brightness(90%);
`

const ModalImage = styled.img`
  height: 22vh;
  width: 22vh;
  object-fit: cover;
  border-radius: 50%;
  align-self: center;
  justify-content: center;
  grid-area: imageSpace;
  animation-name: ${imageAppearanceAnimation};
  animation-duration: 1.7s;
  animation-iteration-count: 1;
`

const ModalText = styled.div`
  text-align: center;
  width: 75%;
  line-height: 2.9vh;
  grid-area: textSpace;
`

const StyledCheck = styled(AiOutlineCheckCircle)`
  color: green;
  position: absolute;
  bottom: 5vh;
  font-size: 4.5vh;
  animation-name: ${checkAnimation};
  animation-duration: 1.7s;
  animation-iteration-count: infinite;
`

function ItemAddedModal (props) {
  const [timeOut, setTimeOut] = useState(false)
  setTimeout(function () {
    setTimeOut(true)
  }, 1650)
  return (
    <PageWrapper timeout={timeOut}>
      <ModalWrapper>
        <StyledCheck />
        <ModalImage src={props.itemImage} />
        <ModalText> {props.item} has been added to your cart!</ModalText>
      </ModalWrapper>
    </PageWrapper>
  )
}

export default ItemAddedModal
