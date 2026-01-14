# Session Isolation - Before & After Code Examples

## Problem: Shared Sessions (BEFORE)

### How It Was Broken

```typescript
// src/lib/auth-client.ts (BEFORE - Problematic)
export const authClient = createAuthClient({
  baseURL: window.location.origin,
  // ❌ PROBLEM: Single auth client for everything
  // ❌ PROBLEM: One cookie for admin + public
  // ❌ PROBLEM: No role-based endpoint separation
});

// Any login used this same client:
const { signIn, signOut } = authClient;

// Both admin and public login used SAME endpoint:
await authClient.signIn.email({
  email: "admin@example.com",  // Admin or user? No distinction!
  password: "pass"
});

// Result: user-role="admin" → full access everywhere ❌
```

### Login Form (Problematic)

```typescript
// pages/admin/login.tsx (BEFORE - Broken)
const handleAdminLogin = async (email: string, password: string) => {
  // ❌ PROBLEM: Uses shared authClient
  const { data, error } = await authClient.signIn.email({
    email,
    password
  });
  
  // ❌ PROBLEM: No role verification
  // If any user account logs in here → they get access
  // If admin logs in to public site → they get full access there too
  
  if (data) {
    router.push("/admin/dashboard");
    // But they can ALSO access public site! ❌
  }
};
```

### Logout Form (Problematic)

```typescript
// components/navbar.tsx (BEFORE - Broken)
const handleLogout = async () => {
  // ❌ PROBLEM: Single logout endpoint
  await authClient.signOut();
  
  // Result: Logs you out of EVERYTHING
  // - Public session cleared ❌
  // - Admin session cleared ❌
  // - Even if you only wanted to log out of one!
};

// Result: 
// If logged in as both admin + user
// → Logout button clears BOTH sessions
// → Must log back in to both places
```

---

## Solution: Separate Sessions (AFTER)

### Two Distinct Auth Flows

```typescript
// src/lib/auth-client.ts (AFTER - Public User)
export const authClient = createAuthClient({
  baseURL: window.location.origin,
  fetchOptions: {
    credentials: "include",
    headers: {
      "X-Auth-Context": "user"  // ✅ Marked as user context
    }
  }
});

// src/lib/auth-admin.ts (AFTER - Admin Only)
export const adminAuthClient = createAuthClient({
  baseURL: window.location.origin,
  fetchOptions: {
    credentials: "include",
    headers: {
      "X-Auth-Context": "admin"  // ✅ Marked as admin context
    }
  }
});

// ✅ Now we have two separate clients!
```

### Admin Login Endpoint (Secure)

```typescript
// src/app/api/auth/admin/login/route.ts (AFTER - Secure)
export async function POST(request: NextRequest) {
  const { email, password } = await request.json();

  // ✅ SECURITY: Verify user is admin BEFORE creating session
  const adminUser = await db
    .select()
    .from(userTable)
    .where(eq(userTable.email, email))
    .get();

  if (!adminUser || adminUser.role !== "admin") {
    // ✅ Reject non-admin users immediately
    return NextResponse.json(
      { error: "Admin access only" },
      { status: 403 }  // Forbidden
    );
  }

  // Only if admin: create session
  const signInResponse = await auth.api.signInEmail({ email, password });

  // ✅ ISOLATION: Set admin-specific cookie
  response.cookies.set({
    name: "admin-session-token",
    value: token,
    path: "/admin",  // ✅ Only sent to /admin routes
    httpOnly: true,
    maxAge: 30 * 24 * 60 * 60  // 30 days
  });

  // ✅ CLEANUP: Clear public session
  response.cookies.set({
    name: "user-session-token",
    value: "",
    maxAge: 0
  });

  return response;
}
```

**Key Protections:**
- Role verification BEFORE session creation
- Non-admins get 403 Forbidden (not 401)
- Sets isolated cookie (path=/admin)
- Clears any conflicting public session

### Public User Login Endpoint (Secure)

