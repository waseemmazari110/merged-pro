/**
 * Payment Verification Utilities
 * Helper functions to check if user has active paid subscription
 */

import { db } from "@/db";
import { subscriptions, payments, user } from "@/db/schema";
import { eq, and, desc } from "drizzle-orm";

export interface PaymentVerificationResult {
  hasActivePlan: boolean;
  isPaymentConfirmed: boolean;
  planName: string | null;
  subscriptionStatus: string | null;
  message: string;
}

/**
 * Check if user has active paid subscription with confirmed payment
 * @param userId - The user ID to check
 * @returns PaymentVerificationResult
 */
export async function verifyUserPayment(
  userId: string
): Promise<PaymentVerificationResult> {
  try {
    // Get user's most recent subscription (check for active or trialing)
    const userSubscriptions = await db
      .select()
      .from(subscriptions)
      .where(eq(subscriptions.userId, userId))
      .orderBy(desc(subscriptions.createdAt))
      .limit(1);

    if (userSubscriptions.length === 0) {
      return {
        hasActivePlan: false,
        isPaymentConfirmed: false,
        planName: null,
        subscriptionStatus: null,
        message: "No active subscription found. Please subscribe to a plan to submit listings.",
      };
    }

    const subscription = userSubscriptions[0];

    // Block if subscription is cancelled, past_due, expired, or suspended
    const blockedStatuses = ['cancelled', 'past_due', 'expired', 'suspended', 'incomplete', 'incomplete_expired'];
    if (blockedStatuses.includes(subscription.status)) {
      return {
        hasActivePlan: false,
        isPaymentConfirmed: false,
        planName: subscription.planName,
        subscriptionStatus: subscription.status,
        message: `Subscription is ${subscription.status}. Please update your payment method to submit listings.`,
      };
    }

    // Only allow active or trialing subscriptions
    if (subscription.status !== 'active' && subscription.status !== 'trialing') {
      return {
        hasActivePlan: false,
        isPaymentConfirmed: false,
        planName: subscription.planName,
        subscriptionStatus: subscription.status,
        message: "Subscription is not active. Please contact support.",
      };
    }

    // Check for confirmed payment (succeeded status)
    const confirmedPayments = await db
      .select()
      .from(payments)
      .where(
        and(
          eq(payments.userId, userId),
          eq(payments.subscriptionId, subscription.id),
          eq(payments.paymentStatus, "succeeded")
        )
      )
      .orderBy(desc(payments.createdAt))
      .limit(1);

    // Also check for failed payments as a blocker
    const failedPayments = await db
      .select()
      .from(payments)
      .where(
        and(
          eq(payments.userId, userId),
          eq(payments.subscriptionId, subscription.id),
          eq(payments.paymentStatus, "failed")
        )
      )
      .orderBy(desc(payments.createdAt))
      .limit(1);

    // If most recent payment is failed, block
    if (
      failedPayments.length > 0 &&
      (!confirmedPayments.length ||
        new Date(failedPayments[0].createdAt) > new Date(confirmedPayments[0].createdAt))
    ) {
      return {
        hasActivePlan: false,
        isPaymentConfirmed: false,
        planName: subscription.planName,
        subscriptionStatus: subscription.status,
        message: "Last payment failed. Please update your payment method before submitting listings.",
      };
    }

    if (confirmedPayments.length === 0) {
      return {
        hasActivePlan: true,
        isPaymentConfirmed: false,
        planName: subscription.planName,
        subscriptionStatus: subscription.status,
        message: "Payment is still pending. Please complete payment before submitting listings.",
      };
    }

    // All checks passed
    return {
      hasActivePlan: true,
      isPaymentConfirmed: true,
      planName: subscription.planName,
      subscriptionStatus: subscription.status,
      message: "Payment verified successfully.",
    };
  } catch (error) {
    console.error("Error verifying payment:", error);
    return {
      hasActivePlan: false,
      isPaymentConfirmed: false,
      planName: null,
      subscriptionStatus: null,
      message: "Error verifying payment status. Please contact support.",
    };
  }
}

/**
 * Check if user is eligible to create a property listing
 * Must have active subscription with confirmed payment
 * @param userId - The user ID to check
 * @returns boolean
 */
export async function canCreateProperty(userId: string): Promise<{
  allowed: boolean;
  reason?: string;
}> {
  const verification = await verifyUserPayment(userId);

  if (!verification.hasActivePlan) {
    return {
      allowed: false,
      reason: "You need an active subscription to create property listings. Please subscribe to a plan first.",
    };
  }

  if (!verification.isPaymentConfirmed) {
    return {
      allowed: false,
      reason: "Your payment is pending. Listings cannot be submitted until payment is confirmed.",
    };
  }

  return {
    allowed: true,
  };
}

/**
 * Get user's subscription details for display
 * @param userId - The user ID
 * @returns Subscription details or null
 */
export async function getUserSubscriptionDetails(userId: string) {
  try {
    const userSubscriptions = await db
      .select()
      .from(subscriptions)
      .where(eq(subscriptions.userId, userId))
      .orderBy(desc(subscriptions.createdAt))
      .limit(1);

    if (userSubscriptions.length === 0) {
      return null;
    }

    const subscription = userSubscriptions[0];

    // Get latest payment
    const latestPayments = await db
      .select()
      .from(payments)
      .where(eq(payments.subscriptionId, subscription.id))
      .orderBy(desc(payments.createdAt))
      .limit(1);

    return {
      ...subscription,
      latestPayment: latestPayments[0] || null,
    };
  } catch (error) {
    console.error("Error fetching subscription details:", error);
    return null;
  }
}
