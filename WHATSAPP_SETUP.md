# WhatsApp Chatbot Setup Guide

## Overview
Your website now has an AI-powered WhatsApp chatbot that can answer questions about properties, experiences, pricing, and bookings using all your website information.

## What's Been Added

### 1. Floating WhatsApp Button
- Green WhatsApp button appears in the bottom-right corner of every page
- Animated with pulse effect
- Shows tooltip on hover with chatbot description
- Clicking opens WhatsApp with your business number: **07454253313**

### 2. AI-Powered Chatbot Backend
- Uses OpenAI (GPT-4) to provide intelligent responses
- Has full context about:
  - All properties (Brighton, Bath, Manchester, etc.)
  - Experiences (Cocktail Classes, Butlers, Life Drawing, etc.)
  - Pricing (weekend/midweek rates)
  - Booking process and house rules
  - Company contact information

### 3. Twilio Integration
- Handles incoming WhatsApp messages
- Sends AI-generated responses back via WhatsApp
- Professional messaging experience

## Setup Required

### Step 1: Get a WhatsApp Business Account
1. Go to [Twilio Console](https://www.twilio.com/console)
2. Create a Twilio account if you don't have one
3. Set up a WhatsApp Business sender (requires approval)
4. Get your WhatsApp Business number

### Step 2: Update WhatsApp Number
The WhatsApp number has been set to **07454253313** (447454253313 in international format).

If you need to change it in the future, edit `src/components/WhatsAppChat.tsx`:
```typescript
const WHATSAPP_NUMBER = "447454253313"; // Your WhatsApp Business number
```

### Step 3: Configure Twilio Webhook
1. In Twilio Console, go to WhatsApp Senders
2. Set the webhook URL to: `https://yourdomain.com/api/whatsapp/webhook`
3. Method: POST

### Step 4: Environment Variables
Add these to your `.env.local` file:

```env
# Twilio Credentials
TWILIO_ACCOUNT_SID=your_account_sid_here
TWILIO_AUTH_TOKEN=your_auth_token_here

# OpenAI API Key
OPENAI_API_KEY=your_openai_api_key_here
```

**Where to get these:**
- Twilio credentials: [Twilio Console](https://www.twilio.com/console)
- OpenAI API key: [OpenAI Platform](https://platform.openai.com/api-keys)

## How It Works

### User Experience
1. User clicks the green WhatsApp button on your website
2. WhatsApp opens with a pre-filled greeting message
3. User sends messages asking about properties, prices, availability, etc.
4. AI chatbot responds instantly with accurate information
5. User can have a full conversation about bookings

### Example Conversations

**User:** "Do you have any properties in Brighton with hot tubs?"
**Bot:** "Yes! We have several stunning properties in Brighton with hot tubs:

1. The Brighton Manor - Sleeps 16, 8 bedrooms, hot tub, pool, games room. From £89pp per night.
2. Brighton Seafront Villa - Sleeps 12, 6 bedrooms, hot tub with sea views. From £79pp per night.

Would you like to make an enquiry? Visit our website or call hello@groupescapehouses.co.uk"

**User:** "What experiences do you offer?"
**Bot:** "We offer amazing experiences for your hen weekend:

🍹 Cocktail Masterclass (2 hours) - from £45pp
👨 Butlers in the Buff - from £150
🎨 Life Drawing (1.5-2 hours) - from £35pp
👨‍🍳 Private Chef - from £50pp
💆 Spa Treatments - various prices
🥂 Bottomless Brunch - from £40pp

All can be added when you book your property!"

## Customization

### Update Website Context
To add more information or update pricing, edit the `WEBSITE_CONTEXT` in:
`src/app/api/whatsapp/webhook/route.ts`

### Change Button Styling
The button styling can be modified in:
`src/components/WhatsAppChatbot.tsx`

### Adjust AI Responses
- Change the OpenAI model (currently using `gpt-4o-mini`)
- Adjust `temperature` for more/less creative responses
- Modify `max_tokens` to control response length

## Testing

### Test the Button
1. Visit any page on your website
2. Click the green WhatsApp button
3. Verify it opens WhatsApp correctly

### Test the Chatbot
1. Send a message to your WhatsApp Business number
2. Check if you receive an AI-generated response
3. Try different questions about properties, pricing, etc.

## Costs

- **Twilio WhatsApp:** ~$0.005 per message
- **OpenAI API:** ~$0.0001-0.0002 per message (GPT-4o-mini)
- Very affordable even with high volume

## Support

If you encounter issues:
1. Check Twilio webhook logs in the Twilio Console
2. Check your server logs for API errors
3. Verify all environment variables are set correctly
4. Ensure your WhatsApp Business number is approved

## Next Steps

1. Get your API keys (see Step 4)
2. Update the WhatsApp number (see Step 2)
3. Configure the Twilio webhook (see Step 3)
4. Test the chatbot
5. Monitor conversations and refine the AI context as needed

Your WhatsApp chatbot is now ready to handle customer enquiries 24/7! 🎉