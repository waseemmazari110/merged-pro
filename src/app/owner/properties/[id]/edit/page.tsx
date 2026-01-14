"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, CheckCircle, Loader2 } from "lucide-react";

interface PropertyData {
  title: string;
  slug: string;
  location: string;
  region: string;
  sleepsMin: number;
  sleepsMax: number;
  bedrooms: number;
  bathrooms: number;
  priceFromMidweek: number;
  priceFromWeekend: number;
  description: string;
  heroImage: string;
  isPublished: boolean;
}

export default function EditPropertyPage() {
  const router = useRouter();
  const params = useParams();
  const propertyId = params.id as string;
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [property, setProperty] = useState<PropertyData>({
    title: "",
    slug: "",
    location: "",
    region: "United Kingdom",
    sleepsMin: 1,
    sleepsMax: 8,
    bedrooms: 1,
    bathrooms: 1,
    priceFromMidweek: 100,
    priceFromWeekend: 100,
    description: "",
    heroImage: "",
    isPublished: false,
  });

  useEffect(() => {
    async function checkAuthAndFetch() {
      try {
        const session = await authClient.getSession();
        if (!session || !session.data?.user) {
          router.push("/");
          return;
        }

        const userData = session.data.user as any;
        if (userData.role !== "owner" && userData.role !== "admin") {
          router.push("/");
          return;
        }

        // Fetch property data
        const response = await fetch(`/api/owner/properties/${propertyId}`, { cache: 'no-store' });
        if (response.ok) {
          const data = await response.json();
          // Handle both response formats: direct property or wrapped in {property: ...}
          const propertyData = data.property || data;
          
          setProperty({
            title: propertyData.title || "",
            slug: propertyData.slug || "",
            location: propertyData.location || "",
            region: propertyData.region || "United Kingdom",
            sleepsMin: propertyData.sleepsMin || 1,
            sleepsMax: propertyData.sleepsMax || 8,
            bedrooms: propertyData.bedrooms || 1,
            bathrooms: propertyData.bathrooms || 1,
            priceFromMidweek: propertyData.priceFromMidweek || 100,
            priceFromWeekend: propertyData.priceFromWeekend || 100,
            description: propertyData.description || "",
            heroImage: propertyData.heroImage || "",
            isPublished: propertyData.isPublished || false,
          });
        } else {
          alert("Property not found");
          router.push("/owner/dashboard");
        }
      } catch (error) {
        console.error("Auth check error:", error);
        router.push("/");
      } finally {
        setLoading(false);
      }
    }

    checkAuthAndFetch();
  }, [router, propertyId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const response = await fetch(`/api/owner/properties/${propertyId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(property),
      });

      if (response.ok) {
        alert("Property updated successfully!");
        router.push("/owner/dashboard");
      } else {
        const error = await response.json();
        alert(`Failed to update property: ${error.error || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Update error:", error);
      alert("Failed to update property. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (field: keyof PropertyData, value: any) => {
    setProperty((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Auto-generate slug from title
    if (field === "title") {
      const slug = value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
      setProperty((prev) => ({ ...prev, slug }));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#17a2b8] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading property...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center py-4">
            <Button
              variant="ghost"
              onClick={() => router.push("/owner/dashboard")}
              className="mr-4"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Dashboard
            </Button>
            <h1 className="text-2xl font-bold text-gray-900">Edit Property</h1>
          </div>
        </div>
      </header>

      {/* Form */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Property Title *
              </label>
              <input
                type="text"
                required
                value={property.title}
                onChange={(e) => handleChange("title", e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#17a2b8] focus:border-transparent"
                placeholder="Beautiful 5-Bedroom House"
              />
            </div>

            {/* Location & Region */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location (Town/City) *
                </label>
                <input
                  type="text"
                  required
                  value={property.location}
                  onChange={(e) => handleChange("location", e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#17a2b8] focus:border-transparent"
                  placeholder="Brighton"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Region *
                </label>
                <input
                  type="text"
                  required
                  value={property.region}
                  onChange={(e) => handleChange("region", e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#17a2b8] focus:border-transparent"
                  placeholder="United Kingdom"
                />
              </div>
            </div>

            {/* Capacity */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Min Guests *
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  value={property.sleepsMin}
                  onChange={(e) => handleChange("sleepsMin", parseInt(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#17a2b8] focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Max Guests *
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  value={property.sleepsMax}
                  onChange={(e) => handleChange("sleepsMax", parseInt(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#17a2b8] focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bedrooms *
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  value={property.bedrooms}
                  onChange={(e) => handleChange("bedrooms", parseInt(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#17a2b8] focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bathrooms *
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  value={property.bathrooms}
                  onChange={(e) => handleChange("bathrooms", parseInt(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#17a2b8] focus:border-transparent"
                />
              </div>
            </div>

            {/* Pricing */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Midweek Price (£/night) *
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  step="0.01"
                  value={property.priceFromMidweek}
                  onChange={(e) => handleChange("priceFromMidweek", parseFloat(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#17a2b8] focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Weekend Price (£/night) *
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  step="0.01"
                  value={property.priceFromWeekend}
                  onChange={(e) => handleChange("priceFromWeekend", parseFloat(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#17a2b8] focus:border-transparent"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                required
                rows={4}
                value={property.description}
                onChange={(e) => handleChange("description", e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#17a2b8] focus:border-transparent"
                placeholder="Describe your property..."
              />
            </div>

            {/* Hero Image */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Hero Image URL
              </label>
              <input
                type="url"
                value={property.heroImage}
                onChange={(e) => handleChange("heroImage", e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#17a2b8] focus:border-transparent"
                placeholder="https://example.com/image.jpg"
              />
            </div>

            {/* Published Status */}
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="isPublished"
                checked={property.isPublished}
                onChange={(e) => handleChange("isPublished", e.target.checked)}
                className="w-4 h-4 text-[#17a2b8] border-gray-300 rounded focus:ring-[#17a2b8]"
              />
              <label htmlFor="isPublished" className="text-sm font-medium text-gray-700">
                Publish this property (visible to guests)
              </label>
            </div>

            {/* Submit Button */}
            <div className="flex gap-4 pt-6">
              <Button
                type="submit"
                disabled={saving}
                className="px-8 py-3 bg-[#17a2b8] text-white rounded-lg hover:bg-[#138496] disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/owner/dashboard")}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}




