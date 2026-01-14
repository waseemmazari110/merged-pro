/**
 * Milestone 4: Payment Retry Policy & Account Suspension
 * Implements intelligent retry logic with exponential backoff
 * Automatic account suspension after failed payment attempts
 * All timestamps in DD/MM/YYYY HH:mm:ss UK time format
 */

import { db } from '@/db';
import { subscriptions, user } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { nowUKFormatted, formatDateTimeUK, addDaysUK } from '@/lib/date-utils';
import { stripe } from '@/lib/stripe-client';

// ============================================
// RETRY CONFIGURATION
// ============================================

export const RETRY_CONFIG = {
  // Maximum number of retry attempts
  maxAttempts: 4,
  
  // Retry schedule (in days after initial failure)
  retrySchedule: [
    { attempt: 1, days: 3, description: 'First retry after 3 days' },
    { attempt: 2, days: 5, description: 'Second retry after 5 days (8 days total)' },
    { attempt: 3, days: 7, description: 'Third retry after 7 days (15 days total)' },
    { attempt: 4, days: 7, description: 'Final retry after 7 days (22 days total)' },
  ],
  
  // Grace period before suspension (after all retries fail)
  gracePeriodDays: 3,
  
  // Total days until suspension: 22 days (retries) + 3 days (grace) = 25 days
  totalDaysUntilSuspension: 25,
};

export const SUSPENSION_CONFIG = {
  // Account status during retry period
  duringRetry: 'payment_past_due' as const,
  
  // Account status after all retries fail
  suspended: 'suspended' as const,
  
  // Grace period for payment after suspension
  suspensionGraceDays: 7,
  
  // Account status if not paid after suspension grace period
  cancelled: 'cancelled' as const,
};

// ============================================
// TYPES
// ============================================

export interface PaymentRetryAttempt {
  attempt: number;
  attemptedAt: string; // UK timestamp
  failureReason?: string;
  nextRetryAt?: string; // UK timestamp
  status: 'pending' | 'failed' | 'succeeded';
}

export interface RetryPolicy {
  subscriptionId: string;
  userId: string;
  initialFailureDate: string; // UK timestamp
  currentAttempt: number;
  maxAttempts: number;
  attempts: PaymentRetryAttempt[];
  nextRetryDate: string | null; // UK timestamp
  suspensionDate: string | null; // UK timestamp
  status: 'active' | 'past_due' | 'suspended' | 'cancelled';
  createdAt: string; // UK timestamp
  updatedAt: string; // UK timestamp
}

// ============================================
// RETRY POLICY FUNCTIONS
// ============================================

/**
 * Log retry action with UK timestamp
 */
function logRetryAction(action: string, details?: any) {
  const timestamp = nowUKFormatted();
  console.log(`[${timestamp}] Payment Retry: ${action}`, details || '');
}

/**
 * Calculate next retry date
 */
export function calculateNextRetryDate(
  failureDate: Date,
  attemptNumber: number
): string | null {
  if (attemptNumber > RETRY_CONFIG.maxAttempts) {
    return null;
  }

  const schedule = RETRY_CONFIG.retrySchedule.find(s => s.attempt === attemptNumber);
  if (!schedule) return null;

  // Calculate cumulative days
  const cumulativeDays = RETRY_CONFIG.retrySchedule
    .filter(s => s.attempt <= attemptNumber)
    .reduce((sum, s) => sum + s.days, 0);

  return addDaysUK(failureDate, cumulativeDays);
}

/**
 * Calculate suspension date (after all retries + grace period)
 */
export function calculateSuspensionDate(initialFailureDate: Date): string {
  return addDaysUK(initialFailureDate, RETRY_CONFIG.totalDaysUntilSuspension);
}

/**
 * Initialize retry policy for failed payment
 */
