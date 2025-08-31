
/**
 * @fileoverview Initializes the Firebase Admin SDK for server-side operations.
 * This is the single source of truth for the admin app instance. It relies on
 * Firebase App Hosting's built-in support for service accounts.
 *
 * For this to work, the `FIREBASE_SERVICE_ACCOUNT` secret must be set
 * in the Firebase Secret Manager and linked in `apphosting.yaml`.
 *
 * This setup automatically uses the default service account credentials
 * provisioned by the App Hosting environment.
 */
import { initializeApp, getApps, App } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

let app: App;

if (getApps().length === 0) {
  app = initializeApp();
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
