/**
 * Stripe Billing Service - Milestone 3
 * All timestamps logged in DD/MM/YYYY HH:mm:ss UK time
 * Global Rules:
 * - Stripe = primary billing provider (test mode)
 * - Never hardcode secrets - use environment variables
 * - Validate all webhook signatures
 */

import Stripe from 'stripe';
import { db } from '@/db';
import { subscriptions, invoices, payments, user } from '@/db/schema';
import { eq, and, desc } from 'drizzle-orm';
import { nowUKFormatted, todayUKFormatted, formatDateUK } from '@/lib/date-utils';
import { stripe, webhookSecret } from '@/lib/stripe-client';

/**
 * Log billing action with UK timestamp
 */
function logBillingAction(action: string, details?: any) {
  const timestamp = nowUKFormatted();
  console.log(`[${timestamp}] Stripe Billing: ${action}`, details || '');
}

// ============================================
// CUSTOMER MANAGEMENT
// ============================================

export interface CreateCustomerParams {
  userId: string;
  email: string;
  name: string;
  phone?: string;
  metadata?: Record<string, string>;
}

/**
 * Create a Stripe customer
 * @param params Customer details
 * @returns Stripe customer object
 */
export async function createCustomer(params: CreateCustomerParams): Promise<Stripe.Customer> {
  try {
    logBillingAction('Creating customer', { userId: params.userId, email: params.email });
    
    const customer = await stripe.customers.create({
      email: params.email,
      name: params.name,
      phone: params.phone,
      metadata: {
        userId: params.userId,
        createdAt: nowUKFormatted(),
        ...params.metadata,
      },
    });

    logBillingAction('Customer created successfully', { 
      customerId: customer.id,
      email: customer.email 
    });

    return customer;

  } catch (error) {
    logBillingAction('Customer creation failed', { error: (error as Error).message });
    throw error;
  }
}

/**
 * Get or create Stripe customer for user
 */
export async function getOrCreateCustomer(
  userId: string,
  email: string,
  name: string
): Promise<string> {
  try {
    // Check if user already has a Stripe customer ID
    const existingSubscription = await db
      .select()
      .from(subscriptions)
      .where(eq(subscriptions.userId, userId))
      .limit(1);

    if (existingSubscription[0]?.stripeCustomerId) {
      logBillingAction('Using existing customer', { 
        customerId: existingSubscription[0].stripeCustomerId 
      });
      return existingSubscription[0].stripeCustomerId;
    }

    // Create new customer
    const customer = await createCustomer({ userId, email, name });
    return customer.id;

  } catch (error) {
    logBillingAction('Get/create customer failed', { error: (error as Error).message });
    throw error;
  }
}

/**
 * Update customer details
 */
export async function updateCustomer(
  customerId: string,
  params: Partial<CreateCustomerParams>
): Promise<Stripe.Customer> {
  try {
    logBillingAction('Updating customer', { customerId });

    const customer = await stripe.customers.update(customerId, {
      email: params.email,
      name: params.name,
      phone: params.phone,
      metadata: params.metadata,
    });

    logBillingAction('Customer updated successfully', { customerId });
    return customer;

  } catch (error) {
    logBillingAction('Customer update failed', { error: (error as Error).message });
    throw error;
  }
}

// ============================================
// SUBSCRIPTION MANAGEMENT
// ============================================

export interface CreateSubscriptionParams {
  userId: string;
  customerId: string;
  priceId: string;
  planName: string;
  planType: 'monthly' | 'yearly';
  trialDays?: number;
  metadata?: Record<string, string>;
}

/**
 * Create a new subscription
 * @param params Subscription parameters
 * @returns Subscription details
 */
export async function createSubscription(params: CreateSubscriptionParams) {
  try {
    logBillingAction('Creating subscription', {
      userId: params.userId,
      planName: params.planName,
    });

    // Create Stripe subscription
    const stripeSubscription = await stripe.subscriptions.create({
      customer: params.customerId,
      items: [{ price: params.priceId }],
      trial_period_days: params.trialDays,
      payment_behavior: 'default_incomplete',
      payment_settings: { save_default_payment_method: 'on_subscription' },
      expand: ['latest_invoice.payment_intent'],
      metadata: {
        userId: params.userId,
        planName: params.planName,
        createdAt: nowUKFormatted(),
        ...params.metadata,
      },
    });

    const currentPeriodStart = new Date((stripeSubscription as any).current_period_start * 1000);
    const currentPeriodEnd = new Date((stripeSubscription as any).current_period_end * 1000);
    const trialStart = stripeSubscription.trial_start 
      ? new Date(stripeSubscription.trial_start * 1000) 
      : null;
    const trialEnd = stripeSubscription.trial_end 
      ? new Date(stripeSubscription.trial_end * 1000) 
      : null;

    // Save to database with UK timestamps
    const [dbSubscription] = await db.insert(subscriptions).values({
      userId: params.userId,
      stripeSubscriptionId: stripeSubscription.id,
      stripePriceId: params.priceId,
      stripeCustomerId: params.customerId,
      planName: params.planName,
      planType: params.planType,
      status: stripeSubscription.status,
      currentPeriodStart: formatDateUK(currentPeriodStart),
      currentPeriodEnd: formatDateUK(currentPeriodEnd),
      trialStart: trialStart ? formatDateUK(trialStart) : null,
      trialEnd: trialEnd ? formatDateUK(trialEnd) : null,
      amount: (stripeSubscription.items.data[0].price.unit_amount || 0) / 100,
      currency: stripeSubscription.currency.toUpperCase(),
      interval: stripeSubscription.items.data[0].price.recurring?.interval || 'month',
      intervalCount: stripeSubscription.items.data[0].price.recurring?.interval_count || 1,
      cancelAtPeriodEnd: false,
      metadata: JSON.stringify(params.metadata || {}),
      createdAt: nowUKFormatted(),
      updatedAt: nowUKFormatted(),
    }).returning();

    logBillingAction('Subscription created successfully', {
      subscriptionId: stripeSubscription.id,
      status: stripeSubscription.status,
    });

    return {
      subscription: dbSubscription,
      stripeSubscription,
      clientSecret: (stripeSubscription.latest_invoice as any)?.payment_intent?.client_secret,
    };

  } catch (error) {
    logBillingAction('Subscription creation failed', { error: (error as Error).message });
    throw error;
  }
}

