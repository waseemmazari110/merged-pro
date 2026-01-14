"use client";

import { useSession } from "@/lib/auth-client";
import { useState, useEffect } from "react";

type UserRole = 'guest' | 'owner' | 'admin' | 'customer';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: UserRole[];
}

/**
 * Client-side route protection component
 * Wraps page content and checks if user has required role
 * 
 * Usage:
 * <ProtectedRoute allowedRoles={['admin']}>
 *   <YourAdminPage />
 * </ProtectedRoute>
 */
export function ProtectedRoute({ 
  children, 
  allowedRoles
}: ProtectedRouteProps) {
  const { data: session, isPending } = useSession();
  const [userRole, setUserRole] = useState<UserRole>('guest');
  const [isLoading, setIsLoading] = useState(true);

  // Fetch user role from profile API
  useEffect(() => {
    async function fetchUserRole() {
      if (session?.user) {
        try {
          const response = await fetch("/api/user/profile", {
            cache: 'no-store',
          });
          
          if (response.ok) {
            const profile = await response.json();
            setUserRole(profile.role || 'customer');
          }
        } catch (error) {
          console.error("Error fetching user role:", error);
          setUserRole('customer');
        }
      } else {
        setUserRole('guest');
      }
      setIsLoading(false);
    }
    
    if (!isPending) {
      fetchUserRole();
    }
  }, [session, isPending]);

  // Show loading while checking auth or fetching role
  if (isPending || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Not authenticated
  if (!session?.user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8 bg-white rounded-lg shadow-lg max-w-md">
          <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Restricted</h1>
          <p className="text-gray-600 mb-4">Please sign in to access this page.</p>
          <a href="/auth/signin" className="inline-block px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition">
            Sign In
          </a>
        </div>
      </div>
    );
  }

  // Wrong role - show restricted message
  if (!allowedRoles.includes(userRole)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8 bg-white rounded-lg shadow-lg max-w-md">
          <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Restricted</h1>
          <p className="text-gray-600 mb-4">
            You don't have permission to access this page. Required role: {allowedRoles.join(' or ')}.
          </p>
          <p className="text-sm text-gray-600 mb-4">
            Your current role: <span className="font-semibold">{userRole}</span>
          </p>
          <a href="/" className="inline-block px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition">
            Go Home
          </a>
        </div>
      </div>
    );
  }

  // Authorized - render children
  return <>{children}</>;
}

/**
 * HOC to wrap owner pages
 */
export function withOwnerProtection(Component: React.ComponentType) {
  return function ProtectedComponent(props: any) {
    return (
      <ProtectedRoute allowedRoles={['owner', 'admin']}>
        <Component {...props} />
      </ProtectedRoute>
    );
  };
}

/**
 * HOC to wrap admin pages
 */
export function withAdminProtection(Component: React.ComponentType) {
  return function ProtectedComponent(props: any) {
    return (
      <ProtectedRoute allowedRoles={['admin']}>
        <Component {...props} />
      </ProtectedRoute>
    );
  };
}
