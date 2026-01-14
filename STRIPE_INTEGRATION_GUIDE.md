# Admin Dashboard - Stripe Integration Guide

## Overview
This guide explains how to integrate Stripe payments and subscriptions into the Admin Dashboard.

## 1. Stripe API Setup

### Required Stripe Keys
```env
STRIPE_SECRET_KEY=sk_test_... (or sk_live_ for production)
STRIPE_PUBLISHABLE_KEY=pk_test_... (or pk_live_ for production)
STRIPE_WEBHOOK_SECRET=whsec_... (for webhook verification)
```

### Get Keys From:
https://dashboard.stripe.com/apikeys

## 2. Core Stripe Functions Needed

### A. List All Customers
```typescript
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const customers = await stripe.customers.list({
  limit: 100,
});
```

### B. List All Payments (Charges)
```typescript
const charges = await stripe.charges.list({
  limit: 100,
});
```

### C. List All Subscriptions
```typescript
const subscriptions = await stripe.subscriptions.list({
  limit: 100,
  status: 'all', // or 'active', 'past_due', 'canceled'
});
```

### D. Get Customer with Subscriptions
```typescript
const customer = await stripe.customers.retrieve(customerId, {
  expand: ['subscriptions'],
});
```

### E. Get Subscription Details
```typescript
const subscription = await stripe.subscriptions.retrieve(subscriptionId);
// Returns: id, status, current_period_start/end, next_pending_invoice, items, etc.
```

## 3. Admin API Endpoints Implementation

### GET /api/admin/payments
Returns all payments/charges from Stripe.

```typescript
// Parameters
- limit: 50 (default)
- offset: 0 (default)
- status: 'succeeded' | 'failed' | 'pending' (optional)
- customer: 'email@example.com' (optional, search by customer)

// Response
{
  "payments": [
    {
      "id": "ch_1234567890",
      "customerId": "cus_123",
      "customerName": "John Doe",
      "customerEmail": "john@example.com",
      "amount": 29999,
      "currency": "gbp",
      "status": "succeeded",
      "paymentMethod": "card",
      "cardLast4": "4242",
      "created": "2024-01-14T10:00:00Z",
      "receiptUrl": "https://stripe.com/receipt",
      "invoiceId": "in_123"
    }
  ],
  "total": 145,
  "hasMore": true
}
```

### GET /api/admin/subscriptions
Returns all subscriptions from Stripe.

```typescript
// Parameters
- limit: 50 (default)
- offset: 0 (default)
- status: 'active' | 'past_due' | 'canceled' (optional)

// Response
{
  "subscriptions": [
    {
      "id": "sub_1234567890",
      "customerId": "cus_123",
      "customerName": "John Doe",
      "customerEmail": "john@example.com",
      "planName": "Premium Monthly",
      "planId": "price_123",
      "amount": 9999,
      "currency": "gbp",
      "billingCycle": "monthly",
      "status": "active",
      "currentPeriodStart": "2024-01-01T00:00:00Z",
      "currentPeriodEnd": "2024-02-01T00:00:00Z",
      "cancelledAt": null,
      "createdAt": "2023-01-01T00:00:00Z"
    }
  ],
  "total": 45,
  "hasMore": false
}
```

### POST /api/admin/subscriptions/:id/cancel
Cancels a subscription immediately.

```typescript
// Response
{
  "success": true,
  "subscriptionId": "sub_123",
  "cancelledAt": "2024-01-14T10:00:00Z"
}
```

## 4. Database Schema for Payments (Optional)

To cache/log payment data in your database:

```typescript
export const payments = sqliteTable('payments', {
  id: text('id').primaryKey(), // Stripe charge ID
  customerId: text('customer_id').notNull(),
  userId: text('user_id').references(() => user.id),
  amount: integer('amount').notNull(), // in cents
  currency: text('currency').notNull(),
  status: text('status').notNull(), // succeeded, failed, pending
  paymentMethod: text('payment_method'),
  description: text('description'),
  receiptUrl: text('receipt_url'),
  invoiceId: text('invoice_id'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
});

export const subscriptions = sqliteTable('subscriptions', {
  id: text('id').primaryKey(), // Stripe subscription ID
  customerId: text('customer_id').notNull(),
  userId: text('user_id').references(() => user.id),
  planId: text('plan_id').notNull(),
  status: text('status').notNull(), // active, past_due, canceled
  currentPeriodStart: integer('current_period_start', { mode: 'timestamp' }),
  currentPeriodEnd: integer('current_period_end', { mode: 'timestamp' }),
  cancelledAt: integer('cancelled_at', { mode: 'timestamp' }),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
});
```

