import { auth } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { user as userTable } from "@/db/schema";
import { eq } from "drizzle-orm";

/**
 * Admin Login Endpoint
 * - Verifies user is admin
 * - Creates session with admin-specific cookie
 * - Returns admin session token
 */
export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const body = await request.json();
    const { email, password } = body;

    // Strict validation - both fields must be non-empty strings
    if (!email || !password || typeof email !== 'string' || typeof password !== 'string') {
      return NextResponse.json(
        { error: "Email and password required" },
        { status: 400 }
      );
    }

    // Trim and validate non-empty
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    if (!trimmedEmail || !trimmedPassword) {
      return NextResponse.json(
        { error: "Email and password cannot be empty" },
        { status: 400 }
      );
    }

    // First check if user is admin in database
    const adminUser = await db
      .select()
      .from(userTable)
      .where(eq(userTable.email, trimmedEmail))
      .get();

    if (!adminUser || adminUser.role !== "admin") {
      return NextResponse.json(
        { error: "Admin access only. User account not authorized." },
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
        body: JSON.stringify({ email: trimmedEmail, password: trimmedPassword }),
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

    // Copy cookies from auth response
    const setCookieHeader = authResponse.headers.get("set-cookie");
    if (setCookieHeader) {
      response.headers.set("set-cookie", setCookieHeader);
    }

    // CLEAR any conflicting user session cookies
    response.cookies.delete("user-session-token");

    return response;
  } catch (error) {
    console.error("[Admin Auth] Login error:", error);
    return NextResponse.json(
      { error: "Authentication failed" },
      { status: 500 }
    );
  }
}
