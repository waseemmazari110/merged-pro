# Admin Isolation - Complete Setup Steps

## ✅ What This Achieves

✅ Admin users CANNOT access public/user pages  
✅ Admin users ONLY see admin dashboard  
✅ Database explicitly marks admin users  
✅ 5 layers of security enforce isolation  
✅ No breaking changes to existing code  

---

## 🔧 Setup Instructions

### Phase 1: Database Setup (2 minutes)

**Step 1**: Run this command to check current status:
```bash
npm run script scripts/test-admin-isolation.ts
```

**Expected Output**:
```
📋 Step 1: Database Schema Verification
✅ User table columns: [id, email, role, isAdmin, ...]
✅ Column 'isAdmin' found in user table

📋 Step 2: Admin Users Verification
✅ Found 1 admin user(s):
   ✅ admin@example.com
      - role: admin
      - isAdmin: 1

📋 Step 5: Admin Isolation Status
   Database Schema: ✅
   Admin Users Found: ✅
   Admin Flag Set: ✅
   Overall: ✅ READY
```

**If you see warnings about missing isAdmin column**, run:
```bash
npm run script scripts/add-isadmin-column.ts
```

This will:
1. Add `isAdmin` column to database
2. Set `isAdmin = 1` for all admin users
3. Verify the changes

**Step 2**: Verify setup completed:
```bash
npm run script scripts/verify-admin-isolation.ts
```

---

### Phase 2: Code Implementation (Already Done ✅)

The following changes have been made automatically:

#### **New Files Created**:
- ✅ `src/app/AdminRedirectWrapper.tsx` - Client-side isolation component
- ✅ `src/app/account/layout.tsx` - Account page admin blocker
- ✅ `scripts/add-isadmin-column.ts` - Database migration
- ✅ `scripts/verify-admin-isolation.ts` - Verification
- ✅ `scripts/test-admin-isolation.ts` - Full test suite
- ✅ `ADMIN_ISOLATION_ARCHITECTURE.md` - Detailed documentation
- ✅ `ADMIN_ISOLATION_IMPLEMENTATION.md` - Implementation details
- ✅ `ADMIN_ISOLATION_QUICK_START.md` - Quick reference

#### **Files Updated**:
- ✅ `src/app/layout.tsx` - Added AdminRedirectWrapper
- ✅ `src/app/(home)/layout.tsx` - Added admin check
- ✅ `src/lib/auth-helpers.ts` - Added isUserAdmin() function
- ✅ `drizzle/schema.ts` - Added isAdmin column definition
- ✅ `src/middleware.ts` - Simplified logic

---

### Phase 3: Testing (3-5 minutes)

**Step 1**: Start the dev server:
```bash
npm run dev
```

**Step 2**: Test Admin Isolation

Test Case 1: Admin Login
- Go to: http://localhost:3000/auth/admin-login
- Login with admin credentials
- Expected: Redirects to http://localhost:3000/admin/dashboard
- ✅ Should NOT see login confirmation page

Test Case 2: Admin Blocked from Home
- Go to: http://localhost:3000/
- Expected: Redirects to http://localhost:3000/admin/dashboard
- ✅ Check browser console for "Admin Isolation" message

Test Case 3: Admin Blocked from Booking
- Go to: http://localhost:3000/booking/search
- Expected: Redirects to http://localhost:3000/admin/dashboard
- ✅ Admin cannot access booking pages

Test Case 4: Admin Blocked from Account
- Go to: http://localhost:3000/account/dashboard
- Expected: Redirects to http://localhost:3000/admin/dashboard
- ✅ Admin cannot access customer dashboard

Test Case 5: Admin Can Access Admin Routes
- Go to: http://localhost:3000/admin/dashboard
- Expected: Loads admin dashboard
- ✅ Should see admin interface

Test Case 6: Customer Login Still Works
- Logout from admin (click logout button)
- Go to: http://localhost:3000/auth/login
- Login with customer credentials
- Expected: Redirects to http://localhost:3000/account/dashboard
- ✅ Customer can access booking, experiences, destinations, etc.

---

## 🔐 How It Works

### Security Architecture

```
LAYER 1: AdminRedirectWrapper (Client-Side)
├─ Checks user role and isAdmin flag
├─ Blocks all public pages for admins
└─ Redirects to /admin/dashboard

LAYER 2: Middleware (Request-Level)
├─ Enforces session for /admin routes
├─ Redirects to login if needed
└─ Handles HTTPS and route standardization

LAYER 3: Server Layouts
├─ (home) layout: Redirects admin users
├─ account layout: Blocks admin access
└─ admin layout: Only allows admins

LAYER 4: Database Schema
├─ role field: "admin", "owner", "customer", "guest"
└─ isAdmin field: 1 for admin, 0 for others

LAYER 5: API Endpoint
└─ /api/user/profile: Returns accurate user role
```

### Admin User Representation

In database:
```sql
email = "admin@example.com"
role = "admin"              -- String indicating role
isAdmin = 1                 -- Binary flag for fast queries
```

In code:
```typescript
// Check if user is admin
const isAdmin = user.role === 'admin' && user.isAdmin === 1;

// Helper function available
import { isUserAdmin } from '@/lib/auth-helpers';
const isAdmin = isUserAdmin(user);  // Same check, cleaner code
```

---

## 📋 Blocked Routes for Admins

These routes will redirect admin to `/admin/dashboard`:

| Route | Purpose |
|-------|---------|
| `/` | Home page |
| `/login` | Customer login |
| `/account/*` | Customer dashboard/info |
| `/booking/*` | Search & booking |
| `/experiences/*` | Experiences listing |
| `/destinations/*` | Destinations listing |
| `/house-styles/*` | House styles |
| `/inspiration/*` | Inspiration content |
| `/contact/*` | Contact form |
| `/advertise*` | Advertiser pages |
| `/choose-plan/*` | Pricing & plans |
| `/owner-login/*` | Owner login |
| `/owner-sign-up/*` | Owner signup |

