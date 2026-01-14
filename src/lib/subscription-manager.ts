/**
 * Subscription Manager - Complete Billing & Payment System
 * Handles subscription lifecycle, payment failures, auto-suspension, and reactivation
 * All timestamps in DD/MM/YYYY HH:mm:ss UK time format
 */

import { db } from '@/db';
import { subscriptions, invoices, user } from '@/db/schema';
import { eq, and, lt } from 'drizzle-orm';
import { stripe } from '@/lib/stripe-client';
import { nowUKFormatted, formatDateUK, addDaysUK } from '@/lib/date-utils';
import { syncMembershipStatus } from '@/lib/crm-sync';
import { sendEmail } from '@/lib/email';
import Stripe from 'stripe';

// ============================================
// PAYMENT FAILURE & RETRY LOGIC
// ============================================

export interface PaymentRetrySchedule {
  attempt: number;
  daysAfterFailure: number;
  description: string;
}

export const PAYMENT_RETRY_SCHEDULE: PaymentRetrySchedule[] = [
  { attempt: 1, daysAfterFailure: 3, description: 'First retry after 3 days' },
  { attempt: 2, daysAfterFailure: 5, description: 'Second retry after 5 days' },
  { attempt: 3, daysAfterFailure: 7, description: 'Third retry after 7 days' },
  { attempt: 4, daysAfterFailure: 7, description: 'Final retry after 7 days' },
];

export const GRACE_PERIOD_DAYS = 7; // Additional grace period before permanent suspension
export const TOTAL_RETRY_DAYS = PAYMENT_RETRY_SCHEDULE.reduce((sum, r) => sum + r.daysAfterFailure, 0);
export const TOTAL_DAYS_BEFORE_SUSPENSION = TOTAL_RETRY_DAYS + GRACE_PERIOD_DAYS; // 29 days total

/**
 * Log subscription action with UK timestamp
 */
function logSubscriptionAction(action: string, details?: any) {
  const timestamp = nowUKFormatted();
  console.log(`[${timestamp}] Subscription Manager: ${action}`, details || '');
}

// ============================================
// PAYMENT FAILURE HANDLING
// ============================================

export interface PaymentFailureParams {
  subscriptionId: string;
  invoiceId?: string;
  failureReason?: string;
  attemptCount?: number;
}

/**
 * Handle payment failure - implements retry schedule
 */
export async function handlePaymentFailure(params: PaymentFailureParams): Promise<void> {
  try {
    logSubscriptionAction('Handling payment failure', params);

    // Get subscription from database
    const [subscription] = await db
      .select()
      .from(subscriptions)
      .where(eq(subscriptions.stripeSubscriptionId, params.subscriptionId));

    if (!subscription) {
      throw new Error(`Subscription not found: ${params.subscriptionId}`);
    }

    if (!subscription.stripeSubscriptionId) {
      throw new Error(`Stripe subscription ID missing for subscription ${subscription.id}`);
    }

    // Get user details
    const [userRecord] = await db
      .select()
      .from(user)
      .where(eq(user.id, subscription.userId));

    if (!userRecord) {
      throw new Error(`User not found: ${subscription.userId}`);
    }

    const attemptCount = params.attemptCount || 1;
    const retrySchedule = PAYMENT_RETRY_SCHEDULE[attemptCount - 1];

    if (!retrySchedule) {
      // All retry attempts exhausted - suspend account
      await suspendSubscription(subscription.stripeSubscriptionId, 'Payment failure - all retry attempts exhausted');
      
      // Send suspension email
      await sendEmail({
        to: userRecord.email,
        subject: 'Account Suspended - Payment Failed',
        html: generateSuspensionEmail(userRecord.name, subscription.planName),
      });

      return;
    }

    // Update subscription status to past_due
    await db
      .update(subscriptions)
      .set({
        status: 'past_due',
        updatedAt: nowUKFormatted(),
      })
      .where(eq(subscriptions.id, subscription.id));

    // Calculate next retry date
    const nextRetryDate = addDaysUK(new Date(), retrySchedule.daysAfterFailure);

    // Send payment failure notification
    await sendEmail({
      to: userRecord.email,
      subject: `Payment Failed - Retry Attempt ${attemptCount} of ${PAYMENT_RETRY_SCHEDULE.length}`,
      html: generatePaymentFailureEmail(
        userRecord.name,
        subscription.planName,
        attemptCount,
        nextRetryDate,
        params.failureReason
      ),
    });

    // Schedule next retry with Stripe
    if (subscription.stripeSubscriptionId) {
      await stripe.subscriptions.update(subscription.stripeSubscriptionId, {
        metadata: {
          retryAttempt: attemptCount.toString(),
          nextRetryDate: formatDateUK(nextRetryDate),
          lastFailureReason: params.failureReason || 'Unknown',
        },
      });
    }

    logSubscriptionAction('Payment failure handled', {
      userId: subscription.userId,
      attempt: attemptCount,
      nextRetry: formatDateUK(nextRetryDate),
    });

  } catch (error) {
    logSubscriptionAction('Payment failure handling error', { error: (error as Error).message });
    throw error;
  }
}

