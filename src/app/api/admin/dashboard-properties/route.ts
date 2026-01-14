import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/db";
import { properties, user } from "@/db/schema";
import { eq } from "drizzle-orm";

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

    const searchParams = request.nextUrl.searchParams;
    const statusFilter = searchParams.get("status") || "pending";

    // Get properties with their owner info
    const allProperties: any[] = await db
      .select({
        id: properties.id,
        title: properties.title,
        status: properties.status,
        ownerId: properties.ownerId,
        location: properties.location,
        region: properties.region,
        sleepsMax: properties.sleepsMax,
        bedrooms: properties.bedrooms,
        bathrooms: properties.bathrooms,
        priceFromMidweek: properties.priceFromMidweek,
        priceFromWeekend: properties.priceFromWeekend,
        heroImage: properties.heroImage,
        createdAt: properties.createdAt,
        ownerName: user.name,
        ownerEmail: user.email,
      })
      .from(properties)
      .leftJoin(user, eq(properties.ownerId, user.id));

    // Filter by status
    const filtered = allProperties.filter((p: any) => {
      if (statusFilter === "all") return true;
      return p.status === statusFilter;
    });

    // Group by status for summary
    const summary = {
      pending: allProperties.filter((p: any) => p.status === "pending").length,
      approved: allProperties.filter((p: any) => p.status === "approved").length,
      rejected: allProperties.filter((p: any) => p.status === "rejected").length,
      total: allProperties.length,
    };

    return NextResponse.json(
      {
        properties: filtered,
        summary,
        total: filtered.length,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error fetching properties:", error);
    return NextResponse.json(
      { error: "Failed to fetch properties: " + error.message },
      { status: 500 }
    );
  }
}
