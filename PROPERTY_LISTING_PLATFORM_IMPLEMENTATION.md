# Property Listing Platform - Implementation Guide

## 🎯 System Overview

This is a **paid property listing platform**, NOT a booking website. The system operates as follows:

```
Owner → Buys Membership → Submits Property → Admin Reviews → Approved → Published
                              ↓
                        Status: Pending
                        Cannot edit/publish
                        Awaits Admin approval
```

## 📋 User Flows

### Owner Flow
1. **Registration/Login** → Visit frontend
2. **Browse Plans** → `/choose-plan`
3. **Purchase Membership** → Stripe payment
4. **Access Property Form** → `/register-your-property`
5. **Submit Property** → POST `/api/owner/properties/create`
6. **View Status** → Property shows as "pending" in membership dashboard
7. **Wait for Approval** → Admin reviews in admin dashboard
8. **Published** → Property appears on live site (admin control only)

### Admin Flow
1. **Login** → `/admin/login`
2. **Access Dashboard** → `/admin/dashboard`
3. **View Memberships** → See all purchased plans
4. **View Properties** → See all submissions (pending/approved/rejected)
5. **Approve/Reject** → Set status + publish/unpublish
6. **Manage Listings** → Edit, remove, or feature properties

## 🏗️ Database Schema

### Key Tables:
- **user** - User accounts (role: owner, guest, admin)
- **properties** - Property listings (status: pending/approved/rejected)
- **properties.status** - Owner-facing status
- **properties.isPublished** - Admin-controlled publication
- **session** - User sessions

## ✅ Implementation Checklist

### Phase 1: Property Submission API ✓ (Already Exists)
- [x] `/api/owner/properties/create` - Submit property
- [x] Property starts as `status: 'pending'`
- [x] Set `isPublished: false` by default
- [x] Associate with owner ID

### Phase 2: Admin Property Management APIs
- [ ] GET `/api/admin/properties` - List all properties with status
- [ ] GET `/api/admin/properties/:id` - View property details
- [ ] PATCH `/api/admin/properties/:id/approve` - Approve + publish
- [ ] PATCH `/api/admin/properties/:id/reject` - Reject with reason
- [ ] PATCH `/api/admin/properties/:id/publish` - Control publication
- [ ] DELETE `/api/admin/properties/:id` - Remove property

### Phase 3: Admin Dashboard UI
- [ ] Full property listings table
  - [x] Status column (pending/approved/rejected)
  - [x] Owner name/email
  - [ ] Quick approve/reject buttons
  - [ ] View details link
- [ ] Property detail page
  - [ ] Full property info
  - [ ] Edit form
  - [ ] Approve/reject actions
  - [ ] Publication toggle

### Phase 4: Frontend Owner Form
- [ ] Property submission form
  - [ ] Basic info (name, location, bedrooms, etc.)
  - [ ] Images (hero + gallery)
  - [ ] Pricing
  - [ ] Rules & amenities
  - [ ] Calendar sync (iCal)
- [ ] Success state
  - [ ] Confirmation message
  - [ ] Status tracking

### Phase 5: Membership Integration
- [ ] Only members can submit properties
- [ ] Non-members see "Purchase Plan" CTA
- [ ] Plans: Bronze, Silver, Gold
- [ ] Payment validation before property access

### Phase 6: Cleanup
- [ ] Remove/restructure owner backend routes (if needed)
- [ ] Remove owner dashboard from backend
- [ ] Move all owner operations to frontend

## 📊 Current Status

### What's Already Built:
✅ Property schema with status & isPublished fields
✅ Owner property creation API (`/api/owner/properties/create`)
✅ Authentication & role-based access
✅ Admin dashboard structure
✅ Membership/plan system
✅ User/membership deletion (just added)
✅ UK date formatting

### What's Needed:
🔴 Complete admin property management APIs
🔴 Admin dashboard property listing page
🔴 Admin property details page with approve/reject
🔴 Frontend property submission form
🔴 Property visibility/publication controls
🔴 Owner membership dashboard integration

## 🔑 Key API Endpoints Summary

### Owner APIs (Frontend)
```
POST /api/owner/properties/create
  - Create property listing (status: pending)
  - Requires: authenticated owner
  - Returns: property ID, status

GET /api/owner/properties
  - List owner's properties
  - Requires: authenticated owner
  - Returns: all owner properties

GET /api/owner/properties/:id
  - View property details
  - Requires: authenticated owner

PUT /api/owner/properties/:id
  - Update property (before approval)
  - Requires: authenticated owner
  - Locked after approval
```

### Admin APIs
```
GET /api/admin/properties
  - List all properties with filters
  - Requires: admin auth
  - Params: status, page, limit

GET /api/admin/properties/:id
  - View full property + owner details
  - Requires: admin auth

PATCH /api/admin/properties/:id/approve
  - Approve & publish property
  - Requires: admin auth
  - Sets: status=approved, isPublished=true

PATCH /api/admin/properties/:id/reject
  - Reject property with reason
  - Requires: admin auth
  - Sets: status=rejected

PATCH /api/admin/properties/:id/publish
  - Toggle publication status
  - Requires: admin auth
  - Sets: isPublished=true/false

DELETE /api/admin/properties/:id
  - Delete property completely
  - Requires: admin auth
```

### Public APIs
```
GET /api/properties
  - List published properties only
  - No auth required
  - Filter: isPublished=true, status=approved
  - Used on /properties listing page
```

## 🎨 Frontend Components Needed

### Owner Dashboard
- PropertyCard - Show property with status
- PropertySubmissionForm - Multi-step property creation
- UploadImages - Hero + gallery images
- StatusBadge - pending/approved/rejected

### Admin Dashboard
- PropertiesTable - Sortable, filterable
- PropertyDetailModal - Full details + actions
- ApprovalActions - Approve/Reject with reason
- PublishToggle - Control visibility

## 🔐 Authorization & Roles

### Owner
- Can create properties
- Can only see their own properties
- Cannot publish/approve
- Cannot see other owners' properties
- Cannot access /admin

### Admin
- Can see all properties
- Can approve/reject/publish/unpublish
- Can delete properties
- Can see owner details
- Cannot create listings as owner

### Guest/Customer
- Can see published properties
- Cannot create listings
- Cannot access admin
- Cannot access owner dashboard

## 🚨 Critical Requirements

1. **Property Status Flow**
   - New: pending (auto)
   - Approved: admin action
   - Rejected: admin action
   - Publishing: separate from approval (admin only)

2. **Membership Check**
   - User must have active membership to submit
   - Check `user.planId` and `user.paymentStatus`
   - Plans: bronze, silver, gold

3. **Data Isolation**
   - Owners see only their properties
   - Admin sees all properties
   - Public sees only published properties

4. **Admin Control**
   - Admin fully controls publication
   - Admin can approve/reject at any time
   - Admin can change status anytime

## 📝 Next Steps

1. Build admin property list API with filters
2. Build admin property detail page
3. Implement approve/reject functionality
4. Create frontend property submission form
5. Integrate membership check in form
6. Test complete owner → approval → publication flow
7. Remove/cleanup backend owner routes

---

**Last Updated:** January 15, 2026
**Status:** Ready for Implementation
