import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/db";
import { properties } from "@/db/schema";
import { eq } from "drizzle-orm";

/**
 * PATCH /api/admin/properties/:id/publish
 * Toggle publication status of a property
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const propertyId = parseInt(params.id);
    const body = await request.json();
    const { isPublished } = body;

    if (isPublished === undefined) {
      return NextResponse.json(
        { error: "isPublished flag is required" },
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

    // Prevent publishing rejected properties
    if (isPublished && property.status === "rejected") {
      return NextResponse.json(
        {
          error:
            "Cannot publish rejected properties. Please approve first.",
        },
        { status: 400 }
      );
    }

    // Update publication status
    await db
      .update(properties)
      .set({
        isPublished: isPublished ? 1 : 0,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(properties.id, propertyId));

    return NextResponse.json(
      {
        success: true,
        message: `Property ${isPublished ? "published" : "unpublished"} successfully`,
        propertyId,
        isPublished,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("[Admin Publish Error]", error);
    return NextResponse.json(
      {
        error: "Failed to update publication status: " + (error.message || "Unknown error"),
      },
      { status: 500 }
    );
  }
}
