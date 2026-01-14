# Payment Flow Setup - Complete Guide

## Overview
The payment system is now configured to use your Stripe price IDs from the .env file. After owner sign-up, users will be redirected to choose a plan and then proceed to Stripe checkout.

## Payment Flow

### 1. Owner Sign Up (`/owner-sign-up`)
- User fills in their details (name, email, phone, property details)
- Creates account with role "owner" and payment status "pending"
- Redirects to `/choose-plan` page

### 2. Choose Plan (`/choose-plan`)
- User selects from 3 plans: Bronze (£450), Silver (£650), or Gold (£850)
- Plans are mapped to subscription tiers:
  - **Bronze** → Basic Plan (Monthly/Yearly)
  - **Silver** → Premium Plan (Monthly/Yearly)  
  - **Gold** → Enterprise Plan (Monthly/Yearly)
- When user clicks "Proceed to Payment", it calls `/api/checkout`

### 3. Checkout API (`/api/checkout`)
- Validates user authentication
- Saves the selected plan to user's account
- Creates Stripe checkout session with:
  - Correct price ID from environment variables
  - User metadata (userId, planId, propertyId)
  - Automatic tax calculation enabled
  - Tax ID collection enabled
- Redirects user to Stripe hosted checkout page

### 4. Stripe Checkout
- User enters payment details on Stripe's secure page
- Completes subscription payment
- Stripe processes the payment and creates subscription

### 5. Webhook Processing (`/api/webhooks/stripe`)
- Stripe sends webhook event when payment succeeds
- Updates user record:
  - `payment_status` → "active"
  - `plan_id` → selected plan
  - `stripe_customer_id` → Stripe customer ID
  - `stripe_subscription_id` → subscription ID

### 6. Success/Cancel Pages
- **Success** (`/payment/success`): Shows confirmation
- **Cancel** (`/payment/cancel`): Allows retry

## Stripe Price IDs Configuration

The following price IDs are configured in your .env file:

```env
# Monthly Plans
STRIPE_PRICE_BASIC_MONTHLY=price_1SlA8rI0J9sqa21Cpr3kyVzE
STRIPE_PRICE_PREMIUM_MONTHLY=price_1SlA9zI0J9sqa21C5otPYqAU
STRIPE_PRICE_ENTERPRISE_MONTHLY=price_1SlAAtI0J9sqa21CYrz1BcfW

# Yearly Plans (Default)
STRIPE_PRICE_BASIC_YEARLY=price_1SlA97I0J9sqa21Cs4lB88Zd
STRIPE_PRICE_PREMIUM_YEARLY=price_1SlAAMI0J9sqa21CgTlHU0xg
STRIPE_PRICE_ENTERPRISE_YEARLY=price_1SlABDI0J9sqa21CMj7l3PUz
```

## Plan Mapping

| UI Plan  | Subscription Tier | Monthly Price ID | Yearly Price ID |
|----------|-------------------|------------------|-----------------|
| Bronze   | Basic             | price_1SlA8r...  | price_1SlA97... |
| Silver   | Premium           | price_1SlA9z...  | price_1SlAAM... |
| Gold     | Enterprise        | price_1SlAAt...  | price_1SlABD... |

## Files Modified

1. **`src/lib/plans.ts`**
   - Updated with correct price IDs from .env
   - Added `getPlanPriceId()` function for server-side price ID resolution
   - Maps Bronze/Silver/Gold to Basic/Premium/Enterprise

2. **`src/app/api/checkout/route.ts`**
   - Uses `getPlanPriceId()` to get correct Stripe price ID
   - Supports both monthly and yearly intervals
   - Saves plan selection before creating checkout session
   - Enhanced logging for debugging

3. **`.env`**
   - Added NEXT_PUBLIC_* versions for client-side access
   - All 6 price IDs configured (3 monthly + 3 yearly)

4. **`src/lib/stripe.ts`**
   - Cleaned up exports
   - Uses STRIPE_TEST_KEY or STRIPE_LIVE_KEY

## Testing the Flow

1. **Sign Up**: http://localhost:3000/owner-sign-up
2. **Choose Plan**: Will redirect automatically after sign-up
3. **Payment**: Click "Proceed to Payment" to create Stripe session
4. **Test Cards**: Use Stripe test cards:
   - Success: `4242 4242 4242 4242`
   - Failure: `4000 0000 0000 0002`

## Webhook Setup (Required for Production)

To receive payment confirmations from Stripe:

1. In Stripe Dashboard → Developers → Webhooks
2. Add endpoint: `https://yourdomain.com/api/webhooks/stripe`
3. Select events:
   - `checkout.session.completed`
   - `invoice.paid`
   - `customer.subscription.updated`
4. Copy webhook secret to `.env`:
   ```env
   STRIPE_WEBHOOK_SECRET=whsec_...
   ```

## Security Notes

- All price IDs are validated server-side
- User authentication required for checkout
- Payment processing happens on Stripe's secure servers
- Webhook signatures verified to prevent tampering
- VAT/tax automatically calculated by Stripe

## Current Status

✅ Price IDs configured from .env  
✅ Checkout API updated to use correct prices  
✅ Payment flow integrated with Stripe  
✅ Webhook handler configured  
✅ Support for both monthly and yearly billing  
✅ Automatic tax calculation enabled  

## Next Steps

1. Test the complete sign-up flow
2. Verify Stripe checkout works with test cards
3. Set up webhook endpoint for production
4. Test webhook by completing a test payment
