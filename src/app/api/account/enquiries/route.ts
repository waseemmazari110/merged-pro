import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/db";
import { enquiries } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(req: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() });
  
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const list = await db.query.enquiries.findMany({
      where: eq(enquiries.userId, session.user.id),
      orderBy: (enquiries, { desc }) => [desc(enquiries.createdAt)],
    });

    return NextResponse.json({ enquiries: list });
  } catch (error) {
    console.error("Get enquiries error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
