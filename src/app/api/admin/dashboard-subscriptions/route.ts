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

    const allUsers = await db.select().from(user);
    const allBookings = await db.select().from(bookings);

    const subscriptions = allUsers
      .filter((u: any) => u.role === "owner")
      .map((u: any) => {
        const userBookings = allBookings.filter((b: any) => b.guestEmail === u.email);
        const totalRevenue = userBookings.reduce((sum: number, b: any) => sum + (b.totalPrice || 0), 0);
        
        // Calculate renewal date (arbitrary 30 days from signup)
        const signupDate = u.createdAt ? new Date(u.createdAt) : new Date();
        const renewsAt = new Date(signupDate);
        renewsAt.setDate(renewsAt.getDate() + 30);

        return {
          id: u.id,
          email: u.email,
          planName: "Premium Plan",
          status: u.paymentStatus === "paid" ? "active" : "pending",
          amount: totalRevenue,
          renewsAt: renewsAt.toISOString(),
        };
      });

    return NextResponse.json({ subscriptions });
  } catch (error) {
    console.error("Dashboard subscriptions error:", error);
    return NextResponse.json(
      { error: "Failed to fetch subscriptions" },
      { status: 500 }
    );
  }
}
