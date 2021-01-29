import styled from 'styled-components/macro'

/** MainDiv is used both in VendorCheck and Login. It puts all blocks at the center of the screen.
 *  Need to override font for element inside of MainDiv!
 */
const MainDiv = styled.div`
  font-family: 'Omnes';
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
  color: #f3725b;
  font-size: 3.3rem;
  margin: 0.1rem;
  font-family: 'Omnes';
  font-style: normal;
  font-weight: 500;
`
const LoginButton = styled.button`
  border-radius: 25pt;
  height: 2.2rem;
  width: 8.5rem;
  border: none;
  font-size: 0.8rem;
  background-color: #f3725b;
  color: white;
  font-weight: bold;
  :hover {
    text-decoration: underline;
  }
  :focus {
    outline: none;
  }
`

const BackgroundCover = styled.div`
  color:#F3725B;
  backgound-color: white;
  }
`

const ButtonPane = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  align-items: space-evenly;
`

const CheckButton = styled.button`
  border-radius: 20px;
  border: 2.8px solid #f3725b;
  cursor: pointer;
  background-color: white;
  font-size: 1rem;
  font-weight: bold;
  padding: 1rem;
  width: 10rem;
  margin: 0.5rem;
  outline: none;
`

const ExitButton = styled.button`
  position: relative;
  background-color: white;
  bottom: 5pt;
  border: 1px solid #f3725b;
  font-weight: bold;

  text-align: center;
  cursor: pointer;
  :hover {
    background-color: #ffe6e6;
    text-decoration: underline;
    box-shadow: 2px 8px 5px -5px #9d7a96;
  }
`

const LoginQuestion = styled.div`
  position: relative;
  font-weight: bold;
  font-size: 2rem;
  letter-spacing: 0rem;
  text-align: center;
  padding: 0.3rem;
`

export {
  MainDiv,
  ElemDiv,
  Logo,
  Title,
  LoginButton,
  BackgroundCover,
  ButtonPane,
  CheckButton,
  ExitButton,
  LoginQuestion,
  HedwigLogo
}
