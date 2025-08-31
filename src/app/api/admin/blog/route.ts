
import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { Timestamp } from 'firebase-admin/firestore';

async function handler(req: Request) {
    const apiKey = req.headers.get('x-admin-api-key');

    if (apiKey !== process.env.ADMIN_API_KEY) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    try {
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
