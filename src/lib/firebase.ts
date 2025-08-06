// This is a placeholder file.
// In the next step, I will prompt you to get your Firebase config object.
// We will then populate this file with the necessary Firebase initialization code.

import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore }from 'firebase/firestore';

// IMPORTANT: This is a placeholder configuration.
const firebaseConfig = {
  "projectId": "azpdscc-hub",
  "appId": "1:594549470017:web:4c36f8e414cc3dcbc067c0",
  "storageBucket": "azpdscc-hub.firebasestorage.app",
  "apiKey": process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  "authDomain": "azpdscc-hub.firebaseapp.com",
  "measurementId": "",
  "messagingSenderId": "594549470017"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);

export { app, db };
