# Session Isolation - Implementation Checklist

## Phase 1: Verify Files Are in Place ✅

- [x] `src/lib/auth-admin.ts` - Created
- [x] `src/app/api/auth/admin/login/route.ts` - Created
- [x] `src/app/api/auth/admin/logout/route.ts` - Created
- [x] `src/app/api/auth/user/login/route.ts` - Created
- [x] `src/app/api/auth/user/logout/route.ts` - Created
- [x] `middleware.ts` - Updated
- [x] `src/app/AdminRedirectWrapper.tsx` - Updated

**Documentation Created:**
- [x] `SESSION_ISOLATION_GUIDE.md` - Comprehensive reference
- [x] `SESSION_ISOLATION_EXECUTIVE_SUMMARY.md` - High-level overview
- [x] `SESSION_ISOLATION_CODE_EXAMPLES.md` - Before/after code

---

## Phase 2: Update Frontend Components

### Admin Login Page
- [ ] Update to use `/api/auth/admin/login` endpoint
- [ ] Add error handling for 403 (non-admin users)
- [ ] Update to use `adminAuthClient` from `src/lib/auth-admin.ts`

**Location**: Typically `src/app/admin/login/page.tsx` or similar

```typescript
// Replace old signIn code:
const response = await fetch('/api/auth/admin/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  credentials: 'include',
  body: JSON.stringify({ email, password })
});
```

### Public Login Page
- [ ] Update to use `/api/auth/user/login` endpoint
- [ ] Add error handling for 403 (admin trying to log in)
- [ ] Update to use `authClient` from `src/lib/auth-client.ts`

**Location**: Typically `src/app/login/page.tsx` or similar

```typescript
// Replace old signIn code:
const response = await fetch('/api/auth/user/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  credentials: 'include',
  body: JSON.stringify({ email, password })
});
```

### Admin Logout Button
- [ ] Update to use `/api/auth/admin/logout` endpoint
- [ ] Redirect to `/admin/login` after logout

**Example**:
```typescript
const handleAdminLogout = async () => {
  await fetch('/api/auth/admin/logout', {
    method: 'POST',
    credentials: 'include'
  });
  router.push('/admin/login');
};
```

### Public Logout Button
- [ ] Update to use `/api/auth/user/logout` endpoint
- [ ] Redirect to `/login` after logout

**Example**:
```typescript
const handlePublicLogout = async () => {
  await fetch('/api/auth/user/logout', {
    method: 'POST',
    credentials: 'include'
  });
  router.push('/login');
};
```

---

## Phase 3: Testing

### Manual Testing

**Test 1: Admin Login Isolation**
- [ ] Log in as admin via `/admin/login`
- [ ] Verify `admin-session-token` cookie is set (in DevTools)
- [ ] Verify `user-session-token` is NOT set
- [ ] Verify can access `/admin/dashboard`
- [ ] Try to access `/owner-dashboard` → should redirect to `/admin/dashboard`

**Test 2: Public User Login Isolation**
- [ ] Log in as public user via `/login`
- [ ] Verify `user-session-token` cookie is set
- [ ] Verify `admin-session-token` is NOT set
- [ ] Verify can access `/owner-dashboard`
- [ ] Try to access `/admin/dashboard` → should redirect to `/admin/login`

**Test 3: Admin Cannot Log In Publicly**
- [ ] Try to log in with admin email at `/login`
- [ ] Should get error: "Admin accounts cannot log in to public site"
- [ ] Should get 403 status
- [ ] No session cookie should be set

**Test 4: Public User Cannot Log In as Admin**
- [ ] Try to log in with regular user email at `/admin/login`
- [ ] Should get error: "Admin access only. User account not authorized."
- [ ] Should get 403 status
- [ ] No session cookie should be set

**Test 5: Independent Logouts**
- [ ] Log in as admin first
- [ ] Verify admin session exists
- [ ] Log in as public user (from different browser/incognito if needed)
- [ ] Verify both sessions can exist
- [ ] Log out from admin
- [ ] Verify can still access public site
- [ ] Log out from public
- [ ] Verify cannot access either

**Test 6: Logout Independence**
- [ ] Set up both sessions (admin + public) if possible
- [ ] Logout from admin only via `/api/auth/admin/logout`
- [ ] Verify `admin-session-token` is cleared
- [ ] Verify `user-session-token` still exists
- [ ] Can still access public routes ✓

**Test 7: Middleware Enforcement**
- [ ] Without any session, try to access `/admin`
- [ ] Should redirect to `/admin/login`
- [ ] Without any session, try to access `/owner-dashboard`
- [ ] Should allow access (no auth required) or redirect to `/login`

### Browser DevTools Checklist

**Cookies Panel**
- [ ] Open DevTools → Application → Cookies → localhost:3000
- [ ] After admin login: See `admin-session-token` (path=/admin)
- [ ] After public login: See `user-session-token` (path=/)
- [ ] After admin logout: `admin-session-token` cleared
- [ ] After public logout: `user-session-token` cleared

**Network Tab**
- [ ] `/api/auth/admin/login` returns 200 (success) or 403 (non-admin)
- [ ] `/api/auth/user/login` returns 200 (success) or 403 (admin)
- [ ] `/api/auth/admin/logout` returns 200
- [ ] `/api/auth/user/logout` returns 200

---

## Phase 4: Troubleshooting

