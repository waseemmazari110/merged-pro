import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/db";
import { properties } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function PATCH(request: NextRequest) {
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
    const { propertyId, status, rejectionReason } = body;

    if (!propertyId || !status) {
      return NextResponse.json(
        { error: "Property ID and status are required" },
        { status: 400 }
      );
    }

    if (!["approved", "rejected", "pending"].includes(status)) {
      return NextResponse.json(
        { error: "Invalid status. Must be: approved, rejected, or pending" },
        { status: 400 }
      );
    }

    // Get the property first
    const propertyRecord: any = await db
      .select()
      .from(properties)
      .where(eq(properties.id, propertyId));

    if (propertyRecord.length === 0) {
      return NextResponse.json(
        { error: "Property not found" },
        { status: 404 }
      );
    }

    // Update the property status
    const updateData: any = {
      status,
      updatedAt: new Date().toISOString(),
    };

    // If rejecting, add rejection reason to description or create a note field
    if (status === "rejected" && rejectionReason) {
      updateData.description = `[REJECTED: ${rejectionReason}]\n\n${propertyRecord[0].description}`;
    }

    if (status === "approved") {
      // When approved, also publish the property
      updateData.isPublished = true;
    }

    await db
      .update(properties)
      .set(updateData)
      .where(eq(properties.id, propertyId));

    return NextResponse.json(
      {
        success: true,
        message: `Property ${status} successfully`,
        propertyId,
        status,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error updating property status:", error);
    return NextResponse.json(
      { error: "Failed to update property status: " + error.message },
      { status: 500 }
    );
  }
}
