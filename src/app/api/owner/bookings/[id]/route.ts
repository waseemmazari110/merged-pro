/**
 * Owner Booking Management API
 * Allows owners to update (reject) or delete bookings for their properties
 */

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { bookings, properties } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { 
  getCurrentUserWithRole, 
  isAdmin,
  isOwner,
  unauthorizedResponse
} from "@/lib/auth-roles";

/**
 * PATCH /api/owner/bookings/[id]
 * Update booking status (e.g., reject a booking)
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const currentUser = await getCurrentUserWithRole();
    
    if (!currentUser || (!isOwner(currentUser) && !isAdmin(currentUser))) {
      return unauthorizedResponse('Only owners and admins can update bookings');
    }

    const { id } = await params;
    const bookingId = parseInt(id);

    if (isNaN(bookingId)) {
      return NextResponse.json(
        { error: 'Invalid booking ID' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { bookingStatus } = body;

    if (!bookingStatus || !['confirmed', 'pending', 'cancelled', 'rejected'].includes(bookingStatus)) {
      return NextResponse.json(
        { error: 'Invalid booking status. Must be one of: confirmed, pending, cancelled, rejected' },
        { status: 400 }
      );
    }

    // Get the booking
    const [booking] = await db
      .select()
      .from(bookings)
      .where(eq(bookings.id, bookingId))
      .limit(1);

    if (!booking) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      );
    }

    // Verify ownership (admin can modify any, owner can only modify their properties)
    if (!isAdmin(currentUser)) {
      if (!booking.propertyId) {
        return unauthorizedResponse('Booking has no associated property');
      }
      
      const [property] = await db
        .select()
        .from(properties)
        .where(
          and(
            eq(properties.id, booking.propertyId),
            eq(properties.ownerId, currentUser.id)
          )
        )
        .limit(1);

      if (!property) {
        return unauthorizedResponse('You can only modify bookings for your own properties');
      }
    }

    // Update booking status
    const [updatedBooking] = await db
      .update(bookings)
      .set({
        bookingStatus,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(bookings.id, bookingId))
      .returning();

    return NextResponse.json({
      success: true,
      message: `Booking ${bookingStatus} successfully`,
      booking: updatedBooking,
    });

  } catch (error) {
    console.error('Error updating booking:', error);
    return NextResponse.json(
      { error: 'Failed to update booking', details: (error as Error).message },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/owner/bookings/[id]
 * Delete a booking (owner can delete bookings for their properties)
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const currentUser = await getCurrentUserWithRole();
    
    if (!currentUser || (!isOwner(currentUser) && !isAdmin(currentUser))) {
      return unauthorizedResponse('Only owners and admins can delete bookings');
    }

    const { id } = await params;
    const bookingId = parseInt(id);

    if (isNaN(bookingId)) {
      return NextResponse.json(
        { error: 'Invalid booking ID' },
        { status: 400 }
      );
    }

    // Get the booking
    const [booking] = await db
      .select()
      .from(bookings)
      .where(eq(bookings.id, bookingId))
      .limit(1);

    if (!booking) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      );
    }

    // Verify ownership (admin can delete any, owner can only delete their properties)
    if (!isAdmin(currentUser)) {
      if (!booking.propertyId) {
        return unauthorizedResponse('Booking has no associated property');
      }
      
      const [property] = await db
        .select()
        .from(properties)
        .where(
          and(
            eq(properties.id, booking.propertyId),
            eq(properties.ownerId, currentUser.id)
          )
        )
        .limit(1);

      if (!property) {
        return unauthorizedResponse('You can only delete bookings for your own properties');
      }
    }

    // Delete the booking
    await db
      .delete(bookings)
      .where(eq(bookings.id, bookingId));

    return NextResponse.json({
      success: true,
      message: 'Booking deleted successfully',
    });

  } catch (error) {
    console.error('Error deleting booking:', error);
    return NextResponse.json(
      { error: 'Failed to delete booking', details: (error as Error).message },
      { status: 500 }
    );
  }
}
