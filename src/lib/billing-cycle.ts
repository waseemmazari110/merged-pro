/**
 * Milestone 4: Billing Cycle Management
 * Manages subscription billing cycles with UK timestamps
 * Handles monthly and annual billing periods
 * All timestamps in DD/MM/YYYY HH:mm:ss UK time format
 */

import { db } from '@/db';
import { subscriptions } from '@/db/schema';
import { eq, and, lte } from 'drizzle-orm';
import {
  nowUKFormatted,
  formatDateUK,
  addMonthsUK,
  addYearsUK,
  calculateNextBillingDate,
  getDaysBetween,
  isDateInPast,
} from '@/lib/date-utils';
import { stripe } from '@/lib/stripe-client';
import { createInvoiceFromStripe } from '@/lib/stripe-billing';
import { initializeRetryPolicy } from '@/lib/payment-retry';

// ============================================
// BILLING CYCLE TYPES
// ============================================

export interface BillingCycle {
  subscriptionId: string;
  userId: string;
  currentPeriodStart: string; // DD/MM/YYYY
  currentPeriodEnd: string; // DD/MM/YYYY
  nextBillingDate: string; // DD/MM/YYYY
  interval: 'month' | 'year';
  intervalCount: number;
  amount: number;
  currency: string;
  status: 'active' | 'past_due' | 'cancelled' | 'suspended';
  daysUntilRenewal: number;
  isRenewalDue: boolean;
}

export interface BillingHistory {
  subscriptionId: string;
  cycles: BillingCycleRecord[];
  totalPaid: number;
  totalCycles: number;
}

export interface BillingCycleRecord {
  cycleNumber: number;
  startDate: string; // DD/MM/YYYY
  endDate: string; // DD/MM/YYYY
  billedAt: string; // DD/MM/YYYY HH:mm:ss
  amount: number;
  currency: string;
  status: 'paid' | 'failed' | 'pending';
  invoiceId?: string;
}

// ============================================
// LOGGING
// ============================================

function logBillingCycle(action: string, details?: any) {
  const timestamp = nowUKFormatted();
  console.log(`[${timestamp}] Billing Cycle: ${action}`, details || '');
}

// ============================================
// BILLING CYCLE FUNCTIONS
// ============================================

/**
 * Get current billing cycle for subscription
 */
