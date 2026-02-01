import { NextResponse } from 'next/server';

export async function GET() {
    return NextResponse.json({
        status: 'ok',
        time: new Date().toISOString(),
        version: 'debug-auth-v6',
        env: {
            hasServiceAccount: !!process.env.FIREBASE_SERVICE_ACCOUNT,
            projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
        }
    });
}
