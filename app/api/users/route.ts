import { NextRequest, NextResponse } from 'next/server';
import { verifyAdmin } from '@/lib/auth-server';
import { UserService } from '@/lib/services/UserService';

export async function GET(req: NextRequest) {
    const authResult = await verifyAdmin(req);
    if ('error' in authResult) {
        return NextResponse.json({ success: false, error: authResult.error }, { status: authResult.status });
    }

    try {
        const searchParams = req.nextUrl.searchParams;
        const query = searchParams.get('q');

        const users = query
            ? await UserService.searchUsers(query)
            : await UserService.getUsers();

        return NextResponse.json({ success: true, data: { users } });
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
    }
}
