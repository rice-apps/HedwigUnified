import admin from 'firebase-admin'

const firebaseAdmin = admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  databaseURL: 'https://hedwig-279117.firebaseio.com'
})

export default firebaseAdmin
