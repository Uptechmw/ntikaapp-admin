import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase-admin';

export async function GET() {
    return NextResponse.json({
        status: 'ok',
        time: new Date().toISOString(),
        version: 'debug-auth-v8',
        env: {
            hasServiceAccount: !!process.env.FIREBASE_SERVICE_ACCOUNT,
            projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
            keyInfo: process.env.FIREBASE_SERVICE_ACCOUNT ? (() => {
                try {
                    const sa = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
                    const key = sa.private_key || '';
                    const trimmed = key.trim();
                    return {
                        length: key.length,
                        first40: trimmed.substring(0, 40),
                        last40: trimmed.substring(trimmed.length - 40),
                        headerMatch: trimmed.startsWith('-----BEGIN PRIVATE KEY-----'),
                        footerMatch: trimmed.endsWith('-----END PRIVATE KEY-----')
                    };
                } catch { return 'JSON-parse-failed'; }
            })() : 'missing',
            firestoreTest: await (async () => {
                try {
                    // Try to list collections (requires Cloud Datastore Viewer role)
                    const collections = await db().listCollections();
                    return { status: 'success', count: collections.length };
                } catch (e: any) {
                    return { status: 'failed', error: e.message };
                }
            })()
        }
    });
}
