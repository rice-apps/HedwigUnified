// Initialize Firebase
import { FIREBASE_API_KEY, FIREBASE_AUTH_DOMAIN } from './config'

// This import loads the firebase namespace along with all its type information.
import firebase from 'firebase/app'

// These imports load individual services into the firebase namespace.
import 'firebase/auth'

const firebaseConfig = {
  apiKey: FIREBASE_API_KEY,
  authDomain: FIREBASE_AUTH_DOMAIN
}

firebase.initializeApp(firebaseConfig)

firebase.auth().onIdTokenChanged(async user => {
  if (user) {
    localStorage.setItem('token', await user.getIdToken())
  } else {
    localStorage.removeItem('token')
  }
})

export default firebase
