"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import {
  AlertCircle,
  CheckCircle2,
  Loader2,
  Upload,
  MapPin,
  DollarSign,
  Home,
  Users,
  BadgeCheck,
} from "lucide-react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";

const REGIONS = [
  "South West",
  "South Coast",
  "Midlands",
  "North",
  "Wales",
  "Scotland",
  "Lake District",
  "Peak District",
];

interface PropertyFormData {
  title: string;
  location: string;
  region: string;
  sleepsMin: number;
  sleepsMax: number;
  bedrooms: number;
  bathrooms: number;
  priceFromMidweek: number;
  priceFromWeekend: number;
  description: string;
  houseRules?: string;
  checkInOut?: string;
  iCalURL?: string;
  heroImage: string;
  heroVideo?: string;
  ownerContact?: string;
  mapLat?: number;
  mapLng?: number;
  floorplanURL?: string;
}

interface FormErrors {
  [key: string]: string;
}

export default function PropertySubmissionForm() {
  const router = useRouter();
  const { data: session, isPending: sessionPending } = authClient.useSession();

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [uploadingImage, setUploadingImage] = useState(false);
  const [userHasMembership, setUserHasMembership] = useState(false);

  const [formData, setFormData] = useState<PropertyFormData>({
    title: "",
    location: "",
    region: "",
    sleepsMin: 2,
    sleepsMax: 10,
    bedrooms: 3,
    bathrooms: 2,
    priceFromMidweek: 500,
    priceFromWeekend: 750,
    description: "",
    heroImage: "",
  });

  // Check membership status
  useEffect(() => {
    if (!sessionPending && session?.user) {
      const user = session.user as any;
      const hasPlan = user.planId && user.paymentStatus === "succeeded";
      setUserHasMembership(hasPlan);

      if (!hasPlan) {
        toast.error(
          "You need an active membership to submit a property. Please purchase a plan first."
        );
      }
    } else if (!sessionPending && !session) {
      router.push("/owner-login");
    }
  }, [session, sessionPending, router]);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.title.trim()) newErrors.title = "Property title is required";
    if (!formData.location.trim()) newErrors.location = "Location is required";
    if (!formData.region) newErrors.region = "Region is required";
    if (formData.sleepsMax < formData.sleepsMin) {
      newErrors.sleepsMax = "Max guests must be greater than or equal to min guests";
    }
    if (formData.priceFromMidweek <= 0) {
      newErrors.priceFromMidweek = "Midweek price must be greater than 0";
    }
    if (formData.priceFromWeekend <= 0) {
      newErrors.priceFromWeekend = "Weekend price must be greater than 0";
    }
    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }
    if (!formData.heroImage) {
      newErrors.heroImage = "Hero image is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleImageUpload = async (file: File) => {
    setUploadingImage(true);
    try {
      const formDataObj = new FormData();
      formDataObj.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formDataObj,
      });

      if (!response.ok) {
        throw new Error("Failed to upload image");
      }

      const data = await response.json();
      setFormData((prev) => ({
        ...prev,
        heroImage: data.url,
      }));
      toast.success("Image uploaded successfully");
    } catch (error) {
      toast.error("Failed to upload image");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    const finalValue =
      type === "number"
        ? parseFloat(value) || 0
        : type === "text"
          ? value
          : value;

    setFormData((prev) => ({
      ...prev,
      [name]: finalValue,
    }));

    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSelectChange = (value: string, field: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix all errors before submitting");
      return;
    }

    if (!userHasMembership) {
      toast.error("You need an active membership to submit a property");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/owner/properties/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setSubmitted(true);
        toast.success(
          "Property submitted successfully! Awaiting admin approval..."
        );
        setTimeout(() => {
          router.push("/account/dashboard");
        }, 2000);
      } else {
        toast.error(data.error || "Failed to submit property");
      }
    } catch (error) {
      console.error("Error submitting property:", error);
      toast.error("Error submitting property");
    } finally {
      setLoading(false);
    }
  };

  if (sessionPending) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    );
  }

  if (!session) {
    return null;
  }

  if (!userHasMembership) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <Card className="p-8 border-amber-200 bg-amber-50">
          <div className="flex items-start gap-4">
            <AlertCircle className="w-6 h-6 text-amber-600 mt-1 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-amber-900 mb-2">
                Active Membership Required
              </h3>
              <p className="text-amber-800 mb-4">
                You need to purchase a membership plan before you can submit a
                property. Choose from our Bronze, Silver, or Gold plans.
              </p>
              <Button
                onClick={() => router.push("/choose-plan")}
                className="bg-amber-600 hover:bg-amber-700"
              >
                Browse Plans
              </Button>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {submitted && (
        <Card className="p-8 border-green-200 bg-green-50 mb-6">
          <div className="flex items-start gap-4">
            <CheckCircle2 className="w-6 h-6 text-green-600 mt-1 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-green-900 mb-2">
                Property Submitted Successfully!
              </h3>
              <p className="text-green-800">
                Your property has been submitted for review. Our team will review
                it within 24-48 hours and notify you of the approval status.
              </p>
            </div>
          </div>
        </Card>
      )}

      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Submit Your Property
        </h1>
        <p className="text-gray-600 text-lg">
          Fill in the details below to get your property listed. Once submitted,
          our team will review and approve your listing.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information */}
        <Card className="p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Home className="w-6 h-6" />
            Basic Information
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Property Title *
              </label>
              <Input
                type="text"
                name="title"
                placeholder="e.g., Luxury Manor House in the Cotswolds"
                value={formData.title}
                onChange={handleInputChange}
                className={errors.title ? "border-red-500" : ""}
              />
              {errors.title && (
                <p className="text-red-500 text-sm mt-1">{errors.title}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location / Town *
                </label>
                <Input
                  type="text"
                  name="location"
                  placeholder="e.g., Bourton-on-the-Water"
                  value={formData.location}
                  onChange={handleInputChange}
                  className={errors.location ? "border-red-500" : ""}
                />
                {errors.location && (
                  <p className="text-red-500 text-sm mt-1">{errors.location}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Region *
                </label>
                <Select
                  value={formData.region}
                  onValueChange={(value) => handleSelectChange(value, "region")}
                >
                  <SelectTrigger
                    className={errors.region ? "border-red-500" : ""}
                  >
                    <SelectValue placeholder="Select region" />
                  </SelectTrigger>
                  <SelectContent>
                    {REGIONS.map((region) => (
                      <SelectItem key={region} value={region}>
                        {region}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.region && (
                  <p className="text-red-500 text-sm mt-1">{errors.region}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description *
              </label>
              <Textarea
                name="description"
                placeholder="Describe your property in detail. Include unique features, amenities, and what makes it special."
                value={formData.description}
                onChange={handleInputChange}
                rows={6}
                className={errors.description ? "border-red-500" : ""}
              />
              {errors.description && (
                <p className="text-red-500 text-sm mt-1">{errors.description}</p>
              )}
            </div>
          </div>
        </Card>

        {/* Capacity & Bedrooms */}
        <Card className="p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Users className="w-6 h-6" />
            Capacity & Layout
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Min Guests *
              </label>
              <Input
                type="number"
                name="sleepsMin"
                min="1"
                value={formData.sleepsMin}
                onChange={handleInputChange}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Max Guests *
              </label>
              <Input
                type="number"
                name="sleepsMax"
                min="1"
                value={formData.sleepsMax}
                onChange={handleInputChange}
                className={errors.sleepsMax ? "border-red-500" : ""}
              />
              {errors.sleepsMax && (
                <p className="text-red-500 text-sm mt-1">{errors.sleepsMax}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Bedrooms *
              </label>
              <Input
                type="number"
                name="bedrooms"
                min="1"
                value={formData.bedrooms}
                onChange={handleInputChange}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Bathrooms *
              </label>
              <Input
                type="number"
                name="bathrooms"
                min="1"
                step="0.5"
                value={formData.bathrooms}
                onChange={handleInputChange}
              />
            </div>
          </div>
        </Card>

        {/* Pricing */}
        <Card className="p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <DollarSign className="w-6 h-6" />
            Pricing
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price from Midweek (£) *
              </label>
              <Input
                type="number"
                name="priceFromMidweek"
                min="0"
                step="0.01"
                value={formData.priceFromMidweek}
                onChange={handleInputChange}
                className={errors.priceFromMidweek ? "border-red-500" : ""}
              />
              {errors.priceFromMidweek && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.priceFromMidweek}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price from Weekend (£) *
              </label>
              <Input
                type="number"
                name="priceFromWeekend"
                min="0"
                step="0.01"
                value={formData.priceFromWeekend}
                onChange={handleInputChange}
                className={errors.priceFromWeekend ? "border-red-500" : ""}
              />
              {errors.priceFromWeekend && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.priceFromWeekend}
                </p>
              )}
            </div>
          </div>
        </Card>

        {/* Media */}
        <Card className="p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Upload className="w-6 h-6" />
            Media
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Hero Image URL *
              </label>
              <Input
                type="text"
                name="heroImage"
                placeholder="https://example.com/image.jpg"
                value={formData.heroImage}
                onChange={handleInputChange}
                className={errors.heroImage ? "border-red-500" : ""}
              />
              {errors.heroImage && (
                <p className="text-red-500 text-sm mt-1">{errors.heroImage}</p>
              )}
              <p className="text-xs text-gray-500 mt-2">
                You can upload via file or provide an image URL
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Video URL (Optional)
              </label>
              <Input
                type="text"
                name="heroVideo"
                placeholder="https://yourdomain.com/video.mp4"
                value={formData.heroVideo || ""}
                onChange={handleInputChange}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Floorplan URL (Optional)
              </label>
              <Input
                type="text"
                name="floorplanURL"
                placeholder="https://yourdomain.com/floorplan.pdf"
                value={formData.floorplanURL || ""}
                onChange={handleInputChange}
              />
            </div>
          </div>
        </Card>

        {/* Additional Information */}
        <Card className="p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <BadgeCheck className="w-6 h-6" />
            Additional Information
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Check-in / Check-out Info (Optional)
              </label>
              <Textarea
                name="checkInOut"
                placeholder="E.g., Check-in: 4pm, Check-out: 11am"
                value={formData.checkInOut || ""}
                onChange={handleInputChange}
                rows={3}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                House Rules (Optional)
              </label>
              <Textarea
                name="houseRules"
                placeholder="List any house rules for guests"
                value={formData.houseRules || ""}
                onChange={handleInputChange}
                rows={3}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                iCal URL (Optional)
              </label>
              <Input
                type="text"
                name="iCalURL"
                placeholder="https://yourbookingsystem.com/ical"
                value={formData.iCalURL || ""}
                onChange={handleInputChange}
              />
              <p className="text-xs text-gray-500 mt-2">
                Sync your availability with iCal calendar links
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Contact Info for Guests (Optional)
              </label>
              <Input
                type="text"
                name="ownerContact"
                placeholder="E.g., contact@yourdomain.com or phone number"
                value={formData.ownerContact || ""}
                onChange={handleInputChange}
              />
            </div>
          </div>
        </Card>

        {/* Submit Button */}
        <div className="flex justify-between items-center">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={loading || uploadingImage}
            className="bg-green-600 hover:bg-green-700 text-white px-8"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Submit Property
              </>
            )}
          </Button>
        </div>

        <p className="text-sm text-gray-600 text-center">
          Your property will be reviewed by our team within 24-48 hours. You'll
          receive an email notification with the approval status.
        </p>
      </form>
    </div>
  );
}
