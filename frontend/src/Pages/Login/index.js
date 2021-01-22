import logo from './HedwigLogoFinal_02.svg'
import { MainDiv, ElemDiv, Logo, Title, LoginButton } from './Login.styles'

// import './Transitions.css';
import { useNavigate } from 'react-router-dom'
import moment from 'moment'

// This import loads the firebase namespace along with all its type information.
import firebase from 'firebase/app'
import { TokenKind } from 'graphql'

function Login ({updateLoginStatus}) {
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
      const expTime = idTokenResult.expirationTime
      localStorage.setItem('idToken', idTokenResult.token)
      localStorage.setItem('expireTime', moment(expTime))
      updateLoginStatus(true, /* sets expiration alert timer */ 40 * 60 * 1000)
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