// ============================================
// SUBSCRIPTION SUSPENSION
// ============================================

/**
 * Suspend subscription due to payment failure
 */
export async function suspendSubscription(
  stripeSubscriptionId: string,
  reason: string
): Promise<void> {
  try {
    logSubscriptionAction('Suspending subscription', { stripeSubscriptionId, reason });

    // Get subscription
    const [subscription] = await db
      .select()
      .from(subscriptions)
      .where(eq(subscriptions.stripeSubscriptionId, stripeSubscriptionId));

    if (!subscription) {
      throw new Error(`Subscription not found: ${stripeSubscriptionId}`);
    }

    // Cancel Stripe subscription
    await stripe.subscriptions.cancel(stripeSubscriptionId);

    // Update database
    await db
      .update(subscriptions)
      .set({
        status: 'cancelled',
        cancelledAt: nowUKFormatted(),
        cancelAtPeriodEnd: true,
        updatedAt: nowUKFormatted(),
      })
      .where(eq(subscriptions.id, subscription.id));

    // Update user role to guest (removing owner privileges)
    await db
      .update(user)
      .set({
        role: 'guest',
        updatedAt: new Date(),
      })
      .where(eq(user.id, subscription.userId));

    // Sync CRM status
    await syncMembershipStatus(subscription.userId);

    logSubscriptionAction('Subscription suspended successfully', {
      subscriptionId: subscription.id,
      userId: subscription.userId,
    });

  } catch (error) {
    logSubscriptionAction('Subscription suspension error', { error: (error as Error).message });
    throw error;
  }
}

// ============================================
// SUBSCRIPTION REACTIVATION
// ============================================

export interface ReactivateSubscriptionParams {
  userId: string;
  paymentMethodId: string;
}

/**
 * Reactivate a suspended subscription
 */
export async function reactivateSubscription(
  params: ReactivateSubscriptionParams
): Promise<{ success: boolean; subscription?: any; error?: string }> {
  try {
    logSubscriptionAction('Reactivating subscription', { userId: params.userId });

    // Get most recent subscription
    const [oldSubscription] = await db
      .select()
      .from(subscriptions)
      .where(eq(subscriptions.userId, params.userId))
      .orderBy(subscriptions.id)
      .limit(1);

    if (!oldSubscription) {
      return { success: false, error: 'No previous subscription found' };
    }

    // Get user details
    const [userRecord] = await db
      .select()
      .from(user)
      .where(eq(user.id, params.userId));

    if (!userRecord) {
      return { success: false, error: 'User not found' };
    }

    // Attach payment method to customer
    await stripe.paymentMethods.attach(params.paymentMethodId, {
      customer: oldSubscription.stripeCustomerId || '',
    });

    // Set as default payment method
    await stripe.customers.update(oldSubscription.stripeCustomerId || '', {
      invoice_settings: {
        default_payment_method: params.paymentMethodId,
      },
    });

    // Create new subscription
    const newStripeSubscription = await stripe.subscriptions.create({
      customer: oldSubscription.stripeCustomerId || '',
      items: [{ price: oldSubscription.stripePriceId || '' }],
      payment_behavior: 'default_incomplete',
      expand: ['latest_invoice.payment_intent'],
      metadata: {
        userId: params.userId,
        reactivatedAt: nowUKFormatted(),
        previousSubscriptionId: oldSubscription.id.toString(),
      },
    });

    // Update user role back to owner
    await db
      .update(user)
      .set({
        role: 'owner',
        updatedAt: new Date(),
      })
      .where(eq(user.id, params.userId));

    // Save new subscription to database
    const sub = newStripeSubscription as any; // Stripe SDK typing
    const currentPeriodStart = new Date(sub.current_period_start * 1000);
    const currentPeriodEnd = new Date(sub.current_period_end * 1000);

    const [newSubscription] = await db.insert(subscriptions).values({
      userId: params.userId,
      stripeSubscriptionId: sub.id,
      stripePriceId: oldSubscription.stripePriceId,
      stripeCustomerId: oldSubscription.stripeCustomerId,
      planName: oldSubscription.planName,
      planType: oldSubscription.planType,
      status: 'active',
      currentPeriodStart: formatDateUK(currentPeriodStart),
      currentPeriodEnd: formatDateUK(currentPeriodEnd),
      amount: oldSubscription.amount,
      currency: oldSubscription.currency,
      interval: oldSubscription.interval,
      intervalCount: oldSubscription.intervalCount || 1,
      createdAt: nowUKFormatted(),
      updatedAt: nowUKFormatted(),
    }).returning();

    // Sync CRM
    await syncMembershipStatus(params.userId);

    // Send reactivation email
    await sendEmail({
      to: userRecord.email,
      subject: 'Subscription Reactivated Successfully',
      html: generateReactivationEmail(userRecord.name, oldSubscription.planName),
    });

    logSubscriptionAction('Subscription reactivated successfully', {
      userId: params.userId,
      newSubscriptionId: newSubscription.id,
    });

    return { success: true, subscription: newSubscription };

  } catch (error) {
    logSubscriptionAction('Reactivation error', { error: (error as Error).message });
    return { success: false, error: (error as Error).message };
  }
}