export async function getCurrentBillingCycle(
  subscriptionId: string
): Promise<BillingCycle | null> {
  try {
    const [subscription] = await db
      .select()
      .from(subscriptions)
      .where(eq(subscriptions.id, parseInt(subscriptionId)))
      .limit(1);

    if (!subscription) {
      return null;
    }

    // Parse UK dates (DD/MM/YYYY) to Date objects for calculations
    const periodEndParts = subscription.currentPeriodEnd.split('/');
    const periodEndDate = new Date(
      parseInt(periodEndParts[2]),
      parseInt(periodEndParts[1]) - 1,
      parseInt(periodEndParts[0])
    );

    const today = new Date();
    const daysUntilRenewal = Math.ceil(
      (periodEndDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    );

    const isRenewalDue = daysUntilRenewal <= 0;

    const billingCycle: BillingCycle = {
      subscriptionId: subscription.id.toString(),
      userId: subscription.userId,
      currentPeriodStart: subscription.currentPeriodStart,
      currentPeriodEnd: subscription.currentPeriodEnd,
      nextBillingDate: subscription.currentPeriodEnd,
      interval: subscription.interval === 'year' ? 'year' : 'month',
      intervalCount: subscription.intervalCount || 1,
      amount: subscription.amount || 0,
      currency: subscription.currency || 'GBP',
      status: subscription.status as any,
      daysUntilRenewal: Math.max(0, daysUntilRenewal),
      isRenewalDue,
    };

    return billingCycle;
  } catch (error) {
    logBillingCycle('Failed to get current billing cycle', {
      error: (error as Error).message,
    });
    return null;
  }
}

/**
 * Process subscription renewal
 */
export async function processSubscriptionRenewal(
  subscriptionId: string
): Promise<{ success: boolean; message: string; invoiceId?: string }> {
  try {
    logBillingCycle('Processing subscription renewal', { subscriptionId });

    const [subscription] = await db
      .select()
      .from(subscriptions)
      .where(eq(subscriptions.id, parseInt(subscriptionId)))
      .limit(1);

    if (!subscription) {
      throw new Error('Subscription not found');
    }

    // Check if renewal is actually due
    const billingCycle = await getCurrentBillingCycle(subscriptionId);
    if (!billingCycle?.isRenewalDue) {
      return {
        success: false,
        message: `Renewal not due yet. Next billing: ${billingCycle?.nextBillingDate}`,
      };
    }

    // Get Stripe subscription
    if (!subscription.stripeSubscriptionId) {
      throw new Error('Stripe subscription ID not found');
    }

    const stripeSubId = subscription.stripeSubscriptionId;
    const stripeSubscription = await stripe.subscriptions.retrieve(
      stripeSubId,
      { expand: ['latest_invoice'] }
    );

    const latestInvoice = stripeSubscription.latest_invoice as any;

    // Check payment status
    if (latestInvoice.status === 'paid') {
      // Update billing cycle dates
      const newPeriodStart = subscription.currentPeriodEnd;
      const newPeriodEnd = calculateNextBillingDate(
        subscription.currentPeriodEnd,
        subscription.interval === 'year' ? 'year' : 'month',
        subscription.intervalCount || 1
      );

      await db
        .update(subscriptions)
        .set({
          currentPeriodStart: newPeriodStart,
          currentPeriodEnd: newPeriodEnd,
          status: 'active',
          updatedAt: nowUKFormatted(),
        })
        .where(eq(subscriptions.id, parseInt(subscriptionId)));

      // Create invoice record in database
      if (latestInvoice) {
        await createInvoiceFromStripe(latestInvoice, subscription.userId);
      }

      logBillingCycle('Subscription renewed successfully', {
        subscriptionId,
        newPeriodStart,
        newPeriodEnd,
      });

      return {
        success: true,
        message: `Subscription renewed. Next billing: ${newPeriodEnd}`,
        invoiceId: latestInvoice?.id,
      };
    } else if (latestInvoice.status === 'open' || latestInvoice.status === 'uncollectible') {
      // Payment failed - initialize retry policy
      await initializeRetryPolicy(
        subscriptionId,
        subscription.userId,
        `Payment failed during renewal: ${latestInvoice.status}`
      );

      logBillingCycle('Subscription renewal failed - retry policy initialized', {
        subscriptionId,
        invoiceStatus: latestInvoice.status,
      });

      return {
        success: false,
        message: 'Payment failed. Retry policy initialized.',
      };
    } else {
      logBillingCycle('Unexpected invoice status during renewal', {
        subscriptionId,
        status: latestInvoice.status,
      });

      return {
        success: false,
        message: `Unexpected invoice status: ${latestInvoice.status}`,
      };
    }
  } catch (error) {
    logBillingCycle('Subscription renewal processing failed', {
      error: (error as Error).message,
    });
    throw error;
  }
}

/**
 * Get subscriptions due for renewal
 */
export async function getSubscriptionsDueForRenewal(): Promise<BillingCycle[]> {
  try {
    logBillingCycle('Fetching subscriptions due for renewal');

    // Get all active subscriptions
    const activeSubscriptions = await db
      .select()
      .from(subscriptions)
      .where(eq(subscriptions.status, 'active'));

    const dueSubscriptions: BillingCycle[] = [];

    for (const subscription of activeSubscriptions) {
      const billingCycle = await getCurrentBillingCycle(subscription.id.toString());
      
      if (billingCycle && billingCycle.isRenewalDue) {
        dueSubscriptions.push(billingCycle);
      }
    }

    logBillingCycle('Found subscriptions due for renewal', {
      count: dueSubscriptions.length,
    });

    return dueSubscriptions;
  } catch (error) {
    logBillingCycle('Failed to fetch subscriptions due for renewal', {
      error: (error as Error).message,
    });
    return [];
  }
}

/**
 * Process all pending renewals (cron job function)
 */
export async function processAllPendingRenewals(): Promise<{
  processed: number;
  succeeded: number;
  failed: number;
  results: any[];
}> {
  try {
    logBillingCycle('Processing all pending renewals - STARTED');

    const dueSubscriptions = await getSubscriptionsDueForRenewal();
    const results = [];
    let succeeded = 0;
    let failed = 0;

    for (const cycle of dueSubscriptions) {
      try {
        const result = await processSubscriptionRenewal(cycle.subscriptionId);
        results.push({
          subscriptionId: cycle.subscriptionId,
          userId: cycle.userId,
          success: result.success,
          message: result.message,
        });

        if (result.success) {
          succeeded++;
        } else {
          failed++;
        }
      } catch (error) {
        results.push({
          subscriptionId: cycle.subscriptionId,
          userId: cycle.userId,
          success: false,
          error: (error as Error).message,
        });
        failed++;
      }
    }

    logBillingCycle('Processing all pending renewals - COMPLETED', {
      processed: dueSubscriptions.length,
      succeeded,
      failed,
    });

    return {
      processed: dueSubscriptions.length,
      succeeded,
      failed,
      results,
    };
  } catch (error) {
    logBillingCycle('Failed to process pending renewals', {
      error: (error as Error).message,
    });
    throw error;
  }
}

/**
 * Get billing history for subscription
 */
export async function getBillingHistory(subscriptionId: string): Promise<BillingHistory | null> {
  try {
    const [subscription] = await db
      .select()
      .from(subscriptions)
      .where(eq(subscriptions.id, parseInt(subscriptionId)))
      .limit(1);

    if (!subscription) {
      return null;
    }

    // Get all invoices for this subscription
    const { invoices: invoicesTable } = await import('@/db/schema');
    const allInvoices = await db
      .select()
      .from(invoicesTable)
      .where(eq(invoicesTable.subscriptionId, parseInt(subscriptionId)));

    // Build cycle records from invoices
    const cycles: BillingCycleRecord[] = allInvoices.map((invoice, index) => ({
      cycleNumber: index + 1,
      startDate: invoice.periodStart || '',
      endDate: invoice.periodEnd || '',
      billedAt: invoice.createdAt,
      amount: invoice.total || 0,
      currency: invoice.currency || 'GBP',
      status: invoice.status === 'paid' ? 'paid' : invoice.status === 'open' ? 'pending' : 'failed',
      invoiceId: invoice.id.toString(),
    }));

    const totalPaid = cycles
      .filter(c => c.status === 'paid')
      .reduce((sum, c) => sum + c.amount, 0);

    return {
      subscriptionId,
      cycles,
      totalPaid,
      totalCycles: cycles.length,
    };
  } catch (error) {
    logBillingCycle('Failed to get billing history', {
      error: (error as Error).message,
    });
    return null;
  }
}

/**
 * Calculate prorated amount for subscription upgrade/downgrade
 */
export function calculateProratedAmount(
  currentAmount: number,
  newAmount: number,
  daysRemaining: number,
  totalDaysInCycle: number
): number {
  // Calculate unused portion of current plan
  const unusedAmount = (currentAmount / totalDaysInCycle) * daysRemaining;

  // Calculate prorated amount for new plan
  const proratedNewAmount = (newAmount / totalDaysInCycle) * daysRemaining;

  // Return the difference (credit if downgrading, charge if upgrading)
  return proratedNewAmount - unusedAmount;
}

/**
 * Preview subscription change (upgrade/downgrade)
 */
export async function previewSubscriptionChange(
  subscriptionId: string,
  newPlanAmount: number
): Promise<{
  currentAmount: number;
  newAmount: number;
  proratedAmount: number;
  daysRemaining: number;
  effectiveDate: string;
  nextBillingDate: string;
} | null> {
  try {
    const billingCycle = await getCurrentBillingCycle(subscriptionId);
    if (!billingCycle) return null;

    const currentAmount = billingCycle.amount;
    const daysRemaining = billingCycle.daysUntilRenewal;
    
    // Calculate total days in cycle
    const periodStartParts = billingCycle.currentPeriodStart.split('/');
    const periodEndParts = billingCycle.currentPeriodEnd.split('/');
    
    const periodStart = new Date(
      parseInt(periodStartParts[2]),
      parseInt(periodStartParts[1]) - 1,
      parseInt(periodStartParts[0])
    );
    
    const periodEnd = new Date(
      parseInt(periodEndParts[2]),
      parseInt(periodEndParts[1]) - 1,
      parseInt(periodEndParts[0])
    );

    const totalDaysInCycle = Math.ceil(
      (periodEnd.getTime() - periodStart.getTime()) / (1000 * 60 * 60 * 24)
    );

    const proratedAmount = calculateProratedAmount(
      currentAmount,
      newPlanAmount,
      daysRemaining,
      totalDaysInCycle
    );

    return {
      currentAmount,
      newAmount: newPlanAmount,
      proratedAmount,
      daysRemaining,
      effectiveDate: nowUKFormatted(),
      nextBillingDate: billingCycle.nextBillingDate,
    };
  } catch (error) {
    logBillingCycle('Failed to preview subscription change', {
      error: (error as Error).message,
    });
    return null;
  }
}

/**
 * Get upcoming renewals (next 7 days)
 */
export async function getUpcomingRenewals(): Promise<BillingCycle[]> {
  try {
    const activeSubscriptions = await db
      .select()
      .from(subscriptions)
      .where(eq(subscriptions.status, 'active'));

    const upcoming: BillingCycle[] = [];

    for (const subscription of activeSubscriptions) {
      const billingCycle = await getCurrentBillingCycle(subscription.id.toString());
      
      if (billingCycle && billingCycle.daysUntilRenewal <= 7 && billingCycle.daysUntilRenewal > 0) {
        upcoming.push(billingCycle);
      }
    }

    logBillingCycle('Found upcoming renewals', { count: upcoming.length });

    return upcoming;
  } catch (error) {
    logBillingCycle('Failed to get upcoming renewals', {
      error: (error as Error).message,
    });
    return [];
  }
}

/**
 * Send renewal reminders (3 days before renewal)
 */
export async function sendRenewalReminders(): Promise<number> {
  try {
    logBillingCycle('Sending renewal reminders');

    const activeSubscriptions = await db
      .select()
      .from(subscriptions)
      .where(eq(subscriptions.status, 'active'));

    let remindersSent = 0;

    for (const subscription of activeSubscriptions) {
      const billingCycle = await getCurrentBillingCycle(subscription.id.toString());
      
      // Send reminder 3 days before renewal
      if (billingCycle && billingCycle.daysUntilRenewal === 3) {
        // TODO: Send email reminder
        logBillingCycle('Renewal reminder sent', {
          subscriptionId: subscription.id.toString(),
          userId: subscription.userId,
          renewalDate: billingCycle.nextBillingDate,
        });
        remindersSent++;
      }
    }

    logBillingCycle('Renewal reminders sent', { count: remindersSent });
    return remindersSent;
  } catch (error) {
    logBillingCycle('Failed to send renewal reminders', {
      error: (error as Error).message,
    });
    return 0;
  }
}

/**
 * Get billing cycle statistics
 */
export async function getBillingCycleStatistics() {
  try {
    const allSubscriptions = await db.select().from(subscriptions);

    const stats = {
      total: allSubscriptions.length,
      active: allSubscriptions.filter(s => s.status === 'active').length,
      pastDue: allSubscriptions.filter(s => s.status === 'past_due').length,
      suspended: allSubscriptions.filter(s => s.status === 'suspended').length,
      cancelled: allSubscriptions.filter(s => s.status === 'cancelled').length,
      monthly: allSubscriptions.filter(s => s.interval === 'month').length,
      yearly: allSubscriptions.filter(s => s.interval === 'year').length,
      generatedAt: nowUKFormatted(),
    };

    return stats;
  } catch (error) {
    logBillingCycle('Failed to get billing cycle statistics', {
      error: (error as Error).message,
    });
    return null;
  }
}



