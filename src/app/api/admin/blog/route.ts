
import { NextResponse } from 'next/server';
import { adminDb, verifyIdToken } from '@/lib/firebase-admin';
import { Timestamp } from 'firebase-admin/firestore';

async function handler(req: Request) {
    try {
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
        await verifyIdToken(authToken); // This confirms the user is a valid, logged-in user

        // 3. Process the request based on the method
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
        console.error('Admin Blog API Error:', message);
        // Ensure a clear error is sent back
        return NextResponse.json({ message: `Server error: ${message}` }, { status: 500 });
    }
}

export { handler as POST, handler as PUT, handler as DELETE };
