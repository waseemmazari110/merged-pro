import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/db";
import { properties, user } from "@/db/schema";
import { eq } from "drizzle-orm";

/**
 * GET /api/admin/properties/:id
 * Get property details with owner information
 */
export async function GET(
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

    // Get owner details
    const ownerData: any = await db
      .select()
      .from(user)
      .where(eq(user.id, property.ownerId))
      .get();

    return NextResponse.json(
      {
        success: true,
        property: {
          ...property,
          owner: ownerData
            ? {
                id: ownerData.id,
                name: ownerData.name,
                email: ownerData.email,
                phoneNumber: ownerData.phoneNumber,
                planId: ownerData.planId,
                paymentStatus: ownerData.paymentStatus,
                createdAt: ownerData.createdAt,
              }
            : null,
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("[Admin Property Details Error]", error);
    return NextResponse.json(
      { error: "Failed to fetch property: " + (error.message || "Unknown error") },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/admin/properties/:id
 * Update property details
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

    // Verify property exists
    const property = await db
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

    // Build update object - only include provided fields
    const updateData: any = {
      updatedAt: new Date().toISOString(),
    };

    // Optional field mappings
    const optionalFields = [
      "title",
      "slug",
      "location",
      "region",
      "sleepsMin",
      "sleepsMax",
      "bedrooms",
      "bathrooms",
      "priceFromMidweek",
      "priceFromWeekend",
      "description",
      "houseRules",
      "checkInOut",
      "heroImage",
      "heroVideo",
      "floorplanURL",
      "mapLat",
      "mapLng",
      "ownerContact",
      "featured",
      "status",
      "plan",
      "iCalURL",
    ];

    optionalFields.forEach((field) => {
      if (field in body) {
        const value = body[field];
        // Type conversion for numeric fields
        if (["sleepsMin", "sleepsMax", "bedrooms", "bathrooms"].includes(field)) {
          updateData[field] = parseInt(value);
        } else if ([
          "priceFromMidweek",
          "priceFromWeekend",
          "mapLat",
          "mapLng",
        ].includes(field)) {
          updateData[field] = parseFloat(value);
        } else if (["featured"].includes(field)) {
          updateData[field] = value ? 1 : 0;
        } else {
          updateData[field] = value;
        }
      }
    });

    await db
      .update(properties)
      .set(updateData)
      .where(eq(properties.id, propertyId));

    return NextResponse.json(
      {
        success: true,
        message: "Property updated successfully",
        propertyId,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("[Admin Property Update Error]", error);
    return NextResponse.json(
      { error: "Failed to update property: " + (error.message || "Unknown error") },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/properties/:id
 * Delete a property completely
 */
export async function DELETE(
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

    // Verify property exists
    const property = await db
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

    // Delete property
    await db.delete(properties).where(eq(properties.id, propertyId));

    return NextResponse.json(
      {
        success: true,
        message: "Property deleted successfully",
        propertyId,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("[Admin Property Delete Error]", error);
    return NextResponse.json(
      { error: "Failed to delete property: " + (error.message || "Unknown error") },
      { status: 500 }
    );
  }
}
