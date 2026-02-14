import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    // Check for common authentication cookies
    // Adjust 'token' to the specific cookie name used by your backend if known
    const token = request.cookies.get('token')?.value ||
        request.cookies.get('connect.sid')?.value ||
        request.cookies.get('session')?.value;

    const { pathname } = request.nextUrl;

    // Define protected routes pattern
    const isProtectedRoute = pathname.startsWith('/dashboard') || pathname === '/';

    // Define auth routes pattern
    const isAuthRoute = pathname.startsWith('/auth');

    // Redirect unauthenticated users to login page
    if (isProtectedRoute && !token) {
        const url = request.nextUrl.clone();
        url.pathname = '/auth/sign-in';
        return NextResponse.redirect(url);
    }

    // Redirect authenticated users away from login page
    if (isAuthRoute && token) {
        const url = request.nextUrl.clone();
        url.pathname = '/dashboard/overview';
        return NextResponse.redirect(url);
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/dashboard/:path*',
        '/auth/:path*',
        '/'
    ],
};
