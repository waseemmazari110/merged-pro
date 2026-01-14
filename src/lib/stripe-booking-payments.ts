/**
 * Stripe Booking Payment Service
 * Handle payment intents for booking deposits and balances
 * STEP 2.2 - Stripe Integration for Bookings
 */

import Stripe from 'stripe';
import { db } from '@/db';
import { bookings } from '@/db/schema';
import { eq } from 'drizzle-orm';

// Initialize Stripe
const stripeSecretKey = process.env.STRIPE_TEST_KEY || process.env.STRIPE_SECRET_KEY;

if (!stripeSecretKey) {
  throw new Error('Missing Stripe secret key. Set STRIPE_TEST_KEY in environment variables.');
}

export const stripe = new Stripe(stripeSecretKey, {
  apiVersion: '2025-10-29.clover',
  typescript: true,
});

/**
 * Log payment action with timestamp
 */
function logPaymentAction(action: string, details?: any) {
  const timestamp = new Date().toLocaleString('en-GB', { 
    timeZone: 'Europe/London',
    hour12: false 
  });
  console.log(`[${timestamp}] Stripe Booking Payment: ${action}`, details || '');
}

// ============================================
// CUSTOMER MANAGEMENT
// ============================================

export interface CreateBookingCustomerParams {
  guestEmail: string;
  guestName: string;
  guestPhone?: string;
  bookingId: number;
}

/**
 * Create or retrieve Stripe customer for booking guest
 */
export async function getOrCreateBookingCustomer(
  params: CreateBookingCustomerParams
): Promise<string> {
  try {
    logPaymentAction('Getting or creating customer', { 
      email: params.guestEmail,
      bookingId: params.bookingId 
    });

    // Search for existing customer by email
    const existingCustomers = await stripe.customers.list({
      email: params.guestEmail,
      limit: 1,
    });

    if (existingCustomers.data.length > 0) {
      const customerId = existingCustomers.data[0].id;
      logPaymentAction('Existing customer found', { customerId });
      return customerId;
    }

    // Create new customer
    const customer = await stripe.customers.create({
      email: params.guestEmail,
      name: params.guestName,
      phone: params.guestPhone,
      metadata: {
        bookingId: params.bookingId.toString(),
        createdFor: 'booking',
        createdAt: new Date().toISOString(),
      },
    });

    logPaymentAction('New customer created', { customerId: customer.id });
    return customer.id;

  } catch (error) {
    logPaymentAction('Customer creation failed', { error: (error as Error).message });
    throw error;
  }
}

// ============================================
// PAYMENT INTENT CREATION
// ============================================

export interface CreatePaymentIntentParams {
  bookingId: number;
  amount: number; // Amount in GBP
  paymentType: 'deposit' | 'balance';
  guestEmail: string;
  guestName: string;
  guestPhone?: string;
  propertyName: string;
  checkInDate: string;
  checkOutDate: string;
}

export interface PaymentIntentResult {
  paymentIntentId: string;
  clientSecret: string;
  customerId: string;
  amount: number;
  currency: string;
}

/**
 * Create payment intent for booking deposit or balance
 */
export async function createBookingPaymentIntent(
  params: CreatePaymentIntentParams
): Promise<PaymentIntentResult> {
  try {
    logPaymentAction('Creating payment intent', {
      bookingId: params.bookingId,
      paymentType: params.paymentType,
      amount: params.amount,
    });

    // Get or create customer
    const customerId = await getOrCreateBookingCustomer({
      guestEmail: params.guestEmail,
      guestName: params.guestName,
      guestPhone: params.guestPhone,
      bookingId: params.bookingId,
    });

    // Calculate amount in pence (Stripe uses smallest currency unit)
    const amountInPence = Math.round(params.amount * 100);

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInPence,
      currency: 'gbp',
      customer: customerId,
      description: `${params.paymentType === 'deposit' ? 'Deposit' : 'Balance'} payment for ${params.propertyName}`,
      metadata: {
        bookingId: params.bookingId.toString(),
        paymentType: params.paymentType,
        propertyName: params.propertyName,
        checkInDate: params.checkInDate,
        checkOutDate: params.checkOutDate,
        guestEmail: params.guestEmail,
        guestName: params.guestName,
      },
      automatic_payment_methods: {
        enabled: true,
      },
      receipt_email: params.guestEmail,
    });

    // Update booking with payment intent ID
    const fieldToUpdate = params.paymentType === 'deposit' 
      ? 'stripeDepositPaymentIntentId' 
      : 'stripeBalancePaymentIntentId';

    await db
      .update(bookings)
      .set({
        [fieldToUpdate]: paymentIntent.id,
        stripeCustomerId: customerId,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(bookings.id, params.bookingId));

    logPaymentAction('Payment intent created successfully', {
      paymentIntentId: paymentIntent.id,
      clientSecret: paymentIntent.client_secret?.substring(0, 20) + '...',
    });

    return {
      paymentIntentId: paymentIntent.id,
      clientSecret: paymentIntent.client_secret!,
      customerId,
      amount: params.amount,
      currency: 'gbp',
    };

  } catch (error) {
    logPaymentAction('Payment intent creation failed', { 
      error: (error as Error).message 
    });
    throw error;
  }
}

