# Quick Reference: Admin User Deletion & Property Approval

## 🚀 Quick Start

### Access Admin Dashboard
1. Navigate to `/admin/dashboard`
2. Login with admin credentials (Dan / Admin123)
3. You'll see 5 tabs: Overview, Users, Properties, Payments, Subscriptions

---

## 👥 User Deletion

### How to Delete a User
1. Click **Users** tab
2. Find the user you want to delete
3. Click the **red trash icon** in the Actions column
4. Click **Confirm** in the popup
5. User is deleted immediately

### Important Notes
- ❌ Cannot delete admin accounts
- ⚠️ Confirmation required (prevents accidents)
- 🔒 Only admins can delete users
- 📊 User deletion doesn't affect their past bookings/payments

---

## 🏠 Property Approval & Rejection

### How to Approve a Property
1. Click **Properties** tab
2. Click **Pending** filter button (default)
3. Review property details
4. Click **✅ Approve & Publish** (green button)
5. Property becomes visible on booking site

### How to Reject a Property
1. Click **Properties** tab
2. See pending property
3. Click **❌ Reject** (outline button)
4. Property status changes to "Rejected"
5. Property removed from booking site
6. Owner should fix and resubmit

### Filter Properties by Status
- **Pending** - Awaiting admin review
- **Approved** - Approved and visible for booking
- **Rejected** - Rejected, not visible
- **All** - Show all properties

---

## 📊 Property Card Information

Each property shows:
- Property title and location
- Owner name and email
- Capacity (sleeps, bedrooms, bathrooms)
- Pricing (midweek/weekend)
- Submission date
- Current approval status

---

## 🔐 Security & Permissions

### Required to Use These Features
- ✅ Must be logged in as admin
- ✅ Admin role assigned in database
- ✅ Valid session token in browser

### Protected Operations
- User deletion - Admin only
- Property approval - Admin only
- Property rejection - Admin only

---

## 📱 Mobile/Responsive Design

✅ All features work on mobile
✅ Tables are scrollable on small screens
✅ Buttons are touch-friendly
✅ Modals are responsive

---

## ⚡ Real-Time Updates

When you perform an action:
- ✅ UI updates immediately
- ✅ No page refresh needed
- ✅ Data syncs with database
- ✅ Other admins see changes (after refresh)

---

## 🆘 Troubleshooting

### "Access Denied" Error
→ You must be logged in as admin
→ Go to `/admin/login` and enter admin credentials

### Users Tab Shows No Users
→ Check that users exist in database
→ Try refreshing the page

### Properties Tab Shows No Properties
→ Owners must have created properties
→ Check that subscription purchases are working

### Delete/Approve Button Doesn't Work
→ Check your internet connection
→ Verify you're still logged in
→ Try refreshing the page

### Deleted User Still Appears
→ Refresh the page to sync with database
→ Check if user was actually deleted

---

## 💡 Use Cases

### Scenario 1: Delete Spam User
1. User registered but never used system
2. Go to Users tab
3. Find spam user
4. Click trash icon
5. Confirm deletion
6. ✅ Spam user removed

### Scenario 2: Approve Quality Property
1. Owner submits luxury property listing
2. Looks good (images, pricing, description)
3. Go to Properties tab → Pending
4. Click "Approve & Publish"
5. ✅ Property visible to guests
6. ✅ Guests can now book it

### Scenario 3: Reject Incomplete Property
1. Owner submits property with missing info
2. Go to Properties tab → Pending
3. Click "Reject"
4. ✅ Status changes to Rejected
5. Owner notified to fix property
6. Property not visible to guests

---

## 📊 Statistics Summary (Properties Tab)

The summary shows:
- **Pending** - Properties awaiting review
- **Approved** - Published properties
- **Rejected** - Properties that were rejected
- **Total** - All properties in system

---

## 🔗 Related Features

These features work with:
- ✅ Subscription purchase system
- ✅ User authentication (better-auth)
- ✅ Property creation by owners
- ✅ Booking system
- ✅ Admin login

---

## 📞 Support

If features aren't working:
1. Check admin login status
2. Refresh the page
3. Check browser console for errors
4. Verify database has required fields
5. Check session cookie is present

---

## 🎯 Key Endpoints

**For Developers:**

```
DELETE /api/admin/users/delete
- Delete a user

GET /api/admin/dashboard-properties?status=pending
- Get properties (with status filter)

PATCH /api/admin/properties/approve
- Approve or reject a property
```

All endpoints require:
- Admin authentication
- Valid session token
- Proper request body

---

## ✅ Feature Checklist

- [x] Admin can delete users
- [x] Confirmation dialog before deletion
- [x] Admin can approve properties
- [x] Admin can reject properties
- [x] Approved properties become visible
- [x] Status filtering works
- [x] Real-time UI updates
- [x] Mobile responsive
- [x] Security checks in place
- [x] Error handling
- [x] Documentation complete

---

## 📝 Notes

- Changes are permanent (no undo)
- Always confirm before deleting
- Approved properties are published immediately
- Rejected properties can be resubmitted by owner
- All actions are logged with timestamps

---

**Last Updated:** January 14, 2026
**Status:** ✅ Production Ready
