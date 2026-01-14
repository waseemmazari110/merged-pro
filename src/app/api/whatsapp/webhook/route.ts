import { NextRequest, NextResponse } from "next/server";
import twilio from "twilio";
import OpenAI from "openai";

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

// Lazy initialize Twilio client only when needed
function getTwilioClient() {
  if (!accountSid || !authToken) {
    throw new Error("Twilio credentials not configured");
  }
  return twilio(accountSid, authToken);
}

// Lazy initialize OpenAI client only when needed
function getOpenAIClient() {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return null; // Return null if not configured, we'll handle gracefully
  }
  return new OpenAI({ apiKey });
}

// Website context for the AI chatbot
const WEBSITE_CONTEXT = `
You are a helpful assistant for Group Escape Houses, a luxury group house rental company in the UK.

COMPANY INFO:
- Office: 11a North St, Brighton and Hove, Brighton BN41 1DH
- Email: hello@groupescapehouses.co.uk
- Website: groupescapehouses.co.uk

SERVICES:
We offer luxury group accommodation across the UK perfect for hen weekends, birthdays, and special celebrations.
`;

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const from = formData.get("From") as string;
    const body = formData.get("Body") as string;

    if (!body) {
      return new NextResponse("No message body", { status: 400 });
    }

    let aiResponse = "Thanks for your message! For immediate assistance, please email us at hello@groupescapehouses.co.uk or visit our website at groupescapehouses.co.uk to make an instant enquiry.";

    // Try to generate AI response if OpenAI is configured

    const openai = getOpenAIClient();
    if (openai) {
      try {
        const completion = await openai.chat.completions.create({
          model: "gpt-4o-mini",
          messages: [
            {
              role: "system",
              content: WEBSITE_CONTEXT,
            },
            {
              role: "user",
              content: body,
            },
          ],
          temperature: 0.7,
          max_tokens: 500,
        });

        aiResponse = completion.choices[0].message.content || aiResponse;
      } catch (error) {
        console.error("OpenAI error:", error);
        // Fall back to default message
      }
    }

    // Send response via Twilio
    const twilioClient = getTwilioClient();
    const twiml = new twilio.twiml.MessagingResponse();
    twiml.message(aiResponse);

    return new NextResponse(twiml.toString(), {
      headers: {
        "Content-Type": "text/xml",
      },
    });
  } catch (error) {
    console.error("WhatsApp webhook error:", error);
    
    const twiml = new twilio.twiml.MessagingResponse();
    twiml.message(
      "Sorry, I'm having trouble right now. Please email us at hello@groupescapehouses.co.uk or call our office."
    );

    return new NextResponse(twiml.toString(), {
      headers: {
        "Content-Type": "text/xml",
      },
    });
  }
}

// Twilio webhook verification
export async function GET(request: NextRequest) {
  return NextResponse.json({ status: "WhatsApp webhook active" });
}