# Admin Dashboard Architecture & Implementation Guide

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        Admin Dashboard                          │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ Frontend: src/app/admin/dashboard/page.tsx              │  │
│  │ ├─ Sidebar Navigation (4 tabs)                          │  │
│  │ ├─ Overview Tab (statistics)                            │  │
│  │ ├─ Users Tab (user list)                                │  │
│  │ ├─ Payments Tab (payment history)                       │  │
│  │ └─ Subscriptions Tab (memberships)                      │  │
│  └──────────────────────────────────────────────────────────┘  │
│                          ↓                                       │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ Security Layer: /api/admin/verify                       │  │
│  │ ├─ Check: Session exists?                               │  │
│  │ ├─ Check: role = "admin"?                               │  │
│  │ └─ Redirect: If not authorized → /admin/login          │  │
│  └──────────────────────────────────────────────────────────┘  │
│                          ↓                                       │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ Data APIs (5 endpoints)                                 │  │
│  ├─ /api/admin/dashboard-stats        (statistics)         │  │
│  ├─ /api/admin/dashboard-users        (users list)         │  │
│  ├─ /api/admin/dashboard-payments     (payment history)    │  │
│  ├─ /api/admin/dashboard-subscriptions (memberships)       │  │
│  └─ /api/admin/verify                 (session check)     │  │
│  └──────────────────────────────────────────────────────────┘  │
│                          ↓                                       │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ Database                                                │  │
│  ├─ user table    (users, roles)                           │  │
│  └─ bookings table (payments, subscriptions)               │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Authentication Flow

```
┌─────────────────────────────────────────────────────────────┐
│ 1. Admin visits /admin/login                               │
│    ↓                                                         │
│ 2. Fills form: email + password                            │
│    ↓                                                         │
│ 3. Submits to POST /api/auth/admin/login                   │
│    ↓                                                         │
│ 4. Backend verifies:                                        │
│    • Email exists?                                          │
│    • Password matches?                                      │
│    • role = "admin"?                                        │
│    ↓                                                         │
│ 5. If valid:                                                │
│    • Create session                                         │
│    • Set cookie: better-auth.session_token                 │
│    • Redirect to /admin/dashboard                          │
│    ↓                                                         │
│ 6. Dashboard calls /api/admin/verify                       │
│    ↓                                                         │
│ 7. Verify checks:                                           │
│    • Cookie exists?                                         │
│    • Session valid?                                         │
│    • role = "admin"?                                        │
│    ↓                                                         │
│ 8. If verified:                                             │
│    • Load dashboard data                                    │
│    • Show 4 tabs with data                                 │
│                                                              │
│ If invalid at any step:                                     │
│    • Redirect to /admin/login                              │
│    • Clear session                                          │
└─────────────────────────────────────────────────────────────┘
```

---

## Data Flow Diagram

```
┌────────────────────────────────────────────────────────────┐
│ Dashboard Component Loads                                  │
│ ├─ useEffect: Verify admin session                       │
│ │  └─ fetch("/api/admin/verify")                         │
│ │                                                          │
│ ├─ If verified: Load user data                           │
│ │  ├─ Fetch user object                                  │
│ │  └─ Display in sidebar                                 │
│ │                                                          │
│ └─ useEffect: Watch activeTab changes                    │
│    ├─ If "overview": fetch("/api/admin/dashboard-stats") │
│    ├─ If "users": fetch("/api/admin/dashboard-users")    │
│    ├─ If "payments": fetch("/api/admin/dashboard-payments")
│    └─ If "subscriptions": fetch("...subscriptions")      │
│                                                            │
│ Each API Response:                                        │
│ ├─ User Table:                                            │
│ │  [ { id, name, email, role, createdAt }, ... ]        │
│ ├─ Payments Table:                                        │
│ │  [ { id, amount, status, createdAt, method }, ... ]   │
│ ├─ Subscriptions Table:                                   │
│ │  [ { id, email, planName, status, amount, renewsAt }..│
│ └─ Stats Object:                                          │
│    { totalUsers, totalRevenue, totalSubscriptions, ... }  │
└────────────────────────────────────────────────────────────┘
```

---

## File Structure & Dependencies

```
Admin Dashboard Files:

src/app/admin/
├── login/
│   └── page.tsx
│       └── Uses: /api/auth/admin/login
│
└── dashboard/
    └── page.tsx
        ├── Uses: /api/admin/verify
        ├── Uses: /api/admin/dashboard-stats
        ├── Uses: /api/admin/dashboard-users
        ├── Uses: /api/admin/dashboard-payments
        └── Uses: /api/admin/dashboard-subscriptions

src/app/api/admin/
├── verify/route.ts
│   └── Returns: { user: { id, name, email, role } }
│
├── dashboard-stats/route.ts
│   └── Returns: { totalUsers, totalRevenue, ... }
│
├── dashboard-users/route.ts
│   └── Returns: { users: [ { id, name, email, role, createdAt } ] }
│
├── dashboard-payments/route.ts
│   └── Returns: { payments: [ { id, amount, status, ... } ] }
│
└── dashboard-subscriptions/route.ts
    └── Returns: { subscriptions: [ { id, email, planName, ... } ] }

Security Layers:
├── middleware.ts
│   └── Protects /admin routes
│
└── API Authorization
    └── Each endpoint checks role = "admin"
```

---

## Component Structure

