import { NextResponse, type NextRequest } from 'next/server';
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function middleware(request: NextRequest) {
  const protocol = request.headers.get('x-forwarded-proto') || 'https';
  const host = request.headers.get('host');
  const pathname = request.nextUrl.pathname;
  
  // 1. Skip HTTPS redirect for localhost and development
  if (!(host?.includes('localhost') || process.env.NODE_ENV === 'development')) {
    if (protocol === 'http' && host) {
      const httpsUrl = `https://${host}${request.nextUrl.pathname}${request.nextUrl.search}`;
      return NextResponse.redirect(httpsUrl, { status: 301 });
    }
  }

    // 2. Auth & Role-based Redirection
    // Standardized Route Redirects
    if (pathname === '/account/sign-in') {
      const tab = request.nextUrl.searchParams.get('tab');
      if (tab === 'owner') {
        return NextResponse.redirect(new URL('/owner-login', request.url));
      }
      return NextResponse.redirect(new URL('/login', request.url));
    }
    if (pathname === '/account/owner/sign-in') {
      return NextResponse.redirect(new URL('/owner-login', request.url));
    }
    if (pathname === '/account/guest/sign-in') {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    if (pathname === '/register' || pathname === '/account/guest/sign-up-legacy') {
      return NextResponse.redirect(new URL('/account/guest/sign-up', request.url));
    }

    // Role Protection
    const hasSession = request.cookies.get("better-auth.session_token") || request.cookies.get("__Secure-better-auth.session_token");

    if (pathname.startsWith('/owner/dashboard') || pathname.startsWith('/owner-dashboard')) {
      if (!hasSession) {
        return NextResponse.redirect(new URL('/owner-login', request.url));
      }
    }

    if (pathname.startsWith('/account/dashboard')) {
      if (!hasSession) {
        return NextResponse.redirect(new URL('/login', request.url));
      }
    }

  return NextResponse.next();
}

// Apply middleware to all routes
export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
};
