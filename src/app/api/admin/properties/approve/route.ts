import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/db";
import { properties } from "@/db/schema";
import { eq } from "drizzle-orm";

/**
 * POST /api/admin/properties/approve
 * Approve and publish a property
 */
export async function POST(request: NextRequest) {
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
    const { propertyId } = body;

    if (!propertyId) {
      return NextResponse.json(
        { error: "Property ID is required" },
        { status: 400 }
      );
    }

    // Get the property
    const property: any = await db
      .select()
      .from(properties)
      .where(eq(properties.id, propertyId))
      .get();

    if (!property) {
      return NextResponse.json(
        { error: "Property not found" },
        { status: 404 }
      );
    }

    // Update property: set status to approved and publish
    await db
      .update(properties)
      .set({
        status: "approved",
        isPublished: 1,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(properties.id, propertyId));

    return NextResponse.json(
      {
        success: true,
        message: "Property approved and published successfully",
        propertyId,
        status: "approved",
        isPublished: true,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("[Admin Approve Error]", error);
    return NextResponse.json(
      { error: "Failed to approve property: " + (error.message || "Unknown error") },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/admin/properties/approve
 * Update approval status (compatible with existing code)
 */
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
        {
          error:
            "Invalid status. Must be: approved, rejected, or pending",
        },
        { status: 400 }
      );
    }

    // Get the property
    const propertyRecord: any = await db
      .select()
      .from(properties)
      .where(eq(properties.id, propertyId))
      .get();

    if (!propertyRecord) {
      return NextResponse.json(
        { error: "Property not found" },
        { status: 404 }
      );
    }

    const updateData: any = {
      status,
      updatedAt: new Date().toISOString(),
    };

    // If rejecting, add rejection reason to description
    if (status === "rejected" && rejectionReason) {
      updateData.description = `[REJECTED: ${rejectionReason}]\n\n${propertyRecord.description}`;
    }

    // Auto-publish when approved
    if (status === "approved") {
      updateData.isPublished = 1;
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
    console.error("[Admin Approve Update Error]", error);
    return NextResponse.json(
      {
        error: "Failed to update property status: " + (error.message || "Unknown error"),
      },
      { status: 500 }
    );
  }
}
