"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

/**
 * Root page redirect component
 * Checks if user is admin and redirects to admin dashboard
 */
export default function RootPageRedirect() {
  const router = useRouter();

  useEffect(() => {
    async function checkAndRedirect() {
      try {
        const session = await authClient.getSession();
        
        if (session?.data?.user) {
          // Fetch user profile to check role
          const response = await fetch("/api/user/profile", { cache: 'no-store' });
          if (response.ok) {
            const profile = await response.json();
            
            // If admin, redirect to admin dashboard
            if (profile.role === 'admin') {
              router.replace('/admin/dashboard');
              return;
            }
            // If owner, redirect to owner dashboard
            if (profile.role === 'owner') {
              router.replace('/owner/dashboard');
              return;
            }
            // If customer, redirect to account dashboard
            if (profile.role === 'customer') {
              router.replace('/account/dashboard');
              return;
            }
          }
        }
        // If not logged in, show home page (no redirect)
      } catch (error) {
        console.error("Root redirect error:", error);
        // On error, show home page
      }
    }

    checkAndRedirect();
  }, [router]);

  // Show loading while checking authentication
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading...</p>
      </div>
    </div>
  );
}
