/**
 * @fileoverview This file contains server-side Firebase Admin SDK functions.
 * It is used for operations that require admin privileges, such as verifying
 * user ID tokens on the server. This file should only be imported in
 * server-side code (e.g., Next.js Server Actions).
 */
import { initializeApp, getApps, cert, App, ServiceAccount } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

let adminApp: App;

// This is the robust, standard way to initialize the Admin SDK in a serverless environment.
// It relies on a single, base64-encoded environment variable.
try {
    if (!getApps().length) {
        const serviceAccountString = process.env.FIREBASE_SERVICE_ACCOUNT;
        if (!serviceAccountString) {
            throw new Error('The FIREBASE_SERVICE_ACCOUNT environment variable is not set.');
        }

        // Decode the base64 string to get the JSON-formatted service account key
        const decodedServiceAccount = Buffer.from(serviceAccountString, 'base64').toString('utf8');
        const serviceAccount: ServiceAccount = JSON.parse(decodedServiceAccount);

        adminApp = initializeApp({
            credential: cert(serviceAccount),
        });
    } else {
        adminApp = getApps()[0];
    }
} catch (error) {
    console.error("Firebase Admin SDK initialization failed:", error);
    // If initialization fails, we'll throw an error to make it clear what's wrong.
    // This helps in debugging during deployment.
    throw new Error(`Firebase Admin SDK initialization failed: ${error instanceof Error ? error.message : 'An unknown error occurred'}`);
}


const adminAuth = getAuth(adminApp);
const adminDb = getFirestore(adminApp);

/**
 * Verifies a Firebase ID token.
 * @param {string} idToken The ID token to verify.
 * @returns {Promise<import('firebase-admin/auth').DecodedIdToken>} A promise that resolves with the decoded ID token.
 * @throws Will throw an error if the token is invalid.
 */
export async function verifyIdToken(idToken: string) {
    try {
        const decodedToken = await adminAuth.verifyIdToken(idToken);
        return decodedToken;
    } catch (error) {
        console.error("Error verifying ID token:", error);
        throw new Error("Invalid or expired authentication token.");
    }
}

// Export the admin database instance for use in server actions
export { adminDb, adminAuth };