// ============================================
// AUTOMATED BILLING CYCLE CHECKS
// ============================================

/**
 * Check for subscriptions that need renewal
 * Run this daily via cron job
 */
export async function processUpcomingRenewals(): Promise<void> {
  try {
    logSubscriptionAction('Processing upcoming renewals');

    // Get all active subscriptions ending in next 7 days
    const upcomingDateStr = addDaysUK(new Date(), 7);
    const upcomingDate = new Date(upcomingDateStr.split('/').reverse().join('-'));
    const allSubscriptions = await db.select().from(subscriptions);

    const upcomingRenewals = allSubscriptions.filter(sub => {
      if (sub.status !== 'active') return false;
      const endDate = new Date(sub.currentPeriodEnd.split('/').reverse().join('-'));
      return endDate <= upcomingDate && endDate > new Date();
    });

    logSubscriptionAction(`Found ${upcomingRenewals.length} subscriptions for renewal reminder`);

    for (const subscription of upcomingRenewals) {
      const [userRecord] = await db
        .select()
        .from(user)
        .where(eq(user.id, subscription.userId));

      if (userRecord) {
        await sendEmail({
          to: userRecord.email,
          subject: 'Subscription Renewal Reminder',
          html: generateRenewalReminderEmail(
            userRecord.name,
            subscription.planName,
            subscription.currentPeriodEnd,
            subscription.amount
          ),
        });
      }
    }

  } catch (error) {
    logSubscriptionAction('Renewal processing error', { error: (error as Error).message });
  }
}

/**
 * Check for past due subscriptions and trigger suspension
 * Run this daily via cron job
 */
export async function processPastDueSubscriptions(): Promise<void> {
  try {
    logSubscriptionAction('Processing past due subscriptions');

    const allSubscriptions = await db.select().from(subscriptions);
    const pastDueSubscriptions = allSubscriptions.filter(sub => sub.status === 'past_due');

    logSubscriptionAction(`Found ${pastDueSubscriptions.length} past due subscriptions`);

    for (const subscription of pastDueSubscriptions) {
      // Check if suspension grace period has passed
      const updatedDate = new Date(subscription.updatedAt);
      const daysSinceUpdate = Math.floor((Date.now() - updatedDate.getTime()) / (1000 * 60 * 60 * 24));

      if (daysSinceUpdate >= TOTAL_DAYS_BEFORE_SUSPENSION) {
        await suspendSubscription(
          subscription.stripeSubscriptionId || '',
          'Grace period expired after payment failures'
        );
      }
    }

  } catch (error) {
    logSubscriptionAction('Past due processing error', { error: (error as Error).message });
  }
}

// ============================================
// EMAIL TEMPLATES
// ============================================

