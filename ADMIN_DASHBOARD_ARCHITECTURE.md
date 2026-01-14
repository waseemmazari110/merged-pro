# Admin Dashboard - Complete Implementation Guide

## Overview
This document outlines the complete architecture for a secure, production-ready Admin Dashboard for the Orchids Escape Houses platform.

## Architecture

### 1. Authentication & Authorization

**Admin Access Flow:**
```
Admin Login (localhost:3001/admin/login)
    ↓
Validates credentials against user table (role="admin")
    ↓
Creates better-auth session (better-auth.session_token cookie)
    ↓
Redirects to /admin/dashboard
    ↓
Middleware checks for valid session
    ↓
Dashboard loads with admin data
```

**Key Security Points:**
- Admin login endpoint: `/api/auth/admin/login` (validates role="admin")
- Admin profile endpoint: `/api/admin/profile` (validates role="admin")
- Middleware checks for `better-auth.session_token` on all `/admin/*` routes
- Admin session is isolated from user sessions
- Admin cannot access public site logged in as admin
- Regular users cannot access admin dashboard

### 2. Admin User Account Setup

**Current Admin Account:**
- Email: `cswaseem110@gmail.com`
- Password: `Admin123`
- Name: `Dan`
- Role: `admin`
- Status: Active

**To create additional admins:**
Run the setup script or manually insert into database:
```sql
INSERT INTO user (
  id, name, email, email_verified, role, created_at, updated_at
) VALUES (
  'admin_id_' || datetime('now'),
  'Admin Name',
  'admin@example.com',
  1,
  'admin',
  datetime('now'),
  datetime('now')
);
```

### 3. Dashboard Features & Data

#### A. Overview/Statistics
- **Total Users**: Count all users with role != "admin"
- **Total Admins**: Count all users with role = "admin"
- **Total Bookings**: Sum of all bookings
- **Total Revenue**: Sum of all payments received
- **Active Subscriptions**: Count of active memberships
- **Pending Approvals**: Count of properties awaiting approval

#### B. Users Management
Display all users with:
- User ID
- Name
- Email
- Phone
- Role (customer, owner, admin)
- Membership Status (active, inactive, cancelled)
- Join Date
- Last Login
- Actions (View Profile, Edit, Deactivate, Delete)

#### C. Payments & Transactions
Display Stripe payments with:
- Payment ID
- User/Customer Name
- Amount
- Currency
- Payment Method
- Status (succeeded, pending, failed)
- Date
- Invoice Link

#### D. Subscriptions/Memberships
Display active subscriptions with:
- Subscription ID
- User Name
- Plan Name (Free, Premium, etc.)
- Price
- Billing Cycle (monthly, yearly)
- Status (active, past_due, cancelled)
- Next Billing Date
- Actions (View Invoice, Cancel, Manage)

#### E. Bookings
Display all bookings with:
- Booking ID
- Property Name
- Guest Name
- Check-in/Check-out Dates
- Status (pending, confirmed, cancelled)
- Total Price
- Payment Status

#### F. Properties
Display all properties with:
- Property ID
- Owner Name
- Property Name
- Location
- Status (pending approval, approved, rejected)
- Approval Date
- Actions (Approve, Reject, View)

### 4. Database Schema Requirements

The current schema already has:
- `user` table (with role field)
- `session` table
- `bookings` table

Additional tables needed for full functionality:
- `subscriptions` (for Stripe subscriptions)
- `payments` (for payment history)
- `properties` (for property listings)

See `/src/db/schema.ts` for full schema.

### 5. API Endpoints

Required admin endpoints:

**Admin Auth:**
- `POST /api/auth/admin/login` - Login with email/password
- `POST /api/auth/admin/logout` - Logout and clear session
- `GET /api/admin/profile` - Get current admin profile

**Admin Users:**
- `GET /api/admin/users` - List all users
- `GET /api/admin/users/:id` - Get specific user
- `PUT /api/admin/users/:id` - Update user
- `DELETE /api/admin/users/:id` - Delete user
- `PUT /api/admin/users/:id/role` - Change user role

**Admin Statistics:**
- `GET /api/admin/stats` - Dashboard statistics

**Admin Payments:**
- `GET /api/admin/payments` - List all payments
- `GET /api/admin/payments/:id` - Get payment details
- `GET /api/admin/subscriptions` - List all subscriptions

**Admin Properties:**
- `GET /api/admin/properties` - List all properties
- `GET /api/admin/properties/pending` - Properties awaiting approval
- `PUT /api/admin/properties/:id/approve` - Approve property
- `PUT /api/admin/properties/:id/reject` - Reject property

### 6. Security Checklist

✅ Admin login endpoint validates role
✅ Middleware checks for valid session on admin routes
✅ Admin cannot log into public site
✅ User sessions isolated from admin
✅ Logout properly clears cookies
✅ All admin endpoints verify admin role
✅ Password validation (trim, non-empty)
✅ Origin validation (localhost:3001, production domain)
✅ CORS properly configured
✅ Sensitive data endpoints require admin role

### 7. File Structure

```
/src/app/
  /admin/
    /login/          # Admin login page
    /dashboard/      # Admin dashboard
    /users/          # User management
    /payments/       # Payment history
    /subscriptions/  # Subscription management
  /api/
    /auth/
      /admin/        # Admin-specific auth
    /admin/          # Admin endpoints
      /profile
      /users
      /stats
      /payments
      /subscriptions
      /properties
```

### 8. Production Deployment

**Environment Variables Required:**
```
BETTER_AUTH_SECRET=xxx
BETTER_AUTH_URL=https://yourdomain.com
NEXT_PUBLIC_BETTER_AUTH_URL=https://yourdomain.com
TURSO_CONNECTION_URL=xxx
STRIPE_SECRET_KEY=xxx
STRIPE_PUBLISHABLE_KEY=xxx
```

**Trusted Origins:**
```
- https://yourdomain.com
- https://www.yourdomain.com
- http://localhost:3000
- http://localhost:3001
```

**Security Headers:**
- CSP (Content Security Policy)
- X-Frame-Options: DENY
- X-Content-Type-Options: nosniff
- Strict-Transport-Security (HSTS)

### 9. Admin Dashboard Routes Reference

| Route | Purpose | Components |
|-------|---------|-----------|
| `/admin/login` | Admin authentication | Login form, email/password validation |
| `/admin/dashboard` | Main dashboard | Stats cards, charts, navigation |
| `/admin/dashboard?view=users` | User management | User list, search, filter |
| `/admin/dashboard?view=payments` | Payment history | Payment table, filters, export |
| `/admin/dashboard?view=subscriptions` | Subscription mgmt | Subscription list, status |
| `/admin/dashboard?view=bookings` | Booking management | Booking list, status updates |
| `/admin/dashboard?view=properties` | Property approvals | Pending properties, approve/reject |

### 10. Testing Checklist

- [ ] Admin can login with valid credentials
- [ ] Admin is redirected to dashboard on successful login
- [ ] Non-admin users cannot access /admin routes
- [ ] Logout clears admin session
- [ ] Dashboard loads all data correctly
- [ ] User search/filter works
- [ ] Payment history displays correctly
- [ ] Subscription status updates work
- [ ] Property approval/rejection works
- [ ] Admin can update user details
- [ ] Admin cannot delete own account
- [ ] All API endpoints require admin role