// ============================================
// PAYMENT CONFIRMATION
// ============================================

/**
 * Confirm payment success and update booking
 */
export async function confirmBookingPayment(
  paymentIntentId: string
): Promise<{ success: boolean; bookingId?: number; paymentType?: string }> {
  try {
    logPaymentAction('Confirming payment', { paymentIntentId });

    // Retrieve payment intent from Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status !== 'succeeded') {
      logPaymentAction('Payment not successful', { 
        status: paymentIntent.status,
        paymentIntentId 
      });
      return { success: false };
    }

    // Extract booking info from metadata
    const bookingId = parseInt(paymentIntent.metadata.bookingId);
    const paymentType = paymentIntent.metadata.paymentType as 'deposit' | 'balance';

    if (!bookingId || !paymentType) {
      throw new Error('Missing booking metadata in payment intent');
    }

    // Get current booking
    const booking = await db
      .select()
      .from(bookings)
      .where(eq(bookings.id, bookingId))
      .limit(1);

    if (booking.length === 0) {
      throw new Error(`Booking ${bookingId} not found`);
    }

    // Update booking based on payment type
    const updates: any = {
      updatedAt: new Date().toISOString(),
    };

    if (paymentType === 'deposit') {
      updates.depositPaid = true;
      updates.stripeDepositChargeId = paymentIntent.latest_charge as string;
      
      // Auto-confirm booking when deposit is paid
      if (booking[0].bookingStatus === 'pending') {
        updates.bookingStatus = 'confirmed';
        
        const timestamp = new Date().toLocaleString('en-GB', { 
          timeZone: 'Europe/London',
          hour12: false 
        });
        const existingNotes = booking[0].adminNotes || '';
        updates.adminNotes = existingNotes
          ? `${existingNotes}\n\n[${timestamp}] Deposit paid via Stripe - booking confirmed automatically`
          : `[${timestamp}] Deposit paid via Stripe - booking confirmed automatically`;
      }
    } else {
      updates.balancePaid = true;
      updates.stripeBalanceChargeId = paymentIntent.latest_charge as string;
    }

    await db
      .update(bookings)
      .set(updates)
      .where(eq(bookings.id, bookingId));

    logPaymentAction('Payment confirmed and booking updated', {
      bookingId,
      paymentType,
      status: updates.bookingStatus || booking[0].bookingStatus,
    });

    return {
      success: true,
      bookingId,
      paymentType,
    };

  } catch (error) {
    logPaymentAction('Payment confirmation failed', { 
      error: (error as Error).message 
    });
    throw error;
  }
}

// ============================================
// PAYMENT FAILURE HANDLING
// ============================================

/**
 * Handle payment failure
 */
