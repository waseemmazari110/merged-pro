import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/db";
import { savedProperties } from "@/db/schema";
import { eq, and } from "drizzle-orm";

export async function POST(req: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() });
  
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { propertyId, action } = await req.json();

  if (!propertyId) {
    return NextResponse.json({ error: "Property ID required" }, { status: 400 });
  }

  try {
    if (action === "save") {
      // Check if already saved
      const existing = await db.query.savedProperties.findFirst({
        where: and(
          eq(savedProperties.userId, session.user.id),
          eq(savedProperties.propertyId, propertyId)
        ),
      });

      if (!existing) {
        await db.insert(savedProperties).values({
          userId: session.user.id,
          propertyId,
          createdAt: new Date().toISOString(),
        });
      }
    } else {
      await db.delete(savedProperties).where(
        and(
          eq(savedProperties.userId, session.user.id),
          eq(savedProperties.propertyId, propertyId)
        )
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Save property error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() });
  
  if (!session?.user) {
    return NextResponse.json({ savedIds: [] });
  }

  try {
    const saved = await db.query.savedProperties.findMany({
      where: eq(savedProperties.userId, session.user.id),
      columns: {
        propertyId: true,
      },
    });

    return NextResponse.json({ savedIds: saved.map(s => s.propertyId) });
  } catch (error) {
    console.error("Get saved properties error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
