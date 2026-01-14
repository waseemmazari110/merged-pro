# Admin Login - 403 Forbidden Fix

## Problem
You're getting a **403 Forbidden** error when trying to login with the admin account. This means one of two things:

1. The admin user doesn't exist in the database
2. The admin user exists but the role is not set to "admin"

## Solution

### Step 1: Check Current Admin User Status
Run this command in your terminal:

```bash
npx ts-node check-admin-user.ts
```

This will show you:
- ✅ If the admin user exists
- ✅ What role they currently have
- ✅ All available users in the database

### Step 2: Setup Admin User
If the user doesn't exist or doesn't have the admin role, run:

```bash
npx ts-node setup-admin-user.ts
```

This script will:
- ✅ Check if user exists
- ✅ If exists, update role to "admin"
- ✅ If doesn't exist, create user with admin role
- ✅ Hash password securely

### Step 3: Verify Admin Login
After running the setup script:

1. **Restart your dev server**
   ```bash
   Ctrl+C  (stop current server)
   npm run dev  (restart)
   ```

2. **Go to admin login page**
   ```
   http://localhost:3000/admin/login
   ```

3. **Login with:**
   - Email: `cswaseem110@gmail.com`
   - Password: `Admin123`

## Expected Result

### ✅ Success
- Login page processes without hanging
- Redirects to `/admin/dashboard`
- See admin panel interface

### ❌ Still Getting 403?
Try the troubleshooting steps below:

## Troubleshooting

### 1. Check Database Connection
```bash
npx ts-node check-local-db.ts
```

### 2. Verify User Role Directly
```bash
npx ts-node -e "
import { db } from './src/db';
import { user } from './src/db/schema';
import { eq } from 'drizzle-orm';

(async () => {
  const admin = await db.select()
    .from(user)
    .where(eq(user.email, 'cswaseem110@gmail.com'))
    .get();
  console.log(JSON.stringify(admin, null, 2));
})();
"
```

### 3. Check Password Hash Format
The password should be stored as `salt:key` format (e.g., `abc123:def456`).

### 4. Clear Browser Data
- Close all browser tabs with localhost:3000
- Clear browser cache and cookies
- Restart browser
- Try login again

## Fixed Issues

### 1. 403 Admin Login Error
Now properly checks database for admin user with correct role.

### 2. Autumn CORS Warning
Updated AutumnProvider with `includeCredentials={true}` to suppress CORS warnings.

## Files Modified

1. ✅ `setup-admin-user.ts` - NEW: Script to setup/update admin user
2. ✅ `check-admin-user.ts` - NEW: Script to verify admin user exists
3. ✅ `src/lib/autumn-provider.tsx` - UPDATED: Added `includeCredentials={true}`

## Quick Start (Copy & Paste)

```bash
# 1. Check if admin exists
npx ts-node check-admin-user.ts

# 2. Setup admin if needed
npx ts-node setup-admin-user.ts

# 3. Restart dev server
npm run dev

# 4. Try login at http://localhost:3000/admin/login
```

## Need Help?

If you still can't login:
1. Make sure database is connected (check .env for TURSO_CONNECTION_URL)
2. Run check scripts above to see what's in database
3. Run setup script to ensure admin user exists with correct role
4. Clear browser cookies and try again
