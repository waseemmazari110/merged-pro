import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { user as userTable, properties as propertiesTable } from '@/db/schema';
import { eq, like, or, sql, and } from 'drizzle-orm';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    
    if (!session?.user || (session.user as any).role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const role = searchParams.get('role');
    const paymentStatus = searchParams.get('paymentStatus');
    const search = searchParams.get('search');

    const conditions: any[] = [];

    if (role && role !== 'all') {
      conditions.push(eq(userTable.role, role));
    }

    if (paymentStatus && paymentStatus !== 'all') {
      conditions.push(eq(userTable.paymentStatus, paymentStatus));
    }

    if (search) {
      conditions.push(
        or(
          like(userTable.name, `%${search}%`),
          like(userTable.email, `%${search}%`)
        )
      );
    }

    let query = db.select().from(userTable);
    
    if (conditions.length > 0) {
      query = query.where(and(...conditions)) as any;
    }

    const users = await query;

    const usersWithProperties = await Promise.all(
      users.map(async (u) => {
        const propertyCount = await db
          .select({ count: sql<number>`count(*)` })
          .from(propertiesTable)
          .where(eq(propertiesTable.ownerId, u.id));

        return {
          ...u,
          propertyCount: propertyCount[0]?.count || 0,
        };
      })
    );

    return NextResponse.json(usersWithProperties);
  } catch (error) {
    console.error('Admin users GET error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