export async function initializeRetryPolicy(
  subscriptionId: string,
  userId: string,
  failureReason?: string
): Promise<void> {
  try {
    logRetryAction('Initializing retry policy', {
      subscriptionId,
      userId,
      failureReason,
    });

    const now = new Date();
    const nextRetryDate = calculateNextRetryDate(now, 1);
    const suspensionDate = calculateSuspensionDate(now);

    const initialAttempt: PaymentRetryAttempt = {
      attempt: 0,
      attemptedAt: nowUKFormatted(),
      failureReason: failureReason || 'Initial payment failure',
      nextRetryAt: nextRetryDate || undefined,
      status: 'failed',
    };

    // Update subscription with retry metadata
    await db
      .update(subscriptions)
      .set({
        status: 'past_due',
        metadata: JSON.stringify({
          retryPolicy: {
            initialFailureDate: nowUKFormatted(),
            currentAttempt: 0,
            maxAttempts: RETRY_CONFIG.maxAttempts,
            attempts: [initialAttempt],
            nextRetryDate,
            suspensionDate,
            status: 'past_due',
          },
        }),
        updatedAt: nowUKFormatted(),
      })
      .where(eq(subscriptions.id, parseInt(subscriptionId)));

    logRetryAction('Retry policy initialized', {
      subscriptionId,
      nextRetryDate,
      suspensionDate,
    });

    // TODO: Send email notification about payment failure

  } catch (error) {
    logRetryAction('Failed to initialize retry policy', {
      error: (error as Error).message,
    });
    throw error;
  }
}

/**
 * Process payment retry attempt
 */
export async function processRetryAttempt(
  subscriptionId: string,
  attemptNumber: number
): Promise<{ success: boolean; message: string }> {
  try {
    logRetryAction('Processing retry attempt', {
      subscriptionId,
      attemptNumber,
    });

    // Get subscription
    const [subscription] = await db
      .select()
      .from(subscriptions)
      .where(eq(subscriptions.id, parseInt(subscriptionId)))
      .limit(1);

    if (!subscription) {
      throw new Error('Subscription not found');
    }

    // Get retry policy from metadata
    const metadata = typeof subscription.metadata === 'object' && subscription.metadata !== null 
      ? subscription.metadata 
      : {};
    const retryPolicy: RetryPolicy = (metadata as any).retryPolicy;

    if (!retryPolicy) {
      throw new Error('Retry policy not found');
    }

    // Check if we've exceeded max attempts
    if (attemptNumber > RETRY_CONFIG.maxAttempts) {
      await suspendAccount(subscriptionId, subscription.userId);
      return {
        success: false,
        message: 'Maximum retry attempts exceeded. Account suspended.',
      };
    }

    // Attempt to charge the customer via Stripe
    if (!subscription.stripeSubscriptionId) {
      throw new Error('Stripe subscription ID not found');
    }

    const paymentResult = await attemptPayment(subscription.stripeSubscriptionId);

    const attempt: PaymentRetryAttempt = {
      attempt: attemptNumber,
      attemptedAt: nowUKFormatted(),
      status: paymentResult.success ? 'succeeded' : 'failed',
      failureReason: paymentResult.error,
      nextRetryAt: paymentResult.success
        ? undefined
        : calculateNextRetryDate(new Date(), attemptNumber + 1) || undefined,
    };

    // Update retry policy
    retryPolicy.attempts.push(attempt);
    retryPolicy.currentAttempt = attemptNumber;
    retryPolicy.updatedAt = nowUKFormatted();

    if (paymentResult.success) {
      // Payment succeeded - clear retry policy
      await db
        .update(subscriptions)
        .set({
          status: 'active',
          metadata: JSON.stringify({
            ...metadata,
            retryPolicy: {
              ...retryPolicy,
              status: 'active',
            },
          }),
          updatedAt: nowUKFormatted(),
        })
        .where(eq(subscriptions.id, parseInt(subscriptionId)));

      logRetryAction('Payment retry succeeded', {
        subscriptionId,
        attemptNumber,
      });

      // TODO: Send email notification about successful payment

      return {
        success: true,
        message: 'Payment successful. Subscription reactivated.',
      };
    } else {
      // Payment failed - schedule next retry or suspend
      const nextRetryDate = calculateNextRetryDate(new Date(), attemptNumber + 1);

      if (nextRetryDate) {
        retryPolicy.nextRetryDate = nextRetryDate;
        retryPolicy.status = 'past_due';

        await db
          .update(subscriptions)
          .set({
            metadata: JSON.stringify({
              ...metadata,
              retryPolicy,
            }),
            updatedAt: nowUKFormatted(),
          })
          .where(eq(subscriptions.id, parseInt(subscriptionId)));

        logRetryAction('Payment retry failed, next retry scheduled', {
          subscriptionId,
          attemptNumber,
          nextRetryDate,
        });

        // TODO: Send email notification about failed retry

        return {
          success: false,
          message: `Payment failed. Next retry scheduled for ${nextRetryDate}`,
        };
      } else {
        // No more retries - suspend account
        await suspendAccount(subscriptionId, subscription.userId);

        return {
          success: false,
          message: 'All retry attempts exhausted. Account suspended.',
        };
      }
    }
  } catch (error) {
    logRetryAction('Retry attempt processing failed', {
      error: (error as Error).message,
    });
    throw error;
  }
}

