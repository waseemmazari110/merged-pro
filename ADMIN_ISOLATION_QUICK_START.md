# Admin Isolation - Quick Start Guide

## Overview

This guide shows how to set up complete admin isolation where:
- ✅ Admins ONLY see `/admin/dashboard`
- ❌ Admins CANNOT see public pages
- ✅ Database explicitly marks admin users
- ✅ 5 layers of security enforce isolation

---

## 🚀 Setup (5 minutes)

### Step 1: Check Current Status
```bash
npm run script scripts/test-admin-isolation.ts
```

This shows:
- ✅ Database schema status
- ✅ Admin users (if any)
- ✅ Setup instructions
- ✅ What to do next

### Step 2: Migrate Database (if needed)
```bash
npm run script scripts/add-isadmin-column.ts
```

This adds the `isAdmin` column and marks all admin users.

### Step 3: Verify Setup
```bash
npm run script scripts/verify-admin-isolation.ts
```

This checks that everything is correct.

---

## 🧪 Test Admin Isolation (2 minutes)

### Manual Testing

1. **Start dev server**:
   ```bash
   npm run dev
   ```

2. **Login as admin**:
   - Open http://localhost:3000/auth/admin-login
   - Enter admin credentials
   - Expected: Redirects to `/admin/dashboard`

3. **Try accessing public pages**:
   ```
   http://localhost:3000/               ❌ Should redirect
   http://localhost:3000/booking/search ❌ Should redirect
   http://localhost:3000/account/info   ❌ Should redirect
   http://localhost:3000/experiences    ❌ Should redirect
   ```
   All should redirect to `/admin/dashboard`

4. **Check browser console**:
   - Should see: `🚫 Admin Isolation: Admin user attempted to access...`
   - This confirms the isolation is working

5. **Test customer login still works**:
   - Logout admin (go to admin dashboard, find logout button)
   - Open http://localhost:3000/auth/login
   - Enter customer credentials
   - Should redirect to `/account/dashboard`
   - Should be able to access public pages

---

## 📊 How Admin Isolation Works

### Security Layers (in order):

```
Layer 1: AdminRedirectWrapper (Client-side)
├─ Checks if user is admin
├─ Checks if on blocked route
└─ Redirects to /admin/dashboard BEFORE rendering
   ↓
Layer 2: Middleware (Request-level)
├─ Enforces HTTPS
├─ Requires session for /admin routes
└─ Standardizes routes
   ↓
Layer 3: Layouts (Server-side)
├─ (home) layout: Redirects admin users
├─ account layout: Redirects admin users
└─ admin layout: Only allows admins
   ↓
Layer 4: Database Schema
├─ Explicit `isAdmin` flag (1 = admin, 0 = not admin)
├─ Plus role field (admin, owner, customer, guest)
└─ Used for queries and reporting
   ↓
Layer 5: API Endpoint
├─ /api/user/profile returns user role
├─ Used by all client checks
└─ Source of truth
```

Any single layer failing won't break isolation - others catch it.

---

## 🗄️ Database Schema

User table now has:
```typescript
role: text                  // "admin", "owner", "customer", "guest"
isAdmin: integer            // 1 = admin, 0 = not admin
```

When creating an admin user, ensure BOTH are set:
```sql
INSERT INTO user VALUES (
  id, name, email, emailVerified, image,
  createdAt, updatedAt,
  'admin',  -- role = 'admin'
  1,        -- isAdmin = 1
  phone, companyName
)
```

---

## 📝 Files Modified

### Core Changes:
- `src/app/AdminRedirectWrapper.tsx` - **NEW**: Client-side isolation
- `src/app/layout.tsx` - Integrated AdminRedirectWrapper
- `src/app/(home)/layout.tsx` - Added admin check
- `src/app/account/layout.tsx` - **NEW**: Created with admin block
- `src/lib/auth-helpers.ts` - Added `isUserAdmin()` function
- `drizzle/schema.ts` - Added `isAdmin` column

### Scripts:
- `scripts/add-isadmin-column.ts` - **NEW**: Database migration
- `scripts/verify-admin-isolation.ts` - **NEW**: Verification
- `scripts/test-admin-isolation.ts` - **NEW**: Testing

