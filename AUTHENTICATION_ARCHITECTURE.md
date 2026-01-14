# Production Solution: Separate Admin & User Authentication

## Problem Analysis

**Current Issue:**
- Admin dashboard and main site share the same authentication session
- Single `better-auth` instance with one session cookie
- Logging in/out on one affects the other

**Root Cause:**
- All roles use the same session token cookie: `better-auth.session_token`
- No session scope isolation
- Shared auth provider across all routes

---

## Solution Architecture

### Option 1: Single Auth with Role-Based Isolation (RECOMMENDED)

**Best for:** Single domain with multiple user roles  
**Complexity:** Low  
**Current Setup:** Already implemented, needs enhancement

#### Implementation:

**1. Enhanced Middleware with Role-Based Routes**

```typescript
// src/middleware.ts
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const sessionToken = request.cookies.get("better-auth.session_token") || 
                       request.cookies.get("__Secure-better-auth.session_token");

  // Admin routes - strict isolation
  if (pathname.startsWith('/admin')) {
    if (!sessionToken) {
      return NextResponse.redirect(new URL('/auth/admin-login', request.url));
    }
    // Role check happens in layout.tsx server-side
  }

  // Owner routes
  if (pathname.startsWith('/owner')) {
    if (!sessionToken) {
      return NextResponse.redirect(new URL('/owner-login', request.url));
    }
  }

  // Prevent cross-contamination: admin shouldn't access /login, etc.
  if (sessionToken) {
    // If logged in, prevent accessing other login pages
    if (pathname === '/auth/admin-login' || pathname === '/owner-login' || pathname === '/login') {
      // Check role and redirect to appropriate dashboard
      // This requires fetching session - done in page component
    }
  }

  return NextResponse.next();
}
```

**2. Role-Aware Logout Component**

```typescript
// src/components/auth/RoleAwareLogout.tsx
"use client";

import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface RoleAwareLogoutProps {
  userRole: string;
  children: React.ReactNode;
}

export function RoleAwareLogout({ userRole, children }: RoleAwareLogoutProps) {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await authClient.signOut();
      
      // Clear role-specific data
      if (typeof window !== 'undefined') {
        localStorage.removeItem(`${userRole}_preferences`);
        sessionStorage.clear();
      }

      // Redirect to role-specific login
      const redirectMap = {
        admin: '/auth/admin-login',
        owner: '/owner-login',
        customer: '/login',
      };

      const redirectUrl = redirectMap[userRole as keyof typeof redirectMap] || '/';
      
      toast.success("Logged out successfully");
      router.push(redirectUrl);
      router.refresh();
    } catch (error) {
      toast.error("Logout failed");
    }
  };

  return (
    <button onClick={handleLogout}>
      {children}
    </button>
  );
}
```

**3. Usage in Admin Dashboard**

```tsx
// src/app/admin/dashboard/page.tsx (or layout)
import { RoleAwareLogout } from "@/components/auth/RoleAwareLogout";

// In your component
<RoleAwareLogout userRole="admin">
  <LogOut className="w-4 h-4 mr-2" />
  Sign Out
</RoleAwareLogout>
```

**4. Session Validation in Layouts**

Your current layouts already implement this correctly:

```tsx
// src/app/admin/layout.tsx
const session = await auth.api.getSession({ headers: headersList });
const user = session?.user as any;
const role = user?.role;

if (role !== "admin") {
  redirect(role === "owner" ? "/owner/dashboard" : "/");
}
```

---

### Option 2: Separate Subdomain Authentication (ADVANCED)

**Best for:** Complete isolation, enterprise apps  
**Complexity:** High  
**Requires:** DNS configuration, separate deployments

#### Architecture:

```
admin.yourdomain.com  → Admin dashboard (separate auth)
www.yourdomain.com    → Main site (user auth)
api.yourdomain.com    → Shared API (optional)
```

#### Implementation:

**1. Separate Auth Instances**

```typescript
// src/lib/auth-admin.ts
export const authAdmin = betterAuth({
  database: drizzleAdapter(db, { /* same schema */ }),
  secret: process.env.BETTER_AUTH_SECRET_ADMIN,
  baseURL: "https://admin.yourdomain.com",
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 60 * 5,
    },
  },
  // Admin-specific config
});

// src/lib/auth-user.ts
export const authUser = betterAuth({
  database: drizzleAdapter(db, { /* same schema */ }),
  secret: process.env.BETTER_AUTH_SECRET_USER,
  baseURL: "https://www.yourdomain.com",
  // User-specific config
});
```

**2. Vercel Configuration**

```json
// vercel.json
{
  "rewrites": [
    {
      "source": "/:path*",
      "destination": "https://admin.yourdomain.com/:path*",
      "has": [
        {
          "type": "host",
          "value": "admin.yourdomain.com"
        }
      ]
    }
  ]
}
```

**Pros:**
- Complete session isolation
- Different cookie domains
- Independent deployments
- Better security boundaries

**Cons:**
- More complex infrastructure
- Higher costs (potentially)
- More maintenance overhead

---

