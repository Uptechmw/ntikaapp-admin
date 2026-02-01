import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase-admin';
import { verifyAdmin } from '@/lib/auth-server';

export async function GET(req: NextRequest) {
    const auth = await verifyAdmin(req);
    if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });

    try {
        const settingsDb = db();
        const [aiDoc, pawapayDoc] = await Promise.all([
            settingsDb.collection('settings').doc('ai').get(),
            settingsDb.collection('settings').doc('pawapay').get()
        ]);

        return NextResponse.json({
            ai: aiDoc.exists ? aiDoc.data() : {},
            pawapay: pawapayDoc.exists ? pawapayDoc.data() : {
                environment: 'sandbox',
                live: { baseUrl: '', token: '' },
                sandbox: { baseUrl: '', token: '' }
            }
        });
    } catch (error: any) {
        console.error('Failed to fetch settings:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    const auth = await verifyAdmin(req);
    if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });

    try {
        const body = await req.json();
        const settingsDb = db();

        const updates: Promise<any>[] = [];

        if (body.ai) {
            updates.push(settingsDb.collection('settings').doc('ai').set({
                ...body.ai,
                updatedAt: new Date().toISOString()
            }, { merge: true }));
        }

        if (body.pawapay) {
            updates.push(settingsDb.collection('settings').doc('pawapay').set({
                ...body.pawapay,
                updatedAt: new Date().toISOString()
            }, { merge: true }));
        }

        await Promise.all(updates);
        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('Failed to update settings:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