/**
 * Update subscription
 */
export async function updateSubscription(
  subscriptionId: string,
  updates: {
    priceId?: string;
    cancelAtPeriodEnd?: boolean;
    prorationBehavior?: 'always_invoice' | 'create_prorations' | 'none';
  }
) {
  try {
    logBillingAction('Updating subscription', { subscriptionId, updates });

    // Get current subscription
    const currentSubscription = await stripe.subscriptions.retrieve(subscriptionId);

    // Prepare update params
    const updateParams: Stripe.SubscriptionUpdateParams = {
      cancel_at_period_end: updates.cancelAtPeriodEnd,
      proration_behavior: updates.prorationBehavior || 'always_invoice',
    };

    // If changing price, update the subscription items
    if (updates.priceId) {
      updateParams.items = [{
        id: currentSubscription.items.data[0].id,
        price: updates.priceId,
      }];
    }

    const stripeSubscription = await stripe.subscriptions.update(subscriptionId, updateParams);

    // Update database with new plan details
    const updateData: any = {
      cancelAtPeriodEnd: stripeSubscription.cancel_at_period_end,
      status: stripeSubscription.status,
      updatedAt: nowUKFormatted(),
    };

    // If price changed, update plan details in database
    if (updates.priceId && stripeSubscription.items.data[0]) {
      const newPrice = stripeSubscription.items.data[0].price;
      updateData.stripePriceId = updates.priceId;
      updateData.amount = (newPrice.unit_amount || 0) / 100;
      updateData.currency = newPrice.currency.toUpperCase();
      updateData.interval = newPrice.recurring?.interval || 'month';
    }

    const [dbSubscription] = await db
      .update(subscriptions)
      .set(updateData)
      .where(eq(subscriptions.stripeSubscriptionId, subscriptionId))
      .returning();

    logBillingAction('Subscription updated successfully', { subscriptionId });
    return stripeSubscription;

  } catch (error) {
    logBillingAction('Subscription update failed', { error: (error as Error).message });
    throw error;
  }
}

/**
 * Cancel subscription
 * @param subscriptionId Stripe subscription ID
 * @param cancelAtPeriodEnd If true, cancel at period end; if false, cancel immediately
 */
export async function cancelSubscription(
  subscriptionId: string,
  cancelAtPeriodEnd: boolean = true
) {
  try {
    logBillingAction('Cancelling subscription', { 
      subscriptionId, 
      cancelAtPeriodEnd 
    });

    let stripeSubscription: Stripe.Subscription;

    if (cancelAtPeriodEnd) {
      // Cancel at period end
      stripeSubscription = await stripe.subscriptions.update(subscriptionId, {
        cancel_at_period_end: true,
      });
    } else {
      // Cancel immediately
      stripeSubscription = await stripe.subscriptions.cancel(subscriptionId);
    }

    // Update database with UK timestamp
    const now = nowUKFormatted();
    const [dbSubscription] = await db
      .update(subscriptions)
      .set({
        status: stripeSubscription.status,
        cancelAtPeriodEnd: cancelAtPeriodEnd,
        cancelledAt: cancelAtPeriodEnd ? null : now,
        updatedAt: now,
      })
      .where(eq(subscriptions.stripeSubscriptionId, subscriptionId))
      .returning();

    logBillingAction('Subscription cancelled successfully', {
      subscriptionId,
      cancelledAt: cancelAtPeriodEnd ? 'At period end' : now,
    });

    return { subscription: dbSubscription, stripeSubscription };

  } catch (error) {
    logBillingAction('Subscription cancellation failed', { error: (error as Error).message });
    throw error;
  }
}

/**
 * Reactivate a cancelled subscription
 */
export async function reactivateSubscription(subscriptionId: string) {
  try {
    logBillingAction('Reactivating subscription', { subscriptionId });

    const stripeSubscription = await stripe.subscriptions.update(subscriptionId, {
      cancel_at_period_end: false,
    });

    const [dbSubscription] = await db
      .update(subscriptions)
      .set({
        status: stripeSubscription.status,
        cancelAtPeriodEnd: false,
        cancelledAt: null,
        updatedAt: nowUKFormatted(),
      })
      .where(eq(subscriptions.stripeSubscriptionId, subscriptionId))
      .returning();

    logBillingAction('Subscription reactivated successfully', { subscriptionId });
    return { subscription: dbSubscription, stripeSubscription };

  } catch (error) {
    logBillingAction('Subscription reactivation failed', { error: (error as Error).message });
    throw error;
  }
}

// ============================================
// INVOICE MANAGEMENT
// ============================================

/**
 * Generate invoice number in format: INV-YYYY-NNNN
 */
async function generateInvoiceNumber(): Promise<string> {
  const year = new Date().getFullYear();
  
  // Get the count of invoices this year
  const existingInvoices = await db
    .select()
    .from(invoices)
    .where(eq(invoices.invoiceNumber, `INV-${year}-%`));
  
  const nextNumber = (existingInvoices.length + 1).toString().padStart(4, '0');
  return `INV-${year}-${nextNumber}`;
}

