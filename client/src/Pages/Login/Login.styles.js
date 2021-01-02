import styled from 'styled-components'

const MainDiv = styled.div`
@font-face {
  font-family: 'Omnes';
  src: local('Omnes'), url(../../fonts/Omnes-Font/Omnes/Omnes.ttf);
}
  height: 100vh;
  width: 100vw;
  display: flex;
  align-items: center;
  justify-content: center;
  max-width: 100%;
  
  background-color: white;
`

const ElemDiv = styled.div`
  display: flex;
  flex-direction: column;
  text-align: center;
  align-items: center;
  justify-items: center;
  max-height: 70%;
`

const Logo = styled.img`
  width: 10rem;
`

const HedwigLogo = styled.img`
  max-height: 20%;
  max-width: 20%;
`
const Title = styled.h1`
  color: #F3725B;
  font-size: 3.3rem;
  margin: 0.1rem;
  font-family:  Omnes;
  font-style: normal;
  font-weight: 500;
`
const LoginButton = styled.button`
@font-face {
  font-family: 'Proxima Nova';
  src: local('Proxima Nova'), url(../../fonts/FontsFree-Net-proxima_nova_reg-webfont.ttf);
}
  border-radius: 25pt;
  height: 2.2rem;
  width: 8.5rem;
  border: none;
  font-size: 0.8rem;
  background-color:#F3725B;
  color: white;
  font-family: Proxima Nova;
  font-weight: bold;
  :hover {
    text-decoration: underline;
  }
  :focus{
    outline: none;
  }
`

const BackgroundCover = styled.div`
  height: 100vh;
  width: 100vw;
  display: grid;
  background-color: white;
  max-width: 100%;
  font-family: 'Raleway', sans-serif;

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
  }
`

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
  height: 40vh;
  width: 40%;
  border: none;
  font-size: 14pt;
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
  height: 40vh;
  width: 40%;
  border: none;
  font-size: 14pt;

  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;

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

const LoginQuestion = styled.p`
  position: relative;
  font-weight: bold;
  color: white;
  font-size: 25pt;
  text-align: center;
  padding: 1em;
`

export {
  MainDiv,
  ElemDiv,
  Logo,
  Title,
  LoginButton,
  BackgroundCover,
  ButtonPane,
  VendorButton,
  ClientButton,
  ExitButton,
  LoginQuestion,
  HedwigLogo
}
