import styled, { keyframes } from 'styled-components/macro'
import HedwigLogo from './../Pages/Login/HedwigLogoFinal_02.svg'

const spinAnimation = keyframes`
30%, 85%{
    transform: rotate(0deg)
}

40%{
    transform: rotate(-20deg)
}
55%{
    transform: rotate(14deg)
}
`

const textAnimation = keyframes`
0%{ 
    content : "Loading."
}

50%{
    content: "Loading.."
}

100%{
    content: "Loading..."
}
`

const barAnimation = keyframes`
0%{
    width: 0%;
}
90%{
    width: 95%;
}
`

const visibilityAnimation = keyframes`
0%{opacity:0%}
100% {opacity:100%}
`

const LoadingWrapper = styled.div`
  animation-name: ${visibilityAnimation};
  animation-duration: 2s;
  animation-iteration-count: 1;
  height: 100vh;
  width: 100vw;
  display: grid;
  grid-template-rows: auto ${props => props.size} 4vh auto;
  grid-template-columns: 1fr;
  grid-template-areas:
    'blank'
    'LogoSpace'
    'TextSpace'
    'blank2';
  align-items: center;
  justify-items: center;
`

const Hedwig = styled.img`
  height: ${props => props.size};
  width: ${props => props.size};
  grid-area: LogoSpace;
  animation-name: ${props => props.animationName};
  animation-duration: ${props => props.animationDuration};
  animation-iteration-count: infinite;
`

const LoadingText = styled.div`
  font-size: 2.5vh;
  font-family: 'avenir';
  color: #f3725b;
  font-weight: bold;
  grid-area: TextSpace;
  &:after {
    content: '';
    animation-name: ${textAnimation};
    animation-duration: 2s;
    animation-iteration-count: infinite;
    animation-timing-function: linear;
  }
`
const LoadingBarWrapper = styled.div`
  border-radius: 20px;
  width: 23vh;
  height: 3vh;
  border: 3px solid #f3725b;
  grid-area: TextSpace;
  display: flex;
  justify-content: flex-start;
  align-items: center;
`

const LoadingBar = styled.div`
  height: 73%;
  width: 95%;
  border-radius: 20px;
  background-color: #f3725b;
  margin-left: 0.4vh;
  animation-name: ${barAnimation};
  animation-duration: 4.3s;
  animation-iteration-count: 1;
`

function addVh (i) {
  let vhString = i.toString() + 'vh'
  return vhString
}

function LoadingPage () {
  let size = 25
  return (
    <LoadingWrapper size={addVh(size + 2)}>
      <Hedwig
        src={HedwigLogo}
        size={addVh(size)}
        animationName={spinAnimation}
        animationDuration='2.2s'
      />
      <LoadingBarWrapper>
        <LoadingBar />
      </LoadingBarWrapper>
    </LoadingWrapper>
  )
}

function SmallLoadingPage () {
  let size = 12
  return (
    <LoadingWrapper size={addVh(size + 2)}>
      <Hedwig
        src={HedwigLogo}
        size={addVh(size)}
        animationName={spinAnimation}
        animationDuration='1.4s'
      />
      <LoadingText />
    </LoadingWrapper>
  )
}

export { LoadingPage, SmallLoadingPage }
