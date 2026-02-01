import { NextResponse } from 'next/server';

export async function GET() {
    return NextResponse.json({
        status: 'ok',
        time: new Date().toISOString(),
        version: 'debug-auth-v6',
        env: {
            hasServiceAccount: !!process.env.FIREBASE_SERVICE_ACCOUNT,
            projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
            keyInfo: process.env.FIREBASE_SERVICE_ACCOUNT ? (() => {
                try {
                    const sa = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
                    const key = sa.private_key || '';
                    return {
                        length: key.length,
                        startsWithHeader: key.trim().startsWith('-----BEGIN PRIVATE KEY-----'),
                        endsWithHeader: key.trim().endsWith('-----END PRIVATE KEY-----'),
                        first40Chars: key.trim().substring(0, 40)
                    };
                } catch { return 'JSON-parse-failed'; }
            })() : 'missing'
        }
    });
}
