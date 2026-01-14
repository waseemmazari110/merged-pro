# Admin Isolation Architecture

## Overview

This document describes the complete admin isolation system implemented to ensure that:
1. **Admin users CANNOT access any public/user-facing routes**
2. **Admin users ONLY see the admin dashboard** at `/admin/dashboard`
3. **Multiple security layers** prevent unauthorized access
4. **Database schema** explicitly marks admin users for faster queries

## The Problem

Previously, admin users could log in and access public routes (home page, booking pages, etc.). This violated the security principle of least privilege and created confusion about what admins can access.

## The Solution: Multi-Layer Security

### Layer 1: Database Schema (Permanent)

**File**: `drizzle/schema.ts`

```typescript
export const user = sqliteTable("user", {
  // ... other fields ...
  role: text().default("guest").notNull(),           // Explicit role (admin, owner, customer, guest)
  isAdmin: integer("is_admin").default(0).notNull(), // Explicit admin flag for fast queries
});
```

**Why both `role` and `isAdmin`?**
- `role='admin'`: Semantic meaning of what this user does
- `isAdmin=1`: Fast database queries, explicit admin marking, prevents role field errors

**Migration**: Run `npm run migrate:admin` to add this column to existing databases

### Layer 2: Root Layout Wrapper (Client-Side)

**File**: `src/app/AdminRedirectWrapper.tsx`

This React component wraps the entire application and:
1. Checks if the current user is admin (via `/api/user/profile`)
2. Checks if they're on a blocked route
3. **Immediately redirects to `/admin/dashboard`** before rendering any content
4. Prevents flash of protected content during redirect

**Protected Routes**:
```
/                       (home)
/login                  (customer login)
/account/*              (customer account pages)
/booking/*              (booking pages)
/experiences/*          (experiences)
/destinations/*         (destinations)
/house-styles/*         (house styles)
/inspiration/*          (inspiration)
/contact/*              (contact page)
/advertise*             (advertiser pages)
/choose-plan/*          (pricing pages)
/owner-login/*          (owner login)
/owner-sign-up/*        (owner signup)
```

### Layer 3: Middleware (Request Level)

**File**: `src/middleware.ts`

The middleware enforces:
1. HTTPS redirect for non-localhost
2. Route standardization (old routes → new routes)
3. Session requirements for protected routes
4. Admin-only route protection

**Key Point**: Middleware cannot check user role from database (too slow), so it relies on layouts and client-side checks.

### Layer 4: Layout-Level Guards (Server-Side)

**Files**: 
- `src/app/(home)/layout.tsx`
- `src/app/account/layout.tsx`
- `src/app/admin/layout.tsx`
- `src/app/owner/layout.tsx`

Each layout server component:
1. Gets the session via `auth.api.getSession()`
2. Checks the user's role
3. **Redirects admin users to `/admin/dashboard`** (server-side redirect)
4. Prevents rendering of protected content

Example from home layout:
```typescript
export default async function HomeLayout() {
  const session = await auth.api.getSession();
  const user = session?.user as any;
  const role = user?.role;

  if (user && role === "admin") {
    redirect("/admin/dashboard"); // Server-side redirect
  }

  return <>{/* protected content */}</>;
}
```

### Layer 5: API Endpoint Protection

**File**: `src/app/api/user/profile/route.ts`

Returns current user profile with role and isAdmin flag:
```json
{
  "id": "user123",
  "email": "admin@example.com",
  "role": "admin",
  "isAdmin": 1,
  "name": "Admin User"
}
```

## How Admin Users Flow

```
1. Admin logs in at /auth/admin-login
   ↓
2. Session created with role='admin', isAdmin=1
   ↓
3. Redirected to /admin/dashboard by login logic
   ↓
4. Admin sees admin dashboard
   ↓
5. If admin tries to navigate to / (home):
   - AdminRedirectWrapper checks /api/user/profile
   - Sees role='admin' AND isAdmin=1
   - Redirects back to /admin/dashboard
   ↓
6. If somehow middleware allows access:
   - Layout server component checks session
   - Sees role='admin'
   - Server-side redirects to /admin/dashboard
```

## How Regular Users Flow

```
1. Customer logs in at /login
   ↓
2. Session created with role='customer', isAdmin=0
   ↓
3. Redirected to /account/dashboard
   ↓
4. Customer can access public pages (/, /experiences, /destinations, etc.)
   ↓
5. If customer tries to access /admin:
   - Middleware checks for session
   - Redirects to /auth/admin-login (no access)
```

## Testing Admin Isolation

