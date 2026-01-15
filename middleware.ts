import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const secret = new TextEncoder().encode(process.env.BETTER_AUTH_SECRET || "");

async function verifySessionToken(token: string): Promise<any> {
  try {
    const verified = await jwtVerify(token, secret);
    return verified.payload;
  } catch (err) {
    return null;
  }
}

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const isAdminPath = pathname.startsWith("/admin");
  const isLoginPath = pathname === "/login" || pathname === "/owner-login" || pathname === "/auth/login";
  const isAuthenticatedPath = pathname.startsWith("/account/dashboard") || 
                               pathname.startsWith("/owner-dashboard") ||
                               pathname.startsWith("/admin");

  // Get session cookies
  const sessionCookie = request.cookies.get("better-auth.session_token")?.value || 
                        request.cookies.get("__Secure-better-auth.session_token")?.value ||
                        request.cookies.get("__secure-next-auth.session-token")?.value;

  const adminSessionCookie = request.cookies.get("admin-session-token")?.value;
  const userSessionCookie = request.cookies.get("user-session-token")?.value;

  // 1. ADMIN PATH PROTECTION
  if (isAdminPath) {
    // Allow /admin/login without session
    if (pathname === "/admin/login" || pathname === "/auth/admin-login") {
      // If already has admin session, redirect to admin dashboard
      if (adminSessionCookie) {
        return NextResponse.redirect(new URL("/admin/dashboard", request.url));
      }
      return NextResponse.next();
    }

    // All other /admin/* paths require admin session
    if (!adminSessionCookie) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }

    return NextResponse.next();
  }

  // 2. PREVENT ADMIN ACCESS TO FRONTEND
  // If user has admin session, block access to public/customer pages
  if (adminSessionCookie && !isAdminPath && !isLoginPath) {
    return NextResponse.redirect(new URL("/admin/dashboard", request.url));
  }

  // 3. CUSTOMER/OWNER DASHBOARD PROTECTION
  if (pathname.startsWith("/account/dashboard") || pathname.startsWith("/owner-dashboard")) {
    if (!userSessionCookie && !sessionCookie) {
      // Redirect to appropriate login page
      const loginPath = pathname.startsWith("/owner-dashboard") ? "/owner-login" : "/login";
      return NextResponse.redirect(new URL(loginPath, request.url));
    }
    return NextResponse.next();
  }

  // 4. PREVENT LOGGED-IN USERS FROM ACCESSING LOGIN PAGES
  if (isLoginPath && (sessionCookie || userSessionCookie || adminSessionCookie)) {
    // Redirect to appropriate dashboard
    if (adminSessionCookie) {
      return NextResponse.redirect(new URL("/admin/dashboard", request.url));
    }
    if (pathname === "/owner-login" || pathname.includes("owner")) {
      return NextResponse.redirect(new URL("/owner-dashboard", request.url));
    }
    return NextResponse.redirect(new URL("/account/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/login",
    "/owner-login",
    "/auth/login",
    "/auth/admin-login",
    "/account/dashboard/:path*",
    "/owner-dashboard/:path*",
  ],
};
