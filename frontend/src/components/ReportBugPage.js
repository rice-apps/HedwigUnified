import './components.css'
import styled from 'styled-components/macro'
import { useNavigate } from 'react-router-dom'

const ReportPageButton = styled.button`
  border-radius: 3vh;
  height: 15vh;
  width: 40vh;
  border: none;
  margin-bottom: 7vh;
  font-size: 5vh;
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

function ReportBugPage () {
  const navigate = useNavigate()
  const reportBug = () => {
    window.open("https://forms.gle/QJgMDKxCoT19jHbF9", "_blank")
  }
  const goBack = () => {
    navigate('/login')
  }
  return (
    <div className='errorPage'>
      <h1 style={{ 'font-size': '8vh' }}>
        Uh oh! Something went wrong.
      </h1>
      <ReportPageButton onClick={reportBug} style={{ cursor: 'pointer' }}>
        Report Bug
      </ReportPageButton>
      <ReportPageButton onClick={goBack} style={{ cursor: 'pointer' }}>
        Back to Login
      </ReportPageButton>
    </div>
  )
}

export default ReportBugPage
