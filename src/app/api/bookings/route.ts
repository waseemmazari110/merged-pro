import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { bookings } from '@/db/schema';
import { eq, like, and, or, desc, asc, gte, lte } from 'drizzle-orm';
import { checkForSpam, type SpamCheckData } from '@/lib/spam-protection';

// Email validation regex
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Helper function to validate email
function isValidEmail(email: string): boolean {
  return EMAIL_REGEX.test(email);
}

// Helper function to validate dates
function isValidDate(dateString: string): boolean {
  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date.getTime());
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    // Single booking by ID
    if (id) {
      if (!id || isNaN(parseInt(id))) {
        return NextResponse.json(
          { error: 'Valid ID is required', code: 'INVALID_ID' },
          { status: 400 }
        );
      }

      const booking = await db
        .select()
        .from(bookings)
        .where(eq(bookings.id, parseInt(id)))
        .limit(1);

      if (booking.length === 0) {
        return NextResponse.json(
          { error: 'Booking not found', code: 'BOOKING_NOT_FOUND' },
          { status: 404 }
        );
      }

      return NextResponse.json(booking[0], { status: 200 });
    }

    // List bookings with filters, search, and pagination
    const limit = Math.min(parseInt(searchParams.get('limit') ?? '20'), 100);
    const offset = parseInt(searchParams.get('offset') ?? '0');
    const search = searchParams.get('search');
    const status = searchParams.get('status');
    const property = searchParams.get('property');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const sortField = searchParams.get('sort') ?? 'createdAt';
    const sortOrder = searchParams.get('order') ?? 'desc';

    // Build WHERE conditions
    const conditions = [];

    // Status filter
    if (status) {
      conditions.push(eq(bookings.bookingStatus, status.trim()));
    }

    // Property filter
    if (property) {
      conditions.push(like(bookings.propertyName, `%${property.trim()}%`));
    }

    // Date range filter
    if (startDate) {
      conditions.push(gte(bookings.checkInDate, startDate.trim()));
    }
    if (endDate) {
      conditions.push(lte(bookings.checkOutDate, endDate.trim()));
    }

    // Search filter (guest name or email)
    if (search) {
      const searchTerm = search.trim();
      conditions.push(
        or(
          like(bookings.guestName, `%${searchTerm}%`),
          like(bookings.guestEmail, `%${searchTerm}%`)
        )
      );
    }

    // Build query
    let query: any = db.select().from(bookings);

    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    // Apply sorting
    const sortColumn = sortField === 'checkInDate' ? bookings.checkInDate :
                      sortField === 'checkOutDate' ? bookings.checkOutDate :
                      sortField === 'guestName' ? bookings.guestName :
                      sortField === 'bookingStatus' ? bookings.bookingStatus :
                      bookings.createdAt;

    query = query.orderBy(sortOrder === 'asc' ? asc(sortColumn) : desc(sortColumn));

    // Apply pagination
    const results = await query.limit(limit).offset(offset);

    return NextResponse.json(results, { status: 200 });
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + (error as Error).message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    const requiredFields = [
      'propertyName',
      'guestName',
      'guestEmail',
      'guestPhone',
      'checkInDate',
      'checkOutDate',
      'numberOfGuests'
    ];

    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { 
            error: `${field} is required`, 
            code: 'MISSING_REQUIRED_FIELD' 
          },
          { status: 400 }
        );
      }
    }

    // Sanitize string inputs
    const propertyName = body.propertyName.trim();
    const guestName = body.guestName.trim();
    const guestEmail = body.guestEmail.trim().toLowerCase();
    const guestPhone = body.guestPhone.trim();
    const checkInDate = body.checkInDate.trim();
    const checkOutDate = body.checkOutDate.trim();

    // Validate email format
    if (!isValidEmail(guestEmail)) {
      return NextResponse.json(
        { error: 'Invalid email format', code: 'INVALID_EMAIL' },
        { status: 400 }
      );
    }

    // Run comprehensive spam check
    const spamCheckData: SpamCheckData = {
      email: guestEmail,
      honeypot: body.honeypot,
      timestamp: body.timestamp,
      challenge: body.challenge,
      userInteraction: body.userInteraction
    };

    const spamCheck = await checkForSpam(request, spamCheckData);

    if (spamCheck.isSpam) {
      console.log(`🚫 Booking spam blocked: ${spamCheck.reason}`);
      return NextResponse.json(
        { error: spamCheck.reason || 'Submission rejected', code: 'SPAM_DETECTED' },
        { status: 429 }
      );
    }

    // Validate dates
    if (!isValidDate(checkInDate)) {
      return NextResponse.json(
        { error: 'Invalid check-in date format', code: 'INVALID_CHECK_IN_DATE' },
        { status: 400 }
      );
    }

    if (!isValidDate(checkOutDate)) {
      return NextResponse.json(
        { error: 'Invalid check-out date format', code: 'INVALID_CHECK_OUT_DATE' },
        { status: 400 }
      );
    }

    // Validate checkout is after checkin
    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);
    if (checkOut <= checkIn) {
      return NextResponse.json(
        { 
          error: 'Check-out date must be after check-in date', 
          code: 'INVALID_DATE_RANGE' 
        },
        { status: 400 }
      );
    }

    // Validate number of guests
    const numberOfGuests = parseInt(body.numberOfGuests);
    if (isNaN(numberOfGuests) || numberOfGuests <= 0) {
      return NextResponse.json(
        { 
          error: 'Number of guests must be greater than 0', 
          code: 'INVALID_GUEST_COUNT' 
        },
        { status: 400 }
      );
    }

    // Prepare insert data
    const insertData: any = {
      propertyName,
      guestName,
      guestEmail,
      guestPhone,
      checkInDate,
      checkOutDate,
      numberOfGuests,
      bookingStatus: body.bookingStatus?.trim() ?? 'pending',
      depositPaid: body.depositPaid ?? false,
      balancePaid: body.balancePaid ?? false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Add optional fields if provided
    if (body.propertyLocation) {
      insertData.propertyLocation = body.propertyLocation.trim();
    }
    if (body.occasion) {
      insertData.occasion = body.occasion.trim();
    }
    if (body.totalPrice !== undefined && body.totalPrice !== null) {
      insertData.totalPrice = parseFloat(body.totalPrice);
    }
    if (body.depositAmount !== undefined && body.depositAmount !== null) {
      insertData.depositAmount = parseFloat(body.depositAmount);
    }
    if (body.balanceAmount !== undefined && body.balanceAmount !== null) {
      insertData.balanceAmount = parseFloat(body.balanceAmount);
    }
    if (body.specialRequests) {
      insertData.specialRequests = body.specialRequests.trim();
    }
    if (body.experiencesSelected) {
      insertData.experiencesSelected = body.experiencesSelected;
    }
    if (body.adminNotes) {
      insertData.adminNotes = body.adminNotes.trim();
    }

    // Insert booking
    const newBooking = await db
      .insert(bookings)
      .values(insertData)
      .returning();

    return NextResponse.json(newBooking[0], { status: 201 });
  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + (error as Error).message },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { error: 'Valid ID is required', code: 'INVALID_ID' },
        { status: 400 }
      );
    }

    // Check if booking exists
    const existingBooking = await db
      .select()
      .from(bookings)
      .where(eq(bookings.id, parseInt(id)))
      .limit(1);

    if (existingBooking.length === 0) {
      return NextResponse.json(
        { error: 'Booking not found', code: 'BOOKING_NOT_FOUND' },
        { status: 404 }
      );
    }

    const body = await request.json();
    const updates: any = {
      updatedAt: new Date().toISOString()
    };

    // Validate and add optional updates
    if (body.propertyName !== undefined) {
      updates.propertyName = body.propertyName.trim();
    }
    if (body.propertyLocation !== undefined) {
      updates.propertyLocation = body.propertyLocation ? body.propertyLocation.trim() : null;
    }
    if (body.guestName !== undefined) {
      updates.guestName = body.guestName.trim();
    }
    if (body.guestEmail !== undefined) {
      const email = body.guestEmail.trim().toLowerCase();
      if (!isValidEmail(email)) {
        return NextResponse.json(
          { error: 'Invalid email format', code: 'INVALID_EMAIL' },
          { status: 400 }
        );
      }
      updates.guestEmail = email;
    }
    if (body.guestPhone !== undefined) {
      updates.guestPhone = body.guestPhone.trim();
    }
    if (body.checkInDate !== undefined) {
      const checkInDate = body.checkInDate.trim();
      if (!isValidDate(checkInDate)) {
        return NextResponse.json(
          { error: 'Invalid check-in date format', code: 'INVALID_CHECK_IN_DATE' },
          { status: 400 }
        );
      }
      updates.checkInDate = checkInDate;
    }
    if (body.checkOutDate !== undefined) {
      const checkOutDate = body.checkOutDate.trim();
      if (!isValidDate(checkOutDate)) {
        return NextResponse.json(
          { error: 'Invalid check-out date format', code: 'INVALID_CHECK_OUT_DATE' },
          { status: 400 }
        );
      }
      updates.checkOutDate = checkOutDate;
    }
    
    // Validate date range if both dates are being updated
    if (updates.checkInDate || updates.checkOutDate) {
      const checkIn = new Date(updates.checkInDate || existingBooking[0].checkInDate);
      const checkOut = new Date(updates.checkOutDate || existingBooking[0].checkOutDate);
      if (checkOut <= checkIn) {
        return NextResponse.json(
          { 
            error: 'Check-out date must be after check-in date', 
            code: 'INVALID_DATE_RANGE' 
          },
          { status: 400 }
        );
      }
    }

    if (body.numberOfGuests !== undefined) {
      const numberOfGuests = parseInt(body.numberOfGuests);
      if (isNaN(numberOfGuests) || numberOfGuests <= 0) {
        return NextResponse.json(
          { 
            error: 'Number of guests must be greater than 0', 
            code: 'INVALID_GUEST_COUNT' 
          },
          { status: 400 }
        );
      }
      updates.numberOfGuests = numberOfGuests;
    }
    if (body.occasion !== undefined) {
      updates.occasion = body.occasion ? body.occasion.trim() : null;
    }
    if (body.bookingStatus !== undefined) {
      updates.bookingStatus = body.bookingStatus.trim();
    }
    if (body.totalPrice !== undefined) {
      updates.totalPrice = body.totalPrice !== null ? parseFloat(body.totalPrice) : null;
    }
    if (body.depositAmount !== undefined) {
      updates.depositAmount = body.depositAmount !== null ? parseFloat(body.depositAmount) : null;
    }
    if (body.depositPaid !== undefined) {
      updates.depositPaid = body.depositPaid;
    }
    if (body.balanceAmount !== undefined) {
      updates.balanceAmount = body.balanceAmount !== null ? parseFloat(body.balanceAmount) : null;
    }
    if (body.balancePaid !== undefined) {
      updates.balancePaid = body.balancePaid;
    }
    if (body.specialRequests !== undefined) {
      updates.specialRequests = body.specialRequests ? body.specialRequests.trim() : null;
    }
    if (body.experiencesSelected !== undefined) {
      updates.experiencesSelected = body.experiencesSelected;
    }
    if (body.adminNotes !== undefined) {
      updates.adminNotes = body.adminNotes ? body.adminNotes.trim() : null;
    }

    // Update booking
    const updatedBooking = await db
      .update(bookings)
      .set(updates)
      .where(eq(bookings.id, parseInt(id)))
      .returning();

    return NextResponse.json(updatedBooking[0], { status: 200 });
  } catch (error) {
    console.error('PUT error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + (error as Error).message },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { error: 'Valid ID is required', code: 'INVALID_ID' },
        { status: 400 }
      );
    }

    // Check if booking exists
    const existingBooking = await db
      .select()
      .from(bookings)
      .where(eq(bookings.id, parseInt(id)))
      .limit(1);

    if (existingBooking.length === 0) {
      return NextResponse.json(
        { error: 'Booking not found', code: 'BOOKING_NOT_FOUND' },
        { status: 404 }
      );
    }

    // Delete booking
    const deletedBooking = await db
      .delete(bookings)
      .where(eq(bookings.id, parseInt(id)))
      .returning();

    return NextResponse.json(
      {
        message: 'Booking deleted successfully',
        booking: deletedBooking[0]
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('DELETE error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + (error as Error).message },
      { status: 500 }
    );
  }
}