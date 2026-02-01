import { NextRequest, NextResponse } from 'next/server';
import { verifyAdmin } from '@/lib/auth-server';
import { AnalyticsService } from '@/lib/services/AnalyticsService';

export async function GET(req: NextRequest) {
    const authResult = await verifyAdmin(req);
    if ('error' in authResult) {
        return NextResponse.json({ success: false, error: authResult.error }, { status: authResult.status });
    }

    try {
        const platformStats = await AnalyticsService.getPlatformStats();
        const userGrowth = await AnalyticsService.getUserGrowth();
        const revenueHistory = await AnalyticsService.getRevenueHistory();
        const recentFinancials = await AnalyticsService.getRecentFinancials(5);

        return NextResponse.json({
            success: true,
            version: '1.0.4',
            data: {
                ...platformStats,
                userGrowth,
                revenueHistory,
                recentActivity: recentFinancials
            }
        });
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
    }
}