/**
 * Create invoice from Stripe invoice
 */
export async function createInvoiceFromStripe(
  stripeInvoice: Stripe.Invoice,
  userId: string
) {
  try {
    logBillingAction('Creating invoice from Stripe', { 
      stripeInvoiceId: stripeInvoice.id 
    });

    // Find subscription if exists
    const subscription = (stripeInvoice as any).subscription
      ? await db
          .select()
          .from(subscriptions)
          .where(eq(subscriptions.stripeSubscriptionId, (stripeInvoice as any).subscription as string))
          .limit(1)
      : [];

    const invoiceNumber = await generateInvoiceNumber();
    const now = nowUKFormatted();
    const invoiceDate = formatDateUK(new Date(stripeInvoice.created * 1000));
    const dueDate = stripeInvoice.due_date 
      ? formatDateUK(new Date(stripeInvoice.due_date * 1000))
      : null;
    const paidAt = stripeInvoice.status === 'paid' && stripeInvoice.status_transitions.paid_at
      ? nowUKFormatted()
      : null;

    const [invoice] = await db.insert(invoices).values({
      userId,
      subscriptionId: subscription[0]?.id || null,
      stripeInvoiceId: stripeInvoice.id,
      stripePaymentIntentId: (stripeInvoice as any).payment_intent as string || null,
      invoiceNumber,
      status: stripeInvoice.status || 'draft',
      description: stripeInvoice.description || null,
      amountDue: (stripeInvoice.amount_due || 0) / 100,
      amountPaid: (stripeInvoice.amount_paid || 0) / 100,
      amountRemaining: (stripeInvoice.amount_remaining || 0) / 100,
      currency: stripeInvoice.currency.toUpperCase(),
      taxAmount: ((stripeInvoice as any).tax || 0) / 100,
      subtotal: (stripeInvoice.subtotal || 0) / 100,
      total: (stripeInvoice.total || 0) / 100,
      invoiceDate,
      dueDate,
      paidAt,
      periodStart: stripeInvoice.period_start 
        ? formatDateUK(new Date(stripeInvoice.period_start * 1000))
        : null,
      periodEnd: stripeInvoice.period_end 
        ? formatDateUK(new Date(stripeInvoice.period_end * 1000))
        : null,
      billingReason: stripeInvoice.billing_reason || null,
      customerEmail: stripeInvoice.customer_email || '',
      customerName: stripeInvoice.customer_name || '',
      invoicePdf: stripeInvoice.invoice_pdf || null,
      hostedInvoiceUrl: stripeInvoice.hosted_invoice_url || null,
      metadata: JSON.stringify(stripeInvoice.metadata || {}),
      createdAt: now,
      updatedAt: now,
    }).returning();

    logBillingAction('Invoice created successfully', {
      invoiceNumber,
      stripeInvoiceId: stripeInvoice.id,
    });

    return invoice;

  } catch (error) {
    logBillingAction('Invoice creation failed', { error: (error as Error).message });
    throw error;
  }
}

// ============================================
// WEBHOOK HANDLING
// ============================================

/**
 * Verify Stripe webhook signature
 */
export function verifyWebhookSignature(
  payload: string | Buffer,
  signature: string
): Stripe.Event | null {
  try {
    if (!webhookSecret) {
      logBillingAction('Webhook verification failed', { reason: 'No webhook secret configured' });
      return null;
    }

    const event = stripe.webhooks.constructEvent(payload, signature, webhookSecret);
    
    logBillingAction('Webhook signature verified', { 
      type: event.type,
      id: event.id 
    });

    return event;

  } catch (error) {
    logBillingAction('Webhook signature verification failed', { 
      error: (error as Error).message 
    });
    return null;
  }
}

/**
 * Handle Stripe webhook events
 */
export async function handleWebhook(event: Stripe.Event) {
  const timestamp = nowUKFormatted();
  
  logBillingAction(`Webhook received: ${event.type}`, { 
    eventId: event.id,
    timestamp 
  });

  try {
    switch (event.type) {
      // Checkout events
      case 'checkout.session.completed':
        await handleCheckoutSessionCompleted(event);
        break;

      // Customer events
      case 'customer.created':
      case 'customer.updated':
        await handleCustomerEvent(event);
        break;

      // Subscription events
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event);
        break;

      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event);
        break;

      case 'customer.subscription.trial_will_end':
        await handleTrialWillEnd(event);
        break;

      // Invoice events
      case 'invoice.created':
      case 'invoice.updated':
      case 'invoice.finalized':
        await handleInvoiceEvent(event);
        break;

      case 'invoice.paid':
      case 'invoice.payment_succeeded':
        await handleInvoicePaymentSucceeded(event);
        break;

      case 'invoice.payment_failed':
        await handleInvoicePaymentFailed(event);
        break;

      // Payment events - CRITICAL for payment history
      case 'payment_intent.succeeded':
        await handlePaymentSucceeded(event);
        break;

      case 'payment_intent.payment_failed':
        await handlePaymentFailed(event);
        break;

      case 'payment_intent.created':
        await handlePaymentIntentCreated(event);
        break;

      // Charge events - for refunds and disputes
      case 'charge.succeeded':
        await handleChargeSucceeded(event);
        break;

      case 'charge.failed':
        await handleChargeFailed(event);
        break;

      case 'charge.refunded':
        await handleChargeRefunded(event);
        break;

      default:
        logBillingAction(`Unhandled webhook type: ${event.type}`, { eventId: event.id });
    }

    logBillingAction(`Webhook processed successfully: ${event.type}`, { 
      eventId: event.id,
      timestamp 
    });

    return { success: true, processed: true };

  } catch (error) {
    logBillingAction(`Webhook processing failed: ${event.type}`, {
      error: (error as Error).message,
      eventId: event.id,
    });
    throw error;
  }
}

