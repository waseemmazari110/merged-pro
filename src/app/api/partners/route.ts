import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { partners } from '@/db/schema';
import { eq, like, and, or, desc, asc } from 'drizzle-orm';
import { getCurrentUser } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    // Single partner by ID
    if (id) {
      if (!id || isNaN(parseInt(id))) {
        return NextResponse.json({ 
          error: 'Valid ID is required',
          code: 'INVALID_ID' 
        }, { status: 400 });
      }

      const partner = await db.select()
        .from(partners)
        .where(eq(partners.id, parseInt(id)))
        .limit(1);

      if (partner.length === 0) {
        return NextResponse.json({ 
          error: 'Partner not found',
          code: 'NOT_FOUND' 
        }, { status: 404 });
      }

      return NextResponse.json(partner[0], { status: 200 });
    }

    // List all partners with filters
    const limit = Math.min(parseInt(searchParams.get('limit') ?? '50'), 100);
    const offset = parseInt(searchParams.get('offset') ?? '0');
    const search = searchParams.get('search');
    const typeFilter = searchParams.get('type');
    const regionFilter = searchParams.get('region');
    const isActiveFilter = searchParams.get('isActive');
    const sortField = searchParams.get('sort') ?? 'name';
    const sortOrder = searchParams.get('order') ?? 'asc';

    let query = db.select().from(partners);

    // Build WHERE conditions
    const conditions = [];

    if (search) {
      conditions.push(
        or(
          like(partners.name, `%${search}%`),
          like(partners.type, `%${search}%`),
          like(partners.region, `%${search}%`)
        )
      );
    }

    if (typeFilter) {
      conditions.push(eq(partners.type, typeFilter));
    }

    if (regionFilter) {
      conditions.push(eq(partners.region, regionFilter));
    }

    if (isActiveFilter !== null && isActiveFilter !== undefined) {
      const isActive = isActiveFilter === 'true';
      conditions.push(eq(partners.isActive, isActive));
    }

    if (conditions.length > 0) {
      query = query.where(and(...conditions)) as any;
    }

    // Apply sorting
    const sortColumn = sortField === 'createdAt' ? partners.createdAt :
                      sortField === 'updatedAt' ? partners.updatedAt :
                      sortField === 'type' ? partners.type :
                      sortField === 'region' ? partners.region :
                      partners.name;

    query = sortOrder === 'desc'
      ? query.orderBy(desc(sortColumn)) as any
      : query.orderBy(asc(sortColumn)) as any;

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
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const body = await request.json();

    // Security check: reject if userId provided in body
    if ('userId' in body || 'user_id' in body) {
      return NextResponse.json({ 
        error: "User ID cannot be provided in request body",
        code: "USER_ID_NOT_ALLOWED" 
      }, { status: 400 });
    }

    const { name, type, region, website, contactEmail, commissionNotes } = body;

    // Validate required fields
    if (!name || !name.trim()) {
      return NextResponse.json({ 
        error: 'Name is required',
        code: 'MISSING_NAME' 
      }, { status: 400 });
    }

    if (!type || !type.trim()) {
      return NextResponse.json({ 
        error: 'Type is required',
        code: 'MISSING_TYPE' 
      }, { status: 400 });
    }

    // Sanitize inputs
    const sanitizedName = name.trim();
    const sanitizedType = type.trim();
    const sanitizedRegion = region?.trim() || null;
    const sanitizedWebsite = website?.trim() || null;
    const sanitizedContactEmail = contactEmail?.trim().toLowerCase() || null;
    const sanitizedCommissionNotes = commissionNotes?.trim() || null;

    // Create partner
    const newPartner = await db.insert(partners)
      .values({
        name: sanitizedName,
        type: sanitizedType,
        region: sanitizedRegion,
        website: sanitizedWebsite,
        contactEmail: sanitizedContactEmail,
        commissionNotes: sanitizedCommissionNotes,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })
      .returning();

    return NextResponse.json(newPartner[0], { status: 201 });
  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + (error as Error).message 
    }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json({ 
        error: 'Valid ID is required',
        code: 'INVALID_ID' 
      }, { status: 400 });
    }

    const body = await request.json();

    // Security check: reject if userId provided in body
    if ('userId' in body || 'user_id' in body) {
      return NextResponse.json({ 
        error: "User ID cannot be provided in request body",
        code: "USER_ID_NOT_ALLOWED" 
      }, { status: 400 });
    }

    // Check if partner exists
    const existingPartner = await db.select()
      .from(partners)
      .where(eq(partners.id, parseInt(id)))
      .limit(1);

    if (existingPartner.length === 0) {
      return NextResponse.json({ 
        error: 'Partner not found',
        code: 'NOT_FOUND' 
      }, { status: 404 });
    }

    // Build update object with only provided fields
    const updates: Record<string, any> = {
      updatedAt: new Date().toISOString()
    };

    if (body.name !== undefined) {
      if (!body.name.trim()) {
        return NextResponse.json({ 
          error: 'Name cannot be empty',
          code: 'INVALID_NAME' 
        }, { status: 400 });
      }
      updates.name = body.name.trim();
    }

    if (body.type !== undefined) {
      if (!body.type.trim()) {
        return NextResponse.json({ 
          error: 'Type cannot be empty',
          code: 'INVALID_TYPE' 
        }, { status: 400 });
      }
      updates.type = body.type.trim();
    }

    if (body.region !== undefined) {
      updates.region = body.region?.trim() || null;
    }

    if (body.website !== undefined) {
      updates.website = body.website?.trim() || null;
    }

    if (body.contactEmail !== undefined) {
      updates.contactEmail = body.contactEmail?.trim().toLowerCase() || null;
    }

    if (body.commissionNotes !== undefined) {
      updates.commissionNotes = body.commissionNotes?.trim() || null;
    }

    if (body.isActive !== undefined) {
      updates.isActive = Boolean(body.isActive);
    }

    // Update partner
    const updatedPartner = await db.update(partners)
      .set(updates)
      .where(eq(partners.id, parseInt(id)))
      .returning();

    return NextResponse.json(updatedPartner[0], { status: 200 });
  } catch (error) {
    console.error('PUT error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + (error as Error).message 
    }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json({ 
        error: 'Valid ID is required',
        code: 'INVALID_ID' 
      }, { status: 400 });
    }

    // Check if partner exists
    const existingPartner = await db.select()
      .from(partners)
      .where(eq(partners.id, parseInt(id)))
      .limit(1);

    if (existingPartner.length === 0) {
      return NextResponse.json({ 
        error: 'Partner not found',
        code: 'NOT_FOUND' 
      }, { status: 404 });
    }

    // Delete partner
    const deletedPartner = await db.delete(partners)
      .where(eq(partners.id, parseInt(id)))
      .returning();

    return NextResponse.json({
      message: 'Partner deleted successfully',
      partner: deletedPartner[0]
    }, { status: 200 });
  } catch (error) {
    console.error('DELETE error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + (error as Error).message 
    }, { status: 500 });
  }
}