### Documentation:
- `ADMIN_ISOLATION_ARCHITECTURE.md` - **NEW**: Detailed architecture
- `ADMIN_ISOLATION_IMPLEMENTATION.md` - **NEW**: Implementation details

---

## 🔍 Verify Admin User

Admin users must have:
- [ ] `role = 'admin'`
- [ ] `isAdmin = 1`

Check in database:
```sql
SELECT email, role, isAdmin FROM user WHERE role = 'admin';
```

Expected output:
```
admin@example.com | admin | 1
```

---

## ⚠️ Troubleshooting

### Problem: Admin can still access public pages

**Solution**:
1. Check: `npm run script scripts/test-admin-isolation.ts`
2. Verify: `isAdmin = 1` in database for admin users
3. Clear: Browser cache and cookies
4. Restart: Dev server
5. Check: Browser console for errors

### Problem: Admin sees blank/loading page

**Solution**:
1. Check: Network tab for `/api/user/profile` call
2. Check: Browser console for JS errors
3. Check: Session is still valid
4. Verify: User account in database

### Problem: Customer cannot login

**Solution**:
1. Check: Customer has `isAdmin = 0`
2. Check: Customer has `role = 'customer'`
3. Verify: Email exists in database
4. Try: Different customer account
5. Check: Console for errors

---

## 📊 Admin Isolation Flow

```
┌─────────────────────────────────────┐
│  Admin visits any page (e.g., /)    │
└──────────────┬──────────────────────┘
               │
               ↓
┌─────────────────────────────────────┐
│ AdminRedirectWrapper checks:         │
│ - Is user admin? (role + isAdmin)   │
│ - Is on blocked route?              │
└──────────────┬──────────────────────┘
               │
         ┌─────┴─────┐
         │           │
      YES│           │NO
         ↓           ↓
    ┌────────┐   ┌────────────────┐
    │REDIRECT│   │Render page     │
    │to admin│   │normally        │
    │dashboard   └────────────────┘
    └────────┘
```

---

## 🎯 What Gets Blocked

These routes redirect admin to dashboard:
- `/` (home page)
- `/login` (customer login)
- `/account/*` (customer dashboard/info)
- `/booking/*` (booking pages)
- `/experiences/*` (experiences)
- `/destinations/*` (destinations)
- `/house-styles/*` (house styles)
- `/inspiration/*` (inspiration)
- `/contact/*` (contact form)
- `/advertise*` (advertiser pages)
- `/choose-plan/*` (pricing/plans)
- `/owner-login/*` (owner login)
- `/owner-sign-up/*` (owner signup)

---

## ✅ Deployment Checklist

Before deploying to production:

- [ ] Run: `npm run script scripts/test-admin-isolation.ts`
- [ ] Verify: All tests pass
- [ ] Check: Admin users have `isAdmin=1`
- [ ] Check: Customers have `isAdmin=0`
- [ ] Test: Admin login at staging
- [ ] Test: Admin isolation works
- [ ] Test: Customer login still works
- [ ] Deploy: Code changes
- [ ] Run: Migration script on production database
- [ ] Verify: Production admin login works
- [ ] Monitor: Browser console for errors

---

## 📚 For More Details

See these files for detailed information:
- `ADMIN_ISOLATION_ARCHITECTURE.md` - Full architecture explanation
- `ADMIN_ISOLATION_IMPLEMENTATION.md` - Implementation details
- `scripts/test-admin-isolation.ts` - Testing script source

---

## 🆘 Need Help?

1. **Admin still sees public pages?**
   - Run test script: `npm run script scripts/test-admin-isolation.ts`
   - Check database: Admin must have `isAdmin=1`

2. **Getting errors in console?**
   - Check browser console for specific error messages
   - Most common: API endpoint not returning correct role

3. **Customer login broken?**
   - Verify customer has `isAdmin=0`
   - Check password is correct
   - Look for specific error in console

4. **Still stuck?**
   - Read: `ADMIN_ISOLATION_ARCHITECTURE.md`
   - Check: `scripts/test-admin-isolation.ts` output
   - Review: Browser and server console logs
