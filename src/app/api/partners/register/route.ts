import { NextRequest, NextResponse } from "next/server";
import { checkForSpam, type SpamCheckData } from "@/lib/spam-protection";
import { sendPartnerRegistrationEmail } from "@/lib/email";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      firstName,
      lastName,
      email,
      phone,
      propertyName,
      location,
      bedrooms,
      sleeps,
      membershipTier,
      features,
      website,
      message,
      honeypot,
      timestamp,
      challenge,
      userInteraction
    } = body;

    // Validate required fields
    if (!firstName || !lastName || !email || !phone || !location || !bedrooms || !sleeps) {
      return NextResponse.json(
        { error: 'Please fill in all required fields' },
        { status: 400 }
      );
    }

    // Run comprehensive spam check
    const spamCheckData: SpamCheckData = {
      email,
      honeypot,
      timestamp,
      challenge,
      userInteraction
    };

    const spamCheck = await checkForSpam(request, spamCheckData);

    if (spamCheck.isSpam) {
      console.log(`🚫 Partner registration spam blocked: ${spamCheck.reason}`);
      return NextResponse.json(
        { error: spamCheck.reason || 'Submission rejected' },
        { status: 429 }
      );
    }

    // Send email notification
    try {
      await sendPartnerRegistrationEmail({
        firstName,
        lastName,
        email,
        phone,
        propertyName,
        location,
        bedrooms,
        sleeps,
        membershipTier,
        features,
        website,
        message
      });
    } catch (emailError) {
      console.error('Failed to send partner registration email:', emailError);
      // Continue - don't block the user if email notification fails
    }

    console.log('✅ Partner registration submission:', {
      name: `${firstName} ${lastName}`,
      email,
      property: propertyName,
      location
    });

    return NextResponse.json(
      { 
        message: 'Registration submitted successfully! Our team will be in touch within 48 hours.',
        success: true
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Partner register API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
