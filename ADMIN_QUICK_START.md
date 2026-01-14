# Admin Dashboard - Quick Start Guide

## 🚀 Get Started in 2 Minutes

### 1. Start Server
```bash
npm run dev
# Running on http://localhost:3001
```

### 2. Open Admin Login
```
http://localhost:3001/admin/login
```

### 3. Login
```
Email:    dan@example.com
Password: Admin123

(Use your actual admin credentials from database)
```

### 4. Explore Dashboard
```
✓ Overview   → See stats
✓ Users      → View all users
✓ Payments   → See payment history
✓ Subscriptions → Track memberships
```

---

## 📊 What You See

### Overview Tab
```
┌─────────────────────────────────────────┐
│  Total Users: 25    Total Revenue: £5000│
│  Subscriptions: 12  Active: 10          │
└─────────────────────────────────────────┘
```

### Users Tab
```
┌────────────────────────────────────────────┐
│ Name   │ Email         │ Role  │ Joined   │
├────────────────────────────────────────────┤
│ Dan    │ dan@...       │ Admin │ Jan 2024 │
│ Alice  │ alice@...     │ Owner │ Jan 2024 │
│ Bob    │ bob@...       │ Guest │ Jan 2024 │
└────────────────────────────────────────────┘
```

### Payments Tab
```
┌──────────────────────────────────────────┐
│ Amount    │ Status    │ Date    │ Method │
├──────────────────────────────────────────┤
│ £500.00   │ Succeeded │ Jan 15  │ Card   │
│ £299.99   │ Pending   │ Jan 14  │ Card   │
└──────────────────────────────────────────┘
```

### Subscriptions Tab
```
┌────────────────────────────────────────────────┐
│ Email    │ Plan  │ Status │ Amount  │ Renews  │
├────────────────────────────────────────────────┤
│ alice@.. │ Prime │ Active │ £99.99  │ Feb 15  │
│ bob@...  │ Prime │ Active │ £99.99  │ Feb 14  │
└────────────────────────────────────────────────┘
```

---

## 🔐 Security Features

✅ **Admin-Only Access**
- Only users with `role = "admin"` can access

✅ **Separate Login**
- Different from main website
- Own session & cookies

✅ **Secure Session**
- Cookie-based authentication
- Proper CSRF protection

✅ **Data Protection**
- API endpoints verify role
- Non-admins get 403 error

---

## 📂 File Locations

### Frontend
```
src/app/admin/
├── login/page.tsx       ← Login form
└── dashboard/page.tsx   ← Main dashboard
```

### Backend APIs
```
src/app/api/admin/
├── verify/route.ts                    ← Check session
├── dashboard-stats/route.ts            ← Get statistics
├── dashboard-users/route.ts            ← Get users
├── dashboard-payments/route.ts         ← Get payments
└── dashboard-subscriptions/route.ts    ← Get subscriptions
```

---

## 🔧 Common Tasks

### Change Admin Password
```sql
-- Database
UPDATE user SET password_hash = 'new_hash' 
WHERE email = 'dan@example.com';
```

### Add New Admin
```sql
INSERT INTO user (id, name, email, role, createdAt)
VALUES ('admin-2', 'Admin Name', 'admin@email.com', 'admin', NOW());
```

### Verify Admin Exists
```sql
SELECT email, role FROM user WHERE role = 'admin';
```

---

## ❌ Troubleshooting

### "Access Denied" error?
→ Check user has `role = "admin"` in database

### Can't login?
→ Verify email and password are correct

### Dashboard blank?
→ Check browser console for API errors
→ Verify `/api/admin/verify` returns 200

### Data not showing?
→ Check database has test data
→ Network tab should show 200 from all APIs

---

## 📈 Stripe Integration (Future)

When ready:
1. Add `STRIPE_SECRET_KEY` to `.env`
2. Modify `/api/admin/dashboard-payments`
3. Fetch real Stripe payment objects
4. Same for subscriptions endpoint

---

## 🎯 Key Endpoints

```
GET  /admin/login                         → Login form
GET  /admin/dashboard                     → Main dashboard
POST /api/auth/admin/login                → Authenticate
GET  /api/admin/verify                    → Check session
GET  /api/admin/dashboard-stats           → Get stats
GET  /api/admin/dashboard-users           → Get users
GET  /api/admin/dashboard-payments        → Get payments
GET  /api/admin/dashboard-subscriptions   → Get subscriptions
```

---

## ✅ Checklist

- [ ] Server running (`npm run dev`)
- [ ] Admin account exists in database
- [ ] Can login with admin credentials
- [ ] Dashboard loads without errors
- [ ] All 4 tabs show data
- [ ] Can logout successfully

---

## 💡 Tips

**Collapsible Sidebar**: Click menu icon to collapse/expand sidebar

**Dark Theme**: Sidebar is dark gray, main area is light

**Responsive**: Works on mobile (hamburger menu appears)

**Real-Time**: Data updates when you switch tabs

**Clean Code**: Built with React best practices

---

## 🚀 You're All Set!

Your admin dashboard is **production-ready** and fully functional.

Start exploring and managing your platform!

For detailed docs, see: `ADMIN_DASHBOARD_COMPLETE.md`
