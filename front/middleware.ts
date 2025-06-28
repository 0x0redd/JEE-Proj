import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const isAuthPage = request.nextUrl.pathname.startsWith('/auth');
    const isDashboardPage = request.nextUrl.pathname.startsWith('/dashboard');
    
    // For now, let's allow all requests to pass through
    // The authentication will be handled on the client side
    // This prevents issues with SSR and localStorage access
    
    return NextResponse.next();
}

export const config = {
    matcher: ['/dashboard/:path*', '/auth/:path*']
}; 