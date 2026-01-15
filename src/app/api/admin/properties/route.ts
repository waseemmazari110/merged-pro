import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/db";
import { properties, user } from "@/db/schema";
import { eq, like, and, or, desc, asc } from "drizzle-orm";

/**
 * GET /api/admin/properties
 * List all properties with filters for admin dashboard
 */
export async function GET(request: NextRequest) {
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

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = Math.min(parseInt(searchParams.get("limit") || "20"), 100);
    const offset = (page - 1) * limit;

    const status = searchParams.get("status"); // pending, approved, rejected, all
    const search = searchParams.get("search");
    const region = searchParams.get("region");
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortOrder = searchParams.get("sortOrder") || "desc";

    // Build query conditions
    const conditions: any[] = [];

    // Status filter
    if (status && status !== "all") {
      conditions.push(eq(properties.status, status));
    }

    // Search filter (title, location, owner email)
    if (search) {
      const searchLike = `%${search}%`;
      conditions.push(
        or(
          like(properties.title, searchLike),
          like(properties.location, searchLike),
          like(properties.region, searchLike)
        )
      );
    }

    // Region filter
    if (region && region !== "all") {
      conditions.push(eq(properties.region, region));
    }

    // Build the main query
    let query = db.select().from(properties);

    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    // Apply sorting
    const sortColumns: Record<string, any> = {
      createdAt: properties.createdAt,
      updatedAt: properties.updatedAt,
      title: properties.title,
      location: properties.location,
      region: properties.region,
      status: properties.status,
    };

    const sortColumn = sortColumns[sortBy] || properties.createdAt;

    if (sortOrder === "asc") {
      query = query.orderBy(asc(sortColumn));
    } else {
      query = query.orderBy(desc(sortColumn));
    }

    // Get total count
    const countQuery = db.select({ count: properties.id }).from(properties);
    const countConditions: any[] = [];

    if (status && status !== "all") {
      countConditions.push(eq(properties.status, status));
    }
    if (search) {
      const searchLike = `%${search}%`;
      countConditions.push(
        or(
          like(properties.title, searchLike),
          like(properties.location, searchLike),
          like(properties.region, searchLike)
        )
      );
    }
    if (region && region !== "all") {
      countConditions.push(eq(properties.region, region));
    }

    const countResult: any = await (countConditions.length > 0
      ? countQuery.where(and(...countConditions))
      : countQuery).get();

    // Get paginated results
    const propertyList: any[] = await query.limit(limit).offset(offset);

    // Fetch owner details for each property
    const enrichedProperties = await Promise.all(
      propertyList.map(async (prop) => {
        const owner: any = await db
          .select()
          .from(user)
          .where(eq(user.id, prop.ownerId))
          .get();

        return {
          ...prop,
          owner: owner
            ? {
                id: owner.id,
                name: owner.name,
                email: owner.email,
                planId: owner.planId,
                paymentStatus: owner.paymentStatus,
              }
            : null,
        };
      })
    );

    return NextResponse.json(
      {
        success: true,
        properties: enrichedProperties,
        pagination: {
          page,
          limit,
          offset,
          total: countResult?.count || 0,
          totalPages: Math.ceil((countResult?.count || 0) / limit),
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("[Admin Properties List Error]", error);
    return NextResponse.json(
      { error: "Failed to fetch properties: " + (error.message || "Unknown error") },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/properties
 * Create a property directly (admin only)
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

    // Validate required fields
    const requiredFields = [
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
      "heroImage",
      "ownerId",
    ];

    for (const field of requiredFields) {
      if (!body[field] && body[field] !== 0) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Check if slug is unique
    const existingSlug = await db
      .select()
      .from(properties)
      .where(eq(properties.slug, body.slug))
      .get();

    if (existingSlug) {
      return NextResponse.json(
        { error: "Slug already exists" },
        { status: 400 }
      );
    }

    // Create property
    const newProperty = {
      ownerId: body.ownerId,
      title: body.title,
      slug: body.slug,
      location: body.location,
      region: body.region,
      sleepsMin: parseInt(body.sleepsMin),
      sleepsMax: parseInt(body.sleepsMax),
      bedrooms: parseInt(body.bedrooms),
      bathrooms: parseInt(body.bathrooms),
      priceFromMidweek: parseFloat(body.priceFromMidweek),
      priceFromWeekend: parseFloat(body.priceFromWeekend),
      description: body.description,
      houseRules: body.houseRules || null,
      checkInOut: body.checkInOut || null,
      heroImage: body.heroImage,
      heroVideo: body.heroVideo || null,
      floorplanURL: body.floorplanURL || null,
      mapLat: body.mapLat ? parseFloat(body.mapLat) : null,
      mapLng: body.mapLng ? parseFloat(body.mapLng) : null,
      ownerContact: body.ownerContact || null,
      featured: body.featured ? 1 : 0,
      isPublished: body.isPublished ? 1 : 0,
      status: body.status || "pending",
      plan: body.plan || null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const result = await db.insert(properties).values(newProperty);

    return NextResponse.json(
      {
        success: true,
        message: "Property created successfully",
        propertyId: result.lastInsertRowid,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("[Admin Property Create Error]", error);
    return NextResponse.json(
      { error: "Failed to create property: " + (error.message || "Unknown error") },
      { status: 500 }
    );
  }
}
