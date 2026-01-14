"use client";

import { PropertyMultiStepForm } from "@/components/admin/PropertyMultiStepForm";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NewPropertyPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link href="/admin/properties">
            <Button variant="ghost" size="sm" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Properties
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Add New Property</h1>
          <p className="text-gray-600 mt-2">
            Complete all steps to create a new property listing. You can save as draft at any time.
          </p>
        </div>

        {/* Multi-Step Form */}
        <PropertyMultiStepForm />
      </div>
    </div>
  );
}