---

## 🐛 Troubleshooting

### Issue: "Admin can still see public pages"

**Check 1**: Verify database setup
```bash
npm run script scripts/test-admin-isolation.ts
```
Look for ✅ marks. If you see ❌, run migration.

**Check 2**: Verify admin has correct flags
```sql
SELECT email, role, isAdmin FROM user WHERE email = 'admin@example.com';
```
Result should show: `admin@example.com | admin | 1`

**Check 3**: Clear browser cache
- Open DevTools (F12)
- Go to: Application → Storage → Clear site data
- Refresh page

**Check 4**: Restart dev server
```bash
# Press Ctrl+C in terminal
npm run dev
```

**Check 5**: Check browser console
- Open DevTools (F12)
- Go to: Console tab
- Should see: `🚫 Admin Isolation: Admin user attempted to access /...`
- If no message, admin check is not running

### Issue: "Admin sees blank/white page"

**Check 1**: Check network request
- Open DevTools (F12)
- Go to: Network tab
- Look for: Request to `/api/user/profile`
- Check: Returns `isAdmin: 1`

**Check 2**: Check for JS errors
- Open DevTools (F12)
- Go to: Console tab
- Look for red error messages
- Fix errors shown

**Check 3**: Verify session is valid
- Open DevTools (F12)
- Go to: Application → Cookies
- Look for: Cookie named `better-auth.session_token`
- Check: It exists and is not empty

### Issue: "Customer cannot login"

**Check 1**: Verify customer in database
```sql
SELECT email, role, isAdmin FROM user WHERE email = 'customer@example.com';
```
Result should show: `customer@example.com | customer | 0`

**Check 2**: Check password
- Make sure password is correct
- Try a different customer account

**Check 3**: Check email exists
- If getting "user not found", account doesn't exist
- Create new customer account: http://localhost:3000/auth/sign-up

**Check 4**: Check server logs
- Look in terminal where dev server is running
- Search for error messages with customer email

---

## 📊 Database Verification

To manually check the database state:

```sql
-- Check admin users
SELECT id, email, role, isAdmin 
FROM user 
WHERE role = 'admin';

-- Expected: Shows admin with isAdmin = 1
-- Example: 
-- | id | email | role | isAdmin |
-- | a1 | admin@example.com | admin | 1 |


-- Check customer users
SELECT id, email, role, isAdmin 
FROM user 
WHERE role = 'customer'
LIMIT 5;

-- Expected: All show isAdmin = 0
-- Example:
-- | id | email | role | isAdmin |
-- | c1 | cust1@example.com | customer | 0 |
-- | c2 | cust2@example.com | customer | 0 |


-- Check overall distribution
SELECT role, COUNT(*) as count, SUM(isAdmin) as admin_count
FROM user
GROUP BY role;

-- Expected output shows:
-- | role | count | admin_count |
-- | admin | 1 | 1 |
-- | customer | X | 0 |
-- | owner | Y | 0 |
-- | guest | Z | 0 |
```

---

## ✅ Verification Checklist

Before considering setup complete, verify:

- [ ] Database migration run: `npm run script scripts/add-isadmin-column.ts`
- [ ] Admin user has `isAdmin = 1`
- [ ] Customer users have `isAdmin = 0`
- [ ] Test script passes: `npm run script scripts/test-admin-isolation.ts`
- [ ] Admin login redirects to dashboard
- [ ] Admin cannot access `/` (home page)
- [ ] Admin cannot access `/booking/*`
- [ ] Admin cannot access `/account/*`
- [ ] Admin cannot access `/experiences/*`
- [ ] Admin cannot access `/destinations/*`
- [ ] Customer login still works normally
- [ ] Customer can access all public pages
- [ ] Browser console shows "Admin Isolation" warning for blocked pages
- [ ] No console errors visible

---

## 🚀 Deployment Steps

When deploying to production:

1. **Run migration on production database**:
   ```bash
   # Use production database URL
   TURSO_CONNECTION_URL="prod-url" TURSO_AUTH_TOKEN="prod-token" \
   npm run script scripts/add-isadmin-column.ts
   ```

2. **Verify production setup**:
   ```bash
   TURSO_CONNECTION_URL="prod-url" TURSO_AUTH_TOKEN="prod-token" \
   npm run script scripts/test-admin-isolation.ts
   ```

3. **Deploy code to production**

4. **Test in production**:
   - Go to: https://www.example.com/auth/admin-login
   - Login as admin
   - Verify redirects to dashboard
   - Try accessing public pages
   - All should redirect

5. **Monitor**:
   - Check production logs for errors
   - Monitor browser console for isolation warnings
   - Contact support if issues arise

---

## 📞 Support

If you encounter issues not covered here:

1. Check `ADMIN_ISOLATION_ARCHITECTURE.md` for detailed explanations
2. Check `ADMIN_ISOLATION_IMPLEMENTATION.md` for implementation details
3. Run test script: `npm run script scripts/test-admin-isolation.ts`
4. Check browser console for error messages
5. Check server logs for backend errors

---

## 🎉 Success Indicators

You'll know admin isolation is working when:

✅ Admin logs in and immediately sees dashboard  
✅ Admin cannot access any public pages  
✅ Admin gets redirected when typing public URL directly  
✅ Customer login still works normally  
✅ Customer can access all public pages  
✅ Browser console shows "Admin Isolation" warnings  
✅ No errors in console or server logs  

---

**Setup complete!** Admin isolation is now implemented with 5 security layers. 🔒
