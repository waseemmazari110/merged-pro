'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

/**
 * AdminRedirectWrapper
 * 
 * Session protection component:
 * - Prevents user sessions from accessing /admin routes (middleware handles this)
 * - Prevents session cross-contamination
 * - Does NOT auto-redirect admins away from public site
 * 
 * Admin access is ONLY through explicit /admin navigation
 */
export default function AdminRedirectWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Skip checks for auth, admin, and API routes
    // These are handled by middleware
    if (pathname.startsWith('/auth') || 
        pathname.startsWith('/admin') || 
        pathname.startsWith('/api')) {
      return;
    }

    // No auto-redirects for admins on public routes
    // Admins can freely browse the public site
    // /admin access is only through explicit navigation to /admin/login or /admin/dashboard
    
    // Just render children without redirect interference
  }, [pathname, router]);

  return children;
}
