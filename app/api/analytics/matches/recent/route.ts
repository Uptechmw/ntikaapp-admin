import { NextRequest, NextResponse } from 'next/server';
import { verifyAdmin } from '@/lib/auth-server';
import { MatchService } from '@/lib/services/MatchService';

export async function GET(req: NextRequest) {
    const authResult = await verifyAdmin(req);
    if ('error' in authResult) {
        return NextResponse.json({ success: false, error: authResult.error }, { status: authResult.status });
    }

    try {
        const matches = await MatchService.getRecentMatches();
        return NextResponse.json({ success: true, data: matches });
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
    }
}
