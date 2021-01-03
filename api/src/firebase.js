import * as admin from 'firebase-admin';
import {FIREBASE_AUTH_DOMAIN, FIREBASE_API_KEY} from './config'

const firebaseAppConfig = {
  apiKey: FIREBASE_API_KEY,
  authDomain: FIREBASE_AUTH_DOMAIN,
  projectId: 'hedwig-279117'
}

export const firebaseApp = admin.initializeApp(firebaseAppConfig)