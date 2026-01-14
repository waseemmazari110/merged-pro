import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/db";
import { bookings, user } from "@/db/schema";
import { eq, desc } from "drizzle-orm";

interface Transaction {
  id: number;
  amount: number;
  currency: string;
  status: string;
  paymentMethod: string;
  paymentMethodBrand: string;
  paymentMethodLast4: string;
  description: string;
  customer: {
    name: string;
    email: string;
    role: string;
  };
  subscription: {
    planName: string;
    status: string;
  } | null;
  stripePaymentIntentId: string | null;
  stripeChargeId: string | null;
  receiptUrl: string | null;
  refundAmount: number;
  refundedAt: string | null;
  billingReason: string | null;
  createdAt: string;
  processedAt: string | null;
}

interface StatusCounts {
  all: number;
  succeeded: number;
  pending: number;
  failed: number;
  refunded: number;
  canceled: number;
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

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") || "all";
    const search = searchParams.get("search") || "";
    const limit = parseInt(searchParams.get("limit") || "100", 10);

    // Fetch bookings with associated user information
    const bookingRecords = await db
      .select()
      .from(bookings)
      .orderBy(desc(bookings.createdAt));

    // Map bookings to transaction format
    const transactions: Transaction[] = bookingRecords
      .map((booking: any) => ({
        id: booking.id,
        amount: booking.totalPrice || 0,
        currency: "GBP",
        status: booking.bookingStatus?.toLowerCase() || "pending",
        paymentMethod: "card",
        paymentMethodBrand: "visa",
        paymentMethodLast4: "4242",
        description: `Booking for ${booking.propertyName}`,
        customer: {
          name: booking.guestName || "Unknown Guest",
          email: booking.guestEmail || "unknown@example.com",
          role: "guest",
        },
        subscription: null,
        stripePaymentIntentId: null,
        stripeChargeId: null,
        receiptUrl: null,
        refundAmount: 0,
        refundedAt: null,
        billingReason: null,
        createdAt: booking.createdAt || new Date().toISOString(),
        processedAt: booking.createdAt || new Date().toISOString(),
      }))
      .filter((transaction: any) => {
        // Apply status filter
        if (status !== "all" && transaction.status !== status) {
          return false;
        }

        // Apply search filter
        if (search) {
          const searchLower = search.toLowerCase();
          return (
            transaction.customer.name.toLowerCase().includes(searchLower) ||
            transaction.customer.email.toLowerCase().includes(searchLower) ||
            transaction.description.toLowerCase().includes(searchLower)
          );
        }

        return true;
      })
      .slice(0, limit);

    // Calculate status counts
    const statusCounts: StatusCounts = {
      all: transactions.length,
      succeeded: transactions.filter((t) => t.status === "completed").length,
      pending: transactions.filter((t) => t.status === "pending").length,
      failed: transactions.filter((t) => t.status === "failed").length,
      refunded: transactions.filter((t) => t.refundAmount > 0).length,
      canceled: transactions.filter((t) => t.status === "cancelled").length,
    };

    // Calculate total revenue
    const totalRevenue = transactions.reduce((sum, t) => sum + t.amount, 0);

    return NextResponse.json({
      transactions,
      statusCounts,
      totalRevenue,
      total: transactions.length,
    });
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return NextResponse.json(
      { error: "Failed to fetch transactions" },
      { status: 500 }
    );
  }
}
