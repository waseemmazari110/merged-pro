import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { user as userTable, properties as propertiesTable } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    
    if (!session?.user || (session.user as any).role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { userId, planId, propertyId } = body;

    if (!userId || !planId) {
      return NextResponse.json({ error: 'userId and planId are required' }, { status: 400 });
    }

    await db
      .update(userTable)
      .set({
        paymentStatus: 'active',
        planId: planId,
        updatedAt: new Date(),
      })
      .where(eq(userTable.id, userId));

    console.log(`[Admin Override] User ${userId} activated with plan ${planId} by admin ${session.user.id}`);

    if (propertyId) {
      await db
        .update(propertiesTable)
        .set({
          status: 'Active',
          plan: planId.charAt(0).toUpperCase() + planId.slice(1),
          isPublished: true,
          updatedAt: new Date().toISOString(),
        })
        .where(eq(propertiesTable.id, parseInt(propertyId)));

      console.log(`[Admin Override] Property ${propertyId} activated`);
    } else {
      const userProperties = await db
        .select()
        .from(propertiesTable)
        .where(eq(propertiesTable.ownerId, userId));

      for (const property of userProperties) {
        if (property.status !== 'Active') {
          await db
            .update(propertiesTable)
            .set({
              status: 'Active',
              plan: planId.charAt(0).toUpperCase() + planId.slice(1),
              isPublished: true,
              updatedAt: new Date().toISOString(),
            })
            .where(eq(propertiesTable.id, property.id));

          console.log(`[Admin Override] Property ${property.id} activated for user ${userId}`);
        }
      }
    }

    return NextResponse.json({ success: true, message: 'User and properties activated' });
  } catch (error) {
    console.error('Admin activate error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
