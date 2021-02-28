import './components.css'
import styled from 'styled-components/macro'
import logo from '../Pages/Login/HedwigLogoFinal_02.svg'
import SadOwl from '../images/SadOwl.jpg'
import { useNavigate } from 'react-router-dom'

const BackButton = styled.button`
  border-radius: 25pt;
  height: 5rem;
  margin: 2%;
  width: 10rem;
  border: none;
  font-size: 2rem;
  background-color: #f3725b;
  color: white;
  font-family: Proxima Nova;
  font-weight: bold;
  :hover {
    text-decoration: underline;
    box-shadow: 0 0 50px rgba(33, 33, 33, 0.2);
  }
  :focus {
    outline: none;
  }
`

const Logo = styled.img`
  width: 2rem;
  margin: 0.25em;  
`

const SadOwlPic = styled.img`
  width: 30rem;
  height: 20rem;
  padding: 3%;
  border-radius: 10%;
`

const TextPane = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 50vw;
`

const Text = styled.p`
  padding: 0;
  margin: 0; 
`

const Footer = styled.div`
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  background-color: #de8359;
  color: white;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
}
`

const FooterText = styled.p`
  margin-top: 1%;
  font-size: 12px;
`

const LinkPane = styled.div`
  display: flex;
`

function ErrorPage (props) {
  const navigate = useNavigate()
  const goBack = () => {
    navigate(-1)
    navigate(-1)
  }
  return (
    <div>
      <div className='errorPage'>
        {/* <Logo src={logo} /> */}
        <SadOwlPic src={SadOwl} />
        <TextPane>
          <Text>The page you were looking for does not exist :(</Text>
          <Text>Error Code: 404</Text>
          <BackButton onClick={goBack} style={{ cursor: 'pointer' }}>
            Go Back
          </BackButton>
        </TextPane>
        </div>
        <Footer>
          <Logo src={logo} />
          <FooterText>
            Hedwig © 2021 
          </FooterText>
            
        </Footer>
      </div>

  )
}

export default ErrorPage