// Webhook event handlers

async function handleCheckoutSessionCompleted(event: Stripe.Event) {
  const session = event.data.object as Stripe.Checkout.Session;
  const userId = session.metadata?.userId;
  const planId = session.metadata?.planId;

  // Lookup plan details for metadata enrichment
  const plan = planId
    ? await import('@/lib/subscription-plans').then((m) => m.getPlanById(planId))
    : null;

  if (!userId || !planId) {
    logBillingAction('Checkout session skipped', { reason: 'No userId or planId in metadata' });
    return;
  }

  // Check if subscription already exists for this user
  const existingSubscription = await db
    .select()
    .from(subscriptions)
    .where(eq(subscriptions.userId, userId))
    .limit(1);

  if (existingSubscription.length > 0 && existingSubscription[0].status === 'active') {
    logBillingAction('Checkout session: Subscription already active', { userId, planId });
    return;
  }

  // Get the subscription from Stripe
  if (session.subscription) {
    const stripeSubscription = await stripe.subscriptions.retrieve(session.subscription as string, {
      expand: ['latest_invoice']
    });
    
    // Delete any existing inactive subscriptions for this user
    await db
      .delete(subscriptions)
      .where(eq(subscriptions.userId, userId));

    // Create new subscription record
    if (plan) {
      const currentPeriodStart = formatDateUK(new Date((stripeSubscription as any).current_period_start * 1000));
      const currentPeriodEnd = formatDateUK(new Date((stripeSubscription as any).current_period_end * 1000));

      const [newSubscription] = await db.insert(subscriptions).values({
        userId,
        stripeSubscriptionId: stripeSubscription.id,
        stripeCustomerId: stripeSubscription.customer as string,
        stripePriceId: stripeSubscription.items.data[0].price.id,
        planName: plan.name,
        planType: plan.tier,
        status: stripeSubscription.status,
        currentPeriodStart,
        currentPeriodEnd,
        amount: (stripeSubscription.items.data[0].price.unit_amount || 0) / 100,
        currency: stripeSubscription.currency.toUpperCase(),
        interval: stripeSubscription.items.data[0].price.recurring?.interval || 'month',
        intervalCount: stripeSubscription.items.data[0].price.recurring?.interval_count || 1,
        cancelAtPeriodEnd: false,
        createdAt: nowUKFormatted(),
        updatedAt: nowUKFormatted(),
      }).returning();

      logBillingAction('Subscription created from checkout', { 
        userId, 
        planId,
        subscriptionId: stripeSubscription.id 
      });

      // Create invoice record from checkout session
      try {
        if (stripeSubscription.latest_invoice) {
          const latestInvoice = typeof stripeSubscription.latest_invoice === 'string'
            ? await stripe.invoices.retrieve(stripeSubscription.latest_invoice)
            : stripeSubscription.latest_invoice;
          
          // Check if invoice already exists
          const existingInvoice = await db
            .select()
            .from(invoices)
            .where(eq(invoices.stripeInvoiceId, latestInvoice.id))
            .limit(1);

          if (existingInvoice.length === 0) {
            await createInvoiceFromStripe(latestInvoice, userId);
            logBillingAction('Invoice created from checkout session', {
              invoiceId: latestInvoice.id,
              subscriptionId: stripeSubscription.id
            });
          }
        }
      } catch (invoiceError) {
        logBillingAction('Failed to create invoice from checkout', {
          error: (invoiceError as Error).message,
          subscriptionId: stripeSubscription.id
        });
        // Don't throw - subscription is still created successfully
      }
    }
  }

  // Create payment record from checkout session payment intent
  if (session.payment_intent) {
    try {
      const paymentIntent = typeof session.payment_intent === 'string'
        ? await stripe.paymentIntents.retrieve(session.payment_intent, { expand: ['charges'] })
        : session.payment_intent;

      // Ensure payment intent metadata carries required identifiers for DB persistence
      const mergedMetadata = {
        ...paymentIntent.metadata,
        userId,
        role: paymentIntent.metadata?.role || 'owner',
        planId,
        subscriptionPlan: plan?.id || planId || paymentIntent.metadata?.subscriptionPlan,
        subscriptionId: session.subscription as string,
        billingReason: paymentIntent.metadata?.billingReason || 'subscription_checkout',
        checkoutSessionId: session.id,
      } as Record<string, string | null | undefined>;

      // Strip undefined/null to satisfy Stripe metadata requirements
      const sanitizedMetadata = Object.entries(mergedMetadata).reduce<Record<string, string>>((acc, [key, value]) => {
        if (value !== undefined && value !== null) {
          acc[key] = String(value);
        }
        return acc;
      }, {});

      // Update metadata if any new keys are added
      await stripe.paymentIntents.update(paymentIntent.id, { metadata: sanitizedMetadata });
      const refreshed = await stripe.paymentIntents.retrieve(paymentIntent.id, { expand: ['charges'] });

      await createOrUpdatePayment(refreshed, event.id, userId);
      logBillingAction('Payment recorded from checkout.session.completed', {
        paymentIntentId: paymentIntent.id,
        checkoutSessionId: session.id,
      });
    } catch (paymentError) {
      logBillingAction('Failed to record payment from checkout session', {
        error: (paymentError as Error).message,
        sessionId: session.id,
      });
    }
  }
}

async function handleCustomerEvent(event: Stripe.Event) {
  const customer = event.data.object as Stripe.Customer;
  logBillingAction('Customer event', { 
    customerId: customer.id,
    email: customer.email 
  });
}

