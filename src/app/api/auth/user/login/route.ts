import { auth } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { user as userTable } from "@/db/schema";
import { eq } from "drizzle-orm";

/**
 * User/Public Login Endpoint
 * - Verifies user is NOT admin
 * - Creates session with user-specific cookie
 * - Clears any admin sessions
 */
export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password required" },
        { status: 400 }
      );
    }

    // Verify user is NOT admin
    const publicUser = await db
      .select()
      .from(userTable)
      .where(eq(userTable.email, email))
      .get();

    if (publicUser && publicUser.role === "admin") {
      return NextResponse.json(
        { error: "Admin accounts cannot log in to public site. Use admin panel instead." },
        { status: 403 }
      );
    }

    // Create a new request object for the auth handler
    const authHeaders: Record<string, string> = {
      "Content-Type": "application/json",
    };
    
    // Copy important headers from original request
    const cookie = request.headers.get("cookie");
    if (cookie) {
      authHeaders["cookie"] = cookie;
    }

    // Get origin from request or construct it
    const origin = request.headers.get("origin") || new URL(request.url).origin;
    authHeaders["origin"] = origin;

    const authRequest = new NextRequest(
      new URL("/api/auth/sign-in/email", request.url),
      {
        method: "POST",
        headers: authHeaders,
        body: JSON.stringify({ email, password }),
      }
    );

    // Call the auth handler
    const authResponse = await auth.handler(authRequest);
    const responseData = await authResponse.json();

    if (!authResponse.ok) {
      return NextResponse.json(
        { error: responseData.message || "Invalid email or password" },
        { status: authResponse.status }
      );
    }

    // Create response with the successful auth data
    const response = NextResponse.json(responseData, {
      status: 200,
    });

    // Copy cookies from auth response and modify them
    const setCookieHeader = authResponse.headers.get("set-cookie");
    if (setCookieHeader) {
      response.headers.set("set-cookie", setCookieHeader);
    }

    // Set user-session-token cookie (separate from admin session)
    if (responseData.session?.token) {
      response.cookies.set({
        name: "user-session-token",
        value: responseData.session.token,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 30, // 30 days
        path: "/",
      });

      // CLEAR the admin session cookie if it exists
      response.cookies.delete("admin-session-token");

      // Clear better-auth session cookies so only user token is used
      response.cookies.delete("better-auth.session_token");
    }

    return response;
  } catch (error) {
    console.error("[User Auth] Login error:", error);
    return NextResponse.json(
      { error: "Authentication failed" },
      { status: 500 }
    );
  }
}
