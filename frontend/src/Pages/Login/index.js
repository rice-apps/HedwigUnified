import logo from './HedwigLogoFinal_02.svg'
import { MainDiv, ElemDiv, Logo, Title, LoginButton } from './Login.styles'

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
    .then(result => result.user.getIdTokenResult(true))
    .then(idTokenResult => {
      console.log(idTokenResult.claims.firebase.sign_in_attributes)
      localStorage.setItem('idToken', idTokenResult.token)
      navigate('/auth')
    })
    .catch(error => console.log(error))

  return (
    <MainDiv>
      <ElemDiv>
        <Logo src={logo} />
        <Title>hedwig</Title>
        <LoginButton onClick={signInSAML}>Login with NetID</LoginButton>
      </ElemDiv>
    </MainDiv>
  )
}

export default Login