async function handleSubscriptionUpdated(event: Stripe.Event) {
  const subscription = event.data.object as Stripe.Subscription;
  const userId = subscription.metadata.userId;

  if (!userId) {
    logBillingAction('Subscription update skipped', { reason: 'No userId in metadata' });
    return;
  }

  const currentPeriodStart = formatDateUK(new Date((subscription as any).current_period_start * 1000));
  const currentPeriodEnd = formatDateUK(new Date((subscription as any).current_period_end * 1000));

  // Check if subscription exists in database
  const existing = await db
    .select()
    .from(subscriptions)
    .where(eq(subscriptions.stripeSubscriptionId, subscription.id))
    .limit(1);

  if (existing.length > 0) {
    // Update existing subscription
    await db
      .update(subscriptions)
      .set({
        status: subscription.status,
        currentPeriodStart,
        currentPeriodEnd,
        cancelAtPeriodEnd: subscription.cancel_at_period_end,
        updatedAt: nowUKFormatted(),
      })
      .where(eq(subscriptions.stripeSubscriptionId, subscription.id));

    // Note: Cache revalidation should be called from API routes

    logBillingAction('Subscription updated in database', { 
      subscriptionId: subscription.id,
      status: subscription.status 
    });

    // Revalidate cache after subscription update
    try {
      const { revalidateSubscription } = await import('@/lib/cache');
      await revalidateSubscription(userId);
    } catch (cacheError) {
      logBillingAction('Cache revalidation failed after subscription update', {
        error: (cacheError as Error).message,
      });
    }
  } else {
    logBillingAction('Subscription update skipped - not found in database', { 
      subscriptionId: subscription.id 
    });
  }
}

async function handleSubscriptionDeleted(event: Stripe.Event) {
  const subscription = event.data.object as Stripe.Subscription;
  const userId = subscription.metadata.userId;

  await db
    .update(subscriptions)
    .set({
      status: 'cancelled',
      cancelledAt: nowUKFormatted(),
      updatedAt: nowUKFormatted(),
    })
    .where(eq(subscriptions.stripeSubscriptionId, subscription.id));

  logBillingAction('Subscription deleted', { subscriptionId: subscription.id });
  
  // Downgrade user after cancellation
  if (userId) {
    try {
      const { downgradeAfterCancellation } = await import('@/lib/crm-sync');
      await downgradeAfterCancellation(userId);
      logBillingAction('User downgraded after cancellation', { userId });
    } catch (error) {
      logBillingAction('Failed to downgrade user', { 
        userId, 
        error: (error as Error).message 
      });
    }
  }
}

async function handleTrialWillEnd(event: Stripe.Event) {
  const subscription = event.data.object as Stripe.Subscription;
  logBillingAction('Trial ending soon', { 
    subscriptionId: subscription.id,
    trialEnd: subscription.trial_end 
  });
  // TODO: Send notification email
}

async function handleInvoiceEvent(event: Stripe.Event) {
  const invoice = event.data.object as Stripe.Invoice;
  const userId = (invoice as any).subscription 
    ? (await db
        .select()
        .from(subscriptions)
        .where(eq(subscriptions.stripeSubscriptionId, (invoice as any).subscription as string))
        .limit(1))[0]?.userId
    : null;

  if (userId) {
    // Check if invoice exists
    const existing = await db
      .select()
      .from(invoices)
      .where(eq(invoices.stripeInvoiceId, invoice.id))
      .limit(1);

    if (existing.length === 0) {
      await createInvoiceFromStripe(invoice, userId);
    } else {
      // Update existing invoice
      await db
        .update(invoices)
        .set({
          status: invoice.status || 'draft',
          amountPaid: (invoice.amount_paid || 0) / 100,
          amountRemaining: (invoice.amount_remaining || 0) / 100,
          updatedAt: nowUKFormatted(),
        })
        .where(eq(invoices.stripeInvoiceId, invoice.id));
    }
  }

  logBillingAction('Invoice event processed', { invoiceId: invoice.id });
}

/**
 * Handle invoice.payment_succeeded event
 * Creates comprehensive payment record for subscription/invoice payments
 * Maps all Stripe fields to payments table for admin/owner dashboards
 */
