"use client";

import { ProtectedRoute } from "@/components/ProtectedRoute";
import { EnquiriesViewer } from "@/components/enquiries/EnquiriesViewer";

export default function EnquiriesPage() {
  return (
    <ProtectedRoute allowedRoles={["owner"]}>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Enquiries</h1>
            <p className="text-gray-600 mt-2">
              Manage and respond to property enquiries
            </p>
          </div>

          <EnquiriesViewer />
        </div>
      </div>
    </ProtectedRoute>
  );
}
