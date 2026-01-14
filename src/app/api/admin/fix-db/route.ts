import { db } from '@/db';
import { reviews } from '@/db/schema';
import { sql } from 'drizzle-orm';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // 1. Create the reviews table if it doesn't exist
    await db.run(sql`
      CREATE TABLE IF NOT EXISTS reviews (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        guest_name TEXT NOT NULL,
        rating INTEGER NOT NULL,
        comment TEXT NOT NULL,
        property_id INTEGER,
        review_date TEXT NOT NULL,
        guest_image TEXT,
        is_approved INTEGER DEFAULT 0,
        is_published INTEGER DEFAULT 0,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      );
    `);

    // 2. Add some sample reviews if empty
    const existingReviews = await db.select().from(reviews).limit(1);
    if (existingReviews.length === 0) {
      const now = new Date().toISOString();
      await db.insert(reviews).values([
        {
          guestName: 'Sarah Jenkins',
          rating: 5,
          comment: 'Absolutely stunning property! The hot tub was a highlight of our weekend.',
          reviewDate: '2025-11-15',
          isApproved: true,
          isPublished: true,
          createdAt: now,
          updatedAt: now,
        },
        {
          guestName: 'David Thompson',
          rating: 5,
          comment: 'Perfect for our corporate retreat. Plenty of space and great facilities.',
          reviewDate: '2025-10-20',
          isApproved: true,
          isPublished: true,
          createdAt: now,
          updatedAt: now,
        },
        {
          guestName: 'Emma Wilson',
          rating: 5,
          comment: 'The games room kept the kids entertained for hours. Highly recommend!',
          reviewDate: '2025-09-05',
          isApproved: true,
          isPublished: true,
          createdAt: now,
          updatedAt: now,
        }
      ]);
    }

    return NextResponse.json({ message: 'Database fixed successfully' });
  } catch (error: any) {
    console.error('Error fixing database:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
