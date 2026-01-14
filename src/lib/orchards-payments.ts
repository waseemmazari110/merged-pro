/**
 * MILESTONE 10: ORCHARDS PAYMENT INTEGRATION
 * 
 * Complete payment processing integration with Orchards
 * - Payment URL generation
 * - Payment tracking and webhooks
 * - Deposit and balance payments
 * - Refunds and cancellations
 * - UK timestamps throughout
 */

import { db } from '@/db';
import { orchardsPayments, bookings } from '@/db/schema';
import { eq, and, desc } from 'drizzle-orm';
import { formatUKTimestamp } from './public-listings';

// ============================================
// TYPES & INTERFACES
// ============================================

export type PaymentType = 'deposit' | 'balance' | 'full';
export type PaymentStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'refunded' | 'cancelled';

export interface OrchardsPaymentConfig {
  apiKey: string;
  apiSecret: string;
  merchantId: string;
  baseUrl: string;
  webhookSecret: string;
}

export interface CreatePaymentData {
  bookingId: number;
  paymentType: PaymentType;
  amount: number;
  currency?: string;
  customerEmail: string;
  customerName: string;
  description: string;
  metadata?: Record<string, any>;
}

export interface OrchardsPaymentResponse {
  success: boolean;
  transactionId: string;
  paymentUrl: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  expiresAt?: string;
  metadata?: Record<string, any>;
}

export interface PaymentWebhookData {
  transactionId: string;
  status: PaymentStatus;
  amount: number;
  currency: string;
  paidAt?: string;
  failureReason?: string;
  metadata?: Record<string, any>;
}

// ============================================
// ORCHARDS API CLIENT
// ============================================

/**
 * Get Orchards configuration
 * In production, these should be environment variables
 */
function getOrchardsConfig(): OrchardsPaymentConfig {
  return {
    apiKey: process.env.ORCHARDS_API_KEY || '',
    apiSecret: process.env.ORCHARDS_API_SECRET || '',
    merchantId: process.env.ORCHARDS_MERCHANT_ID || '',
    baseUrl: process.env.ORCHARDS_BASE_URL || 'https://api.orchards.io',
    webhookSecret: process.env.ORCHARDS_WEBHOOK_SECRET || '',
  };
}

/**
 * Generate payment signature (for API authentication)
 */
function generateSignature(payload: string, secret: string): string {
  // In production, use proper HMAC-SHA256 signing
  // This is a placeholder implementation
  const crypto = require('crypto');
  return crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex');
}

/**
 * Make API request to Orchards
 */
async function orchardsApiRequest(
  endpoint: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE',
  data?: any
): Promise<any> {
  const config = getOrchardsConfig();
  const url = `${config.baseUrl}${endpoint}`;
  
  const payload = JSON.stringify(data || {});
  const signature = generateSignature(payload, config.apiSecret);

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'X-Merchant-Id': config.merchantId,
    'X-API-Key': config.apiKey,
    'X-Signature': signature,
  };

  try {
    const response = await fetch(url, {
      method,
      headers,
      body: method !== 'GET' ? payload : undefined,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Orchards API error: ${response.status}`);
    }

    return await response.json();
  } catch (error: any) {
    console.error('Orchards API request failed:', error);
    throw new Error(`Payment processing failed: ${error.message}`);
  }
}

// ============================================
// PAYMENT CREATION
// ============================================

/**
 * Create payment with Orchards
 */
export async function createOrchardsPayment(data: CreatePaymentData): Promise<OrchardsPaymentResponse> {
  // Get booking details
  const booking = await db
    .select()
    .from(bookings)
    .where(eq(bookings.id, data.bookingId))
    .limit(1);

  if (booking.length === 0) {
    throw new Error('Booking not found');
  }

  // Create payment record in database
  const now = formatUKTimestamp();
  const [payment] = await db.insert(orchardsPayments).values({
    bookingId: data.bookingId,
    paymentType: data.paymentType,
    amount: data.amount,
    currency: data.currency || 'GBP',
    status: 'pending',
    metadata: data.metadata ? JSON.stringify(data.metadata) : null,
    createdAt: now,
    updatedAt: now,
  }).returning();

  // Call Orchards API to create payment
  try {
    const orchardsResponse = await orchardsApiRequest('/v1/payments', 'POST', {
      amount: data.amount * 100, // Convert to pence
      currency: data.currency || 'GBP',
      customer_email: data.customerEmail,
      customer_name: data.customerName,
      description: data.description,
      reference: `BOOKING-${data.bookingId}-${payment.id}`,
      metadata: {
        bookingId: data.bookingId,
        paymentType: data.paymentType,
        paymentId: payment.id,
        ...data.metadata,
      },
      return_url: `${process.env.NEXT_PUBLIC_BASE_URL}/booking/confirmation?bookingId=${data.bookingId}`,
      webhook_url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/webhooks/orchards`,
    });

    // Update payment record with Orchards response
    await db
      .update(orchardsPayments)
      .set({
        orchardsTransactionId: orchardsResponse.transaction_id,
        orchardsPaymentUrl: orchardsResponse.payment_url,
        status: 'pending',
        metadata: JSON.stringify({
          ...data.metadata,
          orchardsResponse,
        }),
        updatedAt: formatUKTimestamp(),
      })
      .where(eq(orchardsPayments.id, payment.id));

    return {
      success: true,
      transactionId: orchardsResponse.transaction_id,
      paymentUrl: orchardsResponse.payment_url,
      amount: data.amount,
      currency: data.currency || 'GBP',
      status: 'pending',
      expiresAt: orchardsResponse.expires_at,
      metadata: orchardsResponse.metadata,
    };
  } catch (error: any) {
    // Mark payment as failed
    await db
      .update(orchardsPayments)
      .set({
        status: 'failed',
        failureReason: error.message,
        updatedAt: formatUKTimestamp(),
      })
      .where(eq(orchardsPayments.id, payment.id));

    throw error;
  }
}

