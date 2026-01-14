import { NextResponse } from "next/server";
import { checkForSpam, type SpamCheckData } from "@/lib/spam-protection";
import { sendContactEmail } from "@/lib/email";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      name,
      email,
      phone,
      groupSize,
      dates,
      location,
      experiences,
      message,
      honeypot,
      timestamp,
      challenge,
      userInteraction
    } = body;

    // Validate required fields
    if (!name || !email || !groupSize || !dates) {
      return NextResponse.json(
        { error: 'Name, email, group size, and dates are required' },
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
      console.log(`🚫 Contact form spam blocked: ${spamCheck.reason}`);
      return NextResponse.json(
        { error: spamCheck.reason || 'Submission rejected' },
        { status: 429 }
      );
    }

    // Send email notification
    try {
      await sendContactEmail({
        name,
        email,
        phone,
        groupSize,
        dates,
        location,
        experiences,
        message
      });
    } catch (emailError) {
      console.error('Failed to send email notification:', emailError);
      // Continue even if email fails - don't block the user
    }

    console.log('✅ Contact form submission:', {
      name,
      email,
      phone,
      groupSize,
      dates,
      location,
      experiencesCount: experiences?.length || 0,
      hasMessage: !!message
    });

    return NextResponse.json(
      { 
        message: 'Enquiry sent successfully! We\'ll be in touch within 2 hours.',
        success: true
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Contact API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}