/**
 * Booking Status Lifecycle Management
 * Handle status transitions: pending → confirmed → completed → cancelled
 * STEP 2.1 - Booking Checkout Flow
 */

import { db } from '@/db';
import { bookings } from '@/db/schema';
import { eq } from 'drizzle-orm';

/**
 * Valid booking statuses
 */
export type BookingStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';

/**
 * Status transition rules
 * Defines which status transitions are allowed
 */
const ALLOWED_TRANSITIONS: Record<BookingStatus, BookingStatus[]> = {
  pending: ['confirmed', 'cancelled'],
  confirmed: ['completed', 'cancelled'],
  completed: [], // Final state - no further transitions
  cancelled: [], // Final state - no further transitions
};

export interface StatusTransitionResult {
  success: boolean;
  newStatus?: BookingStatus;
  message?: string;
  error?: string;
}

/**
 * Check if a status transition is allowed
 */
export function isValidTransition(
  currentStatus: BookingStatus,
  newStatus: BookingStatus
): boolean {
  return ALLOWED_TRANSITIONS[currentStatus]?.includes(newStatus) ?? false;
}

/**
 * Get available actions for a booking based on current status
 */
export function getAvailableActions(currentStatus: BookingStatus): Array<{
  action: string;
  label: string;
  newStatus: BookingStatus;
  description: string;
}> {
  const actions: Array<{
    action: string;
    label: string;
    newStatus: BookingStatus;
    description: string;
  }> = [];

  const allowedStatuses = ALLOWED_TRANSITIONS[currentStatus] || [];

  for (const status of allowedStatuses) {
    switch (status) {
      case 'confirmed':
        actions.push({
          action: 'confirm',
          label: 'Confirm Booking',
          newStatus: 'confirmed',
          description: 'Confirm booking after deposit payment received',
        });
        break;
      case 'completed':
        actions.push({
          action: 'complete',
          label: 'Mark as Completed',
          newStatus: 'completed',
          description: 'Mark booking as completed after guest check-out',
        });
        break;
      case 'cancelled':
        actions.push({
          action: 'cancel',
          label: 'Cancel Booking',
          newStatus: 'cancelled',
          description: 'Cancel this booking',
        });
        break;
    }
  }

  return actions;
}

/**
 * Update booking status with validation
 */
