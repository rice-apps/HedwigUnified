// This import loads the firebase namespace along with all its type information.
import firebase from 'firebase/app'
import 'firebase/auth'
// import './Transitions.css';
import { useNavigate } from 'react-router-dom'
import { LoadingPage } from '../../components/LoadingComponents'

function LoadingAuth() {
    const navigate = useNavigate()

    firebase
    .auth()
    .getRedirectResult()
    .then(result => result.user.getIdTokenResult(true))
    .then(idTokenResult => {
        localStorage.setItem('token', idTokenResult.token)
        navigate('/auth')
    })
    .catch(error => console.log(error))

    return (
        <LoadingPage />
    )
}

export default LoadingAuth;