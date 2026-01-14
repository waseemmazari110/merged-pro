import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function GET(request: NextRequest) {
  try {
    // Get the session using better-auth's native method
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized - No session" },
        { status: 401 }
      );
    }

    // Verify user is admin
    const user = session.user as any;
    if (user.role !== "admin") {
      return NextResponse.json(
        { error: "Forbidden - Not an admin" },
        { status: 403 }
      );
    }

    // Return admin profile
    return NextResponse.json({
      id: user.id,
      email: user.email,
      name: user.name || user.email.split("@")[0],
      role: user.role,
      emailVerified: user.emailVerified,
    });
  } catch (error) {
    console.error("Admin profile error:", error);
    return NextResponse.json(
      { error: "Failed to fetch admin profile" },
      { status: 500 }
    );
  }
}
