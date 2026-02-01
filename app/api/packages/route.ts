import { NextRequest, NextResponse } from 'next/server';
import { verifyAdmin } from '@/lib/auth-server';
import { PackageService } from '@/lib/services/PackageService';

export async function GET(req: NextRequest) {
    const authResult = await verifyAdmin(req);
    if ('error' in authResult) {
        return NextResponse.json({ success: false, error: authResult.error }, { status: authResult.status });
    }

    try {
        const packages = await PackageService.getPackages();
        return NextResponse.json({ success: true, data: packages });
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    const authResult = await verifyAdmin(req);
    if ('error' in authResult) {
        return NextResponse.json({ success: false, error: authResult.error }, { status: authResult.status });
    }

    try {
        const body = await req.json();
        const { id, ...data } = body;

        if (id) {
            await PackageService.updatePackage(id, data);
        } else {
            await PackageService.createPackage(data);
        }
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest) {
    const authResult = await verifyAdmin(req);
    if ('error' in authResult) {
        return NextResponse.json({ success: false, error: authResult.error }, { status: authResult.status });
    }

    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ success: false, error: 'Package ID required' }, { status: 400 });
        }

        await PackageService.deletePackage(id);
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
    }
}
