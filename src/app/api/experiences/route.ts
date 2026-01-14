import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { experiences } from '@/db/schema';
import { eq, like, and, or, desc, asc } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    // Single experience by ID
    if (id) {
      if (!id || isNaN(parseInt(id))) {
        return NextResponse.json({ 
          error: "Valid ID is required",
          code: "INVALID_ID" 
        }, { status: 400 });
      }

      const experience = await db.select()
        .from(experiences)
        .where(eq(experiences.id, parseInt(id)))
        .limit(1);

      if (experience.length === 0) {
        return NextResponse.json({ 
          error: 'Experience not found',
          code: "NOT_FOUND" 
        }, { status: 404 });
      }

      return NextResponse.json(experience[0], { status: 200 });
    }

    // List with pagination, search, and filters
    const limit = Math.min(parseInt(searchParams.get('limit') ?? '20'), 100);
    const offset = parseInt(searchParams.get('offset') ?? '0');
    const search = searchParams.get('search');
    const category = searchParams.get('category');
    const isPublished = searchParams.get('isPublished');
    const sort = searchParams.get('sort') ?? 'createdAt';
    const order = searchParams.get('order') ?? 'desc';

    let query = db.select().from(experiences);

    // Build WHERE conditions
    const conditions = [];

    if (search) {
      conditions.push(
        or(
          like(experiences.title, `%${search}%`),
          like(experiences.description, `%${search}%`),
          like(experiences.category, `%${search}%`)
        )
      );
    }

    if (category) {
      conditions.push(eq(experiences.category, category));
    }

    if (isPublished !== null && isPublished !== undefined) {
      const publishedBool = isPublished === 'true';
      conditions.push(eq(experiences.isPublished, publishedBool));
    }

    if (conditions.length > 0) {
      query = query.where(and(...conditions)) as any;
    }

    // Apply sorting
    const sortColumn = sort === 'title' ? experiences.title :
                      sort === 'priceFrom' ? experiences.priceFrom :
                      sort === 'category' ? experiences.category :
                      experiences.createdAt;

    if (order === 'asc') {
      query = query.orderBy(asc(sortColumn)) as any;
    } else {
      query = query.orderBy(desc(sortColumn)) as any;
    }

    const results = await query.limit(limit).offset(offset);

    return NextResponse.json(results, { status: 200 });

  } catch (error: any) {
    console.error('GET error:', error);
    return NextResponse.json({
      error: 'Internal server error: ' + error.message
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      title, 
      slug, 
      duration, 
      groupSizeMin, 
      groupSizeMax, 
      priceFrom, 
      description, 
      heroImage,
      included,
      whatToProvide,
      category
    } = body;

    // Validate required fields
    if (!title) {
      return NextResponse.json({ 
        error: "Title is required",
        code: "MISSING_TITLE" 
      }, { status: 400 });
    }

    if (!slug) {
      return NextResponse.json({ 
        error: "Slug is required",
        code: "MISSING_SLUG" 
      }, { status: 400 });
    }

    if (!duration) {
      return NextResponse.json({ 
        error: "Duration is required",
        code: "MISSING_DURATION" 
      }, { status: 400 });
    }

    if (groupSizeMin === undefined || groupSizeMin === null) {
      return NextResponse.json({ 
        error: "Group size minimum is required",
        code: "MISSING_GROUP_SIZE_MIN" 
      }, { status: 400 });
    }

    if (groupSizeMax === undefined || groupSizeMax === null) {
      return NextResponse.json({ 
        error: "Group size maximum is required",
        code: "MISSING_GROUP_SIZE_MAX" 
      }, { status: 400 });
    }

    if (priceFrom === undefined || priceFrom === null) {
      return NextResponse.json({ 
        error: "Price from is required",
        code: "MISSING_PRICE_FROM" 
      }, { status: 400 });
    }

    if (!description) {
      return NextResponse.json({ 
        error: "Description is required",
        code: "MISSING_DESCRIPTION" 
      }, { status: 400 });
    }

    if (!heroImage) {
      return NextResponse.json({ 
        error: "Hero image is required",
        code: "MISSING_HERO_IMAGE" 
      }, { status: 400 });
    }

    // Validate business rules
    if (groupSizeMax < groupSizeMin) {
      return NextResponse.json({ 
        error: "Group size maximum must be greater than or equal to minimum",
        code: "INVALID_GROUP_SIZE_RANGE" 
      }, { status: 400 });
    }

    if (priceFrom < 0) {
      return NextResponse.json({ 
        error: "Price must be a positive number",
        code: "INVALID_PRICE" 
      }, { status: 400 });
    }

    // Check slug uniqueness
    const existingSlug = await db.select()
      .from(experiences)
      .where(eq(experiences.slug, slug.trim()))
      .limit(1);

    if (existingSlug.length > 0) {
      return NextResponse.json({ 
        error: "Slug already exists",
        code: "DUPLICATE_SLUG" 
      }, { status: 400 });
    }

    // Prepare insert data
    const now = new Date().toISOString();
    const insertData = {
      title: title.trim(),
      slug: slug.trim(),
      duration: duration.trim(),
      groupSizeMin: parseInt(groupSizeMin),
      groupSizeMax: parseInt(groupSizeMax),
      priceFrom: parseFloat(priceFrom),
      description: description.trim(),
      heroImage: heroImage.trim(),
      included: included || null,
      whatToProvide: whatToProvide || null,
      category: category ? category.trim() : null,
      isPublished: true,
      createdAt: now,
      updatedAt: now
    };

    const newExperience = await db.insert(experiences)
      .values(insertData)
      .returning();

    return NextResponse.json(newExperience[0], { status: 201 });

  } catch (error: any) {
    console.error('POST error:', error);
    return NextResponse.json({
      error: 'Internal server error: ' + error.message
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

    // Check if experience exists
    const existing = await db.select()
      .from(experiences)
      .where(eq(experiences.id, parseInt(id)))
      .limit(1);

    if (existing.length === 0) {
      return NextResponse.json({ 
        error: 'Experience not found',
        code: "NOT_FOUND" 
      }, { status: 404 });
    }

    const body = await request.json();
    const updates: any = {};

    // Handle optional field updates with validation
    if (body.title !== undefined) {
      updates.title = body.title.trim();
    }

    if (body.slug !== undefined) {
      const slugValue = body.slug.trim();
      
      // Check slug uniqueness if changed
      if (slugValue !== existing[0].slug) {
        const existingSlug = await db.select()
          .from(experiences)
          .where(eq(experiences.slug, slugValue))
          .limit(1);

        if (existingSlug.length > 0) {
          return NextResponse.json({ 
            error: "Slug already exists",
            code: "DUPLICATE_SLUG" 
          }, { status: 400 });
        }
      }
      
      updates.slug = slugValue;
    }

    if (body.duration !== undefined) {
      updates.duration = body.duration.trim();
    }

    if (body.groupSizeMin !== undefined) {
      updates.groupSizeMin = parseInt(body.groupSizeMin);
    }

    if (body.groupSizeMax !== undefined) {
      updates.groupSizeMax = parseInt(body.groupSizeMax);
    }

    // Validate group size range if either is being updated
    if (updates.groupSizeMin !== undefined || updates.groupSizeMax !== undefined) {
      const newMin = updates.groupSizeMin ?? existing[0].groupSizeMin;
      const newMax = updates.groupSizeMax ?? existing[0].groupSizeMax;
      
      if (newMax < newMin) {
        return NextResponse.json({ 
          error: "Group size maximum must be greater than or equal to minimum",
          code: "INVALID_GROUP_SIZE_RANGE" 
        }, { status: 400 });
      }
    }

    if (body.priceFrom !== undefined) {
      const price = parseFloat(body.priceFrom);
      if (price < 0) {
        return NextResponse.json({ 
          error: "Price must be a positive number",
          code: "INVALID_PRICE" 
        }, { status: 400 });
      }
      updates.priceFrom = price;
    }

    if (body.description !== undefined) {
      updates.description = body.description.trim();
    }

    if (body.heroImage !== undefined) {
      updates.heroImage = body.heroImage.trim();
    }

    if (body.included !== undefined) {
      updates.included = body.included;
    }

    if (body.whatToProvide !== undefined) {
      updates.whatToProvide = body.whatToProvide;
    }

    if (body.category !== undefined) {
      updates.category = body.category ? body.category.trim() : null;
    }

    if (body.isPublished !== undefined) {
      updates.isPublished = body.isPublished;
    }

    // Always update updatedAt
    updates.updatedAt = new Date().toISOString();

    const updated = await db.update(experiences)
      .set(updates)
      .where(eq(experiences.id, parseInt(id)))
      .returning();

    return NextResponse.json(updated[0], { status: 200 });

  } catch (error: any) {
    console.error('PUT error:', error);
    return NextResponse.json({
      error: 'Internal server error: ' + error.message
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

    // Check if experience exists
    const existing = await db.select()
      .from(experiences)
      .where(eq(experiences.id, parseInt(id)))
      .limit(1);

    if (existing.length === 0) {
      return NextResponse.json({ 
        error: 'Experience not found',
        code: "NOT_FOUND" 
      }, { status: 404 });
    }

    const deleted = await db.delete(experiences)
      .where(eq(experiences.id, parseInt(id)))
      .returning();

    return NextResponse.json({ 
      message: 'Experience deleted successfully',
      experience: deleted[0]
    }, { status: 200 });

  } catch (error: any) {
    console.error('DELETE error:', error);
    return NextResponse.json({
      error: 'Internal server error: ' + error.message
    }, { status: 500 });
  }
}