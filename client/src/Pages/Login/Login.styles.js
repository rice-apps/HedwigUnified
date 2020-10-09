import styled from 'styled-components'

const MainDiv = styled.div`
  height: 100vh;
  width: 100vw;
  display: grid;
  grid-template-rows: 25% 15% 30% 30%;
  text-align: center;
  align-items: center;
  justify-items: center;
  background-color: #f49f86;
  max-width: 100%;
  font-family: 'Raleway', sans-serif;
`

const Logo = styled.img`
  grid-row: 3/4;
  max-height: 100%;
  width: 80%;
`
const Title = styled.h1`
  color: white;
  grid-row: 1/2;
  font-size: 60pt;
`
const SubTitle = styled.div`
  color: white;
  grid-row: 2/3;
  align-self: start;
`
const LoginButton = styled.button`
  grid-row: 4/5;
  border-radius: 25pt;
  height: 37pt;
  width: 169pt;
  border: none;
  font-size: 17pt;
  font-weight: bold;
  color: #f49f86;
  :hover {
    text-decoration: underline;
    box-shadow: 2px 8px 5px -5px #9d7a96;
  }
`

const BackgroundCover = styled.div`
  //hopefully position this in the center
  font-family: 'Raleway', sans-serif;
  position: relative;
  width: 30vw;
  height: 40vh;
  //have to make it responsive
  transform: translate(0, -150%);
  background-color: #f49f86;
  border: 1px solid #331a00;
  border-radius: 25pt;

  margin: 0 auto;
  padding: 10px;
  z-index: 40;

  // transitions
    animation: fadeIn ease 0.8s;
  -webkit-animation: fadeIn ease 0.8s;
  -moz-animation: fadeIn ease 0.8s;
  -o-animation: fadeIn ease 0.8s;
  -ms-animation: fadeIn ease 0.8s;

@keyframes fadeIn {
  0% {opacity:0;}
  100% {opacity:1;}
  }
  
  @-moz-keyframes fadeIn {
  0% {opacity:0;}
  100% {opacity:1;}
  }
  
  @-webkit-keyframes fadeIn {
  0% {opacity:0;}
  100% {opacity:1;}
  }
  
  @-o-keyframes fadeIn {
  0% {opacity:0;}
  100% {opacity:1;}
  }
  
  @-ms-keyframes fadeIn {
  0% {opacity:0;}
  100% {opacity:1;}
  }

  // for the internal components of this div
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  @media (max-aspect-ratio: 848/712) {
    width: 100vw;
    height: 89vh;
    top: 11vh;
    left: 25vw;
    // background-color: #ffffff;
  }`

  const ButtonPane = styled.div`
    background-color: #f49f86;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-evenly;
  `

  const VendorButton = styled.button`
    grid-row: 4/5;
    border-radius: 25pt;
    height: 160pt;
    width: 112pt;
    border: none;
    font-size: 17pt;
    font-weight: bold;
    border: 3px solid blue;
    background-color: white;
    cursor: pointer;
    color: #f49f86;
    :hover {
      text-decoration: underline;
      box-shadow: 2px 8px 5px -5px #9d7a96;
    }
`


const ClientButton = styled.button`
grid-row: 4/5;
border-radius: 25pt;
height: 160pt;
width: 112pt;
border: none;
font-size: 17pt;
font-weight: bold;
color: #f49f86;
border: 3px solid orange;
background-color: white;
cursor: pointer;
:hover {
  text-decoration: underline;
  box-shadow: 2px 8px 5px -5px #9d7a96;
}
`

const ExitButton = styled.button`
position: relative;
background-color: white;
bottom: 5pt;
border: 1px solid red;
font-weight: bold;

text-align: center;
cursor: pointer;
:hover {
  background-color: #ffe6e6;
  text-decoration: underline;
  box-shadow: 2px 8px 5px -5px #9d7a96;
}
`


export { MainDiv, Logo, Title, SubTitle, LoginButton, 
  BackgroundCover, ButtonPane,
  VendorButton, ClientButton, ExitButton
}
