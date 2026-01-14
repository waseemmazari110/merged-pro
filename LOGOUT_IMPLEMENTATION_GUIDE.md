# Role-Aware Logout Implementation Guide

## Quick Start

### 1. Import the Component

```tsx
import { RoleAwareLogout } from "@/components/auth/RoleAwareLogout";
import { LogOut } from "lucide-react";
```

### 2. Use in Admin Dashboard

```tsx
// src/app/admin/dashboard/page.tsx or any admin component
export default function AdminDashboard() {
  return (
    <div>
      <nav>
        <RoleAwareLogout 
          userRole="admin"
          className="flex items-center gap-2 px-4 py-2 text-white bg-red-600 rounded hover:bg-red-700"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </RoleAwareLogout>
      </nav>
    </div>
  );
}
```

### 3. Use in Owner Dashboard

```tsx
// src/app/owner/dashboard/page.tsx
<RoleAwareLogout 
  userRole="owner"
  className="btn-logout"
>
  Logout
</RoleAwareLogout>
```

### 4. Use in Customer Pages

```tsx
// src/app/account/dashboard/page.tsx
<RoleAwareLogout 
  userRole="customer"
  onLogoutComplete={() => console.log("User logged out")}
>
  Sign Out
</RoleAwareLogout>
```

---

## Login Page Session Guards

### Admin Login Page

```tsx
// src/app/auth/admin-login/page.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { getDashboardUrl } from "@/lib/auth-helpers";

export default function AdminLoginPage() {
  const router = useRouter();

  useEffect(() => {
    async function checkSession() {
      const session = await authClient.getSession();
      if (session?.data?.user) {
        const response = await fetch("/api/user/profile");
        if (response.ok) {
          const { role } = await response.json();
          
          // Redirect to appropriate dashboard
          const dashboardUrl = getDashboardUrl(role);
          router.replace(dashboardUrl);
        }
      }
    }
    checkSession();
  }, [router]);

  return (
    // Your login form
  );
}
```

### Owner/Customer Login Pages

Apply the same pattern to other login pages.

---

## Helper Functions Usage

### Check Session Role

```tsx
import { validateSessionRole } from "@/lib/auth-helpers";

// In a component
const isValidAdmin = await validateSessionRole('admin');
if (!isValidAdmin) {
  router.push('/auth/admin-login');
}
```

### Get Dashboard/Login URLs

```tsx
import { getDashboardUrl, getLoginUrl } from "@/lib/auth-helpers";

const adminDashboard = getDashboardUrl('admin'); // '/admin/dashboard'
const ownerLogin = getLoginUrl('owner'); // '/owner-login'
```

### Redirect by Role

```tsx
import { redirectByRole } from "@/lib/auth-helpers";

// After successful login
const { role } = userData;
redirectByRole(role, router);
```

---

## Complete Login Flow Example

```tsx
// src/app/auth/admin-login/page.tsx
"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { redirectByRole } from "@/lib/auth-helpers";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data, error } = await authClient.signIn.email({
        email,
        password,
      });

      if (error) {
        toast.error("Invalid credentials");
        setIsLoading(false);
        return;
      }

      // Verify role
      if (data?.user) {
        const response = await fetch("/api/user/profile");
        const profile = await response.json();
        
        if (profile.role !== "admin") {
          toast.error("Access denied. Admin privileges required.");
          await authClient.signOut();
          setIsLoading(false);
          return;
        }
        
        toast.success("Welcome back, Admin!");
        redirectByRole('admin', router);
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("An error occurred");
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Your form fields */}
    </form>
  );
}
```

---

## API Route Protection

```typescript
// src/app/api/admin/route.ts
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const user = session?.user as any;
  
  if (!user || user.role !== 'admin') {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  // Admin-only logic
  return NextResponse.json({ data: "Admin data" });
}
```

---

## Middleware Enhancement

```typescript
// src/middleware.ts
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const sessionToken = request.cookies.get("better-auth.session_token") || 
                       request.cookies.get("__Secure-better-auth.session_token");

  // Protect admin routes
  if (pathname.startsWith('/admin')) {
    if (!sessionToken) {
      return NextResponse.redirect(new URL('/auth/admin-login', request.url));
    }
  }

  // Protect owner routes
  if (pathname.startsWith('/owner')) {
    if (!sessionToken) {
      return NextResponse.redirect(new URL('/owner-login', request.url));
    }
  }

  // Prevent logged-in users from accessing login pages
  if (sessionToken) {
    const loginPages = ['/login', '/auth/admin-login', '/owner-login'];
    if (loginPages.includes(pathname)) {
      // Let the page component handle role-based redirect
      // (We can't easily decode the session here without making a DB call)
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
};
```

---

## Testing Checklist

- [ ] Admin can login at `/auth/admin-login`
- [ ] Admin redirects to `/admin/dashboard`
- [ ] Admin logout redirects to `/auth/admin-login`
- [ ] Owner can login at `/owner-login`
- [ ] Owner redirects to `/owner/dashboard`
- [ ] Owner logout redirects to `/owner-login`
- [ ] Customer can login at `/login`
- [ ] Customer redirects to `/account/dashboard`
- [ ] Customer logout redirects to `/login`
- [ ] Admin cannot access owner routes (gets redirected)
- [ ] Owner cannot access admin routes (gets redirected)
- [ ] Logging out clears all local storage
- [ ] Session cookies are cleared on logout
- [ ] Login pages redirect if already logged in

---

## Troubleshooting

**Issue:** User logged out but session still exists
- **Solution:** Check if localStorage is being cleared. Add `router.refresh()` after logout.

**Issue:** Redirect loops on login pages
- **Solution:** Ensure session check in `useEffect` has proper dependency array.

**Issue:** Role check fails
- **Solution:** Verify `/api/user/profile` endpoint returns correct role.

**Issue:** Logout doesn't work
- **Solution:** Check browser console for errors. Ensure `authClient.signOut()` completes.

---

## Summary

Your authentication system now has:
- ✅ Role-aware logout with proper redirects
- ✅ Session cleanup on logout
- ✅ Login page guards against already-logged-in users
- ✅ Helper functions for role-based routing
- ✅ Reusable components for consistent behavior

The "shared session" is now properly managed with role-based redirects and cleanup!
