import { NextRequest, NextResponse } from 'next/server';
import { auth, db } from './firebase-admin';

export async function verifyAdmin(req: NextRequest) {
    const authHeader = req.headers.get('authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return { error: 'Unauthorized: No token provided', status: 401 };
    }

    const token = authHeader.split('Bearer ')[1];

    try {
        const decodedToken = await auth().verifyIdToken(token);

        // Check Admin privilege in Firestore
        const userDoc = await db().collection('users').doc(decodedToken.uid).get();
        const userData = userDoc.data();

        if (!userData?.isAdmin) {
            return { error: 'Forbidden: Admin access required', status: 403 };
        }

        return { uid: decodedToken.uid, user: userData };
    } catch (error: any) {
        console.error('Auth verification failed. Token prefix:', token.substring(0, 10), 'Err:', error.message);
        return {
            error: `Unauthorized: [${error.code || 'unknown'}] ${error.message}`,
            status: 401
        };
    }
}