function generatePaymentFailureEmail(
  userName: string,
  planName: string,
  attemptCount: number,
  nextRetryDate: string,
  failureReason?: string
): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #dc2626; color: white; padding: 20px; text-align: center; }
        .content { background: #f9fafb; padding: 30px; }
        .button { display: inline-block; padding: 12px 24px; background: #10b981; color: white; text-decoration: none; border-radius: 6px; }
        .warning { background: #fef3c7; padding: 15px; border-left: 4px solid #f59e0b; margin: 20px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>⚠️ Payment Failed</h1>
        </div>
        <div class="content">
          <p>Hi ${userName},</p>
          
          <p>We were unable to process your payment for your <strong>${planName}</strong> subscription.</p>
          
          <div class="warning">
            <strong>Retry Attempt ${attemptCount} of ${PAYMENT_RETRY_SCHEDULE.length}</strong><br>
            Next retry: ${formatDateUK(nextRetryDate)}
          </div>
          
          ${failureReason ? `<p><strong>Reason:</strong> ${failureReason}</p>` : ''}
          
          <p>To avoid service interruption, please update your payment method:</p>
          
          <p style="text-align: center; margin: 30px 0;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/owner/subscription" class="button">
              Update Payment Method
            </a>
          </p>
          
          <p><strong>What happens next?</strong></p>
          <ul>
            <li>We'll automatically retry your payment on ${formatDateUK(nextRetryDate)}</li>
            <li>If all retries fail, your account will be suspended after ${TOTAL_DAYS_BEFORE_SUSPENSION} days</li>
            <li>You can update your payment method at any time to avoid suspension</li>
          </ul>
          
          <p>If you have any questions, please contact our support team.</p>
          
          <p>Best regards,<br>Escape Houses Team</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

function generateSuspensionEmail(userName: string, planName: string): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #dc2626; color: white; padding: 20px; text-align: center; }
        .content { background: #f9fafb; padding: 30px; }
        .button { display: inline-block; padding: 12px 24px; background: #10b981; color: white; text-decoration: none; border-radius: 6px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🚫 Account Suspended</h1>
        </div>
        <div class="content">
          <p>Hi ${userName},</p>
          
          <p>Your <strong>${planName}</strong> subscription has been suspended due to failed payment attempts.</p>
          
          <p><strong>What this means:</strong></p>
          <ul>
            <li>Your property listings are no longer visible</li>
            <li>You cannot manage properties until reactivation</li>
            <li>Your account data is safely stored</li>
          </ul>
          
          <p>To reactivate your account, update your payment method and we'll restore your service immediately:</p>
          
          <p style="text-align: center; margin: 30px 0;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/owner/subscription/reactivate" class="button">
              Reactivate Account
            </a>
          </p>
          
          <p>Need help? Contact our support team.</p>
          
          <p>Best regards,<br>Escape Houses Team</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

function generateReactivationEmail(userName: string, planName: string): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #10b981; color: white; padding: 20px; text-align: center; }
        .content { background: #f9fafb; padding: 30px; }
        .button { display: inline-block; padding: 12px 24px; background: #6366f1; color: white; text-decoration: none; border-radius: 6px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>✅ Welcome Back!</h1>
        </div>
        <div class="content">
          <p>Hi ${userName},</p>
          
          <p>Great news! Your <strong>${planName}</strong> subscription has been reactivated.</p>
          
          <p><strong>Your access has been restored:</strong></p>
          <ul>
            <li>Property listings are now live</li>
            <li>Full dashboard access restored</li>
            <li>All features available</li>
          </ul>
          
          <p style="text-align: center; margin: 30px 0;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/owner/dashboard" class="button">
              Go to Dashboard
            </a>
          </p>
          
          <p>Thank you for staying with us!</p>
          
          <p>Best regards,<br>Escape Houses Team</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

function generateRenewalReminderEmail(
  userName: string,
  planName: string,
  renewalDate: string,
  amount: number
): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #6366f1; color: white; padding: 20px; text-align: center; }
        .content { background: #f9fafb; padding: 30px; }
        .info-box { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🔄 Subscription Renewal Reminder</h1>
        </div>
        <div class="content">
          <p>Hi ${userName},</p>
          
          <p>This is a friendly reminder that your <strong>${planName}</strong> subscription will renew soon.</p>
          
          <div class="info-box">
            <p><strong>Renewal Date:</strong> ${renewalDate}</p>
            <p><strong>Amount:</strong> £${amount.toFixed(2)}</p>
            <p><strong>Plan:</strong> ${planName}</p>
          </div>
          
          <p>Your subscription will automatically renew using your saved payment method. No action needed!</p>
          
          <p>Want to make changes? Manage your subscription anytime in your dashboard.</p>
          
          <p>Best regards,<br>Escape Houses Team</p>
        </div>
      </div>
    </body>
    </html>
  `;
}
