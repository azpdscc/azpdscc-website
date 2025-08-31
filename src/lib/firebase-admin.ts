
/**
 * @fileoverview Initializes the Firebase Admin SDK for server-side operations.
 * This is the single source of truth for the admin app instance. It now robustly
 * handles environment variables by explicitly loading them from `.env.local`,
 * which is populated during the AWS Amplify build process.
 */
import { initializeApp, getApps, cert, App, ServiceAccount } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import * as dotenv from 'dotenv';

// Explicitly load environment variables from .env.local
dotenv.config({ path: '.env.local' });

let app: App;

if (getApps().length === 0) {
  const serviceAccountString = process.env.FIREBASE_SERVICE_ACCOUNT;
  
  if (!serviceAccountString) {
    throw new Error('The FIREBASE_SERVICE_ACCOUNT environment variable is not set. This is required for server-side operations.');
  }

  try {
    const decodedServiceAccount = Buffer.from(serviceAccountString, 'base64').toString('utf8');
    const serviceAccount: ServiceAccount = JSON.parse(decodedServiceAccount);
    
    app = initializeApp({
      credential: cert(serviceAccount),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'An unknown error occurred during JSON parsing or initialization.';
    console.error("Firebase Admin SDK initialization failed:", message);
    throw new Error(`Firebase Admin SDK initialization failed: ${message}`);
  }
} else {
  app = getApps()[0];
}

const adminAuth = getAuth(app);
const adminDb = getFirestore(app);

/**
 * Verifies the Firebase ID token.
 * This function should only be used in secure, server-side environments (e.g., API routes).
 * @param {string} token The Firebase ID token to verify.
 * @returns {Promise<import('firebase-admin/auth').DecodedIdToken>}
 */
export const verifyIdToken = (token: string) => {
  return adminAuth.verifyIdToken(token);
};

export { adminAuth, adminDb };
