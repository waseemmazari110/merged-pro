import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/db";
import { user, bookings } from "@/db/schema";
import { eq, desc } from "drizzle-orm";

interface MembershipData {
  id: string;
  name: string;
  email: string;
  planName: string;
  status: string;
  amount: number;
  currency: string;
  signupDate: string;
  currentPeriodEnd: string;
  paymentStatus: string;
}

interface MembershipSummary {
  totalMembers: number;
  activeMembers: number;
  totalRevenue: number;
  newThisMonth: number;
}

export async function GET(request: NextRequest) {
  try {
    // Verify admin session
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || session.user.role !== "admin") {
      return NextResponse.json(
        { error: "Unauthorized: Admin access required" },
        { status: 403 }
      );
    }

    // Fetch all users (excluding admin)
    const users = await db
      .select()
      .from(user)
      .where(eq(user.role, "owner"))
      .orderBy(desc(user.createdAt));

    // Fetch bookings to calculate revenue
    const bookingRecords = await db.select().from(bookings);

    // Calculate current month start
    const now = new Date();
    const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    // Create membership data from users
    const members: MembershipData[] = users.map((userData: any) => {
      // Get user's total bookings revenue
      const userBookings = bookingRecords.filter((b: any) => b.guestEmail === userData.email);
      const userRevenue = userBookings.reduce((sum: number, b: any) => sum + (b.totalPrice || 0), 0);

      // Determine membership status
      let status = "active";
      if (userRevenue === 0) {
        status = "inactive";
      } else if (userBookings.some((b: any) => b.bookingStatus === "cancelled")) {
        status = "past_due";
      }

      // Calculate current period end (arbitrary 30 days from signup for demo)
      const signupDate = userData.createdAt ? new Date(userData.createdAt) : new Date();
      const periodEnd = new Date(signupDate);
      periodEnd.setDate(periodEnd.getDate() + 30);

      return {
        id: userData.id,
        name: userData.name || "Unknown",
        email: userData.email || "",
        planName: "Premium Plan",
        status,
        amount: userRevenue,
        currency: "GBP",
        signupDate: signupDate.toISOString(),
        currentPeriodEnd: periodEnd.toISOString(),
        paymentStatus: userRevenue > 0 ? "paid" : "pending",
      };
    });

    // Calculate summary
    const newThisMonth = users.filter((u: any) => {
      const userDate = u.createdAt ? new Date(u.createdAt) : new Date();
      return userDate >= currentMonthStart;
    }).length;

    const totalRevenue = bookingRecords.reduce((sum: number, b: any) => sum + (b.totalPrice || 0), 0);
    const activeMembers = members.filter((m) => m.status === "active").length;

    const summary: MembershipSummary = {
      totalMembers: members.length,
      activeMembers,
      totalRevenue,
      newThisMonth,
    };

    return NextResponse.json({
      members,
      summary,
    });
  } catch (error) {
    console.error("Error fetching memberships:", error);
    return NextResponse.json(
      { error: "Failed to fetch memberships" },
      { status: 500 }
    );
  }
}
