// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
import { getDatabase } from 'firebase/database'
import { getFirestore } from 'firebase/firestore'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyBYmJPO3Lv4g3pl0O77B21ZhifKHJbGEMM',
  authDomain: 'socketio-247b2.firebaseapp.com',
  projectId: 'socketio-247b2',
  storageBucket: 'socketio-247b2.appspot.com',
  messagingSenderId: '298527662681',
  appId: '1:298527662681:web:db25e976e811bdf82e8748',
  measurementId: 'G-X3H6R2Y93F',
  databaseUrl:
    'https://socketio-247b2-default-rtdb.asia-southeast1.firebasedatabase.app'
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const database = getFirestore(app)

export { app, database }
