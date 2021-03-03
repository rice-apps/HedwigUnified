import './components.css'
import styled, { css } from 'styled-components/macro'
import { useNavigate } from 'react-router-dom'
import HedwigLogo from './../Pages/Login/HedwigLogoFinal_02.svg'

const ReportPageButton = styled.button`
  border-radius: 6vh;
  height: 8vh;
  width: 40%;
  font-size: 3vh;
  background-color: #f3725b;
  ${props =>
     props.error &&
     css`
       background-color: #f3725b;
       color: white;
       border: none;
       margin-bottom: 3vh;
  `}
  ${props =>
     props.home &&
     css`
       background-color: white;
       color: #f3725b;
       border-color: #f3725b;
       border-width: 0.6vh;
       margin-bottom: 10vh;
  `}
  font-family: Proxima Nova;
  font-weight: bold;
  /* :hover {
    text-decoration: underline; 
    box-shadow: 0 0 50px rgba(33, 33, 33, 0.2);
  } */
  :focus { 
    outline: none;
  }
`
const Logo = styled.img`
  margin-top: 1vh;
  width: 40%;
`

const Title = styled.h1`
  color: #f3725b;
  font-size: 8vh;
  font-weight: bold;
  align-content: center;
  margin-bottom: 1vh;
`

const Description = styled.h1`
  font-size: 3vh;
  margin-left: 15%;
  margin-right: 15%;
  align-content: center;
  font-weight: bold;
  margin-bottom: 4vh;
  padding: 0vh;
  line-height: 4vh;
`
 
function ReportBugPage () {
  const navigate = useNavigate()
  const reportBug = () => {
    window.open("https://forms.gle/QJgMDKxCoT19jHbF9", "_blank")
  }
  const goBack = () => {
    window.localStorage.clear();
    window.open(window.location.origin + "/login", "_blank")
  }
  return (
    <div className='errorPage'>
      <Logo style={{ marginTop: '30%', height: '20vh'}} src={HedwigLogo} />
      <Title>Oops!</Title>
      <Description>
        Something went wrong. Don't worry - we're on the case.
      </Description>
      <ReportPageButton error onClick={reportBug} style={{ cursor: 'pointer' }}>
        Report Error
      </ReportPageButton>
      <ReportPageButton home onClick={goBack} style={{ cursor: 'pointer' }}>
        Return Home
      </ReportPageButton>
    </div>
  )
}

export default ReportBugPage
