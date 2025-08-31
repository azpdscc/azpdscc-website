
/**
 * @fileoverview This file contains server-side Firebase Admin SDK functions.
 * It is used for operations that require admin privileges, such as verifying
 * user ID tokens on the server. This file should only be imported in
 * server-side code (e.g., Next.js Server Actions).
 */
import { initializeApp, getApps, cert, App } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

// This is a server-side only file. The client does not have access to this.
const serviceAccount = {
    "type": "service_account",
    "project_id": process.env.FIREBASE_PROJECT_ID,
    "private_key_id": process.env.FIREBASE_PRIVATE_KEY_ID,
    "private_key": process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    "client_email": process.env.FIREBASE_CLIENT_EMAIL,
    "client_id": process.env.FIREBASE_CLIENT_ID,
    "auth_uri": process.env.FIREBASE_AUTH_URI,
    "token_uri": process.env.FIREBASE_TOKEN_URI,
    "auth_provider_x509_cert_url": process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
    "client_x509_cert_url": process.env.FIREBASE_CLIENT_X509_CERT_URL,
};

let app: App;

if (getApps().length === 0) {
    app = initializeApp({
        credential: cert(serviceAccount)
    });
} else {
    app = getApps()[0];
}

const adminAuth = getAuth(app);

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