export async function handlePaymentFailure(
  paymentIntentId: string,
  failureReason?: string
): Promise<void> {
  try {
    logPaymentAction('Handling payment failure', { 
      paymentIntentId,
      reason: failureReason 
    });

    // Retrieve payment intent
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    const bookingId = parseInt(paymentIntent.metadata.bookingId);
    const paymentType = paymentIntent.metadata.paymentType;

    if (!bookingId) {
      throw new Error('No booking ID in payment intent metadata');
    }

    // Get booking
    const booking = await db
      .select()
      .from(bookings)
      .where(eq(bookings.id, bookingId))
      .limit(1);

    if (booking.length === 0) {
      throw new Error(`Booking ${bookingId} not found`);
    }

    // Add note about payment failure
    const timestamp = new Date().toLocaleString('en-GB', { 
      timeZone: 'Europe/London',
      hour12: false 
    });
    const existingNotes = booking[0].adminNotes || '';
    const failureNote = `[${timestamp}] ${paymentType === 'deposit' ? 'Deposit' : 'Balance'} payment failed${failureReason ? ': ' + failureReason : ''}`;
    
    await db
      .update(bookings)
      .set({
        adminNotes: existingNotes 
          ? `${existingNotes}\n\n${failureNote}`
          : failureNote,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(bookings.id, bookingId));

    logPaymentAction('Payment failure recorded', { bookingId, paymentType });

  } catch (error) {
    logPaymentAction('Failed to handle payment failure', { 
      error: (error as Error).message 
    });
    throw error;
  }
}

// ============================================
// REFUNDS
// ============================================

export interface CreateRefundParams {
  bookingId: number;
  chargeId: string;
  amount?: number; // Optional partial refund (in GBP)
  reason?: string;
}

export interface RefundResult {
  refundId: string;
  amount: number;
  status: string;
}

/**
 * Create refund for booking payment
 */
export async function createBookingRefund(
  params: CreateRefundParams
): Promise<RefundResult> {
  try {
    logPaymentAction('Creating refund', {
      bookingId: params.bookingId,
      chargeId: params.chargeId,
      amount: params.amount,
    });

    // Create refund in Stripe
    const refundParams: Stripe.RefundCreateParams = {
      charge: params.chargeId,
      metadata: {
        bookingId: params.bookingId.toString(),
        reason: params.reason || 'Booking cancellation',
      },
    };

    // Add amount if partial refund
    if (params.amount) {
      refundParams.amount = Math.round(params.amount * 100); // Convert to pence
    }

    const refund = await stripe.refunds.create(refundParams);

    // Update booking with refund ID
    const booking = await db
      .select()
      .from(bookings)
      .where(eq(bookings.id, params.bookingId))
      .limit(1);

    if (booking.length > 0) {
      const timestamp = new Date().toLocaleString('en-GB', { 
        timeZone: 'Europe/London',
        hour12: false 
      });
      const existingNotes = booking[0].adminNotes || '';
      const refundNote = `[${timestamp}] Refund issued: £${(refund.amount / 100).toFixed(2)}${params.reason ? ' - ' + params.reason : ''}`;
      
      await db
        .update(bookings)
        .set({
          stripeRefundId: refund.id,
          adminNotes: existingNotes 
            ? `${existingNotes}\n\n${refundNote}`
            : refundNote,
          updatedAt: new Date().toISOString(),
        })
        .where(eq(bookings.id, params.bookingId));
    }

    logPaymentAction('Refund created successfully', {
      refundId: refund.id,
      amount: refund.amount / 100,
      status: refund.status,
    });

    return {
      refundId: refund.id,
      amount: refund.amount / 100,
      status: refund.status || 'pending',
    };

  } catch (error) {
    logPaymentAction('Refund creation failed', { 
      error: (error as Error).message 
    });
    throw error;
  }
}

// ============================================
// RETRIEVE PAYMENT DETAILS
// ============================================

/**
 * Get payment details for a booking
 */
export async function getBookingPaymentDetails(bookingId: number): Promise<{
  deposit?: any;
  balance?: any;
  refunds?: any[];
}> {
  try {
    const booking = await db
      .select()
      .from(bookings)
      .where(eq(bookings.id, bookingId))
      .limit(1);

    if (booking.length === 0) {
      throw new Error(`Booking ${bookingId} not found`);
    }

    const result: any = {};

    // Get deposit payment intent
    if (booking[0].stripeDepositPaymentIntentId) {
      const depositIntent = await stripe.paymentIntents.retrieve(
        booking[0].stripeDepositPaymentIntentId
      );
      result.deposit = {
        paymentIntentId: depositIntent.id,
        amount: depositIntent.amount / 100,
        status: depositIntent.status,
        chargeId: depositIntent.latest_charge,
      };
    }

    // Get balance payment intent
    if (booking[0].stripeBalancePaymentIntentId) {
      const balanceIntent = await stripe.paymentIntents.retrieve(
        booking[0].stripeBalancePaymentIntentId
      );
      result.balance = {
        paymentIntentId: balanceIntent.id,
        amount: balanceIntent.amount / 100,
        status: balanceIntent.status,
        chargeId: balanceIntent.latest_charge,
      };
    }

    // Get refunds if any
    if (booking[0].stripeRefundId) {
      const refund = await stripe.refunds.retrieve(booking[0].stripeRefundId);
      result.refunds = [{
        refundId: refund.id,
        amount: refund.amount / 100,
        status: refund.status,
        reason: refund.reason,
      }];
    }

    return result;

  } catch (error) {
    logPaymentAction('Failed to retrieve payment details', { 
      error: (error as Error).message 
    });
    throw error;
  }
}
