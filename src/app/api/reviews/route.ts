import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { reviews, properties } from '@/db/schema';
import { eq, like, and, or, desc, asc } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    // Single review by ID
    if (id) {
      if (!id || isNaN(parseInt(id))) {
        return NextResponse.json({ 
          error: "Valid ID is required",
          code: "INVALID_ID" 
        }, { status: 400 });
      }

      const review = await db.select()
        .from(reviews)
        .where(eq(reviews.id, parseInt(id)))
        .limit(1);

      if (review.length === 0) {
        return NextResponse.json({ 
          error: 'Review not found',
          code: 'REVIEW_NOT_FOUND' 
        }, { status: 404 });
      }

      return NextResponse.json(review[0], { status: 200 });
    }

    // List reviews with pagination, search, filters, and sorting
    const limit = Math.min(parseInt(searchParams.get('limit') ?? '20'), 100);
    const offset = parseInt(searchParams.get('offset') ?? '0');
    const search = searchParams.get('search');
    const propertyId = searchParams.get('propertyId');
    const rating = searchParams.get('rating');
    const isApproved = searchParams.get('isApproved');
    const isPublished = searchParams.get('isPublished');
    const sortField = searchParams.get('sort') ?? 'reviewDate';
    const sortOrder = searchParams.get('order') ?? 'desc';

    let query = db.select().from(reviews);

    // Build WHERE conditions
    const conditions = [];

    if (search) {
      conditions.push(
        or(
          like(reviews.guestName, `%${search}%`),
          like(reviews.comment, `%${search}%`)
        )
      );
    }

    if (propertyId) {
      const propertyIdNum = parseInt(propertyId);
      if (!isNaN(propertyIdNum)) {
        conditions.push(eq(reviews.propertyId, propertyIdNum));
      }
    }

    if (rating) {
      const ratingNum = parseInt(rating);
      if (!isNaN(ratingNum) && ratingNum >= 1 && ratingNum <= 5) {
        conditions.push(eq(reviews.rating, ratingNum));
      }
    }

    if (isApproved !== null && isApproved !== undefined) {
      conditions.push(eq(reviews.isApproved, isApproved === 'true'));
    }

    if (isPublished !== null && isPublished !== undefined) {
      conditions.push(eq(reviews.isPublished, isPublished === 'true'));
    }

    if (conditions.length > 0) {
      query = query.where(and(...conditions)) as any;
    }

    // Apply sorting
    const sortColumn = sortField === 'rating' ? reviews.rating :
                       sortField === 'guestName' ? reviews.guestName :
                       sortField === 'createdAt' ? reviews.createdAt :
                       reviews.reviewDate;

    query = query.orderBy(sortOrder === 'asc' ? asc(sortColumn) : desc(sortColumn)) as any;

    // Apply pagination
    const results = await query.limit(limit).offset(offset);

    return NextResponse.json(results, { status: 200 });
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + (error as Error).message 
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { guestName, rating, comment, reviewDate, propertyId, guestImage } = body;

    // Validate required fields
    if (!guestName || !guestName.trim()) {
      return NextResponse.json({ 
        error: "Guest name is required",
        code: "MISSING_GUEST_NAME" 
      }, { status: 400 });
    }

    if (!rating) {
      return NextResponse.json({ 
        error: "Rating is required",
        code: "MISSING_RATING" 
      }, { status: 400 });
    }

    if (!comment || !comment.trim()) {
      return NextResponse.json({ 
        error: "Comment is required",
        code: "MISSING_COMMENT" 
      }, { status: 400 });
    }

    if (!reviewDate) {
      return NextResponse.json({ 
        error: "Review date is required",
        code: "MISSING_REVIEW_DATE" 
      }, { status: 400 });
    }

    // Validate rating range
    const ratingNum = parseInt(rating);
    if (isNaN(ratingNum) || ratingNum < 1 || ratingNum > 5) {
      return NextResponse.json({ 
        error: "Rating must be between 1 and 5",
        code: "INVALID_RATING" 
      }, { status: 400 });
    }

    // Validate reviewDate is a valid date
    const reviewDateObj = new Date(reviewDate);
    if (isNaN(reviewDateObj.getTime())) {
      return NextResponse.json({ 
        error: "Review date must be a valid date",
        code: "INVALID_REVIEW_DATE" 
      }, { status: 400 });
    }

    // Validate propertyId if provided
    if (propertyId) {
      const propertyIdNum = parseInt(propertyId);
      if (isNaN(propertyIdNum)) {
        return NextResponse.json({ 
          error: "Property ID must be a valid number",
          code: "INVALID_PROPERTY_ID" 
        }, { status: 400 });
      }

      // Check if property exists
      const property = await db.select()
        .from(properties)
        .where(eq(properties.id, propertyIdNum))
        .limit(1);

      if (property.length === 0) {
        return NextResponse.json({ 
          error: "Property not found",
          code: "PROPERTY_NOT_FOUND" 
        }, { status: 400 });
      }
    }

    // Prepare insert data with sanitized inputs
    const insertData: any = {
      guestName: guestName.trim(),
      rating: ratingNum,
      comment: comment.trim(),
      reviewDate: reviewDate,
      isApproved: false,
      isPublished: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Add optional fields if provided
    if (propertyId) {
      insertData.propertyId = parseInt(propertyId);
    }

    if (guestImage && guestImage.trim()) {
      insertData.guestImage = guestImage.trim();
    }

    const newReview = await db.insert(reviews)
      .values(insertData)
      .returning();

    return NextResponse.json(newReview[0], { status: 201 });
  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + (error as Error).message 
    }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json({ 
        error: "Valid ID is required",
        code: "INVALID_ID" 
      }, { status: 400 });
    }

    const body = await request.json();

    // Check if review exists
    const existingReview = await db.select()
      .from(reviews)
      .where(eq(reviews.id, parseInt(id)))
      .limit(1);

    if (existingReview.length === 0) {
      return NextResponse.json({ 
        error: 'Review not found',
        code: 'REVIEW_NOT_FOUND' 
      }, { status: 404 });
    }

    // Prepare update data
    const updateData: any = {
      updatedAt: new Date().toISOString(),
    };

    // Update fields if provided
    if (body.guestName !== undefined) {
      if (!body.guestName.trim()) {
        return NextResponse.json({ 
          error: "Guest name cannot be empty",
          code: "INVALID_GUEST_NAME" 
        }, { status: 400 });
      }
      updateData.guestName = body.guestName.trim();
    }

    if (body.rating !== undefined) {
      const ratingNum = parseInt(body.rating);
      if (isNaN(ratingNum) || ratingNum < 1 || ratingNum > 5) {
        return NextResponse.json({ 
          error: "Rating must be between 1 and 5",
          code: "INVALID_RATING" 
        }, { status: 400 });
      }
      updateData.rating = ratingNum;
    }

    if (body.comment !== undefined) {
      if (!body.comment.trim()) {
        return NextResponse.json({ 
          error: "Comment cannot be empty",
          code: "INVALID_COMMENT" 
        }, { status: 400 });
      }
      updateData.comment = body.comment.trim();
    }

    if (body.reviewDate !== undefined) {
      const reviewDateObj = new Date(body.reviewDate);
      if (isNaN(reviewDateObj.getTime())) {
        return NextResponse.json({ 
          error: "Review date must be a valid date",
          code: "INVALID_REVIEW_DATE" 
        }, { status: 400 });
      }
      updateData.reviewDate = body.reviewDate;
    }

    if (body.propertyId !== undefined) {
      if (body.propertyId === null) {
        updateData.propertyId = null;
      } else {
        const propertyIdNum = parseInt(body.propertyId);
        if (isNaN(propertyIdNum)) {
          return NextResponse.json({ 
            error: "Property ID must be a valid number",
            code: "INVALID_PROPERTY_ID" 
          }, { status: 400 });
        }

        // Check if property exists
        const property = await db.select()
          .from(properties)
          .where(eq(properties.id, propertyIdNum))
          .limit(1);

        if (property.length === 0) {
          return NextResponse.json({ 
            error: "Property not found",
            code: "PROPERTY_NOT_FOUND" 
          }, { status: 400 });
        }

        updateData.propertyId = propertyIdNum;
      }
    }

    if (body.guestImage !== undefined) {
      updateData.guestImage = body.guestImage ? body.guestImage.trim() : null;
    }

    if (body.isApproved !== undefined) {
      updateData.isApproved = Boolean(body.isApproved);
    }

    if (body.isPublished !== undefined) {
      updateData.isPublished = Boolean(body.isPublished);
    }

    const updated = await db.update(reviews)
      .set(updateData)
      .where(eq(reviews.id, parseInt(id)))
      .returning();

    return NextResponse.json(updated[0], { status: 200 });
  } catch (error) {
    console.error('PUT error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + (error as Error).message 
    }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json({ 
        error: "Valid ID is required",
        code: "INVALID_ID" 
      }, { status: 400 });
    }

    // Check if review exists
    const existingReview = await db.select()
      .from(reviews)
      .where(eq(reviews.id, parseInt(id)))
      .limit(1);

    if (existingReview.length === 0) {
      return NextResponse.json({ 
        error: 'Review not found',
        code: 'REVIEW_NOT_FOUND' 
      }, { status: 404 });
    }

    const deleted = await db.delete(reviews)
      .where(eq(reviews.id, parseInt(id)))
      .returning();

    return NextResponse.json({
      message: 'Review deleted successfully',
      review: deleted[0]
    }, { status: 200 });
  } catch (error) {
    console.error('DELETE error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + (error as Error).message 
    }, { status: 500 });
  }
}