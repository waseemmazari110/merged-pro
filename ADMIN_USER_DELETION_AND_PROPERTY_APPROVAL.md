# Admin Dashboard - User Deletion & Property Approval Features

## Overview
Enhanced admin dashboard with two new critical features:
1. **User Deletion** - Admin can delete any user from the system
2. **Property Approval/Rejection** - Admin can approve, reject, or view pending properties from owners

---

## Feature 1: User Management & Deletion

### Location
**Dashboard Tab:** Users Tab (2nd tab)

### Functionality
- View all users in the system with their role, email, and join date
- Delete any user (except admin cannot delete themselves)
- Confirmation dialog prevents accidental deletion
- Only non-admin users can be deleted

### User Deletion API
**Endpoint:** `POST /api/admin/users/delete`

**Request Body:**
```json
{
  "id": "user-id-string"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User deleted successfully",
  "deletedUserId": "user-id-string"
}
```

**Status Codes:**
- `200` - Success
- `400` - Invalid request (missing ID or trying to delete self)
- `403` - Unauthorized (not admin)
- `500` - Server error

### Security Features
- ✅ Admin role verification required
- ✅ Prevents self-deletion
- ✅ Confirmation required before deletion
- ✅ Session-based authentication check

---

## Feature 2: Property Approval & Rejection

### Location
**Dashboard Tab:** Properties Tab (3rd tab)

### Functionality
- View all properties by status: Pending, Approved, Rejected, All
- Approve properties (makes them visible on the site for bookings)
- Reject properties with reason
- See property details: title, location, owner info, pricing, capacity
- Batch filtering by approval status

### Property Status Flow
1. **Pending** - Owner created property after buying subscription
2. **Approved** - Admin approved, property is published and visible
3. **Rejected** - Admin rejected with reason, owner is notified

### Property Approval API
**Endpoint:** `PATCH /api/admin/properties/approve`

**Request Body:**
```json
{
  "propertyId": 123,
  "status": "approved",  // or "rejected"
  "rejectionReason": "Property does not meet guidelines"  // optional, only for rejection
}
```

**Response:**
```json
{
  "success": true,
  "message": "Property approved successfully",
  "propertyId": 123,
  "status": "approved"
}
```

**Status Codes:**
- `200` - Success
- `400` - Invalid request (missing fields or invalid status)
- `403` - Unauthorized (not admin)
- `404` - Property not found
- `500` - Server error

### When Property is Approved
✅ Status changes to "approved"
✅ `isPublished` flag is set to true
✅ Property becomes visible on the booking site
✅ Guests can search and book the property

### When Property is Rejected
✅ Status changes to "rejected"
✅ Rejection reason is prepended to property description
✅ Property is NOT published
✅ Owner should receive notification to update property

---

## Getting Pending Properties
**Endpoint:** `GET /api/admin/dashboard-properties?status=pending`

**Query Parameters:**
- `status` - Filter by status: "pending" (default), "approved", "rejected", "all"

**Response:**
```json
{
  "properties": [
    {
      "id": 123,
      "title": "Luxury Cottage",
      "status": "pending",
      "ownerId": "owner-id",
      "location": "Lake District",
      "region": "England",
      "sleepsMax": 8,
      "bedrooms": 3,
      "bathrooms": 2,
      "priceFromMidweek": 250.00,
      "priceFromWeekend": 350.00,
      "heroImage": "https://...",
      "plan": "premium",
      "createdAt": "2025-01-14T10:00:00Z",
      "ownerName": "John Doe",
      "ownerEmail": "john@example.com",
      "ownerPhone": "+44..."
    }
  ],
  "summary": {
    "pending": 5,
    "approved": 12,
    "rejected": 2,
    "total": 19
  },
  "total": 5
}
```

---

## Admin Dashboard UI Components

### Users Tab Features
- **Delete Button** - Click trash icon to delete user
- **Confirmation Modal** - Confirm/Cancel deletion
- **Role Badges** - Visual indicators for admin/owner/guest roles
- **Joined Date** - Shows when user registered

### Properties Tab Features
- **Status Filter Buttons** - Switch between Pending/Approved/Rejected/All
- **Property Card** - Shows:
  - Property title and location
  - Owner information
  - Capacity details (sleeps, bedrooms, bathrooms)
  - Pricing information
  - Submission date