```typescript
// src/app/api/auth/user/login/route.ts (AFTER - Secure)
export async function POST(request: NextRequest) {
  const { email, password } = await request.json();

  // ✅ SECURITY: Verify user is NOT admin
  const publicUser = await db
    .select()
    .from(userTable)
    .where(eq(userTable.email, email))
    .get();

  if (publicUser && publicUser.role === "admin") {
    // ✅ Prevent admin from logging in here
    return NextResponse.json(
      { error: "Admin accounts cannot log in to public site" },
      { status: 403 }
    );
  }

  // Only if not admin: create session
  const signInResponse = await auth.api.signInEmail({ email, password });

  // ✅ ISOLATION: Set user-specific cookie
  response.cookies.set({
    name: "user-session-token",
    value: token,
    path: "/",  // ✅ Sent to all routes
    httpOnly: true,
    maxAge: 30 * 24 * 60 * 60
  });

  // ✅ CLEANUP: Clear admin session
  response.cookies.set({
    name: "admin-session-token",
    value: "",
    maxAge: 0
  });

  return response;
}
```

**Key Protections:**
- Role verification BEFORE session creation
- Admins get 403 Forbidden if they try public login
- Sets isolated cookie (path=/)
- Clears any conflicting admin session

### Admin Login Form (Now Secure)

```typescript
// pages/admin/login.tsx (AFTER - Secure)
const handleAdminLogin = async (email: string, password: string) => {
  // ✅ NEW: Use admin-specific endpoint
  const response = await fetch('/api/auth/admin/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',  // ✅ Include cookies
    body: JSON.stringify({ email, password })
  });

  if (response.ok) {
    // ✅ Sets: admin-session-token (path=/admin)
    // ✅ Clears: user-session-token
    // ✅ Result: Only logged in to admin area
    router.push('/admin/dashboard');
  } else {
    const error = await response.json();
    console.error(error.error);
    // Possible errors:
    // - "Admin access only" (if regular user)
    // - "Invalid email or password" (if creds wrong)
  }
};
```

### Public User Login Form (Now Secure)

```typescript
// pages/login.tsx (AFTER - Secure)
const handlePublicLogin = async (email: string, password: string) => {
  // ✅ NEW: Use user-specific endpoint
  const response = await fetch('/api/auth/user/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',  // ✅ Include cookies
    body: JSON.stringify({ email, password })
  });

  if (response.ok) {
    // ✅ Sets: user-session-token (path=/)
    // ✅ Clears: admin-session-token
    // ✅ Result: Only logged in to public site
    router.push('/owner-dashboard');
  } else {
    const error = await response.json();
    console.error(error.error);
    // Possible errors:
    // - "Admin cannot log in here" (if admin account)
    // - "Invalid email or password" (if creds wrong)
  }
};
```

### Logout Buttons (Now Independent)

```typescript
// ADMIN LOGOUT (AFTER - Secure)
const handleAdminLogout = async () => {
  // ✅ NEW: Admin-specific logout endpoint
  await fetch('/api/auth/admin/logout', {
    method: 'POST',
    credentials: 'include'
  });

  // ✅ Only clears: admin-session-token
  // ✅ Preserves: user-session-token (if logged in publicly)
  // ✅ Result: Still logged in to public site!
  
  router.push('/admin/login');
};

// PUBLIC USER LOGOUT (AFTER - Secure)
const handlePublicLogout = async () => {
  // ✅ NEW: User-specific logout endpoint
  await fetch('/api/auth/user/logout', {
    method: 'POST',
    credentials: 'include'
  });

  // ✅ Only clears: user-session-token
  // ✅ Preserves: admin-session-token (if logged in as admin)
  // ✅ Result: Still logged in to admin area!
  
  router.push('/login');
};
```

### Middleware Enforcement (AFTER - Secure)

```typescript
// middleware.ts (AFTER - Enforces Separation)
export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const isAdminPath = pathname.startsWith("/admin");

  // === ADMIN ROUTES ===
  if (isAdminPath) {
    const adminToken = request.cookies.get("admin-session-token")?.value;
    
    if (!adminToken) {
      // ✅ No admin session → redirect to admin login
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }

    // ✅ If user also logged in, clear user session
    const userToken = request.cookies.get("user-session-token")?.value;
    if (userToken) {
      const response = NextResponse.next();
      response.cookies.set({
        name: "user-session-token",
        value: "",
        maxAge: 0
      });
      return response;
    }

    return NextResponse.next();
  }

  // === PUBLIC ROUTES ===
  // Allow public routes with user-session-token
  // admin-session-token is not sent to public routes (path=/admin)
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/:path*"]
};
```