/**
 * Create deposit payment
 */
export async function createDepositPayment(
  bookingId: number,
  depositAmount: number,
  customerEmail: string,
  customerName: string
): Promise<OrchardsPaymentResponse> {
  return createOrchardsPayment({
    bookingId,
    paymentType: 'deposit',
    amount: depositAmount,
    customerEmail,
    customerName,
    description: `Deposit payment for booking #${bookingId}`,
    metadata: {
      type: 'deposit',
    },
  });
}

/**
 * Create balance payment
 */
export async function createBalancePayment(
  bookingId: number,
  balanceAmount: number,
  customerEmail: string,
  customerName: string
): Promise<OrchardsPaymentResponse> {
  return createOrchardsPayment({
    bookingId,
    paymentType: 'balance',
    amount: balanceAmount,
    customerEmail,
    customerName,
    description: `Balance payment for booking #${bookingId}`,
    metadata: {
      type: 'balance',
    },
  });
}

/**
 * Create full payment
 */
export async function createFullPayment(
  bookingId: number,
  totalAmount: number,
  customerEmail: string,
  customerName: string
): Promise<OrchardsPaymentResponse> {
  return createOrchardsPayment({
    bookingId,
    paymentType: 'full',
    amount: totalAmount,
    customerEmail,
    customerName,
    description: `Full payment for booking #${bookingId}`,
    metadata: {
      type: 'full',
    },
  });
}

// ============================================
// PAYMENT TRACKING
// ============================================

/**
 * Get payment by transaction ID
 */
export async function getPaymentByTransactionId(transactionId: string) {
  const result = await db
    .select()
    .from(orchardsPayments)
    .where(eq(orchardsPayments.orchardsTransactionId, transactionId))
    .limit(1);

  if (result.length === 0) return null;

  return {
    ...result[0],
    metadata: result[0].metadata ? JSON.parse(result[0].metadata as string) : null,
  };
}

/**
 * Get payments for booking
 */
export async function getBookingPayments(bookingId: number) {
  const payments = await db
    .select()
    .from(orchardsPayments)
    .where(eq(orchardsPayments.bookingId, bookingId))
    .orderBy(desc(orchardsPayments.createdAt));

  return payments.map(payment => ({
    ...payment,
    metadata: payment.metadata ? JSON.parse(payment.metadata as string) : null,
  }));
}

/**
 * Update payment status
 */
export async function updatePaymentStatus(
  transactionId: string,
  status: PaymentStatus,
  paidAt?: string,
  failureReason?: string
) {
  const now = formatUKTimestamp();

  const updates: any = {
    status,
    updatedAt: now,
  };

  if (paidAt) {
    updates.paidAt = paidAt;
  }

  if (failureReason) {
    updates.failureReason = failureReason;
  }

  // Update payment record
  await db
    .update(orchardsPayments)
    .set(updates)
    .where(eq(orchardsPayments.orchardsTransactionId, transactionId));

  // If payment completed, update booking
  if (status === 'completed') {
    const payment = await getPaymentByTransactionId(transactionId);
    if (payment) {
      await updateBookingPaymentStatus(payment.bookingId, payment.paymentType as PaymentType);
    }
  }

  return { success: true };
}

