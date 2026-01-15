import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/db";
import { user as userTable } from "@/db/schema";
import { eq } from "drizzle-orm";

/**
 * Delete/Cancel a user's membership and subscription
 */
export async function DELETE(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || session.user.role !== "admin") {
      return NextResponse.json(
        { error: "Unauthorized - Admin access required" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { userId } = body;

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    // Get user
    const targetUser = await db
      .select()
      .from(userTable)
      .where(eq(userTable.id, userId))
      .get();

    if (!targetUser) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Update user to remove subscription details
    await db
      .update(userTable)
      .set({
        planId: null,
        paymentStatus: null,
      })
      .where(eq(userTable.id, userId));

    return NextResponse.json(
      { 
        success: true, 
        message: `Membership for ${targetUser.email} has been cancelled`,
        userId: userId
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("[Admin Delete Membership Error]", error);
    return NextResponse.json(
      { error: "Failed to delete membership: " + (error.message || "Unknown error") },
      { status: 500 }
    );
  }
}
