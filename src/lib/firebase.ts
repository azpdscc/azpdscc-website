
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore }from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// This is the valid, project-specific Firebase configuration.
const firebaseConfig = {
  "projectId": "azpdscc-hub",
  "appId": "1:594549470017:web:4c36f8e414cc3dcbc067c0",
  "storageBucket": "azpdscc-hub.firebasestorage.app",
  "apiKey": "AIzaSyDwpzJ1tR_2ljCm-knQwaghPuTjgwbvY2I",
  "authDomain": "azpdscc-hub.firebaseapp.com",
  "measurementId": "",
  "messagingSenderId": "594549470017"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);
const auth = getAuth(app);

export { app, db, auth };