## 5. Webhook Handling

### Set up webhook in Stripe Dashboard:
https://dashboard.stripe.com/webhooks

**Events to subscribe to:**
- `payment_intent.succeeded` - Successful payment
- `payment_intent.payment_failed` - Failed payment
- `customer.subscription.created` - New subscription
- `customer.subscription.deleted` - Subscription cancelled
- `customer.subscription.updated` - Subscription updated
- `invoice.payment_succeeded` - Invoice paid
- `invoice.payment_failed` - Invoice failed to pay

### Webhook Endpoint Implementation:
```typescript
// POST /api/webhooks/stripe
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const signature = request.headers.get('stripe-signature');
const body = await request.text();

const event = stripe.webhooks.constructEvent(
  body,
  signature,
  process.env.STRIPE_WEBHOOK_SECRET
);

switch (event.type) {
  case 'payment_intent.succeeded':
    // Update payment status
    // Send confirmation email
    break;
  case 'customer.subscription.created':
    // Create subscription record
    // Update user membership
    break;
  case 'customer.subscription.deleted':
    // Update subscription status
    // Cancel user membership
    break;
}
```

## 6. Admin Payment History UI Components

### Payments Table
- Payment ID
- Customer Name & Email
- Amount (formatted)
- Status (badge color: green for succeeded, red for failed, yellow for pending)
- Payment Method (card ending in XXXX)
- Date (formatted)
- Receipt Link (action button)

### Subscriptions Table
- Subscription ID
- Customer Name
- Plan Name
- Amount & Cycle
- Status (active, past_due, cancelled)
- Current Period
- Next Billing Date
- Actions (View Invoice, Manage, Cancel)

### Statistics Cards
- Total Revenue (sum of all successful charges)
- Active Subscriptions (count of status='active')
- Revenue This Month (charges from past 30 days)
- Failed Payments (count of failed charges)

## 7. Admin Dashboard Stripe Integration Tasks

### Phase 1: Basic Display (Current)
- [ ] Fetch payments from Stripe API
- [ ] Fetch subscriptions from Stripe API
- [ ] Display payment history table
- [ ] Display subscriptions table
- [ ] Add search/filter functionality

### Phase 2: Actions
- [ ] Allow admin to cancel subscriptions
- [ ] Allow admin to view invoices
- [ ] Allow admin to retry failed payments
- [ ] Allow admin to issue refunds

### Phase 3: Analytics
- [ ] Calculate MRR (Monthly Recurring Revenue)
- [ ] Chart revenue trends
- [ ] Churn analysis
- [ ] Payment method breakdown

### Phase 4: Automation
- [ ] Automatic payment reminders
- [ ] Subscription renewal notifications
- [ ] Failed payment retries
- [ ] Revenue reports (daily, monthly)

## 8. Security Considerations

✅ All endpoints require admin authentication
✅ Stripe keys stored in environment variables
✅ Webhook signatures verified
✅ Sensitive data (full card numbers) never shown
✅ PCI compliance maintained (no card data stored)
✅ Rate limiting on payment endpoints
✅ Logging of all payment operations
✅ Admin audit trail for refunds/cancellations

## 9. Testing

### Test Cards (Stripe)
- Success: 4242 4242 4242 4242
- Decline: 4000 0000 0000 0002
- 3D Secure: 4000 2500 0000 3155

### Test Subscriptions
Create test subscriptions in Stripe Dashboard and view them in admin dashboard.

## 10. Production Checklist

- [ ] Switch to live Stripe keys
- [ ] Set up webhook in production
- [ ] Enable email receipts in Stripe
- [ ] Configure email notifications
- [ ] Set up payment failure alerts
- [ ] Create payment reconciliation job
- [ ] Document payment procedures
- [ ] Test refund process
- [ ] Set up accounting integration
- [ ] Monitor payment metrics