async function handleInvoicePaymentSucceeded(event: Stripe.Event) {
  const invoice = event.data.object as Stripe.Invoice;
  const timestamp = nowUKFormatted();

  logBillingAction('Processing invoice.payment_succeeded', { 
    invoiceId: invoice.id,
    amount: (invoice.amount_paid || 0) / 100,
    subscriptionId: (invoice as any).subscription as string || 'none',
  });

  // Update invoice record
  await db
    .update(invoices)
    .set({
      status: 'paid',
      paidAt: timestamp,
      amountPaid: (invoice.amount_paid || 0) / 100,
      amountRemaining: 0,
      updatedAt: timestamp,
    })
    .where(eq(invoices.stripeInvoiceId, invoice.id));

  logBillingAction('Invoice marked as paid', { invoiceId: invoice.id });
  
  // Get userId from subscription metadata
  const userId = (invoice as any).subscription 
    ? (await db
        .select()
        .from(subscriptions)
        .where(eq(subscriptions.stripeSubscriptionId, (invoice as any).subscription as string))
        .limit(1))[0]?.userId
    : null;

  if (!userId) {
    logBillingAction('No userId found for invoice - skipping payment record', { 
      invoiceId: invoice.id 
    });
    return;
  }

  // Create comprehensive payment record from invoice payment
  if ((invoice as any).payment_intent) {
    try {
      const paymentIntent = typeof (invoice as any).payment_intent === 'string'
        ? await stripe.paymentIntents.retrieve((invoice as any).payment_intent, {
            expand: ['charges', 'customer'],
          })
        : (invoice as any).payment_intent;

      // Enrich metadata with invoice/subscription context
      const enrichedMetadata = {
        ...paymentIntent.metadata,
        userId,
        invoiceId: invoice.id,
        subscriptionId: (invoice as any).subscription as string || null,
        billingReason: (invoice as any).billing_reason || 'subscription_cycle',
        role: 'owner', // All subscription payments are from owners
      };

      // Update payment intent metadata for complete tracking
      const sanitizedMetadata = Object.entries(enrichedMetadata).reduce<Record<string, string>>((acc, [key, value]) => {
        if (value !== undefined && value !== null) {
          acc[key] = String(value);
        }
        return acc;
      }, {});

      await stripe.paymentIntents.update(paymentIntent.id, { metadata: sanitizedMetadata });
      const refreshedIntent = await stripe.paymentIntents.retrieve(paymentIntent.id, { 
        expand: ['charges'] 
      });

      // Create or update payment record with all fields mapped
      await createOrUpdatePayment(refreshedIntent, event.id, userId);
      
      logBillingAction('Payment record created from invoice.payment_succeeded', {
        invoiceId: invoice.id,
        paymentIntentId: paymentIntent.id,
        userId,
        amount: (invoice.amount_paid || 0) / 100,
        billingReason: invoice.billing_reason,
      });
    } catch (error) {
      logBillingAction('Failed to create payment from invoice', {
        error: (error as Error).message,
        invoiceId: invoice.id,
      });
    }
  } else {
    logBillingAction('No payment_intent on invoice - skipping payment record', { 
      invoiceId: invoice.id 
    });
  }
  
  // Sync membership status after successful payment
  if (userId) {
    try {
      const { updateMembershipAfterPayment } = await import('@/lib/crm-sync');
      await updateMembershipAfterPayment(userId, true);
      logBillingAction('Membership status synced after payment', { userId });
    } catch (error) {
      logBillingAction('Failed to sync membership after payment', { 
        userId, 
        error: (error as Error).message 
      });
    }
  }
}

async function handleInvoicePaymentFailed(event: Stripe.Event) {
  const invoice = event.data.object as Stripe.Invoice;

  await db
    .update(invoices)
    .set({
      status: 'open',
      updatedAt: nowUKFormatted(),
    })
    .where(eq(invoices.stripeInvoiceId, invoice.id));

  logBillingAction('Invoice payment failed', { invoiceId: invoice.id });
  
  // Create failed payment record
  if ((invoice as any).payment_intent) {
    try {
      const paymentIntent = typeof (invoice as any).payment_intent === 'string'
        ? await stripe.paymentIntents.retrieve((invoice as any).payment_intent, {
            expand: ['charges'],
          })
        : (invoice as any).payment_intent;

      const failUserId = (invoice as any).subscription 
        ? (await db
            .select()
            .from(subscriptions)
            .where(eq(subscriptions.stripeSubscriptionId, (invoice as any).subscription as string))
            .limit(1))[0]?.userId
        : null;

      if (failUserId && paymentIntent) {
        await createOrUpdatePayment(paymentIntent, event.id, failUserId);
        logBillingAction('Failed payment record created', {
          invoiceId: invoice.id,
          paymentIntentId: paymentIntent.id,
        });
      }
    } catch (error) {
      logBillingAction('Failed to create failed payment record', {
        error: (error as Error).message,
        invoiceId: invoice.id,
      });
    }
  }
  
  // TODO: Send notification email
}

async function handlePaymentIntentCreated(event: Stripe.Event) {
  const paymentIntent = event.data.object as Stripe.PaymentIntent;
  const userId = paymentIntent.metadata?.userId;

  if (userId) {
    await createOrUpdatePayment(paymentIntent, event.id, userId);
    logBillingAction('Payment intent created and tracked', { 
      paymentIntentId: paymentIntent.id 
    });
  }
}

async function handlePaymentSucceeded(event: Stripe.Event) {
  const paymentIntent = event.data.object as Stripe.PaymentIntent;
  const userId = paymentIntent.metadata?.userId;

  if (userId) {
    await createOrUpdatePayment(paymentIntent, event.id, userId);
    logBillingAction('Payment succeeded and tracked', { 
      paymentIntentId: paymentIntent.id 
    });
  } else {
    logBillingAction('Payment succeeded but no userId found', { 
      paymentIntentId: paymentIntent.id 
    });
  }
}

async function handlePaymentFailed(event: Stripe.Event) {
  const paymentIntent = event.data.object as Stripe.PaymentIntent;
  const userId = paymentIntent.metadata?.userId;

  if (userId) {
    await createOrUpdatePayment(paymentIntent, event.id, userId);
    logBillingAction('Payment failed and tracked', { 
      paymentIntentId: paymentIntent.id 
    });
  }
  // TODO: Send notification email
}

async function handleChargeSucceeded(event: Stripe.Event) {
  const charge = event.data.object as Stripe.Charge;
  
  logBillingAction('Processing charge.succeeded', {
    chargeId: charge.id,
    amount: charge.amount / 100,
    paymentIntent: charge.payment_intent as string || 'none',
  });
  
  // Update payment record with charge details if payment exists
  if (charge.payment_intent) {
    try {
      const payment = await db
        .select()
        .from(payments)
        .where(eq(payments.stripePaymentIntentId, charge.payment_intent as string))
        .limit(1);

      if (payment.length > 0) {
        await db
          .update(payments)
          .set({
            stripeChargeId: charge.id,
            receiptUrl: charge.receipt_url || null,
            networkStatus: (charge.outcome as any)?.network_status || null,
            riskLevel: (charge.outcome as any)?.risk_level || null,
            riskScore: (charge.outcome as any)?.risk_score || null,
            updatedAt: nowUKFormatted(),
          })
          .where(eq(payments.id, payment[0].id));

        logBillingAction('Payment updated with charge details', {
          chargeId: charge.id,
          paymentId: payment[0].id,
        });
      }
    } catch (error) {
      logBillingAction('Failed to update payment with charge', {
        error: (error as Error).message,
        chargeId: charge.id,
      });
    }
  }
}