### Issue: Cookie Not Being Set After Login
**Diagnosis**:
1. Check fetch request has `credentials: 'include'`
2. Check response headers have `Set-Cookie`
3. Check cookies panel in DevTools

**Fix**: Ensure login endpoint fetch includes:
```typescript
fetch('/api/auth/user/login', {
  credentials: 'include',  // ← This is critical!
  // ... other options
})
```

### Issue: Getting Redirected to Login After Login
**Diagnosis**:
1. Check middleware.ts is loading
2. Check correct cookie name for the path
3. Check cookie has valid token value

**Fix**: 
- Restart dev server: `npm run dev`
- Clear cookies and try again
- Check middleware.ts matcher includes your routes

### Issue: Both Sessions Active (Unexpected)
**Diagnosis**:
1. This is actually fine - both can coexist
2. Each has different path, so no conflict
3. Middleware/wrapper should route correctly

**Fix**: Verify middleware is clearing conflicting sessions:
- Admin login should clear `user-session-token`
- User login should clear `admin-session-token`

### Issue: "Cannot get response from login endpoint"
**Diagnosis**:
1. Check endpoint file exists at correct path
2. Check `npm run dev` is reloading
3. Check no syntax errors in file

**Fix**:
- Clear `.next` folder: `rm -r .next`
- Restart dev server
- Check console for errors

### Issue: Middleware Not Working
**Diagnosis**:
1. `middleware.ts` must be in root (not in `src/`)
2. Middleware only runs on actual file requests (not hot reload)

**Fix**:
- Move `middleware.ts` to project root if it's in `src/`
- Restart dev server completely (not just hot reload)
- Hard refresh browser (Ctrl+Shift+R)

---

## Phase 5: Production Deployment

### Before Deploying:
- [ ] All tests pass locally
- [ ] No console errors in browser
- [ ] Admin and public sessions work independently
- [ ] Cookies have `Secure` flag in production
- [ ] `BETTER_AUTH_SECRET` is set in `.env.production`

### Environment Variables
- [ ] `BETTER_AUTH_SECRET` set to strong random value
- [ ] `BETTER_AUTH_URL` set to production domain
- [ ] `NEXT_PUBLIC_BETTER_AUTH_URL` set if needed

### Deployment Checklist
- [ ] All new files deployed (auth endpoints)
- [ ] `middleware.ts` deployed to root
- [ ] `AdminRedirectWrapper.tsx` deployed
- [ ] `auth-admin.ts` deployed
- [ ] No old session cookies in browser cache
- [ ] Test admin login on production
- [ ] Test public login on production
- [ ] Verify separate cookies with correct paths

---

## Phase 6: Rollback Plan (If Needed)

If something goes wrong, you can rollback by:

1. **Restore old middleware.ts** (keeps simple session checking)
2. **Remove new auth endpoints** (admin/login, user/login, etc.)
3. **Revert AdminRedirectWrapper.tsx** (back to original logic)
4. **Clear all session cookies** in production

**Restore Command**:
```bash
git checkout middleware.ts src/app/AdminRedirectWrapper.tsx
rm -r src/app/api/auth/admin
rm -r src/app/api/auth/user
rm src/lib/auth-admin.ts
```

---

## FAQ

**Q: Can both sessions exist simultaneously?**
A: Yes! They use different cookie names and paths, so both can coexist. This is fine.

**Q: Do I need to update the database?**
A: No! The database sessions remain unchanged. Only the cookie layer is different.

**Q: Will existing sessions break?**
A: Yes, users will need to re-login after deployment. This is normal.

**Q: Do I need to update `auth.ts` or `auth-client.ts`?**
A: No! The main auth logic stays the same. Only the endpoints and cookies are new.

**Q: What about OAuth (Google/Apple) logins?**
A: They should continue to work through `/api/auth/[...all]` which is unchanged.

**Q: Can admins and regular users share the same email?**
A: No, emails are unique in the database. Each account is either admin or customer.

---

## Documentation Files

For more detailed information, see:

1. **[SESSION_ISOLATION_GUIDE.md](SESSION_ISOLATION_GUIDE.md)** - Full technical reference
2. **[SESSION_ISOLATION_EXECUTIVE_SUMMARY.md](SESSION_ISOLATION_EXECUTIVE_SUMMARY.md)** - High-level overview
3. **[SESSION_ISOLATION_CODE_EXAMPLES.md](SESSION_ISOLATION_CODE_EXAMPLES.md)** - Before/after code comparison

---

## Support

If you encounter issues:

1. Check error messages in browser console
2. Check network requests in DevTools
3. Verify cookie settings in DevTools → Cookies
4. Check server logs for 403/401 errors
5. Review the CODE_EXAMPLES.md file for reference implementation

---

## Success Criteria

Your implementation is successful when:

✅ Admin can log in to admin panel
✅ Admin cannot access public site with admin account
✅ Public user can log in to public site
✅ Public user cannot access admin panel
✅ Admin logout doesn't log out public session
✅ Public logout doesn't log out admin session
✅ Two different cookies exist: `admin-session-token` and `user-session-token`
✅ No "better-auth.session_token" cookie exists
✅ Admins accessing public routes redirect to admin dashboard
✅ Public users accessing admin routes redirect to admin login

---

**Status**: Implementation Complete ✅
**Ready for**: Frontend component updates and testing
