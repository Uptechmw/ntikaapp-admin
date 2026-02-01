import { NextRequest, NextResponse } from 'next/server';
import { verifyAdmin } from '@/lib/auth-server';
import { ModerationService } from '@/lib/services/ModerationService';

export async function GET(req: NextRequest) {
    const authResult = await verifyAdmin(req);
    if ('error' in authResult) {
        return NextResponse.json({ success: false, error: authResult.error }, { status: authResult.status });
    }

    try {
        const status = req.nextUrl.searchParams.get('status') || 'pending';
        const reports = await ModerationService.getReports(status as any);
        return NextResponse.json({ success: true, data: reports });
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
    }
}
