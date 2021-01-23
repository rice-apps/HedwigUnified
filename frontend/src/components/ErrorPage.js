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

function ErrorPage (props) {
  {
    return (
      <div className='errorPage'>
        <h1>ERROR 404.</h1>
        {/* <p>Page not found. Try a different URL!</p> */}
        <p>{props.errMessage} Try a different URL!</p>
      </div>
    )
  }
}

export default ErrorPage
