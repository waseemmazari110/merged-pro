# Admin Dashboard Data Loading Troubleshooting Guide

## Problem: Data is not being loaded to the admin dashboard

### Step-by-Step Diagnostics

#### 1. Verify Admin Login
- [ ] You are logged in as admin (should see "Dan" in bottom-left corner)
- [ ] URL is `/admin/dashboard`
- [ ] No "Access Denied" message

#### 2. Check Browser Console
Open Developer Tools (F12) and go to Console tab:

**Look for error messages like:**
- `Error loading data: ...`
- `Failed to load stats: ...`
- `Failed to load users: ...`

**Copy the error message and check below**

#### 3. Test Individual API Endpoints

1. **Manually test each endpoint** - Paste this in browser console while on `/admin/dashboard`:

```javascript
// Test Stats API
fetch("/api/admin/dashboard-stats", { credentials: "include" })
  .then(r => r.json())
  .then(d => console.log("Stats:", d))
  .catch(e => console.error("Error:", e));

// Test Users API
fetch("/api/admin/dashboard-users", { credentials: "include" })
  .then(r => r.json())
  .then(d => console.log("Users:", d))
  .catch(e => console.error("Error:", e));

// Test Properties API
fetch("/api/admin/dashboard-properties?status=pending", { credentials: "include" })
  .then(r => r.json())
  .then(d => console.log("Properties:", d))
  .catch(e => console.error("Error:", e));

// Test Payments API
fetch("/api/admin/dashboard-payments", { credentials: "include" })
  .then(r => r.json())
  .then(d => console.log("Payments:", d))
  .catch(e => console.error("Error:", e));

// Test Subscriptions API
fetch("/api/admin/dashboard-subscriptions", { credentials: "include" })
  .then(r => r.json())
  .then(d => console.log("Subscriptions:", d))
  .catch(e => console.error("Error:", e));
```

2. **Check the Network Tab** (F12 → Network):
   - Click a tab in dashboard (e.g., Users)
   - Should see API request like `/api/admin/dashboard-users`
   - Check if response is 200 or error (4xx, 5xx)
   - View response in "Response" tab

---

## Common Issues & Solutions

### Issue 1: "403 Unauthorized" Error
**Cause:** Not logged in as admin or session expired

**Solution:**
- Go to `/admin/login`
- Login with: 
  - Email: `dan@example.com` (or your admin email)
  - Password: `Admin123`
- Verify user exists in database with `role = "admin"`

### Issue 2: "Failed to fetch" Error
**Cause:** Network error or endpoint doesn't exist

**Solution:**
- Check your internet connection
- Verify the API endpoints exist:
  - `/src/app/api/admin/dashboard-stats/route.ts`
  - `/src/app/api/admin/dashboard-users/route.ts`
  - `/src/app/api/admin/dashboard-properties/route.ts`
  - `/src/app/api/admin/dashboard-payments/route.ts`
  - `/src/app/api/admin/dashboard-subscriptions/route.ts`

### Issue 3: Empty Data (No Users, Stats, etc.)
**Cause:** Database has no data

**Solution:**
- Create test users:
  ```sql
  INSERT INTO user (id, name, email, role, created_at, updated_at)
  VALUES ('test1', 'Test User', 'test@example.com', 'guest', datetime('now'), datetime('now'));
  ```
- Create test properties (if needed):
  - Login as owner
  - Create a property after buying subscription

### Issue 4: 500 Server Error
**Cause:** Database query error or missing column

