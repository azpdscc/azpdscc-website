
/**
 * @fileoverview Initializes the Firebase Admin SDK for server-side operations using lazy initialization.
 * This pattern ensures the SDK is initialized only when first needed, preventing errors
 * during the build process where environment variables (like the service account) may not be available.
 *
 * It relies on Firebase App Hosting's built-in support for service accounts.
 * For this to work, the `FIREBASE_SERVICE_ACCOUNT` secret must be set
 * in the Firebase Secret Manager and linked in `apphosting.yaml`.
 */
import { initializeApp, getApps, App, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

let app: App;
let authInstance: ReturnType<typeof getAuth>;
let dbInstance: ReturnType<typeof getFirestore>;

function initializeAdminApp() {
  if (getApps().length === 0) {
    // In the App Hosting environment, initializeApp() is sufficient.
    // For local emulation or other environments, you might need credentials.
    app = initializeApp();
  } else {
    app = getApps()[0];
  }
  authInstance = getAuth(app);
  dbInstance = getFirestore(app);
}

// Lazy-loaded instances
const adminAuth = new Proxy({} as ReturnType<typeof getAuth>, {
  get: (target, prop) => {
    if (!app) initializeAdminApp();
    return Reflect.get(authInstance, prop);
  }
});

const adminDb = new Proxy({} as ReturnType<typeof getFirestore>, {
  get: (target, prop) => {
    if (!app) initializeAdminApp();
    return Reflect.get(dbInstance, prop);
  }
});

/**
 * Verifies the Firebase ID token.
 * This function should only be used in secure, server-side environments (e.g., API routes).
 * @param {string} token The Firebase ID token to verify.
 * @returns {Promise<import('firebase-admin/auth').DecodedIdToken>}
 */
export const verifyIdToken = (token: string) => {
  if (!app) initializeAdminApp();
  return adminAuth.verifyIdToken(token);
};

export { adminAuth, adminDb };
