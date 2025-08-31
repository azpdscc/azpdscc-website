
/**
 * @fileoverview This file contains server-side Firebase Admin SDK functions.
 * It is used for operations that require admin privileges, such as verifying
 * user ID tokens on the server. This file should only be imported in
 * server-side code (e.g., Next.js API Routes).
 */
import { initializeApp, getApps, cert, App, ServiceAccount } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';


let adminApp: App;
let adminAuth: import('firebase-admin/auth').Auth;
let adminDb: import('firebase-admin/firestore').Firestore;

// This function initializes the admin app and its services. It's designed to be
// called only when needed, and it ensures that initialization only happens once.
function initializeAdmin() {
    if (getApps().length > 0) {
        adminApp = getApps()[0];
    } else {
        const serviceAccountString = process.env.FIREBASE_SERVICE_ACCOUNT;
        if (!serviceAccountString) {
            throw new Error('The FIREBASE_SERVICE_ACCOUNT environment variable is not set. This is required for server-side operations.');
        }
        
        try {
            const decodedServiceAccount = Buffer.from(serviceAccountString, 'base64').toString('utf8');
            const serviceAccount: ServiceAccount = JSON.parse(decodedServiceAccount);
            
            adminApp = initializeApp({
                credential: cert(serviceAccount),
            });
        } catch (error) {
            const message = error instanceof Error ? error.message : 'An unknown error occurred during JSON parsing or initialization.';
            console.error("Firebase Admin SDK initialization failed:", message);
            throw new Error(`Firebase Admin SDK initialization failed: ${message}`);
        }
    }
    
    adminAuth = getAuth(adminApp);
    adminDb = getFirestore(adminApp);
}

// Ensure initialization is run when the module is loaded.
initializeAdmin();

/**
 * Verifies a Firebase ID token.
 * This function is used to protect server actions by ensuring the user is logged in.
 * @param {string} idToken The ID token to verify.
 * @returns {Promise<import('firebase-admin/auth').DecodedIdToken>} A promise that resolves with the decoded ID token.
 * @throws Will throw an error if the token is invalid.
 */
export async function verifyIdToken(idToken: string) {
    if (!adminAuth) {
        throw new Error("Admin Auth not initialized.");
    }
    try {
        const decodedToken = await adminAuth.verifyIdToken(idToken);
        return decodedToken;
    } catch (error) {
        console.error("Error verifying ID token:", error);
        throw new Error("Invalid or expired authentication token.");
    }
}

// Export the initialized admin DB instance for use in API routes.
export { adminDb };
