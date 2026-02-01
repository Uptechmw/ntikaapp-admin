import { NextResponse } from 'next/server';

export async function GET() {
    return NextResponse.json({
        status: 'ok',
        time: new Date().toISOString(),
        version: 'debug-auth-v7',
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
            })() : 'missing'
        }
    });
}
