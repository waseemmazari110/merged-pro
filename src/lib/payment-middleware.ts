/**
 * Payment verification middleware for owner property routes
 * Ensures owners have active paid subscriptions before accessing property management
 */

import { NextRequest, NextResponse } from "next/server";
import { verifyUserPayment } from "@/lib/payment-verification";

/**
 * Middleware to check payment status and display friendly UI message
 * Use this on owner property management pages
 */
export async function checkOwnerPaymentStatus(userId: string): Promise<{
  hasAccess: boolean;
  message?: string;
  actionRequired?: string;
}> {
  const verification = await verifyUserPayment(userId);

  if (!verification.hasActivePlan) {
    return {
      hasAccess: false,
      message: "You need an active subscription to manage property listings.",
      actionRequired: "subscribe",
    };
  }

  if (!verification.isPaymentConfirmed) {
    return {
      hasAccess: false,
      message: "Your payment is being processed. You'll be able to submit listings once payment is confirmed.",
      actionRequired: "wait_payment",
    };
  }

  return {
    hasAccess: true,
  };
}

/**
 * Generate user-friendly error response for payment issues
 */
export function paymentRequiredResponse(
  message: string,
  actionRequired: string
): NextResponse {
  return NextResponse.json(
    {
      error: "Payment Required",
      message,
      actionRequired,
      requiresPayment: true,
      subscribeUrl: "/pricing", // Redirect to pricing page
    },
    { status: 402 }
  );
}
