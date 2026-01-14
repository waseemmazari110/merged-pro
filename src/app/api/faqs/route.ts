import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { faqs } from '@/db/schema';
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

    if (id) {
      if (!id || isNaN(parseInt(id))) {
        return NextResponse.json({ 
          error: "Valid ID is required",
          code: "INVALID_ID" 
        }, { status: 400 });
      }

      const faq = await db.select()
        .from(faqs)
        .where(eq(faqs.id, parseInt(id)))
        .limit(1);

      if (faq.length === 0) {
        return NextResponse.json({ 
          error: 'FAQ not found',
          code: "FAQ_NOT_FOUND" 
        }, { status: 404 });
      }

      return NextResponse.json(faq[0], { status: 200 });
    }

    const limit = Math.min(parseInt(searchParams.get('limit') ?? '50'), 100);
    const offset = parseInt(searchParams.get('offset') ?? '0');
    const search = searchParams.get('search');
    const category = searchParams.get('category');
    const isPublished = searchParams.get('isPublished');
    const sort = searchParams.get('sort') ?? 'orderIndex';
    const order = searchParams.get('order') ?? 'asc';

    let query = db.select().from(faqs);

    const conditions = [];

    if (search) {
      conditions.push(
        or(
          like(faqs.question, `%${search}%`),
          like(faqs.answer, `%${search}%`)
        )
      );
    }

    if (category) {
      conditions.push(eq(faqs.category, category));
    }

    if (isPublished !== null && isPublished !== undefined) {
      conditions.push(eq(faqs.isPublished, isPublished === 'true'));
    }

    if (conditions.length > 0) {
      query = query.where(and(...conditions)) as any;
    }

    const orderByColumn = sort === 'category' ? faqs.category :
                          sort === 'createdAt' ? faqs.createdAt :
                          sort === 'updatedAt' ? faqs.updatedAt :
                          sort === 'question' ? faqs.question :
                          faqs.orderIndex;

    if (sort === 'orderIndex') {
      query = query.orderBy(
        order === 'desc' ? desc(faqs.orderIndex) : asc(faqs.orderIndex),
        asc(faqs.category)
      ) as any;
    } else {
      query = query.orderBy(
        order === 'desc' ? desc(orderByColumn) : asc(orderByColumn)
      ) as any;
    }

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
    const { question, answer, category, orderIndex } = body;

    if (!question || typeof question !== 'string' || question.trim() === '') {
      return NextResponse.json({ 
        error: "Question is required and must be a non-empty string",
        code: "MISSING_QUESTION" 
      }, { status: 400 });
    }

    if (!answer || typeof answer !== 'string' || answer.trim() === '') {
      return NextResponse.json({ 
        error: "Answer is required and must be a non-empty string",
        code: "MISSING_ANSWER" 
      }, { status: 400 });
    }

    if (!category || typeof category !== 'string' || category.trim() === '') {
      return NextResponse.json({ 
        error: "Category is required and must be a non-empty string",
        code: "MISSING_CATEGORY" 
      }, { status: 400 });
    }

    const now = new Date().toISOString();

    const newFaq = await db.insert(faqs)
      .values({
        question: question.trim(),
        answer: answer.trim(),
        category: category.trim(),
        orderIndex: orderIndex !== undefined ? parseInt(orderIndex) : 0,
        isPublished: true,
        createdAt: now,
        updatedAt: now,
      })
      .returning();

    return NextResponse.json(newFaq[0], { status: 201 });

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
        error: "Valid ID is required",
        code: "INVALID_ID" 
      }, { status: 400 });
    }

    const existing = await db.select()
      .from(faqs)
      .where(eq(faqs.id, parseInt(id)))
      .limit(1);

    if (existing.length === 0) {
      return NextResponse.json({ 
        error: 'FAQ not found',
        code: "FAQ_NOT_FOUND" 
      }, { status: 404 });
    }

    const body = await request.json();
    const updates: any = {
      updatedAt: new Date().toISOString()
    };

    if (body.question !== undefined) {
      if (typeof body.question !== 'string' || body.question.trim() === '') {
        return NextResponse.json({ 
          error: "Question must be a non-empty string",
          code: "INVALID_QUESTION" 
        }, { status: 400 });
      }
      updates.question = body.question.trim();
    }

    if (body.answer !== undefined) {
      if (typeof body.answer !== 'string' || body.answer.trim() === '') {
        return NextResponse.json({ 
          error: "Answer must be a non-empty string",
          code: "INVALID_ANSWER" 
        }, { status: 400 });
      }
      updates.answer = body.answer.trim();
    }

    if (body.category !== undefined) {
      if (typeof body.category !== 'string' || body.category.trim() === '') {
        return NextResponse.json({ 
          error: "Category must be a non-empty string",
          code: "INVALID_CATEGORY" 
        }, { status: 400 });
      }
      updates.category = body.category.trim();
    }

    if (body.orderIndex !== undefined) {
      updates.orderIndex = parseInt(body.orderIndex);
    }

    if (body.isPublished !== undefined) {
      updates.isPublished = Boolean(body.isPublished);
    }

    const updated = await db.update(faqs)
      .set(updates)
      .where(eq(faqs.id, parseInt(id)))
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
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json({ 
        error: "Valid ID is required",
        code: "INVALID_ID" 
      }, { status: 400 });
    }

    const existing = await db.select()
      .from(faqs)
      .where(eq(faqs.id, parseInt(id)))
      .limit(1);

    if (existing.length === 0) {
      return NextResponse.json({ 
        error: 'FAQ not found',
        code: "FAQ_NOT_FOUND" 
      }, { status: 404 });
    }

    const deleted = await db.delete(faqs)
      .where(eq(faqs.id, parseInt(id)))
      .returning();

    return NextResponse.json({
      message: 'FAQ deleted successfully',
      deleted: deleted[0]
    }, { status: 200 });

  } catch (error) {
    console.error('DELETE error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + (error as Error).message 
    }, { status: 500 });
  }
}