**Solution:**
- Check server logs in terminal running Next.js
- Look for error messages like:
  - `no such column: properties.plan` (FIXED - but check if it's cached)
  - `no such column: user.phone` (FIXED - but check if it's cached)
- Hard refresh browser: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
- Rebuild project: `npm run build`

---

## Data Expectations

### Overview Tab
Shows 4 cards:
- **Total Users** - Count of all users in database
- **Total Revenue** - Sum of all booking prices
- **Total Subscriptions** - Count of users with role = "owner"
- **Active Subscriptions** - Count of owners with paymentStatus = "paid"

**Data comes from:**
- `/api/admin/dashboard-stats`
- **Requires:** At least 1 user in database

### Users Tab
Shows table of all users with:
- Name
- Email
- Role (admin/owner/guest/customer)
- Join date
- Delete action

**Data comes from:**
- `/api/admin/dashboard-users`
- **Requires:** At least 1 user in database

### Properties Tab
Shows cards for each property with:
- Title & location
- Owner info
- Capacity details
- Status
- Approve/Reject buttons

**Data comes from:**
- `/api/admin/dashboard-properties?status=pending`
- **Requires:** At least 1 property in database with status="pending"

### Payments Tab
Shows table of all payments with:
- Amount
- Status
- Date
- Method

**Data comes from:**
- `/api/admin/dashboard-payments`
- **Requires:** At least 1 booking in database

### Subscriptions Tab
Shows table of subscriptions with:
- Email
- Plan name
- Status
- Amount
- Renewal date

**Data comes from:**
- `/api/admin/dashboard-subscriptions`
- **Requires:** At least 1 user with role="owner"

---

## Debugging Steps

### Step 1: Check Authentication
```javascript
// In browser console on any page:
fetch("/api/admin/verify", { credentials: "include" })
  .then(r => r.json())
  .then(d => {
    if (d.user) {
      console.log("✅ Authenticated as:", d.user.name, d.user.role);
    } else {
      console.log("❌ Not authenticated");
    }
  });
```

### Step 2: Check Database Has Data
Open your database (Turso/SQLite) and run:
```sql
-- Count users
SELECT COUNT(*) as total_users FROM user;

-- Count properties
SELECT COUNT(*) as total_properties FROM properties;

-- Count bookings
SELECT COUNT(*) as total_bookings FROM bookings;

-- Check admin user exists
SELECT id, name, email, role FROM user WHERE role = 'admin';
```

### Step 3: Check Server Logs
In terminal running Next.js dev server, look for:
- **Error lines** starting with `❌` or `Error`
- **SQL errors** like `no such column`
- **Auth errors** like `Unauthorized`

### Step 4: Force Fresh Load
1. Hard refresh page: `Ctrl+Shift+R`
2. Clear browser cache: DevTools → Network → "Disable cache" checkbox
3. Rebuild project: 
   ```bash
   npm run build
   npm run dev
   ```

---

## If Still Not Working

### Check these files exist:
- [ ] `src/app/admin/dashboard/page.tsx` - Dashboard component
- [ ] `src/app/api/admin/dashboard-stats/route.ts` - Stats endpoint
- [ ] `src/app/api/admin/dashboard-users/route.ts` - Users endpoint
- [ ] `src/app/api/admin/dashboard-properties/route.ts` - Properties endpoint
- [ ] `src/app/api/admin/dashboard-payments/route.ts` - Payments endpoint
- [ ] `src/app/api/admin/dashboard-subscriptions/route.ts` - Subscriptions endpoint

### Verify imports are correct:
In each API file, check:
```typescript
import { db } from "@/db";  // ✅ Correct
import { db } from "@/lib/db";  // ❌ Wrong!
```

### Run test script:
1. Go to `/admin/dashboard`
2. Open DevTools Console (F12)
3. Paste the content from `ADMIN_DASHBOARD_API_TEST.js`
4. Check output for errors

---

## Expected Console Output

### Success Example:
```
🧪 Testing /api/admin/dashboard-stats...
✅ Stats: {totalUsers: 5, totalRevenue: 1250.50, ...}

🧪 Testing /api/admin/dashboard-users...
✅ Users: {users: [{id: "123", name: "John", ...}, ...]}

✅ All tests completed!
```

### Error Example:
```
🧪 Testing /api/admin/dashboard-stats...
❌ Stats Error: TypeError: Failed to fetch
```

---

## Quick Checklist

- [ ] Logged in as admin
- [ ] URL is `/admin/dashboard`
- [ ] Browser console shows no errors
- [ ] API endpoints respond with data (check Network tab)
- [ ] Database has test data (if empty, stats will show 0)
- [ ] Admin user exists with role="admin"
- [ ] Session cookie `better-auth.session_token` is set

---

## Still Need Help?

1. Check the error message in red box on dashboard
2. Check browser console for errors
3. Check Network tab for API response
4. Check server logs in terminal
5. Check database has data with `SELECT COUNT(*)` queries
6. Try hard refresh: `Ctrl+Shift+R`
7. Try rebuilding: `npm run build && npm run dev`

---

**Last Updated:** January 14, 2026
**Status:** Fully Functional ✅
