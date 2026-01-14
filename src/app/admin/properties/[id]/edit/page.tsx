"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { PropertyMultiStepForm } from "@/components/admin/PropertyMultiStepForm";
import Link from "next/link";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GEH_API } from "@/lib/api-client";
import { toast } from "sonner";

export default function EditPropertyPage() {
  const params = useParams();
  const propertyId = params.id as string;
  const [property, setProperty] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const data = await GEH_API.get(`/properties/${propertyId}`);
        setProperty(data);
      } catch (error: any) {
        toast.error(error.message || "Failed to load property");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProperty();
  }, [propertyId]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-[var(--color-accent-sage)]" />
          </div>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center py-20">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Property Not Found</h2>
            <Link href="/admin/properties">
              <Button>Back to Properties</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

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
          <h1 className="text-3xl font-bold text-gray-900">Edit Property</h1>
          <p className="text-gray-600 mt-2">
            Update property details. Changes will be saved when you publish or save as draft.
          </p>
        </div>

        {/* Multi-Step Form */}
        <PropertyMultiStepForm propertyId={propertyId} initialData={property} />
      </div>
    </div>
  );
}