export async function updateBookingStatus(
  bookingId: number,
  newStatus: BookingStatus,
  adminNotes?: string
): Promise<StatusTransitionResult> {
  try {
    // Get current booking
    const booking = await db
      .select()
      .from(bookings)
      .where(eq(bookings.id, bookingId))
      .limit(1);

    if (booking.length === 0) {
      return {
        success: false,
        error: 'Booking not found',
      };
    }

    const currentBooking = booking[0];
    const currentStatus = currentBooking.bookingStatus as BookingStatus;

    // Validate transition
    if (!isValidTransition(currentStatus, newStatus)) {
      return {
        success: false,
        error: `Invalid status transition: ${currentStatus} → ${newStatus}`,
      };
    }

    // Additional validation based on new status
    switch (newStatus) {
      case 'confirmed':
        // Can only confirm if deposit is paid
        if (!currentBooking.depositPaid) {
          return {
            success: false,
            error: 'Booking cannot be confirmed until deposit is paid',
          };
        }
        break;

      case 'completed':
        // Can only complete if booking date has passed
        const checkOutDate = new Date(currentBooking.checkOutDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        if (checkOutDate > today) {
          return {
            success: false,
            error: 'Booking cannot be completed before check-out date',
          };
        }

        // Should have balance paid (optional check - can be removed if needed)
        if (!currentBooking.balancePaid) {
          // Log warning but allow completion
          console.warn(`Booking ${bookingId} completed without balance paid`);
        }
        break;
    }

    // Update status
    const updates: any = {
      bookingStatus: newStatus,
      updatedAt: new Date().toISOString(),
    };

    // Add admin notes if provided
    if (adminNotes) {
      const existingNotes = currentBooking.adminNotes || '';
      const timestamp = new Date().toLocaleString('en-GB', { 
        timeZone: 'Europe/London',
        hour12: false 
      });
      updates.adminNotes = existingNotes 
        ? `${existingNotes}\n\n[${timestamp}] Status changed to ${newStatus}: ${adminNotes}`
        : `[${timestamp}] Status changed to ${newStatus}: ${adminNotes}`;
    }

    await db
      .update(bookings)
      .set(updates)
      .where(eq(bookings.id, bookingId));

    return {
      success: true,
      newStatus,
      message: `Booking status updated to ${newStatus}`,
    };

  } catch (error) {
    console.error('Status update error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Confirm booking (pending → confirmed)
 * Called after deposit payment is received
 */
export async function confirmBooking(
  bookingId: number,
  adminNotes?: string
): Promise<StatusTransitionResult> {
  return updateBookingStatus(bookingId, 'confirmed', adminNotes);
}

/**
 * Complete booking (confirmed → completed)
 * Called after guest checks out
 */
export async function completeBooking(
  bookingId: number,
  adminNotes?: string
): Promise<StatusTransitionResult> {
  return updateBookingStatus(bookingId, 'completed', adminNotes);
}

/**
 * Cancel booking (pending/confirmed → cancelled)
 * Can be cancelled from pending or confirmed status
 */
export async function cancelBooking(
  bookingId: number,
  reason?: string
): Promise<StatusTransitionResult> {
  const adminNotes = reason ? `Cancellation reason: ${reason}` : 'Booking cancelled';
  return updateBookingStatus(bookingId, 'cancelled', adminNotes);
}

/**
 * Get booking status information
 */
export function getStatusInfo(status: BookingStatus): {
  label: string;
  color: string;
  description: string;
  isFinal: boolean;
} {
  switch (status) {
    case 'pending':
      return {
        label: 'Pending',
        color: 'yellow',
        description: 'Awaiting deposit payment',
        isFinal: false,
      };
    case 'confirmed':
      return {
        label: 'Confirmed',
        color: 'green',
        description: 'Booking confirmed - deposit paid',
        isFinal: false,
      };
    case 'completed':
      return {
        label: 'Completed',
        color: 'blue',
        description: 'Guest has checked out',
        isFinal: true,
      };
    case 'cancelled':
      return {
        label: 'Cancelled',
        color: 'red',
        description: 'Booking cancelled',
        isFinal: true,
      };
    default:
      return {
        label: 'Unknown',
        color: 'gray',
        description: 'Unknown status',
        isFinal: false,
      };
  }
}

/**
 * Update payment status
 */
export async function updatePaymentStatus(
  bookingId: number,
  paymentType: 'deposit' | 'balance',
  isPaid: boolean
): Promise<{ success: boolean; error?: string }> {
  try {
    const updates: any = {
      updatedAt: new Date().toISOString(),
    };

    if (paymentType === 'deposit') {
      updates.depositPaid = isPaid;
      
      // Auto-confirm booking if deposit is paid and status is pending
      if (isPaid) {
        const booking = await db
          .select()
          .from(bookings)
          .where(eq(bookings.id, bookingId))
          .limit(1);

        if (booking.length > 0 && booking[0].bookingStatus === 'pending') {
          updates.bookingStatus = 'confirmed';
          
          const timestamp = new Date().toLocaleString('en-GB', { 
            timeZone: 'Europe/London',
            hour12: false 
          });
          const existingNotes = booking[0].adminNotes || '';
          updates.adminNotes = existingNotes
            ? `${existingNotes}\n\n[${timestamp}] Deposit paid - booking auto-confirmed`
            : `[${timestamp}] Deposit paid - booking auto-confirmed`;
        }
      }
    } else {
      updates.balancePaid = isPaid;
    }

    await db
      .update(bookings)
      .set(updates)
      .where(eq(bookings.id, bookingId));

    return { success: true };

  } catch (error) {
    console.error('Payment status update error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
