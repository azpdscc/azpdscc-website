import { NextResponse } from 'next/server';
import { initializeApp, getApps, cert, App, ServiceAccount } from 'firebase-admin/app';
import { getFirestore, Timestamp } from 'firebase-admin/firestore';

// Define a function to initialize Firebase Admin SDK and return the DB instance
// This ensures it's only initialized once.
function getAdminDb() {
    if (getApps().length) {
        return getFirestore(getApps()[0]);
    }

    const serviceAccountString = process.env.FIREBASE_SERVICE_ACCOUNT;
    if (!serviceAccountString) {
        throw new Error('The FIREBASE_SERVICE_ACCOUNT environment variable is not set.');
    }

    try {
        const decodedServiceAccount = Buffer.from(serviceAccountString, 'base64').toString('utf8');
        const serviceAccount: ServiceAccount = JSON.parse(decodedServiceAccount);
        
        const app = initializeApp({
            credential: cert(serviceAccount),
        });
        return getFirestore(app);
    } catch (error) {
        const message = error instanceof Error ? error.message : 'An unknown error occurred during JSON parsing or initialization.';
        console.error("Firebase Admin SDK initialization failed:", message);
        throw new Error(`Firebase Admin SDK initialization failed: ${message}`);
    }
}


async function handler(req: Request) {
    const apiKey = req.headers.get('x-admin-api-key');

    if (apiKey !== process.env.ADMIN_API_KEY) {
        return NextResponse.json({ message: 'Unauthorized: Invalid API Key' }, { status: 401 });
    }

    try {
        const adminDb = getAdminDb(); // Get the initialized DB instance
        const body = await req.json();

        if (req.method === 'POST') {
            const { date, ...rest } = body;
            const docRef = await adminDb.collection('blogPosts').add({
                ...rest,
                date: Timestamp.fromDate(new Date(date)),
            });
            return NextResponse.json({ success: true, id: docRef.id });
        }

        if (req.method === 'PUT') {
            const { id, date, ...rest } = body;
            if (!id) {
                return NextResponse.json({ message: 'Document ID is required for update.' }, { status: 400 });
            }
            await adminDb.collection('blogPosts').doc(id).update({
                ...rest,
                date: Timestamp.fromDate(new Date(date)),
            });
            return NextResponse.json({ success: true, id });
        }

        if (req.method === 'DELETE') {
             const { id } = body;
             if (!id) {
                return NextResponse.json({ message: 'Document ID is required for deletion.' }, { status: 400 });
            }
            await adminDb.collection('blogPosts').doc(id).delete();
            return NextResponse.json({ success: true });
        }

        return NextResponse.json({ message: `Method ${req.method} Not Allowed` }, { status: 405 });

    } catch (error) {
        const message = error instanceof Error ? error.message : 'An unknown internal error occurred';
        console.error('Admin API Error:', message);
        return NextResponse.json({ message }, { status: 500 });
    }
}

export { handler as POST, handler as PUT, handler as DELETE };