- **Action Buttons** - For pending properties:
  - ✅ Approve & Publish (green button)
  - ❌ Reject (outline button)
- **Status Badge** - Color-coded status indicator

---

## Business Logic

### Property Visibility
```
Owner Creates Property (after buying subscription)
    ↓
Property status = "pending"
Property isPublished = false
    ↓
Admin Reviews Property
    ├─→ APPROVE → status = "approved", isPublished = true
    │                → Property visible to guests
    │                → Can be booked
    │
    └─→ REJECT → status = "rejected", isPublished = false
                 → Property NOT visible to guests
                 → Cannot be booked
                 → Owner notified to fix issues
```

### User Deletion Impact
When a user is deleted:
- ✅ User account removed
- ✅ User cannot login
- ✅ Related bookings/transactions remain (for record-keeping)
- ✅ User's properties are orphaned but remain

---

## Use Cases

### Use Case 1: Approve Quality Property
1. Admin clicks "Properties" tab
2. Sees pending property from owner
3. Reviews details (location, images, pricing)
4. Clicks "Approve & Publish"
5. Property becomes visible on site
6. Guests can now book it

### Use Case 2: Reject Poor Quality Property
1. Admin clicks "Properties" tab
2. Sees pending property that needs work
3. Clicks "Reject"
4. Property status changes to rejected
5. Owner should update property and resubmit

### Use Case 3: Delete Spam/Fake User
1. Admin clicks "Users" tab
2. Finds suspicious user account
3. Clicks trash icon next to user
4. Confirms deletion
5. User account is permanently removed

---

## Database Schema Impact

### Properties Table
- **status** field: "pending" | "approved" | "rejected"
- **isPublished** field: boolean (set to true on approval)
- **description** field: rejection reason prepended if rejected

### User Table
- Uses soft-delete approach for integrity
- Direct deletion to remove accounts

---

## Security Considerations

✅ Admin role required for all operations
✅ Session-based authentication
✅ Confirmation dialogs prevent accidents
✅ Cannot delete own admin account
✅ All requests validated server-side
✅ Error handling prevents data leaks
✅ Timestamps tracked for audit trail

---

## Testing the Features

### Test User Deletion
```bash
# Login as admin first
# Go to Users tab
# Click trash icon on any non-admin user
# Confirm deletion
# User should disappear from list
```

### Test Property Approval
```bash
# Create property as owner after buying plan
# Login as admin
# Go to Properties tab
# See pending property
# Click "Approve & Publish"
# Property status changes to "approved"
# Logout and check if property visible on site
```

### Test Property Rejection
```bash
# Login as admin
# Go to Properties tab
# Click "Reject" on any pending property
# Property status changes to "rejected"
# Property not visible on site
```

---

## API Testing with cURL

### Delete User
```bash
curl -X DELETE http://localhost:3001/api/admin/users/delete \
  -H "Content-Type: application/json" \
  -d '{"id":"user-123"}' \
  -b "better-auth.session_token=your_session_token"
```

### Approve Property
```bash
curl -X PATCH http://localhost:3001/api/admin/properties/approve \
  -H "Content-Type: application/json" \
  -d '{"propertyId":123,"status":"approved"}' \
  -b "better-auth.session_token=your_session_token"
```

### Reject Property
```bash
curl -X PATCH http://localhost:3001/api/admin/properties/approve \
  -H "Content-Type: application/json" \
  -d '{"propertyId":123,"status":"rejected","rejectionReason":"Images missing"}' \
  -b "better-auth.session_token=your_session_token"
```

### Get Pending Properties
```bash
curl http://localhost:3001/api/admin/dashboard-properties?status=pending \
  -b "better-auth.session_token=your_session_token"
```

---

## Troubleshooting

### Users tab showing no users
- Check that users exist in database
- Verify admin session is valid
- Check browser console for errors

### Properties tab showing no properties
- Check that owners have created properties
- Verify property creation is working
- Check for status field in database

### Delete not working
- Verify you're logged in as admin
- Check that user isn't an admin account
- Look for error message in modal

### Approve/Reject not working
- Verify admin session
- Check property ID is correct
- Check for error notifications

---

## Future Enhancements

🔮 Bulk operations (approve/reject multiple at once)
🔮 Property search and filtering
🔮 Rejection reason templates
🔮 Owner notifications on approval/rejection
🔮 Property edit history
🔮 Custom rejection messages
🔮 Automated property quality scoring
