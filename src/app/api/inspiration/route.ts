import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { blogPosts } from '@/db/schema';
import { eq, like, and, or, desc, asc } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    // Single blog post by ID
    if (id) {
      if (!id || isNaN(parseInt(id))) {
        return NextResponse.json(
          { error: 'Valid ID is required', code: 'INVALID_ID' },
          { status: 400 }
        );
      }

      const blogPost = await db
        .select()
        .from(blogPosts)
        .where(eq(blogPosts.id, parseInt(id)))
        .limit(1);

      if (blogPost.length === 0) {
        return NextResponse.json(
          { error: 'Blog post not found', code: 'NOT_FOUND' },
          { status: 404 }
        );
      }

      return NextResponse.json(blogPost[0], { status: 200 });
    }

    // List all blog posts with pagination, search, filters, and sorting
    const limit = Math.min(parseInt(searchParams.get('limit') ?? '20'), 100);
    const offset = parseInt(searchParams.get('offset') ?? '0');
    const search = searchParams.get('search');
    const category = searchParams.get('category');
    const isPublished = searchParams.get('isPublished');
    const sort = searchParams.get('sort') ?? 'publishedAt';
    const order = searchParams.get('order') ?? 'desc';

    // Build WHERE conditions
    const conditions: any[] = [];

    if (search) {
      conditions.push(
        or(
          like(blogPosts.title, `%${search}%`),
          like(blogPosts.excerpt, `%${search}%`),
          like(blogPosts.body, `%${search}%`),
          like(blogPosts.author, `%${search}%`)
        )
      );
    }

    if (category) {
      conditions.push(eq(blogPosts.category, category));
    }

    if (isPublished !== null && isPublished !== undefined) {
      const publishedValue = isPublished === 'true';
      conditions.push(eq(blogPosts.isPublished, publishedValue));
    }

    // Build the query
    let query: any = db.select().from(blogPosts);

    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    // Apply sorting
    const sortColumn = sort === 'title' ? blogPosts.title :
                       sort === 'createdAt' ? blogPosts.createdAt :
                       sort === 'updatedAt' ? blogPosts.updatedAt :
                       blogPosts.publishedAt;

    query = query.orderBy(order === 'asc' ? asc(sortColumn) : desc(sortColumn));

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
    const {
      title,
      slug,
      excerpt,
      body: postBody,
      featuredImage,
      category,
      author,
      tags,
      seoTitle,
      seoDescription,
      isPublished,
      publishedAt,
    } = body;

    // Validate required fields
    if (!title) {
      return NextResponse.json(
        { error: 'Title is required', code: 'MISSING_TITLE' },
        { status: 400 }
      );
    }

    if (!slug) {
      return NextResponse.json(
        { error: 'Slug is required', code: 'MISSING_SLUG' },
        { status: 400 }
      );
    }

    if (!excerpt) {
      return NextResponse.json(
        { error: 'Excerpt is required', code: 'MISSING_EXCERPT' },
        { status: 400 }
      );
    }

    if (!postBody) {
      return NextResponse.json(
        { error: 'Body is required', code: 'MISSING_BODY' },
        { status: 400 }
      );
    }

    if (!featuredImage) {
      return NextResponse.json(
        { error: 'Featured image is required', code: 'MISSING_FEATURED_IMAGE' },
        { status: 400 }
      );
    }

    if (!category) {
      return NextResponse.json(
        { error: 'Category is required', code: 'MISSING_CATEGORY' },
        { status: 400 }
      );
    }

    if (!author) {
      return NextResponse.json(
        { error: 'Author is required', code: 'MISSING_AUTHOR' },
        { status: 400 }
      );
    }

    // Check slug uniqueness
    const existingSlug = await db
      .select()
      .from(blogPosts)
      .where(eq(blogPosts.slug, slug.trim()))
      .limit(1);

    if (existingSlug.length > 0) {
      return NextResponse.json(
        { error: 'Slug already exists', code: 'DUPLICATE_SLUG' },
        { status: 400 }
      );
    }

    // Prepare insert data
    const currentTime = new Date().toISOString();
    const published = isPublished ?? false;

    const insertData: any = {
      title: title.trim(),
      slug: slug.trim(),
      excerpt: excerpt.trim(),
      body: postBody.trim(),
      featuredImage: featuredImage.trim(),
      category: category.trim(),
      author: author.trim(),
      tags: tags ? JSON.stringify(tags) : null,
      seoTitle: seoTitle ? seoTitle.trim() : null,
      seoDescription: seoDescription ? seoDescription.trim() : null,
      isPublished: published,
      publishedAt: published && !publishedAt ? currentTime : (publishedAt ?? null),
      createdAt: currentTime,
      updatedAt: currentTime,
    };

    const newBlogPost = await db
      .insert(blogPosts)
      .values(insertData)
      .returning();

    return NextResponse.json(newBlogPost[0], { status: 201 });
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
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { error: 'Valid ID is required', code: 'INVALID_ID' },
        { status: 400 }
      );
    }

    // Check if blog post exists
    const existingPost = await db
      .select()
      .from(blogPosts)
      .where(eq(blogPosts.id, parseInt(id)))
      .limit(1);

    if (existingPost.length === 0) {
      return NextResponse.json(
        { error: 'Blog post not found', code: 'NOT_FOUND' },
        { status: 404 }
      );
    }

    const body = await request.json();
    const {
      title,
      slug,
      excerpt,
      body: postBody,
      featuredImage,
      category,
      author,
      tags,
      seoTitle,
      seoDescription,
      isPublished,
      publishedAt,
    } = body;

    // If slug is being updated, check uniqueness
    if (slug && slug !== existingPost[0].slug) {
      const existingSlug = await db
        .select()
        .from(blogPosts)
        .where(eq(blogPosts.slug, slug.trim()))
        .limit(1);

      if (existingSlug.length > 0) {
        return NextResponse.json(
          { error: 'Slug already exists', code: 'DUPLICATE_SLUG' },
          { status: 400 }
        );
      }
    }

    // Prepare update data
    const updateData: any = {
      updatedAt: new Date().toISOString(),
    };

    if (title !== undefined) updateData.title = title.trim();
    if (slug !== undefined) updateData.slug = slug.trim();
    if (excerpt !== undefined) updateData.excerpt = excerpt.trim();
    if (postBody !== undefined) updateData.body = postBody.trim();
    if (featuredImage !== undefined) updateData.featuredImage = featuredImage.trim();
    if (category !== undefined) updateData.category = category.trim();
    if (author !== undefined) updateData.author = author.trim();
    if (tags !== undefined) updateData.tags = JSON.stringify(tags);
    if (seoTitle !== undefined) updateData.seoTitle = seoTitle ? seoTitle.trim() : null;
    if (seoDescription !== undefined) updateData.seoDescription = seoDescription ? seoDescription.trim() : null;

    // Handle isPublished and publishedAt logic
    if (isPublished !== undefined) {
      updateData.isPublished = isPublished;
      
      // If changing to published and no publishedAt exists or provided, set it to now
      if (isPublished && !existingPost[0].publishedAt && !publishedAt) {
        updateData.publishedAt = new Date().toISOString();
      }
    }

    if (publishedAt !== undefined) {
      updateData.publishedAt = publishedAt;
    }

    const updatedPost = await db
      .update(blogPosts)
      .set(updateData)
      .where(eq(blogPosts.id, parseInt(id)))
      .returning();

    return NextResponse.json(updatedPost[0], { status: 200 });
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
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { error: 'Valid ID is required', code: 'INVALID_ID' },
        { status: 400 }
      );
    }

    // Check if blog post exists
    const existingPost = await db
      .select()
      .from(blogPosts)
      .where(eq(blogPosts.id, parseInt(id)))
      .limit(1);

    if (existingPost.length === 0) {
      return NextResponse.json(
        { error: 'Blog post not found', code: 'NOT_FOUND' },
        { status: 404 }
      );
    }

    const deleted = await db
      .delete(blogPosts)
      .where(eq(blogPosts.id, parseInt(id)))
      .returning();

    return NextResponse.json(
      {
        message: 'Blog post deleted successfully',
        deletedPost: deleted[0],
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