import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/db";
import { savedProperties, properties, propertyFeatures } from "@/db/schema";
import { eq, inArray } from "drizzle-orm";

export async function GET(req: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() });
  
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const saved = await db.query.savedProperties.findMany({
      where: eq(savedProperties.userId, session.user.id),
      columns: {
        propertyId: true,
      },
    });

    if (saved.length === 0) {
      return NextResponse.json({ properties: [] });
    }

    const savedIds = saved.map(s => s.propertyId);

    const propertyDetails = await db.query.properties.findMany({
      where: inArray(properties.id, savedIds),
      with: {
        features: {
          limit: 2,
          columns: {
            featureName: true
          }
        }
      }
    });

    // Format for PropertyCard
    const formattedProperties = propertyDetails.map(p => ({
      id: p.id,
      title: p.title,
      location: p.location,
      sleeps: p.sleepsMax,
      bedrooms: p.bedrooms,
      priceFrom: Math.round(p.priceFromMidweek / 3), // Estimate per night
      image: p.heroImage,
      features: (p as any).features?.map((f: any) => f.featureName) || [],
      slug: p.slug,
    }));

    return NextResponse.json({ properties: formattedProperties });
  } catch (error) {
    console.error("Get saved properties details error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
