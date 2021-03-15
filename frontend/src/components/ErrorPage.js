import './components.css'
import styled from 'styled-components/macro'
import { useNavigate } from 'react-router-dom'

const BackButton = styled.button`
  border-radius: 25pt;
  height: 10rem;
  width: 15rem;
  border: none;
  font-size: 3rem;
  background-color: #f3725b;
  color: white;
  font-family: Proxima Nova, sans-serif;
  font-weight: bold;
  :hover {
    text-decoration: underline;
    box-shadow: 0 0 50px rgba(33, 33, 33, 0.2);
  }
  :focus {
    outline: none;
  }
`

function ErrorPage (props) {
  const navigate = useNavigate()
  const goBack = () => {
    navigate(-1)
    navigate(-1)
  }
  return (
    <div className='errorPage'>
      <h1 style={{ 'font-size': '52px' }}>
        Page doesn't exist... How did you get here?
      </h1>
      {/* <p>Page not found. Try a different URL!</p> */}
      <p>{props.errMessage} Try a different URL!</p>
      <BackButton onClick={goBack} style={{ cursor: 'pointer' }}>
        Go Back
      </BackButton>
    </div>
  )
}

export default ErrorPage
