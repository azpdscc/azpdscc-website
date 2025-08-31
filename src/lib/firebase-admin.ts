/**
 * @fileoverview This file contains server-side Firebase Admin SDK functions.
 * It is used for operations that require admin privileges, such as verifying
 * user ID tokens on the server. This file should only be imported in
 * server-side code (e.g., Next.js Server Actions).
 */
import { initializeApp, getApps, cert, App } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

// This is a server-side only file. The client does not have access to this.
const serviceAccount = {
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
};

let adminApp: App;

if (getApps().length === 0) {
    adminApp = initializeApp({
        credential: cert(serviceAccount)
    });
} else {
    adminApp = getApps()[0];
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
export { adminDb };
