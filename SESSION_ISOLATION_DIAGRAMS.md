# Session Isolation - Architecture & Flow Diagrams

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                            ORCHIDS ESCAPE HOUSES                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│  ┌──────────────────────────────────────────────────────────────────────┐   │
│  │                         NEXT.JS MIDDLEWARE                            │   │
│  │  middleware.ts                                                        │   │
│  │  ────────────────────────────────────────────────────────────────    │   │
│  │  Checks for admin-session-token on /admin/* routes                   │   │
│  │  Prevents cross-session contamination                                │   │
│  └──────────────────────────────────────────────────────────────────────┘   │
│           ↓                                              ↓                     │
│  ┌─────────────────────────────┐            ┌──────────────────────────┐   │
│  │  ADMIN ROUTES (/admin/*)    │            │  PUBLIC ROUTES (/)       │   │
│  ├─────────────────────────────┤            ├──────────────────────────┤   │
│  │                             │            │                          │   │
│  │ Requires:                   │            │ Requires:                │   │
│  │ admin-session-token         │            │ user-session-token       │   │
│  │ (path=/admin)               │            │ (path=/)                 │   │
│  │                             │            │                          │   │
│  │ Routes:                     │            │ Routes:                  │   │
│  │ • /admin/login              │            │ • /login                 │   │
│  │ • /admin/dashboard          │            │ • /owner-dashboard       │   │
│  │ • /admin/users              │            │ • /owner-login           │   │
│  │ • /admin/settings           │            │ • /owner-sign-up         │   │
│  │ • /admin/*                  │            │ • /experiences           │   │
│  │                             │            │ • /destinations          │   │
│  │ Protected by:               │            │ • /choose-plan           │   │
│  │ AdminRedirectWrapper        │            │ • /advertise-with-us     │   │
│  │ middleware.ts               │            │ • /register-your-property│   │
│  └─────────────────────────────┘            └──────────────────────────┘   │
│           ↓                                              ↓                     │
│  ┌─────────────────────────────┐            ┌──────────────────────────┐   │
│  │  ADMIN AUTH ENDPOINTS       │            │  USER AUTH ENDPOINTS     │   │
│  ├─────────────────────────────┤            ├──────────────────────────┤   │
│  │                             │            │                          │   │
│  │ POST /api/auth/admin/login  │            │ POST /api/auth/user/login│   │
│  │ POST /api/auth/admin/logout │            │ POST /api/auth/user/logout
│  │                             │            │                          │   │
│  │ Checks:                     │            │ Checks:                  │   │
│  │ ✓ role === 'admin'          │            │ ✓ role !== 'admin'       │   │
│  │ ✓ Role verified server-side │            │ ✓ Role verified srv-side │   │
│  │                             │            │                          │   │
│  │ Sets Cookie:                │            │ Sets Cookie:             │   │
│  │ admin-session-token         │            │ user-session-token       │   │
│  │ (path=/admin, httpOnly)     │            │ (path=/, httpOnly)       │   │
│  │                             │            │                          │   │
│  │ Clears:                     │            │ Clears:                  │   │
│  │ ✓ user-session-token        │            │ ✓ admin-session-token    │   │
│  │ ✓ better-auth.session_token │            │ ✓ better-auth.session_token
│  └─────────────────────────────┘            └──────────────────────────┘   │
│           ↓                                              ↓                     │
│  ┌─────────────────────────────┐            ┌──────────────────────────┐   │
│  │  DATABASE (Turso/SQLite)    │            │  DATABASE (Turso/SQLite) │   │
│  ├─────────────────────────────┤            ├──────────────────────────┤   │
│  │                             │            │                          │   │
│  │ users table:                │            │ users table:             │   │
│  │ • id                        │            │ • id                     │   │
│  │ • email: admin@...          │            │ • email: user@...        │   │
│  │ • role: 'admin' ← KEY       │            │ • role: 'customer' ← KEY │   │
│  │ • hash                      │            │ • hash                   │   │
│  │                             │            │                          │   │
│  │ sessions table:             │            │ sessions table:          │   │
│  │ • sessionToken              │            │ • sessionToken           │   │
│  │ • userId                    │            │ • userId                 │   │
│  │ (Retrieved from same table) │            │ (Retrieved from same tbl)│   │
│  │                             │            │                          │   │
│  └─────────────────────────────┘            └──────────────────────────┘   │
│                                                                               │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Admin Login Flow

```
User Navigates to: /admin/login
         │
         ↓
┌─────────────────────────────────────────────────────────┐
│  AdminLoginComponent                                    │
│  ─────────────────────────────────────────────────────  │
│  <form onSubmit={handleAdminLogin}>                     │
│    <input name="email" />                               │
│    <input name="password" type="password" />            │
│    <button type="submit">Login as Admin</button>        │
│  </form>                                                │
└─────────────────────────────────────────────────────────┘
         │
         ↓ User enters credentials and clicks "Login"
         │
         ↓
POST /api/auth/admin/login
{
  "email": "admin@example.com",
  "password": "password123"
}
         │
         ↓ Request reaches server
         │
    ┌────────────────────────────────────────┐
    │ /api/auth/admin/login/route.ts          │
    ├────────────────────────────────────────┤
    │                                         │
    │ 1. Parse email & password               │
    │ 2. Query users table:                   │
    │    WHERE email = ? AND role = 'admin'   │
    │                                         │
    │    ┌─────────────────────────────────┐ │
    │    │ Check Result:                   │ │
    │    │                                 │ │
    │    │ Found admin user?               │ │
    │    │ ✓ YES → Continue to step 3      │ │
    │    │ ✗ NO → Return 403 Forbidden     │ │
    │    │        (non-admin tried to log in)│
    │    └─────────────────────────────────┘ │
    │                                         │
    │ 3. Verify password matches hash         │
    │                                         │
    │    ┌─────────────────────────────────┐ │
    │    │ Password Check:                 │ │
    │    │                                 │ │
    │    │ Correct?                        │ │
    │    │ ✓ YES → Continue to step 4      │ │
    │    │ ✗ NO → Return 401 Unauthorized │ │
    │    └─────────────────────────────────┘ │
    │                                         │
    │ 4. Create session in sessions table     │
    │                                         │
    │ 5. Set Response Cookie:                 │
    │    Name: admin-session-token           │
    │    Value: [session_token]              │
    │    Path: /admin        ← IMPORTANT!    │
    │    HttpOnly: true                      │
    │    Secure: true (prod)                 │
    │    SameSite: Lax                       │
    │    MaxAge: 30 days                     │
    │                                         │
    │ 6. Clear conflicting cookies:          │
    │    user-session-token = ""             │
    │    better-auth.session_token = ""      │
    │                                         │
    │ 7. Return 200 OK                       │
    │    {                                   │
    │      "user": { ... },                  │
    │      "session": { ... }                │
    │    }                                   │
    │                                         │
    └────────────────────────────────────────┘
         │
         ↓ Response received with Set-Cookie header
         │
Browser Stores Cookie: admin-session-token=...
         │
         ↓ Redirect to /admin/dashboard
         │
┌─────────────────────────────────────────────────────────┐
│  GET /admin/dashboard                                   │
│  Cookie: admin-session-token=... (sent, path=/admin)    │
│  Cookie: user-session-token NOT sent (doesn't match /admin)
└─────────────────────────────────────────────────────────┘
         │
         ↓ Request processed by middleware.ts
         │
middleware.ts checks:
  ┌─────────────────────────────┐
  │ Is /admin path? YES          │
  │ Has admin-session-token?     │
  │ YES ✓ → Allow (next())       │
  └─────────────────────────────┘
         │
         ↓ Page loads successfully
         │
┌─────────────────────────────────────────────────────────┐
│  /admin/dashboard Loaded ✓                              │
│  ─────────────────────────────────────────────────────  │
│  Logged in as: admin@example.com                        │
│  Role: admin                                            │
│  Access Level: Full admin panel                         │
│  Session Scope: /admin/* routes only                    │
└─────────────────────────────────────────────────────────┘
```

---

## Public User Login Flow

```
User Navigates to: /login
         │
         ↓
┌─────────────────────────────────────────────────────────┐
│  PublicLoginComponent                                   │
│  ─────────────────────────────────────────────────────  │
│  <form onSubmit={handlePublicLogin}>                    │
│    <input name="email" />                               │
│    <input name="password" type="password" />            │
│    <button type="submit">Login</button>                 │
│  </form>                                                │
└─────────────────────────────────────────────────────────┘
         │
         ↓ User enters credentials and clicks "Login"
         │
         ↓
POST /api/auth/user/login
{
  "email": "user@example.com",
  "password": "password456"
}
         │
         ↓ Request reaches server
         │
    ┌────────────────────────────────────────┐
    │ /api/auth/user/login/route.ts           │
    ├────────────────────────────────────────┤
    │                                         │
    │ 1. Parse email & password               │
    │ 2. Query users table:                   │
    │    WHERE email = ?                      │
    │                                         │
    │    ┌─────────────────────────────────┐ │
    │    │ Check User Role:                │ │
    │    │                                 │ │
    │    │ Is user role = 'admin'?         │ │
    │    │ ✓ YES → Return 403 Forbidden   │ │
    │    │        (admin can't log in here) │
    │    │ ✗ NO → Continue to step 3      │ │
    │    └─────────────────────────────────┘ │
    │                                         │
    │ 3. Verify password matches hash         │
    │                                         │
    │    ┌─────────────────────────────────┐ │
    │    │ Password Check:                 │ │
    │    │                                 │ │
    │    │ Correct?                        │ │
    │    │ ✓ YES → Continue to step 4      │ │
    │    │ ✗ NO → Return 401 Unauthorized │ │
    │    └─────────────────────────────────┘ │
    │                                         │
    │ 4. Create session in sessions table     │
    │                                         │
    │ 5. Set Response Cookie:                 │
    │    Name: user-session-token            │
    │    Value: [session_token]              │
    │    Path: /        ← IMPORTANT! (all)   │
    │    HttpOnly: true                      │
    │    Secure: true (prod)                 │
    │    SameSite: Lax                       │
    │    MaxAge: 30 days                     │
    │                                         │
    │ 6. Clear conflicting cookies:          │
    │    admin-session-token = ""            │
    │    better-auth.session_token = ""      │
    │                                         │
    │ 7. Return 200 OK                       │
    │    {                                   │
    │      "user": { ... },                  │
    │      "session": { ... }                │
    │    }                                   │
    │                                         │
    └────────────────────────────────────────┘
         │
         ↓ Response received with Set-Cookie header
         │
Browser Stores Cookie: user-session-token=...
         │
         ↓ Redirect to /owner-dashboard
         │
┌─────────────────────────────────────────────────────────┐
│  GET /owner-dashboard                                   │
│  Cookie: user-session-token=... (sent, path=/)          │
│  Cookie: admin-session-token NOT sent (path=/admin only)
└─────────────────────────────────────────────────────────┘
         │
         ↓ Request processed by middleware.ts
         │
middleware.ts checks:
  ┌─────────────────────────────┐
  │ Is /admin path? NO           │
  │ Allow public route ✓         │
  │ (middleware passes through)  │
  └─────────────────────────────┘
         │
         ↓ AdminRedirectWrapper checks role
         │
AdminRedirectWrapper:
  ┌─────────────────────────────┐
  │ Fetch /api/user/profile     │
  │ Result: role = 'customer'    │
  │ Is admin? NO ✓              │
  │ Allow route (render children)│
  └─────────────────────────────┘
         │
         ↓ Page loads successfully
         │
┌─────────────────────────────────────────────────────────┐
│  /owner-dashboard Loaded ✓                              │
│  ─────────────────────────────────────────────────────  │
│  Logged in as: user@example.com                         │
│  Role: customer                                         │
│  Access Level: Public site features                     │
│  Session Scope: All routes (/)                          │
└─────────────────────────────────────────────────────────┘
```

---

## Independent Logout Flows

```
SCENARIO: User logged in as both admin AND public user

Session State:
  admin-session-token = "abc123..." (path=/admin)
  user-session-token = "xyz789..." (path=/)


CASE 1: Admin Logs Out
═════════════════════════════════════════════════════════════

User clicks "Logout" button in admin area
         │
         ↓
POST /api/auth/admin/logout
         │
         ↓
Response Sets Cookie:
  Name: admin-session-token
  Value: ""
  MaxAge: 0  ← Immediately expires/deletes
  Path: /admin
         │
         ↓
Browser Deletes Cookie: admin-session-token
         │
Session State After Logout:
  admin-session-token = [DELETED] ✓
  user-session-token = "xyz789..." ← UNCHANGED!
         │
         ↓
Redirect to: /admin/login
         │
         ↓
BUT: User can still access /owner-dashboard
Because user-session-token still exists!
         │
Result: Logged out of admin, but still logged in to public ✓


CASE 2: Public User Logs Out
═════════════════════════════════════════════════════════════

User clicks "Logout" button on public site
         │
         ↓
POST /api/auth/user/logout
         │
         ↓
Response Sets Cookie:
  Name: user-session-token
  Value: ""
  MaxAge: 0  ← Immediately expires/deletes
  Path: /
         │
         ↓
Browser Deletes Cookie: user-session-token
         │
Session State After Logout:
  admin-session-token = "abc123..." ← UNCHANGED!
  user-session-token = [DELETED] ✓
         │
         ↓
Redirect to: /login
         │
         ↓
BUT: Admin can still access /admin/dashboard
Because admin-session-token still exists!
         │
Result: Logged out of public, but still logged in to admin ✓
```

---

## Cookie Path Behavior Diagram

```
Admin Session: admin-session-token
  Path: /admin

        /admin/login       ✓ Sent (matches /admin)
        /admin/dashboard   ✓ Sent (matches /admin)
        /admin/users       ✓ Sent (matches /admin)
        /admin/*           ✓ Sent (matches /admin/*)
        
        /                  ✗ NOT sent (doesn't match /admin)
        /login             ✗ NOT sent
        /owner-dashboard   ✗ NOT sent
        /                  ✗ NOT sent


Public Session: user-session-token
  Path: /

        /                  ✓ Sent (matches /)
        /login             ✓ Sent (matches /*)
        /owner-dashboard   ✓ Sent (matches /*)
        /experiences       ✓ Sent (matches /*)
        /*                 ✓ Sent (matches /*)
        
        /admin/dashboard   ✓ Sent (matches /*) but...
                           ✗ Middleware rejects anyway!
        /admin/login       ✓ Sent (matches /*) but...
                           ✗ Middleware rejects anyway!


This provides DUAL PROTECTION:
1. HTTP-level: Cookies not sent to wrong paths
2. Middleware-level: Even if cookie sent, middleware blocks
```

---

## Error Scenarios

```
┌─────────────────────────────────────────┐
│ SCENARIO 1: Non-Admin Tries Admin Login │
├─────────────────────────────────────────┤
│                                         │
│ User @ /admin/login                     │
│ Enters: user@example.com / pass         │
│ Submits form                            │
│         │                               │
│         ↓                               │
│ POST /api/auth/admin/login              │
│         │                               │
│         ↓                               │
│ Server checks: WHERE email=? AND        │
│                role='admin'             │
│                                         │
│         Result: NOT FOUND ✗             │
│                                         │
│         ↓                               │
│ Response: 403 Forbidden                 │
│ {                                       │
│   "error": "Admin access only.          │
│             User account not            │
│             authorized."                │
│ }                                       │
│                                         │
│ No cookie set! ✓                        │
│ User cannot log in as admin ✓           │
│                                         │
└─────────────────────────────────────────┘


┌─────────────────────────────────────────┐
│ SCENARIO 2: Admin Tries Public Login    │
├─────────────────────────────────────────┤
│                                         │
│ Admin @ /login                          │
│ Enters: admin@example.com / pass        │
│ Submits form                            │
│         │                               │
│         ↓                               │
│ POST /api/auth/user/login               │
│         │                               │
│         ↓                               │
│ Server checks: WHERE email=?            │
│                AND role != 'admin'      │
│                                         │
│         Result: FOUND but role='admin' ✗│
│                                         │
│         ↓                               │
│ Response: 403 Forbidden                 │
│ {                                       │
│   "error": "Admin accounts cannot       │
│             log in to public site.      │
│             Use admin panel instead."   │
│ }                                       │
│                                         │
│ No cookie set! ✓                        │
│ Admin cannot log in to public ✓         │
│                                         │
└─────────────────────────────────────────┘


┌─────────────────────────────────────────┐
│ SCENARIO 3: User Accesses /admin        │
├─────────────────────────────────────────┤
│                                         │
│ Public user has: user-session-token     │
│ Tries to access: /admin/dashboard       │
│         │                               │
│         ↓                               │
│ GET /admin/dashboard                    │
│ Cookies sent: user-session-token only   │
│              (admin-session-token not   │
│               sent because path=/admin) │
│         │                               │
│         ↓ middleware.ts checks          │
│                                         │
│ Is /admin path? YES                     │
│ Has admin-session-token? NO ✗           │
│                                         │
│         ↓                               │
│ Redirect to: /admin/login               │
│ (with 302 redirect)                     │
│                                         │
│ User cannot access admin ✓              │
│                                         │
└─────────────────────────────────────────┘
```

---

## Security Protection Layers

```
┌─────────────────────────────────────────────────────┐
│                SECURITY LAYERS                      │
├─────────────────────────────────────────────────────┤
│                                                     │
│  LAYER 1: HTTP Cookie Paths                        │
│  ─────────────────────────────────────────────────  │
│  admin-session-token: path=/admin only             │
│  → Browser never sends to public routes            │
│  → Low overhead protection                         │
│  → Automatic, can't be bypassed by client          │
│                                                     │
│                      ↓                              │
│                                                     │
│  LAYER 2: Middleware Enforcement                   │
│  ─────────────────────────────────────────────────  │
│  /admin/* requires admin-session-token             │
│  → Server-side validation                          │
│  → Explicit checks                                 │
│  → Catches any bypass attempts                     │
│                                                     │
│                      ↓                              │
│                                                     │
│  LAYER 3: Endpoint Validation                      │
│  ─────────────────────────────────────────────────  │
│  /api/auth/admin/login checks: role='admin'        │
│  /api/auth/user/login checks: role!='admin'        │
│  → Role verified before session created            │
│  → Prevents unauthorized session creation          │
│                                                     │
│                      ↓                              │
│                                                     │
│  LAYER 4: Client-Side Protection                   │
│  ─────────────────────────────────────────────────  │
│  AdminRedirectWrapper checks role                  │
│  → Redirects admins from public routes             │
│  → Better UX (fast redirect)                       │
│  → Cannot be relied upon alone                     │
│                                                     │
│                      ↓                              │
│                                                     │
│  RESULT: No single point of failure ✓              │
│  Admins CANNOT access public site                  │
│  Users CANNOT access admin area                    │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

## Summary

These diagrams show:
1. ✅ Complete system architecture
2. ✅ Admin login flow with security checks
3. ✅ Public user login flow with role verification
4. ✅ Independent logout behavior
5. ✅ Cookie path isolation mechanisms
6. ✅ Error handling scenarios
7. ✅ Multi-layer security approach

The implementation is robust, secure, and follows best practices for role-based access control!
