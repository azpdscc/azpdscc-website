
import { NextResponse } from 'next/server';
import { initializeApp, getApps, cert, App, ServiceAccount } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

// Define admin variables in the global scope of the route
let adminApp: App;
let adminAuth: import('firebase-admin/auth').Auth;
let adminDb: import('firebase-admin/firestore').Firestore;

/**
 * Initializes the Firebase Admin SDK.
 * This function ensures that the SDK is only initialized once, making it safe to call
 * at the beginning of each request handler. This is the most robust way to handle
* initialization in a serverless environment like Vercel or Amplify.
 */
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

/**
 * A centralized handler for all HTTP methods.
 * This function handles authentication and then delegates to the appropriate method handler.
 */
async function handler(req: Request) {
    try {
        // Initialize the Admin SDK at the start of every request.
        // The function is idempotent, so it's safe to call every time.
        initializeAdmin();

        // 1. Verify Admin API Key for server-to-server authentication
        const apiKey = req.headers.get('x-admin-api-key');
        if (apiKey !== process.env.ADMIN_API_KEY) {
            return NextResponse.json({ message: 'Unauthorized: Invalid Admin API Key' }, { status: 401 });
        }

        // 2. Verify User's Firebase Auth Token for user-level authentication
        const authToken = req.headers.get('Authorization')?.split('Bearer ')[1];
        if (!authToken) {
            return NextResponse.json({ message: 'Unauthorized: Missing user token' }, { status: 401 });
        }
        // Now that the SDK is initialized, this call will succeed.
        await adminAuth.verifyIdToken(authToken);

        // 3. Process the request based on the HTTP method
        if (req.method === 'POST') {
            const body = await req.json();
            const docRef = await adminDb.collection('blogPosts').add(body);
            return NextResponse.json({ success: true, id: docRef.id });
        }

        if (req.method === 'PUT') {
            const { id, ...rest } = await req.json();
            if (!id) {
                return NextResponse.json({ message: 'Document ID is required for update.' }, { status: 400 });
            }
            await adminDb.collection('blogPosts').doc(id).update(rest);
            return NextResponse.json({ success: true, id });
        }

        if (req.method === 'DELETE') {
             const { id } = await req.json();
             if (!id) {
                return NextResponse.json({ message: 'Document ID is required for deletion.' }, { status: 400 });
            }
            await adminDb.collection('blogPosts').doc(id).delete();
            return NextResponse.json({ success: true });
        }

        // If the method is not allowed
        return NextResponse.json({ message: `Method ${req.method} Not Allowed` }, { status: 405 });

    } catch (error) {
        const message = error instanceof Error ? error.message : 'An unknown internal error occurred';
        console.error(`[Admin Blog API Error - ${req.method}]`, message, error);
        // Return a clear error message to the client
        return NextResponse.json({ message: `Server error: ${message}` }, { status: 500 });
    }
}

// Export the single handler for all supported methods
export { handler as POST, handler as PUT, handler as DELETE };
