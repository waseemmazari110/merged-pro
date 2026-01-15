import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/db";
import { properties } from "@/db/schema";
import { eq } from "drizzle-orm";

/**
 * POST /api/admin/properties/reject
 * Reject a property with reason
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
    const { propertyId, reason } = body;

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

    // Build update data
    const updateData: any = {
      status: "rejected",
      isPublished: 0, // Unpublish if it was published
      updatedAt: new Date().toISOString(),
    };

    // Add rejection reason to description
    if (reason) {
      updateData.description = `[REJECTED: ${reason}]\n\n${property.description}`;
    }

    // Update property
    await db
      .update(properties)
      .set(updateData)
      .where(eq(properties.id, propertyId));

    return NextResponse.json(
      {
        success: true,
        message: "Property rejected successfully",
        propertyId,
        status: "rejected",
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("[Admin Reject Error]", error);
    return NextResponse.json(
      { error: "Failed to reject property: " + (error.message || "Unknown error") },
      { status: 500 }
    );
  }
}
