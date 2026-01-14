import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { experienceFaqs, experiences } from '@/db/schema';
import { eq, asc } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const experienceId = searchParams.get('experienceId');

    if (!experienceId || isNaN(parseInt(experienceId))) {
      return NextResponse.json(
        { 
          error: 'Valid experienceId is required',
          code: 'MISSING_EXPERIENCE_ID' 
        },
        { status: 400 }
      );
    }

    const faqs = await db.select()
      .from(experienceFaqs)
      .where(eq(experienceFaqs.experienceId, parseInt(experienceId)))
      .orderBy(asc(experienceFaqs.orderIndex));

    return NextResponse.json(faqs, { status: 200 });
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
    const { experienceId, question, answer, orderIndex } = body;

    if (!experienceId || isNaN(parseInt(experienceId))) {
      return NextResponse.json(
        { 
          error: 'Valid experienceId is required',
          code: 'MISSING_EXPERIENCE_ID' 
        },
        { status: 400 }
      );
    }

    if (!question || typeof question !== 'string' || question.trim() === '') {
      return NextResponse.json(
        { 
          error: 'Question is required',
          code: 'MISSING_QUESTION' 
        },
        { status: 400 }
      );
    }

    if (!answer || typeof answer !== 'string' || answer.trim() === '') {
      return NextResponse.json(
        { 
          error: 'Answer is required',
          code: 'MISSING_ANSWER' 
        },
        { status: 400 }
      );
    }

    const experienceExists = await db.select()
      .from(experiences)
      .where(eq(experiences.id, parseInt(experienceId)))
      .limit(1);

    if (experienceExists.length === 0) {
      return NextResponse.json(
        { 
          error: 'Experience not found',
          code: 'EXPERIENCE_NOT_FOUND' 
        },
        { status: 400 }
      );
    }

    const newFaq = await db.insert(experienceFaqs)
      .values({
        experienceId: parseInt(experienceId),
        question: question.trim(),
        answer: answer.trim(),
        orderIndex: orderIndex !== undefined ? parseInt(orderIndex) : 0,
        createdAt: new Date().toISOString(),
      })
      .returning();

    return NextResponse.json(newFaq[0], { status: 201 });
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
        { 
          error: 'Valid ID is required',
          code: 'INVALID_ID' 
        },
        { status: 400 }
      );
    }

    const existingFaq = await db.select()
      .from(experienceFaqs)
      .where(eq(experienceFaqs.id, parseInt(id)))
      .limit(1);

    if (existingFaq.length === 0) {
      return NextResponse.json(
        { error: 'FAQ not found' },
        { status: 404 }
      );
    }

    const body = await request.json();
    const { question, answer, orderIndex } = body;

    const updates: Record<string, any> = {};

    if (question !== undefined) {
      if (typeof question !== 'string' || question.trim() === '') {
        return NextResponse.json(
          { 
            error: 'Question must be a non-empty string',
            code: 'INVALID_QUESTION' 
          },
          { status: 400 }
        );
      }
      updates.question = question.trim();
    }

    if (answer !== undefined) {
      if (typeof answer !== 'string' || answer.trim() === '') {
        return NextResponse.json(
          { 
            error: 'Answer must be a non-empty string',
            code: 'INVALID_ANSWER' 
          },
          { status: 400 }
        );
      }
      updates.answer = answer.trim();
    }

    if (orderIndex !== undefined) {
      updates.orderIndex = parseInt(orderIndex);
    }

    const updatedFaq = await db.update(experienceFaqs)
      .set(updates)
      .where(eq(experienceFaqs.id, parseInt(id)))
      .returning();

    return NextResponse.json(updatedFaq[0], { status: 200 });
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
        { 
          error: 'Valid ID is required',
          code: 'INVALID_ID' 
        },
        { status: 400 }
      );
    }

    const existingFaq = await db.select()
      .from(experienceFaqs)
      .where(eq(experienceFaqs.id, parseInt(id)))
      .limit(1);

    if (existingFaq.length === 0) {
      return NextResponse.json(
        { error: 'FAQ not found' },
        { status: 404 }
      );
    }

    const deleted = await db.delete(experienceFaqs)
      .where(eq(experienceFaqs.id, parseInt(id)))
      .returning();

    return NextResponse.json(
      { 
        message: 'FAQ deleted successfully',
        deleted: deleted[0]
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