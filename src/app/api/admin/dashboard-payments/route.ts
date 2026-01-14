import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/db";
import { bookings } from "@/db/schema";

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || session.user.role !== "admin") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 403 }
      );
    }

    const allBookings = await db.select().from(bookings);

    const payments = allBookings.map(b => ({
      id: b.id,
      amount: b.totalPrice || 0,
      status: b.depositPaid ? "succeeded" : b.bookingStatus === "pending" ? "pending" : "failed",
      createdAt: b.createdAt,
      method: "Card",
    }));

    return NextResponse.json({ payments });
  } catch (error) {
    console.error("Dashboard payments error:", error);
    return NextResponse.json(
      { error: "Failed to fetch payments" },
      { status: 500 }
    );
  }
}
