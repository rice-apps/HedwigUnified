// Initialize Firebase
import { FIREBASE_API_KEY, FIREBASE_AUTH_DOMAIN } from './config'

// This import loads the firebase namespace along with all its type information.
<<<<<<< HEAD
import firebase from 'firebase/app'
=======
import * as firebase from 'firebase/app'
>>>>>>> adds styled files

// These imports load individual services into the firebase namespace.
import 'firebase/auth'
import 'firebase/database'

const firebaseConfig = {
  apiKey: FIREBASE_API_KEY,
  authDomain: FIREBASE_AUTH_DOMAIN
}

firebase.initializeApp(firebaseConfig)

export default firebase
