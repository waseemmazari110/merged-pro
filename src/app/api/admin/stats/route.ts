import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/db";
import { user as userTable, bookings as bookingsTable } from "@/db/schema";
import { eq, count, sql } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    // Verify admin access
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const user = session.user as any;
    if (user.role !== "admin") {
      return NextResponse.json(
        { error: "Forbidden - Admin only" },
        { status: 403 }
      );
    }

    // Get all statistics
    const totalUsers = await db
      .select({ count: count() })
      .from(userTable)
      .where(eq(userTable.role, "customer"))
      .get();

    const totalOwners = await db
      .select({ count: count() })
      .from(userTable)
      .where(eq(userTable.role, "owner"))
      .get();

    const totalAdmins = await db
      .select({ count: count() })
      .from(userTable)
      .where(eq(userTable.role, "admin"))
      .get();

    const totalBookings = await db
      .select({ count: count() })
      .from(bookingsTable)
      .get();

    // Calculate total revenue from bookings (simplified approach)
    const bookings = await db
      .select({ totalPrice: bookingsTable.totalPrice })
      .from(bookingsTable)
      .all();

    const totalRevenue = bookings.reduce((sum, b) => sum + (b.totalPrice || 0), 0);

    // Get status breakdown for bookings
    const statusCounts = await db
      .select({
        status: bookingsTable.bookingStatus,
        count: count(),
      })
      .from(bookingsTable)
      .groupBy(bookingsTable.bookingStatus)
      .all();

    // Calculate payment statistics
    const paidBookings = statusCounts.find(s => s.status === "confirmed")?.count || 0;
    const pendingBookings = statusCounts.find(s => s.status === "pending")?.count || 0;

    return NextResponse.json({
      totalUsers: totalUsers?.count || 0,
      totalOwners: totalOwners?.count || 0,
      totalAdmins: totalAdmins?.count || 0,
      totalGuests: totalUsers?.count || 0, // For consistency with frontend
      totalBookings: totalBookings?.count || 0,
      totalRevenue,
      paidBookings,
      pendingBookings,
      cancelledBookings: statusCounts.find(s => s.status === "cancelled")?.count || 0,
      activeSubscriptions: 0, // Will be populated from Stripe
      pendingApprovals: 0, // Will be populated from properties
    });
  } catch (error) {
    console.error("Admin stats error:", error);
    return NextResponse.json(
      { error: "Failed to fetch statistics" },
      { status: 500 }
    );
  }
}
