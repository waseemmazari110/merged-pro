# Admin Dashboard - Quick Reference & Getting Started

## 🎯 Quick Links

| Feature | URL | Purpose |
|---------|-----|---------|
| **Admin Login** | `http://localhost:3001/admin/login` | Login to admin dashboard |
| **Dashboard Home** | `http://localhost:3001/admin/dashboard` | Main admin dashboard |
| **Users** | `http://localhost:3001/admin/dashboard?view=users` | User management |
| **Payments** | `http://localhost:3001/admin/dashboard?view=transactions` | Payment history |
| **Subscriptions** | `http://localhost:3001/admin/dashboard?view=memberships` | Subscription management |
| **Bookings** | `http://localhost:3001/admin/dashboard?view=bookings` | Booking management |
| **Properties** | `http://localhost:3001/admin/dashboard?view=approvals` | Property approvals |

---

## 🔐 Admin Credentials

**Email:** `cswaseem110@gmail.com`  
**Password:** `Admin123`  
**Name:** `Dan`  
**Role:** `admin`

⚠️ **Security Note:** Change these credentials in production!

---

## 📊 Dashboard Features

### 1. Overview / Statistics
Displays key platform metrics:
- **Total Users**: Number of registered users
- **Total Owners**: Property owners
- **Total Admins**: Admin accounts
- **Total Bookings**: All booking records
- **Total Revenue**: Sum of all payments
- **Active Subscriptions**: Active membership plans
- **Pending Approvals**: Properties awaiting approval

### 2. User Management
Complete user control:
- **View All Users** - See all registered users
- **Search & Filter** - Find users by email, name, or role
- **Filter by Role** - Customer, Owner, Admin
- **Filter by Status** - Active, Inactive, Pending
- **User Details** - View full profile
- **Edit User** - Update user information
- **Change Role** - Promote/demote users
- **Deactivate/Activate** - Control user access
- **Delete User** - Remove user account (with warning)

### 3. Payment History
Monitor all payments:
- **Payment ID** - Stripe charge reference
- **Customer** - User/customer name and email
- **Amount** - Payment amount in GBP
- **Status** - Succeeded, Failed, Pending
- **Method** - Card type (Visa, Mastercard, etc.)
- **Card Details** - Last 4 digits
- **Date** - Payment timestamp
- **Receipt** - Link to Stripe receipt
- **Search** - By customer email or name
- **Filter** - By payment status
- **Export** - Download payment CSV

### 4. Subscriptions/Memberships
Track active subscriptions:
- **Subscription ID** - Unique subscription reference
- **Customer** - User name and email
- **Plan** - Current plan name (Free, Premium, etc.)
- **Amount** - Monthly/yearly price
- **Cycle** - Billing frequency
- **Status** - Active, Past Due, Cancelled
- **Period** - Current billing period dates
- **Next Billing** - Date of next charge
- **Actions** - View invoice, manage, cancel
- **MRR** - Monthly Recurring Revenue total

### 5. Bookings Management
Oversee all bookings:
- **Booking ID** - Unique booking reference
- **Property** - Property name
- **Guest** - Guest name and email
- **Dates** - Check-in and check-out
- **Guests** - Number of guests
- **Status** - Pending, Confirmed, Cancelled
- **Price** - Total booking amount
- **Payment Status** - Paid, Pending, Failed
- **Created** - Booking date
- **Actions** - Approve, cancel, view details

### 6. Property Approvals
Approve/reject property listings:
- **Property ID** - Unique property reference
- **Owner** - Property owner name
- **Name** - Property listing name
- **Location** - Property location
- **Status** - Pending, Approved, Rejected
- **Submitted** - Date property was submitted
- **Preview** - View property images
- **Approve** - Accept property listing
- **Reject** - Decline property listing
- **Comments** - Add approval notes

---

## 🔑 Key Administration Tasks

### Managing Users

**To View All Users:**
1. Go to Dashboard → Users tab
2. See all users with their details
3. Search by email or name

**To Change User Role:**
1. Find user in Users list
2. Click "Edit" or "Change Role"
3. Select new role (Customer, Owner, Admin)
4. Save changes
5. User can access features for new role

**To Deactivate User:**
1. Click user actions menu
2. Select "Deactivate"
3. User cannot login
4. Can be reactivated later

**To Delete User:**
1. Click user actions menu
2. Select "Delete User"
3. Confirm deletion
4. ⚠️ This cannot be undone
5. All user data deleted (bookings, subscriptions, etc.)

### Managing Payments

**To View Payment Details:**
1. Go to Dashboard → Payments tab
2. Click on any payment row
3. See full payment details
4. View receipt on Stripe

**To Search Payments:**
1. Use search bar (email or amount)
2. Filter by status (Succeeded, Failed, Pending)
3. Filter by date range
4. Export as CSV

**To Investigate Failed Payment:**
1. Filter by "Failed" status
2. Click payment to see error details
3. Contact customer if needed
4. Attempt payment retry in Stripe

