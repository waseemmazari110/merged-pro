'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

/**
 * Client-side guard to redirect admins away from frontend
 * Middleware handles this too, but this adds extra client-side protection
 */
export function AdminRedirectGuard() {
  const pathname = usePathname();

  useEffect(() => {
    // Check if user has admin session cookie
    const adminSessionCookie = document.cookie
      .split('; ')
      .find(row => row.startsWith('admin-session-token='));

    // List of paths that admins should NOT be able to access
    const adminBlockedPaths = [
      '/',
      '/login',
      '/owner-login',
      '/account/',
      '/owner-dashboard',
      '/properties',
      '/experiences',
      '/destinations',
    ];

    const isBlockedPath = adminBlockedPaths.some(path => pathname.startsWith(path));

    if (adminSessionCookie && isBlockedPath && !pathname.startsWith('/admin')) {
      // Redirect to admin dashboard
      window.location.href = '/admin/dashboard';
    }
  }, [pathname]);

  return null; // This component doesn't render anything
}
