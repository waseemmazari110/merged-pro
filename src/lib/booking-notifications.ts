/**
 * Booking Notifications Service
 * Handles all email notifications for booking lifecycle
 * 
 * STEP 2.4 - Booking Notifications
 */

import { db } from '@/db';
import { properties, user } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { sendGmailEmail } from './gmail-smtp';
import {
  generateBookingConfirmationHTML,
  generateBookingConfirmationText,
} from './email-templates/booking-confirmation';
import {
  generateBookingCancellationHTML,
  generateBookingCancellationText,
} from './email-templates/booking-cancellation';
import {
  generateOwnerNotificationHTML,
  generateOwnerNotificationText,
} from './email-templates/owner-notification';

// Email configuration
const FROM_EMAIL = process.env.GMAIL_USER || 'noreply@groupescapehouses.co.uk';
const FROM_NAME = 'Group Escape Houses';

interface BookingConfirmationParams {
  bookingId: number;
  guestName: string;
  guestEmail: string;
  propertyId: number;
  propertyName: string;
  checkInDate: string;
  checkOutDate: string;
  numberOfGuests: number;
  totalPrice: number;
  depositAmount: number;
  depositPaid: boolean;
  balanceAmount: number;
  balanceDueDate?: string;
  specialRequests?: string;
}

interface BookingCancellationParams {
  bookingId: number;
  guestName: string;
  guestEmail: string;
  propertyName: string;
  checkInDate: string;
  checkOutDate: string;
  cancellationReason?: string;
  refundAmount?: number;
  refundStatus?: 'processing' | 'completed' | 'none';
}

interface OwnerNotificationParams {
  bookingId: number;
  propertyId: number;
  propertyName: string;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  checkInDate: string;
  checkOutDate: string;
  numberOfGuests: number;
  totalPrice: number;
  depositAmount: number;
  depositPaid: boolean;
  specialRequests?: string;
  occasion?: string;
}

/**
 * Send booking confirmation email to guest
 */
