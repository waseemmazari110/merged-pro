/**
 * API Route: Owner Payment History
 * Get payment history for the logged-in owner with subscription plan details
 */

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { payments, subscriptions } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { 
  getCurrentUserWithRole,
  unauthenticatedResponse
} from "@/lib/auth-roles";

export async function GET(request: NextRequest) {
  try {
    // Verify authentication
    const currentUser = await getCurrentUserWithRole();

    if (!currentUser) {
      return unauthenticatedResponse('Please log in to access this resource');
    }

    console.log(`[${new Date().toISOString()}] Fetching payment history for user: ${currentUser.id}`);

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Fetch all payments for this user with subscription details
    const userPayments = await db
      .select({
        payment: payments,
        subscription: subscriptions,
      })
      .from(payments)
      .leftJoin(subscriptions, eq(payments.subscriptionId, subscriptions.id))
      .where(eq(payments.userId, currentUser.id))
      .orderBy(desc(payments.createdAt))
      .limit(limit)
      .offset(offset);

    // Get total count
    const countResult = await db
      .select()
      .from(payments)
      .where(eq(payments.userId, currentUser.id));

    console.log(`[${new Date().toISOString()}] Found ${userPayments.length} payments, total count: ${countResult.length}`);

    // Format response with subscription plan details
    const formattedPayments = userPayments.map(({ payment, subscription }) => ({
      id: payment.id,
      amount: Math.round((payment.amount || 0) * 100),
      currency: payment.currency,
      status: payment.paymentStatus,
      paymentMethod: payment.paymentMethod || 'card',
      paymentMethodBrand: payment.paymentMethodBrand || 'unknown',
      paymentMethodLast4: payment.paymentMethodLast4 || '****',
      description: payment.description || 'Subscription payment',
      billingReason: payment.billingReason,
      stripePaymentIntentId: payment.stripePaymentIntentId,
      stripeChargeId: payment.stripeChargeId,
      receiptUrl: payment.receiptUrl,
      invoiceUrl: payment.receiptUrl,
      receiptEmail: payment.receiptEmail,
      refundAmount: payment.refundAmount,
      refundedAt: payment.refundedAt,
      refundReason: payment.refundReason,
      createdAt: payment.createdAt,
      processedAt: payment.processedAt,
      // Subscription plan details
      planName: subscription?.planName || payment.subscriptionPlan || null,
      planType: subscription?.planType || null,
      billingInterval: subscription?.interval || null,
    }));

    return NextResponse.json({
      payments: formattedPayments,
      pagination: {
        total: countResult.length,
        limit,
        offset,
        hasMore: offset + limit < countResult.length,
      },
    });

  } catch (error) {
    console.error("Error fetching payment history:", error);
    return NextResponse.json(
      { error: "Failed to fetch payment history", details: (error as Error).message },
      { status: 500 }
    );
  }
}
