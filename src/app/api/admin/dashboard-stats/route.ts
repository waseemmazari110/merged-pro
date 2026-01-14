import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/db";
import { user, bookings } from "@/db/schema";

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

    // Fetch all users
    const allUsers = await db.select().from(user);

    // Fetch all bookings
    const allBookings = await db.select().from(bookings);

    // Calculate statistics
    const totalUsers = allUsers.length;
    const totalRevenue = allBookings.reduce((sum, b) => sum + (b.totalPrice || 0), 0);
    const totalSubscriptions = allUsers.filter(u => u.role === "owner").length;
    const activeSubscriptions = allUsers.filter(
      u => u.role === "owner" && u.paymentStatus === "paid"
    ).length;

    return NextResponse.json({
      totalUsers,
      totalRevenue,
      totalSubscriptions,
      activeSubscriptions,
    });
  } catch (error) {
    console.error("Stats error:", error);
    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}