### Test 1: Admin Cannot Access Home Page
```bash
1. Open http://localhost:3000/auth/admin-login
2. Log in with admin credentials
3. Expected: Redirect to /admin/dashboard (NOT home page)
4. Try to access http://localhost:3000/ directly
5. Expected: Immediately redirect to /admin/dashboard
```

### Test 2: Admin Cannot Access Booking Page
```bash
1. Log in as admin
2. Try to access http://localhost:3000/booking/search
3. Expected: Redirect to /admin/dashboard
4. Check browser console for admin isolation warning
```

### Test 3: Admin Cannot Access Account Page
```bash
1. Log in as admin
2. Try to access http://localhost:3000/account/dashboard
3. Expected: Redirect to /admin/dashboard
```

### Test 4: Customer Can Access Home
```bash
1. Open http://localhost:3000/auth/login
2. Log in with customer credentials
3. Expected: Redirect to /account/dashboard
4. Try to access http://localhost:3000/
5. Expected: Home page loads normally
```

### Test 5: Database Verification
```bash
npm run db:check-admin
```

This script verifies:
- Admin user has `role='admin'`
- Admin user has `isAdmin=1`
- No other users incorrectly marked as admin

## Setting Up Admin User

When creating an admin user, ensure:
1. `role` is set to `'admin'`
2. `isAdmin` is set to `1`

Example:
```typescript
const adminUser = await db.insert(user).values({
  id: "admin-uuid",
  email: "admin@example.com",
  name: "Admin",
  role: "admin",
  isAdmin: 1,  // CRITICAL
  emailVerified: 1,
  createdAt: Date.now(),
  updatedAt: Date.now(),
});
```

## Auth Helper Functions

**File**: `src/lib/auth-helpers.ts`

Key functions for admin checking:
```typescript
// Check if a user object is admin
isUserAdmin(user) → boolean

// Check if current session is admin
isCurrentUserAdmin() → Promise<boolean>

// Validate expected role with admin flag
validateSessionRole(expectedRole) → Promise<boolean>
```

## Why Multiple Layers?

1. **Client-side wrapper**: Fastest redirect, prevents flash of content
2. **Server-side layouts**: More reliable, can't be bypassed by disabling JS
3. **Middleware**: Catches edge cases, handles redirects early
4. **Database flag**: Permanent, used for queries and reporting
5. **API endpoint**: Source of truth for current user role

**Defense in depth**: Even if one layer fails, others catch the problem.

## Security Notes

### What This Protects Against
- Admin accidentally accessing public pages
- Admin confusion about their scope
- Frontend routes being accessible to wrong roles
- Database inconsistencies with role data

### What This Doesn't Protect Against
- API endpoints that don't check role
- Server-side data leakage in queries
- Third-party integrations without auth
- Compromised admin account

**Recommendation**: Also implement role checks in all API endpoints and database queries.

## Migration Checklist

- [ ] Run database migration: `npm run migrate:admin`
- [ ] Verify admin users have `isAdmin=1`: `npm run db:check-admin`
- [ ] Test admin login: Go to `/auth/admin-login`
- [ ] Test admin isolation: Try accessing public pages
- [ ] Check browser console for isolation warnings
- [ ] Test customer login still works normally
- [ ] Deploy to production

## Files Modified

1. **drizzle/schema.ts**: Added `isAdmin` column
2. **src/app/layout.tsx**: Integrated `AdminRedirectWrapper`
3. **src/app/AdminRedirectWrapper.tsx**: Client-side isolation
4. **src/app/(home)/layout.tsx**: Server-side admin check
5. **src/app/account/layout.tsx**: Created with admin block
6. **src/middleware.ts**: Cleaned up admin-blocking logic
7. **src/lib/auth-helpers.ts**: Enhanced with isAdmin checks
8. **scripts/add-isadmin-column.ts**: Migration script
9. **scripts/verify-admin-isolation.ts**: Verification script

## Troubleshooting

### Admin Still Sees Public Pages
1. Check browser console for errors
2. Verify `/api/user/profile` returns correct role
3. Check that `isAdmin=1` in database
4. Clear browser cache and cookies
5. Restart dev server

### Admin Can Access /admin But Not Dashboard
1. Check that `/admin/dashboard` route exists
2. Verify admin layout doesn't have additional blocks
3. Check for typos in route names

### Customer Login Broken
1. Ensure migration script only updated admin users
2. Check `role='customer'` still works
3. Verify `isAdmin=0` for customers

## Questions & Support

If admin isolation is not working:
1. Run verification scripts
2. Check browser console
3. Check server logs
4. Verify database state
5. Review this document
