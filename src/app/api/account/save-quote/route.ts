import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/db";
import { savedQuotes } from "@/db/schema";
import { eq, and } from "drizzle-orm";

export async function POST(req: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() });
  
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { quotePayload, action, id } = await req.json();

  try {
    if (action === "save") {
      if (!quotePayload) {
        return NextResponse.json({ error: "Quote payload required" }, { status: 400 });
      }

      const result = await db.insert(savedQuotes).values({
        userId: session.user.id,
        quotePayload,
        createdAt: new Date().toISOString(),
      }).returning({ id: savedQuotes.id });

      return NextResponse.json({ success: true, id: result[0].id });
    } else {
      if (!id) {
        return NextResponse.json({ error: "Quote ID required for delete" }, { status: 400 });
      }

      await db.delete(savedQuotes).where(
        and(
          eq(savedQuotes.userId, session.user.id),
          eq(savedQuotes.id, id)
        )
      );
      
      return NextResponse.json({ success: true });
    }
  } catch (error) {
    console.error("Save quote error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() });
  
  if (!session?.user) {
    return NextResponse.json({ quotes: [] });
  }

  try {
    const quotes = await db.query.savedQuotes.findMany({
      where: eq(savedQuotes.userId, session.user.id),
      orderBy: (quotes, { desc }) => [desc(quotes.createdAt)],
    });

    return NextResponse.json({ quotes });
  } catch (error) {
    console.error("Get saved quotes error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
