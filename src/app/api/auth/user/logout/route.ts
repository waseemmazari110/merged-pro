import { NextRequest, NextResponse } from "next/server";

/**
 * User/Public Logout Endpoint
 * - Clears ONLY user session cookie
 * - Does NOT affect admin sessions
 */
export async function POST(request: NextRequest) {
  const response = NextResponse.json(
    { success: true, message: "Logged out from website" },
    { status: 200 }
  );

  // Clear ONLY user session cookie
  response.cookies.set({
    name: "user-session-token",
    value: "",
    httpOnly: true,
    maxAge: 0,
    path: "/",
  });

  return response;
}