/**
 * Update booking payment status
 */
async function updateBookingPaymentStatus(bookingId: number, paymentType: PaymentType) {
  const updates: any = {};

  if (paymentType === 'deposit') {
    updates.depositPaid = true;
  } else if (paymentType === 'balance') {
    updates.balancePaid = true;
  } else if (paymentType === 'full') {
    updates.depositPaid = true;
    updates.balancePaid = true;
  }

  if (Object.keys(updates).length > 0) {
    await db
      .update(bookings)
      .set(updates)
      .where(eq(bookings.id, bookingId));
  }
}

// ============================================
// WEBHOOK HANDLING
// ============================================

/**
 * Verify webhook signature
 */
export function verifyWebhookSignature(payload: string, signature: string): boolean {
  const config = getOrchardsConfig();
  const expectedSignature = generateSignature(payload, config.webhookSecret);
  return signature === expectedSignature;
}

/**
 * Handle payment webhook
 */
export async function handlePaymentWebhook(data: PaymentWebhookData) {
  const { transactionId, status, amount, currency, paidAt, failureReason, metadata } = data;

  // Update payment status
  await updatePaymentStatus(
    transactionId,
    status,
    paidAt,
    failureReason
  );

  // Additional actions based on status
  if (status === 'completed') {
    const payment = await getPaymentByTransactionId(transactionId);
    if (payment) {
      // Send confirmation email, update booking status, etc.
      console.log(`Payment completed: ${transactionId} for booking ${payment.bookingId}`);
    }
  } else if (status === 'failed') {
    // Handle failed payment
    console.log(`Payment failed: ${transactionId} - ${failureReason}`);
  }

  return { success: true };
}

// ============================================
// REFUNDS
// ============================================

/**
 * Create refund
 */
export async function createRefund(
  transactionId: string,
  amount: number,
  reason: string
): Promise<{ success: boolean; refundId?: string }> {
  const payment = await getPaymentByTransactionId(transactionId);
  
  if (!payment) {
    throw new Error('Payment not found');
  }

  if (payment.status !== 'completed') {
    throw new Error('Can only refund completed payments');
  }

  try {
    // Call Orchards API to create refund
    const orchardsResponse = await orchardsApiRequest('/v1/refunds', 'POST', {
      transaction_id: transactionId,
      amount: amount * 100, // Convert to pence
      reason,
    });

    // Update payment status
    const now = formatUKTimestamp();
    await db
      .update(orchardsPayments)
      .set({
        status: 'refunded',
        refundedAt: now,
        metadata: JSON.stringify({
          ...(payment.metadata || {}),
          refund: orchardsResponse,
        }),
        updatedAt: now,
      })
      .where(eq(orchardsPayments.orchardsTransactionId, transactionId));

    return {
      success: true,
      refundId: orchardsResponse.refund_id,
    };
  } catch (error: any) {
    console.error('Refund creation failed:', error);
    throw new Error(`Refund failed: ${error.message}`);
  }
}

/**
 * Cancel pending payment
 */
export async function cancelPayment(transactionId: string): Promise<{ success: boolean }> {
  const payment = await getPaymentByTransactionId(transactionId);
  
  if (!payment) {
    throw new Error('Payment not found');
  }

  if (payment.status !== 'pending') {
    throw new Error('Can only cancel pending payments');
  }

  try {
    // Call Orchards API to cancel payment
    await orchardsApiRequest(`/v1/payments/${transactionId}/cancel`, 'POST', {});

    // Update payment status
    await db
      .update(orchardsPayments)
      .set({
        status: 'cancelled',
        updatedAt: formatUKTimestamp(),
      })
      .where(eq(orchardsPayments.orchardsTransactionId, transactionId));

    return { success: true };
  } catch (error: any) {
    console.error('Payment cancellation failed:', error);
    throw new Error(`Cancellation failed: ${error.message}`);
  }
}

/**
 * Get payment status from Orchards
 */
export async function getPaymentStatus(transactionId: string): Promise<PaymentStatus> {
  try {
    const orchardsResponse = await orchardsApiRequest(`/v1/payments/${transactionId}`, 'GET');
    return orchardsResponse.status as PaymentStatus;
  } catch (error: any) {
    console.error('Failed to fetch payment status:', error);
    throw new Error(`Failed to fetch payment status: ${error.message}`);
  }
}

/**
 * Sync payment status with Orchards
 */
export async function syncPaymentStatus(transactionId: string) {
  const status = await getPaymentStatus(transactionId);
  await updatePaymentStatus(transactionId, status);
  return { success: true, status };
}