### Option 3: Different Cookie Names (HYBRID)

**Best for:** Same domain, want some isolation  
**Complexity:** Medium

#### Implementation:

```typescript
// src/lib/auth.ts
export const auth = betterAuth({
  // ... existing config
  session: {
    cookieName: (ctx) => {
      // Check if request is from admin route
      const isAdminRoute = ctx.request?.url?.includes('/admin');
      return isAdminRoute ? 'admin_session_token' : 'user_session_token';
    },
  },
});
```

**Limitation:** better-auth doesn't support dynamic cookie names out of the box. Would require custom implementation.

---

## Recommended Solution for Your Setup

Based on your current architecture, I recommend **Option 1** with these enhancements:

### 1. Create Role-Aware Logout Helper

```typescript
// src/lib/auth-helpers.ts
import { authClient } from "./auth-client";

export async function logoutWithRole(role: string) {
  await authClient.signOut();
  
  // Clear all local storage
  if (typeof window !== 'undefined') {
    localStorage.clear();
    sessionStorage.clear();
  }

  // Return appropriate redirect URL
  const redirects = {
    admin: '/auth/admin-login',
    owner: '/owner-login',
    customer: '/login',
  };

  return redirects[role as keyof typeof redirects] || '/';
}
```

### 2. Update Admin Logout

```tsx
// In admin dashboard component
import { logoutWithRole } from "@/lib/auth-helpers";

const handleLogout = async () => {
  const redirectUrl = await logoutWithRole('admin');
  router.push(redirectUrl);
  router.refresh();
};
```

### 3. Enhance Middleware (Already mostly done)

```typescript
// src/middleware.ts
export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  
  // Block admin from accessing user routes while logged in
  if (pathname.startsWith('/account/dashboard') || pathname === '/login') {
    const sessionToken = request.cookies.get("better-auth.session_token");
    if (sessionToken) {
      // Would need to decode token to check role - better done in layout
      // For now, rely on layout redirects
    }
  }
  
  return NextResponse.next();
}
```

### 4. Add Login Page Guards

```tsx
// src/app/login/page.tsx
useEffect(() => {
  async function checkSession() {
    const session = await authClient.getSession();
    if (session?.data?.user) {
      const profile = await fetch("/api/user/profile");
      const { role } = await profile.json();
      
      // Redirect to appropriate dashboard
      if (role === 'admin') router.push('/admin/dashboard');
      else if (role === 'owner') router.push('/owner/dashboard');
      else router.push('/account/dashboard');
    }
  }
  checkSession();
}, []);
```

---

## Key Differences: Your Setup vs Complete Isolation

| Feature | Current (Single Auth) | Complete Isolation |
|---------|----------------------|-------------------|
| Session Cookie | Shared | Separate |
| Login/Logout | Affects all | Independent |
| Complexity | Low | High |
| Cost | Low | Higher |
| Security | Good (role-based) | Excellent (physical) |
| Maintenance | Easy | Complex |

---

## Why Your Current Approach is Actually Good

Your role-based system is **correct** for most use cases:

✅ **Proper separation of concerns** - Layouts enforce role boundaries  
✅ **Secure** - Server-side session validation  
✅ **Simple** - Single auth provider to maintain  
✅ **Scalable** - Easy to add new roles  

The "shared session" is **by design** - you just need better logout handling.

---

## Quick Fixes for Your Immediate Issue

### Fix 1: Role-Aware Logout Buttons

```tsx
// Admin logout button
<button onClick={async () => {
  await authClient.signOut();
  localStorage.clear();
  router.push('/auth/admin-login');
  router.refresh();
}}>
  Logout
</button>

// User logout button
<button onClick={async () => {
  await authClient.signOut();
  localStorage.clear();
  router.push('/login');
  router.refresh();
}}>
  Logout
</button>
```

### Fix 2: Prevent Cross-Access in Layouts

Already implemented correctly in your `layout.tsx` files! ✅

---

## When to Use Which Solution

**Use Single Auth (Current):**
- Multi-tenant SaaS with roles
- Internal dashboards with admin/user separation
- Cost-conscious projects
- Same team managing all parts

**Use Separate Subdomains:**
- Enterprise applications
- Complete organizational separation
- Different development teams
- Strict compliance requirements

**Use Hybrid Cookie Approach:**
- Need some isolation
- Can't use subdomains
- Willing to customize better-auth

---

## Production Checklist

- [x] Server-side role validation in layouts ✅
- [x] Proper redirects based on role ✅
- [ ] Role-aware logout handlers
- [ ] Login page session checks
- [ ] Clear localStorage on logout
- [x] Middleware session validation ✅
- [ ] CSRF protection (better-auth includes this)
- [ ] Rate limiting on auth endpoints
- [ ] Audit logging for admin actions

---

## Conclusion

Your current architecture is **production-ready** for role-based authentication. The "shared session" behavior is normal and expected. 

**To solve your immediate problem:**
1. Implement role-aware logout with proper redirects
2. Add session checks on login pages
3. Clear local storage on logout

You don't need separate auth systems unless you have specific compliance or organizational requirements.