**What This Prevents:**
- Admin accessing public routes with admin token ✅
- Public user accessing /admin (no admin-session-token) ✅
- Sessions contaminating each other ✅
- Unexpected logouts ✅

---

## Comparison Table

| Feature | BEFORE | AFTER |
|---------|--------|-------|
| **Login Endpoint** | One: `signIn.email()` | Two: `/api/auth/admin/login`, `/api/auth/user/login` |
| **Role Check** | Client-side (weak) | Server-side (strong) |
| **Session Isolation** | None - one cookie | Full - separate cookies |
| **Cookie Names** | `better-auth.session_token` | `admin-session-token`, `user-session-token` |
| **Cookie Paths** | `/` (everywhere) | `/admin` (admin only), `/` (public) |
| **Logout Effect** | Logs out both | Logs out only one |
| **Can Have Both Active** | ❌ No | ✅ Yes |
| **Admin on Public Site** | ❌ Possible | ✅ Impossible |
| **Public on Admin Site** | ❌ Possible | ✅ Impossible |
| **Security Level** | Low | High |

---

## Error Handling Examples

### Admin Login Errors (AFTER)

```typescript
// Regular user trying to log in as admin
POST /api/auth/admin/login
{
  "email": "user@example.com",
  "password": "correct_password"
}

// Response:
{
  "error": "Admin access only. User account not authorized.",
  "status": 403
}
// ✅ Rejected because role !== "admin"

// Wrong password
POST /api/auth/admin/login
{
  "email": "admin@example.com",
  "password": "wrong_password"
}

// Response:
{
  "error": "Invalid email or password",
  "status": 401
}
```

### Public Login Errors (AFTER)

```typescript
// Admin trying to log in to public site
POST /api/auth/user/login
{
  "email": "admin@example.com",
  "password": "correct_password"
}

// Response:
{
  "error": "Admin accounts cannot log in to public site. Use admin panel instead.",
  "status": 403
}
// ✅ Rejected because role === "admin"
```

---

## Cookie Inspection Example

### BEFORE: Shared Cookie
```
Developer Tools → Application → Cookies → localhost

Name: better-auth.session_token
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Path: /
Domain: localhost
Expires: [date]

// ❌ One cookie for admin and public!
// ❌ No way to distinguish which session type
// ❌ Admin automatically logged in everywhere
```

### AFTER: Separate Cookies

**Case 1: Only Public User Logged In**
```
Developer Tools → Application → Cookies → localhost

Name: user-session-token
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Path: /
Domain: localhost
Expires: [date]

// ✅ Only user session exists
// ✅ Accessing /admin: Cookie NOT sent (path=/admin)
// ✅ Middleware redirects to /admin/login
```

**Case 2: Only Admin Logged In**
```
Developer Tools → Application → Cookies → localhost

Name: admin-session-token
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Path: /admin
Domain: localhost
Expires: [date]

// ✅ Only admin session exists
// ✅ Accessing /owner-dashboard: Cookie NOT sent
// ✅ AdminRedirectWrapper redirects to /admin/dashboard
```

**Case 3: Both Logged In (Rare but Possible)**
```
Developer Tools → Application → Cookies → localhost

Name: user-session-token
Path: /
Value: [token1]

Name: admin-session-token
Path: /admin
Value: [token2]

// ✅ Both sessions exist independently
// ✅ Each request uses appropriate cookie
// ✅ Complete isolation!
```

---

## Summary

**BEFORE**: Like having one master key that opens your office, home, and car
- Once unlocked = access to everything
- Lose the key = lock yourself out of everything

**AFTER**: Like having three separate keys
- Office key only opens office
- Home key only opens home
- Car key only opens car
- You can give each key to different people
- Losing one key doesn't affect the others

Your sessions are now completely isolated! 🔒
