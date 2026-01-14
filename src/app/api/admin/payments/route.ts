import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

/**
 * Admin Payments API
 * 
 * Fetches payment history from Stripe
 * Requires: admin role
 * 
 * Query parameters:
 * - limit: number of records (default: 50)
 * - offset: pagination offset (default: 0)
 * - status: filter by payment status (succeeded, failed, pending)
 * - customer: filter by customer email
 */
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

    // For now, return mock payment data
    // In production, integrate with Stripe API
    const mockPayments = [
      {
        id: "pi_1234567890",
        customerId: "cus_123",
        customerEmail: "user@example.com",
        customerName: "John Doe",
        amount: 29999,
        currency: "GBP",
        status: "succeeded",
        paymentMethod: "card",
        cardLast4: "4242",
        created: new Date(Date.now() - 86400000).toISOString(),
        description: "Property Booking",
      },
      {
        id: "pi_0987654321",
        customerId: "cus_456",
        customerEmail: "owner@example.com",
        customerName: "Jane Smith",
        amount: 59999,
        currency: "GBP",
        status: "succeeded",
        paymentMethod: "card",
        cardLast4: "4242",
        created: new Date(Date.now() - 172800000).toISOString(),
        description: "Premium Membership",
      },
    ];

    return NextResponse.json({
      payments: mockPayments,
      total: mockPayments.length,
      limit: 50,
      offset: 0,
      hasMore: false,
    });
  } catch (error) {
    console.error("Admin payments error:", error);
    return NextResponse.json(
      { error: "Failed to fetch payments" },
      { status: 500 }
    );
  }
}