### Managing Subscriptions

**To View Subscriptions:**
1. Go to Dashboard → Subscriptions tab
2. See all active and past subscriptions
3. View MRR (Monthly Recurring Revenue)

**To Cancel Subscription:**
1. Find subscription in list
2. Click "Cancel" action
3. Confirm cancellation
4. Subscription ends at period end (or immediately, depending on setting)

**To View Invoice:**
1. Click "View Invoice" on subscription row
2. Opens Stripe invoice in new tab
3. See payment details, items, tax

---

## 🛡️ Security & Best Practices

### Admin Access Control
- ✅ Only users with role="admin" can access `/admin/*`
- ✅ Non-admin users get redirected to login
- ✅ Admin login separate from customer login
- ✅ Admin cannot be logged into main site simultaneously

### Session Management
- ✅ Admin sessions use separate cookies
- ✅ Logout properly clears all cookies
- ✅ Sessions expire after inactivity (configurable)
- ✅ IP/User-Agent logging for security audit

### Data Protection
- ✅ All passwords hashed with bcrypt
- ✅ Sensitive data (card numbers) not stored
- ✅ PCI-DSS compliant
- ✅ HTTPS required in production
- ✅ Rate limiting on auth endpoints

### Audit Trail
- ✅ All admin actions logged
- ✅ Login attempts tracked
- ✅ Changes to users/settings recorded
- ✅ Payment operations audited

---

## 🚀 Production Deployment

### Pre-Deployment Checklist

- [ ] Change admin password
- [ ] Create backup admin account
- [ ] Enable email notifications
- [ ] Set up payment alerts
- [ ] Configure webhook URLs
- [ ] Test payment scenarios
- [ ] Review security settings
- [ ] Set up monitoring/logging
- [ ] Configure backup schedule
- [ ] Test disaster recovery

### Environment Variables

```env
# Auth
BETTER_AUTH_SECRET=xxxxxxxxxxxx
BETTER_AUTH_URL=https://yourdomain.com
NEXT_PUBLIC_BETTER_AUTH_URL=https://yourdomain.com

# Database
TURSO_CONNECTION_URL=libsql://...

# Stripe
STRIPE_SECRET_KEY=sk_live_xxxxx
STRIPE_PUBLISHABLE_KEY=pk_live_xxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxx

# Email (for notifications)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=noreply@yourdomain.com
SMTP_PASSWORD=xxxxx
```

### Trusted Origins (Update in auth.ts)

```typescript
trustedOrigins: [
  "https://yourdomain.com",
  "https://www.yourdomain.com",
  "http://localhost:3000",
  "http://localhost:3001",
]
```

---

## 📱 Mobile Access

Admin dashboard is responsive and works on:
- ✅ Desktop (Chrome, Firefox, Safari, Edge)
- ✅ Tablet (iPad, Android tablets)
- ✅ Mobile (iPhone, Android phones)

---

## 🆘 Troubleshooting

### "Invalid origin" Error
**Problem:** Login fails with "Invalid origin: ..."
**Solution:** Add your domain to `trustedOrigins` in `/src/lib/auth.ts`

### "Redirect timeout" Error
**Problem:** Login successful but doesn't redirect to dashboard
**Solution:** 
1. Check browser console for errors
2. Verify `/api/admin/profile` endpoint responds
3. Check session cookies in DevTools
4. Try logout and login again

### "Unauthorized" on Admin Routes
**Problem:** Accessing `/admin/*` redirects to login
**Solution:**
1. Login with correct admin credentials
2. Check user role is "admin" in database
3. Verify session cookie is set
4. Clear browser cookies and login again

### Payment Data Not Showing
**Problem:** Payments tab shows no data
**Solution:**
1. Ensure Stripe API keys are valid
2. Create test transaction in Stripe
3. Check API endpoint is returning data
4. Verify admin has payment access

---

## 📚 Related Documentation

- [Admin Dashboard Architecture](./ADMIN_DASHBOARD_ARCHITECTURE.md)
- [Stripe Integration Guide](./STRIPE_INTEGRATION_GUIDE.md)
- [Authentication System](./AUTH_SYSTEM_TESTING_GUIDE.md)
- [Deployment Guide](./DEPLOYMENT_READY_CHECKLIST.md)

---

## 💡 Tips & Tricks

1. **Use Search**: Most tables have search - use it to find specific users/payments quickly
2. **Bulk Actions**: Many tables support bulk select for mass operations
3. **Export Data**: Download user lists, payments, or bookings as CSV
4. **Filters**: Combine multiple filters for precise data views
5. **Keyboard Shortcuts**:
   - `Ctrl+K` / `Cmd+K` - Open search
   - `Escape` - Close modals
   - `Enter` - Submit forms

---

## 📞 Support

For issues or feature requests:
1. Check this documentation first
2. Review error messages in browser console
3. Check server logs (`npm run dev` output)
4. Contact development team with error details

---

**Last Updated:** January 14, 2026  
**Version:** 1.0
