"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { ProtectedRoute } from "@/components/ProtectedRoute";

// This page redirects to the owner dashboard with approvals view active
function OwnerPropertiesApprovalRedirect() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to dashboard with approvals view
    router.replace('/owner/dashboard?view=approvals');
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#89A38F] mx-auto"></div>
        <p className="mt-4 text-gray-600">Redirecting to dashboard...</p>
      </div>
    </div>
  );
}

export default function OwnerPropertiesApprovalPage() {
  return (
    <ProtectedRoute allowedRoles={['owner']}>
      <OwnerPropertiesApprovalRedirect />
    </ProtectedRoute>
  );
}