/**
 * Attempt payment via Stripe
 */
async function attemptPayment(
  stripeSubscriptionId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    logRetryAction('Attempting Stripe payment', { stripeSubscriptionId });

    // Retrieve the subscription's latest invoice
    const subscription = await stripe.subscriptions.retrieve(stripeSubscriptionId, {
      expand: ['latest_invoice'],
    });

    const latestInvoice = subscription.latest_invoice as any;

    if (!latestInvoice) {
      return { success: false, error: 'No invoice found' };
    }

    // If invoice is already paid, return success
    if (latestInvoice.status === 'paid') {
      return { success: true };
    }

    // Attempt to pay the invoice
    const paidInvoice = await stripe.invoices.pay(latestInvoice.id, {
      forgive: false,
    });

    if (paidInvoice.status === 'paid') {
      logRetryAction('Payment succeeded', { invoiceId: paidInvoice.id });
      return { success: true };
    } else {
      return {
        success: false,
        error: `Invoice status: ${paidInvoice.status}`,
      };
    }
  } catch (error: any) {
    const errorMessage = error.message || 'Unknown payment error';
    logRetryAction('Payment attempt failed', { error: errorMessage });
    
    return {
      success: false,
      error: errorMessage,
    };
  }
}

// ============================================
// ACCOUNT SUSPENSION
// ============================================

/**
 * Suspend account after failed payment retries
 */
export async function suspendAccount(
  subscriptionId: string,
  userId: string
): Promise<void> {
  try {
    logRetryAction('Suspending account', { subscriptionId, userId });

    const suspendedAt = nowUKFormatted();
    const cancellationDate = addDaysUK(
      new Date(),
      SUSPENSION_CONFIG.suspensionGraceDays
    );

    // Update subscription status
    const [subscription] = await db
      .select()
      .from(subscriptions)
      .where(eq(subscriptions.id, parseInt(subscriptionId)))
      .limit(1);

    const metadata = typeof subscription?.metadata === 'object' && subscription?.metadata !== null 
      ? subscription.metadata 
      : {};
    const retryPolicy: RetryPolicy = (metadata as any).retryPolicy || {};

    retryPolicy.status = 'suspended';
    retryPolicy.updatedAt = suspendedAt;

    await db
      .update(subscriptions)
      .set({
        status: 'suspended',
        metadata: JSON.stringify({
          ...metadata,
          retryPolicy,
          suspension: {
            suspendedAt,
            reason: 'Payment failure after all retry attempts',
            gracePeriodEnds: cancellationDate,
            canReactivate: true,
          },
        }),
        updatedAt: suspendedAt,
      })
      .where(eq(subscriptions.id, parseInt(subscriptionId)));

    // Update user account status
    await db
      .update(user)
      .set({
        role: 'guest', // Downgrade to guest
        // Add suspension info to user metadata if needed
      })
      .where(eq(user.id, userId));

    logRetryAction('Account suspended', {
      subscriptionId,
      userId,
      suspendedAt,
      gracePeriodEnds: cancellationDate,
    });

    // TODO: Send email notification about suspension
    // TODO: Disable access to premium features

  } catch (error) {
    logRetryAction('Account suspension failed', {
      error: (error as Error).message,
    });
    throw error;
  }
}

/**
 * Reactivate suspended account after payment
 */
