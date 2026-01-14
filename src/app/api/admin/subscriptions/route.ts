import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

/**
 * Admin Subscriptions API
 * 
 * Fetches active and past subscriptions from Stripe
 * Requires: admin role
 * 
 * Query parameters:
 * - limit: number of records (default: 50)
 * - offset: pagination offset (default: 0)
 * - status: filter by subscription status (active, past_due, canceled)
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

    // For now, return mock subscription data
    // In production, integrate with Stripe API
    const mockSubscriptions = [
      {
        id: "sub_1234567890",
        customerId: "cus_123",
        customerEmail: "john@example.com",
        customerName: "John Doe",
        planName: "Premium Monthly",
        planId: "price_123",
        amount: 9999,
        currency: "GBP",
        billingCycle: "monthly",
        status: "active",
        currentPeriodStart: new Date(Date.now() - 2592000000).toISOString(), // 30 days ago
        currentPeriodEnd: new Date().toISOString(),
        nextBillingDate: new Date(Date.now() + 2592000000).toISOString(), // 30 days from now
        createdAt: new Date(Date.now() - 7776000000).toISOString(), // 90 days ago
      },
      {
        id: "sub_0987654321",
        customerId: "cus_456",
        customerEmail: "jane@example.com",
        customerName: "Jane Smith",
        planName: "Premium Yearly",
        planId: "price_456",
        amount: 99999,
        currency: "GBP",
        billingCycle: "yearly",
        status: "active",
        currentPeriodStart: new Date(Date.now() - 31536000000).toISOString(), // 1 year ago
        currentPeriodEnd: new Date().toISOString(),
        nextBillingDate: new Date().toISOString(),
        createdAt: new Date(Date.now() - 31536000000).toISOString(),
      },
    ];

    return NextResponse.json({
      subscriptions: mockSubscriptions,
      total: mockSubscriptions.length,
      limit: 50,
      offset: 0,
      hasMore: false,
      activeSubscriptions: mockSubscriptions.filter(s => s.status === 'active').length,
      totalMRR: mockSubscriptions
        .filter(s => s.status === 'active' && s.billingCycle === 'monthly')
        .reduce((sum, s) => sum + s.amount, 0) / 100,
    });
  } catch (error) {
    console.error("Admin subscriptions error:", error);
    return NextResponse.json(
      { error: "Failed to fetch subscriptions" },
      { status: 500 }
    );
  }
}
