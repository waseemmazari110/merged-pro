/**
 * Role-aware authentication helpers
 * Provides utilities for handling logout and session management by user role
 * 
 * ADMIN ISOLATION POLICY:
 * - Admins (role='admin' AND isAdmin=1) CANNOT access public/user routes
 * - Admins must only see admin dashboard at /admin/dashboard
 * - Any admin access to blocked routes results in immediate redirect
 */

import { authClient } from "./auth-client";

export type UserRole = 'admin' | 'owner' | 'customer' | 'guest';

/**
 * Check if a user should be considered an admin
 * Uses both role field and isAdmin flag for maximum safety
 */
export function isUserAdmin(user: any): boolean {
  if (!user) return false;
  return user.role === 'admin' && (user.isAdmin === 1 || user.isAdmin === true);
}

/**
 * Logout user and redirect to appropriate login page based on role
 * Clears all local storage and session data
 */
export async function logoutWithRole(role: UserRole): Promise<string> {
  try {
    // Sign out from better-auth
    await authClient.signOut();
    
    // Clear all client-side storage
    if (typeof window !== 'undefined') {
      localStorage.clear();
      sessionStorage.clear();
      
      // Clear any role-specific cookies (if manually set)
      document.cookie.split(";").forEach((c) => {
        document.cookie = c
          .replace(/^ +/, "")
          .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
      });
    }
  } catch (error) {
    console.error("Logout error:", error);
  }

  // Return appropriate redirect URL
  const redirectMap: Record<UserRole, string> = {
    admin: '/auth/admin-login',
    owner: '/owner-login',
    customer: '/login',
    guest: '/',
  };

  return redirectMap[role] || '/';
}

/**
 * Check if current session matches the expected role
 * Useful for preventing cross-role access
 */
export async function validateSessionRole(expectedRole: UserRole): Promise<boolean> {
  try {
    const session = await authClient.getSession();
    if (!session?.data?.user) return false;

    const response = await fetch('/api/user/profile', { cache: 'no-store' });
    if (!response.ok) return false;

    const profile = await response.json();
    
    // For admin role, check both role and isAdmin flag
    if (expectedRole === 'admin') {
      return profile.role === 'admin' && (profile.isAdmin === 1 || profile.isAdmin === true);
    }
    
    return profile.role === expectedRole;
  } catch (error) {
    console.error("Session validation error:", error);
    return false;
  }
}

/**
 * Check if current user is admin
 * Used to enforce admin-only access
 */
export async function isCurrentUserAdmin(): Promise<boolean> {
  try {
    const response = await fetch('/api/user/profile', { cache: 'no-store' });
    if (!response.ok) return false;

    const profile = await response.json();
    return isUserAdmin(profile);
  } catch (error) {
    console.error("Admin check error:", error);
    return false;
  }
}

/**
 * Get the dashboard URL for a given role
 */
export function getDashboardUrl(role: UserRole): string {
  const dashboardMap: Record<UserRole, string> = {
    admin: '/admin/dashboard',
    owner: '/owner/dashboard',
    customer: '/account/dashboard',
    guest: '/',
  };

  return dashboardMap[role] || '/';
}

/**
 * Get the login URL for a given role
 */
export function getLoginUrl(role: UserRole): string {
  const loginMap: Record<UserRole, string> = {
    admin: '/auth/admin-login',
    owner: '/owner-login',
    customer: '/login',
    guest: '/login',
  };

  return loginMap[role] || '/login';
}

/**
 * Redirect user to appropriate dashboard based on their role
 * Used after successful login
 */
export function redirectByRole(role: UserRole, router: any) {
  const url = getDashboardUrl(role);
  router.push(url);
  router.refresh();
}
