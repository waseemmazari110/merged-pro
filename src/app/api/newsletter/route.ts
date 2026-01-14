import { NextResponse } from "next/server";
import { checkForSpam, type SpamCheckData } from "@/lib/spam-protection";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, honeypot, timestamp, challenge, userInteraction } = body;

    // Validate email presence
    if (!email || typeof email !== 'string' || email.trim() === '') {
      return NextResponse.json(
        { error: 'Email is required' },
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
      console.log(`🚫 Newsletter spam blocked: ${spamCheck.reason}`);
      return NextResponse.json(
        { error: spamCheck.reason || 'Submission rejected' },
        { status: 429 }
      );
    }

    // TODO: Add email to newsletter database/service
    console.log(`✅ Newsletter signup: ${email}`);

    return NextResponse.json(
      { message: 'Successfully subscribed to newsletter' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Newsletter API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}