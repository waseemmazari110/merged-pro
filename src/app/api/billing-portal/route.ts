import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { stripe } from '@/lib/stripe';
import { auth } from '@/lib/auth';
import { db } from '@/db';
import { properties as propertiesTable } from '@/db/schema';
import { eq, and } from 'drizzle-orm';

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { propertyId } = body;

    if (!propertyId) {
      return NextResponse.json({ error: 'Property ID is required' }, { status: 400 });
    }

    // Find the property and its stripe customer ID
    const property = await db.query.properties.findFirst({
      where: and(
        eq(propertiesTable.id, parseInt(propertyId)),
        eq(propertiesTable.ownerId, session.user.id)
      )
    });

    if (!property || !property.stripeCustomerId) {
      return NextResponse.json({ error: 'No active subscription found for this property' }, { status: 404 });
    }

    const headersList = await headers();
    const origin = headersList.get('origin') || 'http://localhost:3000';

    const portalSession = await stripe.billingPortal.sessions.create({
      customer: property.stripeCustomerId,
      return_url: `${origin}/owner-dashboard`,
    });

    return NextResponse.json({ url: portalSession.url });
  } catch (error) {
    console.error('Billing portal error:', error);
    return NextResponse.json(
      { error: 'Failed to create billing portal session' },
      { status: 500 }
    );
  }
}
