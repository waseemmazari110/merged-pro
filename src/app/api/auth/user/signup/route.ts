import { auth } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { user as userTable } from "@/db/schema";
import { eq } from "drizzle-orm";

/**
 * User/Public Signup Endpoint
 * - Creates new user account with proper role
 * - Blocks admin account creation (admins only via admin endpoint)
 * - Sets user-specific session cookie
 */
export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const body = await request.json();
    const { email, password, name, role = "customer" } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password required" },
        { status: 400 }
      );
    }

    // Prevent admin account creation via signup
    if (role === "admin") {
      return NextResponse.json(
        { error: "Admin accounts cannot be created via signup" },
        { status: 403 }
      );
    }

    // Check if user already exists
    const existingUser = await db
      .select()
      .from(userTable)
      .where(eq(userTable.email, email))
      .get();

    if (existingUser) {
      return NextResponse.json(
        { error: "An account with this email already exists" },
        { status: 409 }
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
      new URL("/api/auth/sign-up/email", request.url),
      {
        method: "POST",
        headers: authHeaders,
        body: JSON.stringify({
          email,
          password,
          name: name || "",
          role: role || "customer",
        }),
      }
    );

    // Call the auth handler
    const authResponse = await auth.handler(authRequest);
    const responseData = await authResponse.json();

    if (!authResponse.ok) {
      return NextResponse.json(
        { error: responseData.message || "Signup failed" },
        { status: authResponse.status }
      );
    }

    // Create response with the successful auth data
    const response = NextResponse.json(responseData, {
      status: 201,
    });

    // Copy cookies from auth response and modify them
    const setCookieHeader = authResponse.headers.get("set-cookie");
    if (setCookieHeader) {
      response.headers.set("set-cookie", setCookieHeader);
    }

    // Set user-session-token cookie
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

      // CLEAR any admin session cookie if it exists
      response.cookies.delete("admin-session-token");

      // Clear better-auth session cookies
      response.cookies.delete("better-auth.session_token");
    }

    return response;
  } catch (error) {
    console.error("[User Auth] Signup error:", error);
    return NextResponse.json(
      { error: "Signup failed" },
      { status: 500 }
    );
  }
}
