// This is a placeholder file.
// In the next step, I will prompt you to get your Firebase config object.
// We will then populate this file with the necessary Firebase initialization code.

import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore }from 'firebase/firestore';

// IMPORTANT: This is a placeholder configuration.
const firebaseConfig = {
  apiKey: "REPLACE_WITH_YOUR_API_KEY",
  authDomain: "REPLACE_WITH_YOUR_AUTH_DOMAIN",
  projectId: "REPLACE_WITH_YOUR_PROJECT_ID",
  storageBucket: "REPLACE_WITH_YOUR_STORAGE_BUCKET",
  messagingSenderId: "REPLACE_WITH_YOUR_MESSAGING_SENDER_ID",
  appId: "REPLACE_WITH_YOUR_APP_ID",
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);

export { app, db };
