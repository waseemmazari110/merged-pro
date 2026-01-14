import { NextRequest, NextResponse } from "next/server";

/**
 * Admin Logout Endpoint
 * - Clears ONLY admin session cookie
 * - Does NOT affect public user sessions
 */
export async function POST(request: NextRequest) {
  const response = NextResponse.json(
    { success: true, message: "Logged out from admin panel" },
    { status: 200 }
  );

  // Clear ONLY admin session cookie
  response.cookies.set({
    name: "admin-session-token",
    value: "",
    httpOnly: true,
    maxAge: 0,
    path: "/admin",
  });

  return response;
}