export async function reactivateSuspendedAccount(
  subscriptionId: string,
  userId: string
): Promise<void> {
  try {
    logRetryAction('Reactivating suspended account', { subscriptionId, userId });

    const [subscription] = await db
      .select()
      .from(subscriptions)
      .where(eq(subscriptions.id, parseInt(subscriptionId)))
      .limit(1);

    if (!subscription) {
      throw new Error('Subscription not found');
    }

    const metadata = typeof subscription.metadata === 'object' && subscription.metadata !== null 
      ? subscription.metadata 
      : {};
    const metadataAny = metadata as any;

    // Clear suspension data
    delete metadataAny.suspension;

    if (metadataAny.retryPolicy) {
      metadataAny.retryPolicy.status = 'active';
      metadataAny.retryPolicy.updatedAt = nowUKFormatted();
    }

    await db
      .update(subscriptions)
      .set({
        status: 'active',
        metadata: JSON.stringify(metadataAny),
        updatedAt: nowUKFormatted(),
      })
      .where(eq(subscriptions.id, parseInt(subscriptionId)));

    // Restore user role
    await db
      .update(user)
      .set({
        role: 'owner', // Restore to owner
      })
      .where(eq(user.id, userId));

    logRetryAction('Account reactivated', {
      subscriptionId,
      userId,
      reactivatedAt: nowUKFormatted(),
    });

    // TODO: Send email notification about reactivation

  } catch (error) {
    logRetryAction('Account reactivation failed', {
      error: (error as Error).message,
    });
    throw error;
  }
}

/**
 * Cancel account permanently after suspension grace period
 */
export async function permanentlyCloseAccount(
  subscriptionId: string,
  userId: string
): Promise<void> {
  try {
    logRetryAction('Permanently closing account', { subscriptionId, userId });

    // Cancel Stripe subscription
    const [subscription] = await db
      .select()
      .from(subscriptions)
      .where(eq(subscriptions.id, parseInt(subscriptionId)))
      .limit(1);

    if (subscription?.stripeSubscriptionId) {
      await stripe.subscriptions.cancel(subscription.stripeSubscriptionId);
    }

    // Update subscription status
    await db
      .update(subscriptions)
      .set({
        status: 'cancelled',
        cancelledAt: nowUKFormatted(),
        updatedAt: nowUKFormatted(),
      })
      .where(eq(subscriptions.id, parseInt(subscriptionId)));

    logRetryAction('Account permanently closed', {
      subscriptionId,
      userId,
      closedAt: nowUKFormatted(),
    });

    // TODO: Send email notification about permanent closure
    // TODO: Archive user data

  } catch (error) {
    logRetryAction('Account closure failed', {
      error: (error as Error).message,
    });
    throw error;
  }
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Get retry policy for subscription
 */
export async function getRetryPolicy(subscriptionId: string): Promise<RetryPolicy | null> {
  try {
    const [subscription] = await db
      .select()
      .from(subscriptions)
      .where(eq(subscriptions.id, parseInt(subscriptionId)))
      .limit(1);

    if (!subscription?.metadata) return null;

    const metadata = typeof subscription.metadata === 'object' && subscription.metadata !== null 
      ? subscription.metadata 
      : {};
    return (metadata as any).retryPolicy || null;
  } catch (error) {
    logRetryAction('Failed to get retry policy', {
      error: (error as Error).message,
    });
    return null;
  }
}

/**
 * Check if subscription is in retry period
 */
export async function isInRetryPeriod(subscriptionId: string): Promise<boolean> {
  const retryPolicy = await getRetryPolicy(subscriptionId);
  return retryPolicy?.status === 'past_due' && retryPolicy.currentAttempt < RETRY_CONFIG.maxAttempts;
}

/**
 * Check if account is suspended
 */
export async function isAccountSuspended(subscriptionId: string): Promise<boolean> {
  const [subscription] = await db
    .select()
    .from(subscriptions)
    .where(eq(subscriptions.id, parseInt(subscriptionId)))
    .limit(1);

  return subscription?.status === 'suspended';
}

/**
 * Get days until suspension
 */
export async function getDaysUntilSuspension(subscriptionId: string): Promise<number | null> {
  const retryPolicy = await getRetryPolicy(subscriptionId);
  if (!retryPolicy?.suspensionDate) return null;

  const suspensionDate = new Date(retryPolicy.suspensionDate.split('/').reverse().join('-'));
  const today = new Date();
  const diffTime = suspensionDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return diffDays > 0 ? diffDays : 0;
}