export async function sendBookingConfirmationEmail(
  params: BookingConfirmationParams
): Promise<{ success: boolean; error?: string }> {
  try {
    const htmlContent = generateBookingConfirmationHTML({
      bookingId: params.bookingId,
      guestName: params.guestName,
      propertyName: params.propertyName,
      checkInDate: params.checkInDate,
      checkOutDate: params.checkOutDate,
      numberOfGuests: params.numberOfGuests,
      totalPrice: params.totalPrice,
      depositAmount: params.depositAmount,
      depositPaid: params.depositPaid,
      balanceAmount: params.balanceAmount,
      balanceDueDate: params.balanceDueDate,
      specialRequests: params.specialRequests,
    });

    const subject = params.depositPaid
      ? `✅ Booking Confirmed - ${params.propertyName} (Ref: #${params.bookingId})`
      : `📋 Booking Received - ${params.propertyName} (Ref: #${params.bookingId})`;

    await sendGmailEmail({
      to: params.guestEmail,
      subject,
      html: htmlContent,
    });

    console.log(`✅ Booking confirmation email sent to ${params.guestEmail} for booking #${params.bookingId}`);

    return { success: true };
  } catch (error) {
    console.error('Failed to send booking confirmation email:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Send booking cancellation email to guest
 */
export async function sendBookingCancellationEmail(
  params: BookingCancellationParams
): Promise<{ success: boolean; error?: string }> {
  try {
    const htmlContent = generateBookingCancellationHTML({
      bookingId: params.bookingId,
      guestName: params.guestName,
      propertyName: params.propertyName,
      checkInDate: params.checkInDate,
      checkOutDate: params.checkOutDate,
      cancellationReason: params.cancellationReason,
      refundAmount: params.refundAmount,
      refundStatus: params.refundStatus,
    });

    await sendGmailEmail({
      to: params.guestEmail,
      subject: `❌ Booking Cancelled - ${params.propertyName} (Ref: #${params.bookingId})`,
      html: htmlContent,
    });

    console.log(`✅ Booking cancellation email sent to ${params.guestEmail} for booking #${params.bookingId}`);

    return { success: true };
  } catch (error) {
    console.error('Failed to send booking cancellation email:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Send new booking notification to property owner
 */
export async function sendOwnerBookingNotification(
  params: OwnerNotificationParams
): Promise<{ success: boolean; error?: string }> {
  try {
    // Get property owner email
    const property = await db
      .select({
        ownerId: properties.ownerId,
      })
      .from(properties)
      .where(eq(properties.id, params.propertyId))
      .limit(1);

    if (property.length === 0 || !property[0].ownerId) {
      console.warn(`Property ${params.propertyId} has no owner assigned. Skipping owner notification.`);
      return {
        success: false,
        error: 'Property has no owner assigned',
      };
    }

    // Get owner email
    const owner = await db
      .select({
        email: user.email,
        name: user.name,
      })
      .from(user)
      .where(eq(user.id, property[0].ownerId))
      .limit(1);

    if (owner.length === 0) {
      console.warn(`Owner ${property[0].ownerId} not found. Skipping notification.`);
      return {
        success: false,
        error: 'Owner not found',
      };
    }

    const htmlContent = generateOwnerNotificationHTML({
      bookingId: params.bookingId,
      propertyName: params.propertyName,
      guestName: params.guestName,
      guestEmail: params.guestEmail,
      guestPhone: params.guestPhone,
      checkInDate: params.checkInDate,
      checkOutDate: params.checkOutDate,
      numberOfGuests: params.numberOfGuests,
      totalPrice: params.totalPrice,
      depositAmount: params.depositAmount,
      depositPaid: params.depositPaid,
      specialRequests: params.specialRequests,
      occasion: params.occasion,
    });

    await sendGmailEmail({
      to: owner[0].email,
      subject: `🎉 New Booking for ${params.propertyName} (Ref: #${params.bookingId})`,
      html: htmlContent,
    });

    console.log(`✅ Owner notification sent to ${owner[0].email} for booking #${params.bookingId}`);

    return { success: true };
  } catch (error) {
    console.error('Failed to send owner notification:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Send all notifications for a new booking
 * Combines guest confirmation + owner notification
 */
export async function sendNewBookingNotifications(
  params: BookingConfirmationParams & {
    guestPhone: string;
    occasion?: string;
  }
): Promise<{
  guestEmailSent: boolean;
  ownerEmailSent: boolean;
  errors?: string[];
}> {
  const errors: string[] = [];

  // Send guest confirmation
  const guestResult = await sendBookingConfirmationEmail(params);
  if (!guestResult.success && guestResult.error) {
    errors.push(`Guest email: ${guestResult.error}`);
  }

  // Send owner notification
  const ownerResult = await sendOwnerBookingNotification({
    bookingId: params.bookingId,
    propertyId: params.propertyId,
    propertyName: params.propertyName,
    guestName: params.guestName,
    guestEmail: params.guestEmail,
    guestPhone: params.guestPhone,
    checkInDate: params.checkInDate,
    checkOutDate: params.checkOutDate,
    numberOfGuests: params.numberOfGuests,
    totalPrice: params.totalPrice,
    depositAmount: params.depositAmount,
    depositPaid: params.depositPaid,
    specialRequests: params.specialRequests,
    occasion: params.occasion,
  });

  if (!ownerResult.success && ownerResult.error) {
    errors.push(`Owner email: ${ownerResult.error}`);
  }

  return {
    guestEmailSent: guestResult.success,
    ownerEmailSent: ownerResult.success,
    errors: errors.length > 0 ? errors : undefined,
  };
}

/**
 * Send payment confirmation email when deposit/balance is paid
 */
export async function sendPaymentConfirmationEmail(
  params: BookingConfirmationParams & { paymentType: 'deposit' | 'balance' }
): Promise<{ success: boolean; error?: string }> {
  try {
    const htmlContent = generateBookingConfirmationHTML({
      bookingId: params.bookingId,
      guestName: params.guestName,
      propertyName: params.propertyName,
      checkInDate: params.checkInDate,
      checkOutDate: params.checkOutDate,
      numberOfGuests: params.numberOfGuests,
      totalPrice: params.totalPrice,
      depositAmount: params.depositAmount,
      depositPaid: params.depositPaid,
      balanceAmount: params.balanceAmount,
      balanceDueDate: params.balanceDueDate,
      specialRequests: params.specialRequests,
    });

    const subject =
      params.paymentType === 'deposit'
        ? `✅ Deposit Payment Received - ${params.propertyName} (Ref: #${params.bookingId})`
        : `✅ Balance Payment Received - ${params.propertyName} (Ref: #${params.bookingId})`;

    await sendGmailEmail({
      to: params.guestEmail,
      subject,
      html: htmlContent,
    });

    console.log(`✅ Payment confirmation email sent to ${params.guestEmail} for booking #${params.bookingId}`);

    return { success: true };
  } catch (error) {
    console.error('Failed to send payment confirmation email:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
