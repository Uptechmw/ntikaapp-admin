
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
    const authCookie = request.cookies.get("session");
    // Note: For client-side Firebase Auth, we typically handle redirects on the client or use session cookies.
    // For this simple implementation, we'll rely on client-side checks in Layout/Page for now, 
    // but let's at least redirect root to login.

    if (request.nextUrl.pathname === "/") {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/"],
};