/**
 * Handle charge.failed event
 * Track failed charges for monitoring
 */
async function handleChargeFailed(event: Stripe.Event) {
  const charge = event.data.object as Stripe.Charge;
  
  logBillingAction('Processing charge.failed', {
    chargeId: charge.id,
    amount: charge.amount / 100,
    failureCode: charge.failure_code,
    failureMessage: charge.failure_message,
  });
  
  // Payment record should already exist from payment_intent.payment_failed
  // Just log for monitoring
  if (charge.payment_intent) {
    const payment = await db
      .select()
      .from(payments)
      .where(eq(payments.stripePaymentIntentId, charge.payment_intent as string))
      .limit(1);
    
    if (payment.length > 0) {
      logBillingAction('Failed charge linked to payment record', {
        paymentId: payment[0].id,
        status: payment[0].paymentStatus,
      });
    }
  }
}

async function handleChargeRefunded(event: Stripe.Event) {
  const charge = event.data.object as Stripe.Charge;
  
  // Get the refund details
  if (charge.refunds && charge.refunds.data.length > 0) {
    const latestRefund = charge.refunds.data[0];
    await recordRefund(charge.id, latestRefund, event.id);
  }
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Get subscription by user ID
 */
export async function getUserSubscription(userId: string) {
  const result = await db
    .select()
    .from(subscriptions)
    .where(eq(subscriptions.userId, userId))
    .limit(1);

  return result[0] || null;
}

/**
 * Get invoices for user
 */
export async function getUserInvoices(userId: string) {
  return await db
    .select()
    .from(invoices)
    .where(eq(invoices.userId, userId));
}

/**
 * Get active subscriptions count
 */
export async function getActiveSubscriptionsCount(): Promise<number> {
  const result = await db
    .select()
    .from(subscriptions)
    .where(eq(subscriptions.status, 'active'));

  return result.length;
}

/**
 * Get total revenue (from paid invoices)
 */
export async function getTotalRevenue(): Promise<number> {
  const paidInvoices = await db
    .select()
    .from(invoices)
    .where(eq(invoices.status, 'paid'));

  return paidInvoices.reduce((total, invoice) => total + (invoice.total || 0), 0);
}

// ============================================
// PAYMENT TRACKING
// ============================================

/**
 * Create or update payment record from Stripe Payment Intent
 * Ensures idempotency using stripe_event_id
 */
export async function createOrUpdatePayment(
  paymentIntent: Stripe.PaymentIntent,
  eventId: string,
  userId?: string
) {
  try {
    logBillingAction('Creating/updating payment record', {
      paymentIntentId: paymentIntent.id,
      eventId,
    });

    // Check if payment already exists (idempotency)
    const existingPayment = await db
      .select()
      .from(payments)
      .where(eq(payments.stripePaymentIntentId, paymentIntent.id))
      .limit(1);

    const now = nowUKFormatted();
    
    // Get user ID from metadata if not provided
    const paymentUserId = userId || paymentIntent.metadata?.userId;
    
    if (!paymentUserId) {
      logBillingAction('Payment record skipped - no userId', {
        paymentIntentId: paymentIntent.id,
      });
      return null;
    }

    // Extract payment method details
    const charge = (paymentIntent as any).charges?.data[0];
    const paymentMethod = charge?.payment_method_details;
    
    // Get related invoice ID if exists
    const relatedInvoice = (paymentIntent as any).invoice
      ? await db
          .select()
          .from(invoices)
          .where(eq(invoices.stripeInvoiceId, (paymentIntent as any).invoice as string))
          .limit(1)
      : [];

    // Get related subscription ID if exists
    const relatedSubscription = paymentIntent.metadata?.subscriptionId
      ? await db
          .select()
          .from(subscriptions)
          .where(eq(subscriptions.stripeSubscriptionId, paymentIntent.metadata.subscriptionId))
          .limit(1)
      : [];

    const paymentData = {
      userId: paymentUserId,
      stripeCustomerId: paymentIntent.customer as string || null,
      stripePaymentIntentId: paymentIntent.id,
      stripeChargeId: charge?.id || null,
      stripeInvoiceId: (paymentIntent as any).invoice as string || null,
      stripeSubscriptionId: paymentIntent.metadata?.subscriptionId || null,
      stripeSessionId: paymentIntent.metadata?.checkoutSessionId || null,
      subscriptionPlan: paymentIntent.metadata?.subscriptionPlan || paymentIntent.metadata?.planId || null,
      userRole: paymentIntent.metadata?.role || paymentIntent.metadata?.userRole || 'owner',
      amount: paymentIntent.amount / 100, // Convert from cents
      currency: paymentIntent.currency.toUpperCase(),
      paymentStatus: paymentIntent.status,
      paymentMethod: paymentMethod?.type || null,
      paymentMethodBrand: (paymentMethod as any)?.card?.brand || null,
      paymentMethodLast4: (paymentMethod as any)?.card?.last4 || null,
      description: paymentIntent.description || null,
      billingReason: paymentIntent.metadata?.billingReason || null,
      receiptUrl: charge?.receipt_url || null,
      receiptEmail: paymentIntent.receipt_email || null,
      invoiceId: relatedInvoice[0]?.id || null,
      subscriptionId: relatedSubscription[0]?.id || null,
      failureCode: (paymentIntent as any).last_payment_error?.code || null,
      failureMessage: (paymentIntent as any).last_payment_error?.message || null,
      networkStatus: (charge as any)?.outcome?.network_status || null,
      riskLevel: (charge as any)?.outcome?.risk_level || null,
      riskScore: (charge as any)?.outcome?.risk_score || null,
      metadata: JSON.stringify(paymentIntent.metadata || {}),
      stripeEventId: eventId,
      processedAt: now,
      updatedAt: now,
    };

    if (existingPayment.length > 0) {
      // Update existing payment
      const [updated] = await db
        .update(payments)
        .set(paymentData)
        .where(eq(payments.id, existingPayment[0].id))
        .returning();

      logBillingAction('Payment record updated', {
        paymentId: updated.id,
        paymentIntentId: paymentIntent.id,
      });

      // Revalidate cache after payment update
      try {
        const { revalidatePayment } = await import('@/lib/cache');
        await revalidatePayment(paymentUserId);
      } catch (cacheError) {
        logBillingAction('Cache revalidation failed after payment update', {
          error: (cacheError as Error).message,
        });
      }

      return updated;
    } else {
      // Create new payment
      const [created] = await db
        .insert(payments)
        .values({
          ...paymentData,
          createdAt: now,
        })
        .returning();

      logBillingAction('Payment record created', {
        paymentId: created.id,
        paymentIntentId: paymentIntent.id,
      });

      // Revalidate cache after payment creation
      try {
        const { revalidatePayment } = await import('@/lib/cache');
        await revalidatePayment(paymentUserId);
      } catch (cacheError) {
        logBillingAction('Cache revalidation failed after payment creation', {
          error: (cacheError as Error).message,
        });
      }

      return created;
    }
  } catch (error) {
    logBillingAction('Payment record creation/update failed', {
      error: (error as Error).message,
      paymentIntentId: paymentIntent.id,
    });
    throw error;
  }
}

/**
 * Record refund in payment
 */
export async function recordRefund(
  chargeId: string,
  refund: Stripe.Refund,
  eventId: string
) {
  try {
    logBillingAction('Recording refund', {
      chargeId,
      refundId: refund.id,
    });

    // Find payment by charge ID
    const payment = await db
      .select()
      .from(payments)
      .where(eq(payments.stripeChargeId, chargeId))
      .limit(1);

    if (payment.length === 0) {
      logBillingAction('Refund skipped - payment not found', { chargeId });
      return null;
    }

    const refundAmount = refund.amount / 100;
    const currentRefundAmount = payment[0].refundAmount || 0;
    const totalRefundAmount = currentRefundAmount + refundAmount;
    const isFullyRefunded = totalRefundAmount >= payment[0].amount;

    const [updated] = await db
      .update(payments)
      .set({
        refundAmount: totalRefundAmount,
        refundedAt: nowUKFormatted(),
        refundReason: refund.reason || null,
        paymentStatus: isFullyRefunded ? 'refunded' : 'partially_refunded',
        stripeEventId: eventId,
        updatedAt: nowUKFormatted(),
      })
      .where(eq(payments.id, payment[0].id))
      .returning();

    logBillingAction('Refund recorded successfully', {
      paymentId: updated.id,
      refundAmount,
      totalRefundAmount,
    });

    return updated;
  } catch (error) {
    logBillingAction('Refund recording failed', {
      error: (error as Error).message,
      chargeId,
    });
    throw error;
  }
}

/**
 * Get all payments for a user
 */
export async function getUserPayments(userId: string, limit: number = 100) {
  try {
    const userPayments = await db
      .select()
      .from(payments)
      .where(eq(payments.userId, userId))
      .orderBy(desc(payments.createdAt))
      .limit(limit);

    return userPayments;
  } catch (error) {
    logBillingAction('Failed to get user payments', {
      error: (error as Error).message,
      userId,
    });
    throw error;
  }
}

/**
 * Sync payment from Stripe Payment Intent
 * Used for manual sync or recovery
 */
export async function syncPaymentFromStripe(
  paymentIntentId: string,
  userId: string
) {
  try {
    logBillingAction('Syncing payment from Stripe', { paymentIntentId });

    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId, {
      expand: ['charges', 'invoice'],
    });

    return await createOrUpdatePayment(paymentIntent, 'manual_sync', userId);
  } catch (error) {
    logBillingAction('Payment sync failed', {
      error: (error as Error).message,
      paymentIntentId,
    });
    throw error;
  }
}

/**
 * Sync all payments for a user from Stripe
 * Fallback mechanism to ensure all payments are captured
 */
export async function syncAllUserPayments(userId: string) {
  try {
    logBillingAction('Syncing all payments for user', { userId });

    // Get user's Stripe customer ID
    const userSubscription = await getUserSubscription(userId);
    if (!userSubscription?.stripeCustomerId) {
      logBillingAction('No Stripe customer found for user', { userId });
      return { synced: 0, errors: [] };
    }

    // Fetch all payment intents for this customer
    const paymentIntents = await stripe.paymentIntents.list({
      customer: userSubscription.stripeCustomerId,
      limit: 100,
    });

    let synced = 0;
    const errors: string[] = [];

    for (const paymentIntent of paymentIntents.data) {
      try {
        await createOrUpdatePayment(paymentIntent, 'bulk_sync', userId);
        synced++;
      } catch (error) {
        errors.push(`${paymentIntent.id}: ${(error as Error).message}`);
      }
    }

    logBillingAction('Bulk payment sync completed', {
      userId,
      synced,
      errors: errors.length,
    });

    return { synced, errors };
  } catch (error) {
    logBillingAction('Bulk payment sync failed', {
      error: (error as Error).message,
      userId,
    });
    throw error;
  }
}