```
AdminDashboard (Main Component)
├── State:
│   ├── user (AdminUser)
│   ├── loading (boolean)
│   ├── activeTab ("overview" | "users" | "payments" | "subscriptions")
│   ├── sidebarOpen (boolean)
│   ├── stats (DashboardStats)
│   ├── users (User[])
│   ├── payments (Payment[])
│   ├── subscriptions (Subscription[])
│   └── dataLoading (boolean)
│
├── Effects:
│   ├── Verify admin on mount
│   └── Fetch tab data on activeTab change
│
├── Handlers:
│   └── handleLogout()
│
└── Render:
    ├── Sidebar
    │   ├── Logo
    │   ├── Navigation (4 tabs)
    │   ├── User profile
    │   └── Logout button
    │
    └── Main Content
        ├── Header
        ├── Error (if any)
        └── Tab Content
            ├── Overview: Stats cards
            ├── Users: User table
            ├── Payments: Payments table
            └── Subscriptions: Subscriptions table
```

---

## API Endpoint Details

### 1. /api/admin/verify
```
Method: GET
Purpose: Verify admin session and role
Auth Required: Yes (session cookie)
Response: 
  Status 200:
    {
      "user": {
        "id": "user-123",
        "name": "Dan",
        "email": "dan@example.com",
        "role": "admin"
      }
    }
  Status 403: Unauthorized
```

### 2. /api/admin/dashboard-stats
```
Method: GET
Purpose: Get dashboard statistics
Auth Required: Yes (admin role)
Response:
  Status 200:
    {
      "totalUsers": 25,
      "totalRevenue": 5000,
      "totalSubscriptions": 12,
      "activeSubscriptions": 10
    }
  Status 403: Unauthorized
```

### 3. /api/admin/dashboard-users
```
Method: GET
Purpose: Get all users list
Auth Required: Yes (admin role)
Response:
  Status 200:
    {
      "users": [
        {
          "id": "user-1",
          "name": "Dan",
          "email": "dan@example.com",
          "role": "admin",
          "createdAt": "2024-01-15T10:00:00Z"
        },
        ...
      ]
    }
  Status 403: Unauthorized
```

### 4. /api/admin/dashboard-payments
```
Method: GET
Purpose: Get payment history
Auth Required: Yes (admin role)
Response:
  Status 200:
    {
      "payments": [
        {
          "id": 1,
          "amount": 500,
          "status": "succeeded",
          "createdAt": "2024-01-15T10:00:00Z",
          "method": "Card"
        },
        ...
      ]
    }
  Status 403: Unauthorized
```

### 5. /api/admin/dashboard-subscriptions
```
Method: GET
Purpose: Get subscription/membership data
Auth Required: Yes (admin role)
Response:
  Status 200:
    {
      "subscriptions": [
        {
          "id": "sub-1",
          "email": "alice@example.com",
          "planName": "Premium",
          "status": "active",
          "amount": 99.99,
          "renewsAt": "2024-02-15T10:00:00Z"
        },
        ...
      ]
    }
  Status 403: Unauthorized
```

---

## Security Verification Points

```
1. Middleware (Server-Side)
   └─ Only /admin/login allowed without session
   └─ Check: better-auth.session_token exists
   └─ Redirect: No token → /admin/login

2. Login Endpoint (Server-Side)
   └─ Check: Email exists?
   └─ Check: Password matches?
   └─ Check: role = "admin"?
   └─ Create: Session & cookie if valid

3. Session Verification (Component Level)
   └─ Call: /api/admin/verify on mount
   └─ Check: Session valid?
   └─ Check: role = "admin"?
   └─ Redirect: Invalid → /admin/login

4. API Endpoints (Server-Side)
   └─ Check: Session exists?
   └─ Check: role = "admin"?
   └─ Return: 403 if unauthorized
   └─ Return: Data if authorized

5. Session Isolation (Cookie-Based)
   └─ Admin: better-auth.session_token
   └─ User: Different cookie/session
   └─ Cannot be logged in simultaneously
```

---

## Database Schema Used

```
User Table:
├─ id (string, PK)
├─ name (string)
├─ email (string, unique)
├─ role (string: "admin" | "owner" | "guest" | "customer")
├─ emailVerified (boolean)
├─ createdAt (date)
├─ updatedAt (date)
├─ paymentStatus (string: "paid" | "pending" | "cancelled")
└─ planId (string)

Bookings Table:
├─ id (number, PK)
├─ propertyName (string)
├─ guestName (string)
├─ guestEmail (string)
├─ checkInDate (string)
├─ checkOutDate (string)
├─ numberOfGuests (number)
├─ bookingStatus (string)
├─ totalPrice (decimal)
├─ depositPaid (boolean)
├─ createdAt (string)
└─ updatedAt (string)
```

---

## Production Deployment Checklist

```
Before Deploying:

[ ] Admin user created with role = "admin"
[ ] Admin password changed from default
[ ] BETTER_AUTH_URL set to production domain
[ ] trustedOrigins updated with production domain
[ ] Database backups enabled
[ ] HTTPS enforced
[ ] Rate limiting configured on /api/auth/admin/login
[ ] Monitoring & alerting enabled
[ ] Error logging configured
[ ] Admin activity logging implemented
[ ] Regular security audits scheduled

After Deploying:

[ ] Test login with admin credentials
[ ] Verify all 4 tabs load correctly
[ ] Check database connections working
[ ] Monitor error logs
[ ] Test logout flow
[ ] Verify session isolation works
[ ] Check CORS headers correct
```

---

## Conclusion

The Admin Dashboard is a **complete, secure, production-ready system** with:

✅ Clean frontend UI
✅ Secure backend API
✅ Multiple security layers
✅ Proper role-based access control
✅ Session isolation from main site
✅ Real-time data loading
✅ Professional design
✅ Easy to extend and maintain

Ready to deploy and use! 🚀
