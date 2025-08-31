import { NextResponse } from 'next/server';
import { adminDb, adminAuth } from '@/lib/firebase-admin';

async function handler(req: Request) {
  try {
    const apiKey = req.headers.get('x-admin-api-key');
    if (apiKey !== process.env.ADMIN_API_KEY) {
      return NextResponse.json({ message: 'Unauthorized: Invalid Admin API Key' }, { status: 401 });
    }

    const authToken = req.headers.get('Authorization')?.split('Bearer ')[1];
    if (!authToken) {
      return NextResponse.json({ message: 'Unauthorized: Missing user token' }, { status: 401 });
    }
    await adminAuth.verifyIdToken(authToken);

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

    return NextResponse.json({ message: `Method ${req.method} Not Allowed` }, { status: 405 });

  } catch (error) {
    const message = error instanceof Error ? error.message : 'An unknown internal error occurred';
    console.error(`[Admin Blog API Error - ${req.method}]`, message);
    return NextResponse.json({ message: `Server error: ${message}` }, { status: 500 });
  }
}

export { handler as POST, handler as PUT, handler as DELETE };
