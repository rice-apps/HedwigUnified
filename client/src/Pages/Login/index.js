import logo from './logo.svg'
import { MainDiv, Logo, Title, SubTitle, LoginButton } from './Login.styles'
// import './Transitions.css';
import { useNavigate } from 'react-router-dom'

// This import loads the firebase namespace along with all its type information.
import firebase from 'firebase/app'

function Login () {
  // const provider = new firebase.auth.SAMLAuthProvider("saml.jumpcloud-demo");
  const navigate = useNavigate()
  const provider = new firebase.auth.SAMLAuthProvider('saml.rice-shibboleth')

  /* Lets user sign in in a pop-up tab, get the user's info then generates a token. */
  const signInSAML = () => {
    firebase.auth().signInWithRedirect(provider)
  }

  firebase
    .auth()
    .getRedirectResult()
    .then(result => result.user.getIdToken())
    .then(idToken => {
      localStorage.setItem('idToken', idToken)
      navigate('/auth')
    })
    .catch(error => console.log(error))

  return (
    <MainDiv>
      <Logo src={logo} />
      <Title>HEDWIG</Title>
      <SubTitle>brought to you by riceapps</SubTitle>
      <LoginButton onClick={signInSAML}>Login with NetID</LoginButton>
    </MainDiv>
  )
}

export default Login
