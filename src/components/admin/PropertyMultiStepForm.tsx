"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { ChevronLeft, ChevronRight, Save, Check, Home, MapPin, Bed, Sparkles, FileText, PoundSterling, Image, Search } from "lucide-react";
import { GEH_API } from "@/lib/api-client";
import { toast } from "sonner";

type PropertyFormData = {
  // Essentials
  title: string;
  property_type: string;
  status: string;
  description: string;
  
  // Location
  address: string;
  town: string;
  county: string;
  postcode: string;
  country: string;
  latitude?: number;
  longitude?: number;
  
  // Rooms
  max_guests: number;
  bedrooms: number;
  bathrooms: number;
  
  // Amenities
  amenities: string[];
  features: string[];
  
  // Policies
  check_in_time: string;
  check_out_time: string;
  minimum_stay: number;
  cancellation_policy: string;
  house_rules: string;
  
  // Pricing
  base_price: number;
  weekend_price?: number;
  cleaning_fee?: number;
  security_deposit?: number;
  
  // Media
  images: string[];
  hero_video?: string;
  
  // SEO
  meta_title?: string;
  meta_description?: string;
  slug?: string;
};

const STEPS = [
  { id: 1, name: "Essentials", icon: Home },
  { id: 2, name: "Location", icon: MapPin },
  { id: 3, name: "Rooms", icon: Bed },
  { id: 4, name: "Amenities", icon: Sparkles },
  { id: 5, name: "Policies", icon: FileText },
  { id: 6, name: "Pricing", icon: PoundSterling },
  { id: 7, name: "Media", icon: Image },
  { id: 8, name: "SEO", icon: Search },
];

const AMENITIES_OPTIONS = [
  "Hot Tub", "Swimming Pool", "Games Room", "Cinema Room", "BBQ", 
  "Garden", "Parking", "WiFi", "Pet Friendly", "Accessible",
  "EV Charging", "Tennis Court", "Beach Access", "Fishing Lake"
];

const PROPERTY_TYPES = [
  "Manor House", "Country House", "Cottage", "Castle", "Luxury House", 
  "Party House", "Stately House", "Quirky Property"
];

interface PropertyMultiStepFormProps {
  propertyId?: string;
  initialData?: Partial<PropertyFormData>;
}

export function PropertyMultiStepForm({ propertyId, initialData }: PropertyMultiStepFormProps) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const [formData, setFormData] = useState<PropertyFormData>({
    // Essentials
    title: initialData?.title || "",
    property_type: initialData?.property_type || "",
    status: initialData?.status || "draft",
    description: initialData?.description || "",
    
    // Location
    address: initialData?.address || "",
    town: initialData?.town || "",
    county: initialData?.county || "",
    postcode: initialData?.postcode || "",
    country: initialData?.country || "United Kingdom",
    latitude: initialData?.latitude,
    longitude: initialData?.longitude,
    
    // Rooms
    max_guests: initialData?.max_guests || 8,
    bedrooms: initialData?.bedrooms || 4,
    bathrooms: initialData?.bathrooms || 2,
    
    // Amenities
    amenities: initialData?.amenities || [],
    features: initialData?.features || [],
    
    // Policies
    check_in_time: initialData?.check_in_time || "15:00",
    check_out_time: initialData?.check_out_time || "10:00",
    minimum_stay: initialData?.minimum_stay || 2,
    cancellation_policy: initialData?.cancellation_policy || "",
    house_rules: initialData?.house_rules || "",
    
    // Pricing
    base_price: initialData?.base_price || 0,
    weekend_price: initialData?.weekend_price,
    cleaning_fee: initialData?.cleaning_fee,
    security_deposit: initialData?.security_deposit,
    
    // Media
    images: initialData?.images || [],
    hero_video: initialData?.hero_video,
    
    // SEO
    meta_title: initialData?.meta_title,
    meta_description: initialData?.meta_description,
    slug: initialData?.slug,
  });

  const updateField = (field: keyof PropertyFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when field is updated
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const toggleAmenity = (amenity: string) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    switch (step) {
      case 1: // Essentials
        if (!formData.title.trim()) newErrors.title = "Title is required";
        if (!formData.property_type) newErrors.property_type = "Property type is required";
        break;
      
      case 2: // Location
        if (!formData.address.trim()) newErrors.address = "Address is required";
        if (!formData.town.trim()) newErrors.town = "Town is required";
        break;
      
      case 3: // Rooms
        if (formData.max_guests < 1) newErrors.max_guests = "Must accommodate at least 1 guest";
        if (formData.bedrooms < 1) newErrors.bedrooms = "Must have at least 1 bedroom";
        break;
      
      case 6: // Pricing
        if (formData.base_price <= 0) newErrors.base_price = "Base price must be greater than 0";
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, STEPS.length));
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSaveDraft = async () => {
    setIsLoading(true);
    try {
      if (propertyId) {
        // Update existing property
        await GEH_API.put(`/properties/${propertyId}`, { ...formData, status: "draft" });
        toast.success("Property draft saved successfully");
      } else {
        // Create new property as draft
        const response = await GEH_API.post("/properties", { ...formData, status: "draft" }) as any;
        toast.success("Property draft created successfully");
        router.push(`/admin/properties/${response.id}/edit`);
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to save draft");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePublish = async () => {
    // Validate all required fields
    const requiredFieldsErrors: Record<string, string> = {};
    
    if (!formData.title.trim()) requiredFieldsErrors.title = "Title is required";
    if (!formData.address.trim()) requiredFieldsErrors.address = "Address is required";
    if (formData.max_guests < 1) requiredFieldsErrors.max_guests = "Max guests is required";
    if (formData.base_price <= 0) requiredFieldsErrors.base_price = "Base price is required";

    if (Object.keys(requiredFieldsErrors).length > 0) {
      setErrors(requiredFieldsErrors);
      toast.error("Please fill in all required fields");
      // Jump to first step with error
      if (requiredFieldsErrors.title || requiredFieldsErrors.property_type) setCurrentStep(1);
      else if (requiredFieldsErrors.address) setCurrentStep(2);
      else if (requiredFieldsErrors.max_guests) setCurrentStep(3);
      else if (requiredFieldsErrors.base_price) setCurrentStep(6);
      return;
    }

    setIsLoading(true);
    try {
      if (propertyId) {
        // Update existing property
        await GEH_API.put(`/properties/${propertyId}`, { ...formData, status: "active" });
        toast.success("Property published successfully");
        router.push("/admin/properties");
      } else {
        // Create new property
        await GEH_API.post("/properties", { ...formData, status: "active" });
        toast.success("Property published successfully");
        router.push("/admin/properties");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to publish property");
    } finally {
      setIsLoading(false);
    }
  };

  const addImageUrl = () => {
    const url = prompt("Enter image URL:");
    if (url) {
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, url]
      }));
    }
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1: // Essentials
        return (
          <div className="space-y-6">
            <div>
              <Label htmlFor="title">Property Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => updateField("title", e.target.value)}
                placeholder="e.g., The Brighton Manor"
                className={errors.title ? "border-red-500" : ""}
              />
              {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
            </div>

            <div>
              <Label htmlFor="property_type">Property Type *</Label>
              <Select value={formData.property_type} onValueChange={(value) => updateField("property_type", value)}>
                <SelectTrigger className={errors.property_type ? "border-red-500" : ""}>
                  <SelectValue placeholder="Select property type" />
                </SelectTrigger>
                <SelectContent>
                  {PROPERTY_TYPES.map(type => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.property_type && <p className="text-red-500 text-sm mt-1">{errors.property_type}</p>}
            </div>

            <div>
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value) => updateField("status", value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => updateField("description", e.target.value)}
                placeholder="Describe your property..."
                rows={6}
              />
            </div>
          </div>
        );

      case 2: // Location
        return (
          <div className="space-y-6">
            <div>
              <Label htmlFor="address">Full Address *</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => updateField("address", e.target.value)}
                placeholder="123 High Street"
                className={errors.address ? "border-red-500" : ""}
              />
              {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="town">Town *</Label>
                <Input
                  id="town"
                  value={formData.town}
                  onChange={(e) => updateField("town", e.target.value)}
                  placeholder="Brighton"
                  className={errors.town ? "border-red-500" : ""}
                />
                {errors.town && <p className="text-red-500 text-sm mt-1">{errors.town}</p>}
              </div>

              <div>
                <Label htmlFor="county">County</Label>
                <Input
                  id="county"
                  value={formData.county}
                  onChange={(e) => updateField("county", e.target.value)}
                  placeholder="East Sussex"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="postcode">Postcode</Label>
                <Input
                  id="postcode"
                  value={formData.postcode}
                  onChange={(e) => updateField("postcode", e.target.value)}
                  placeholder="BN1 1AA"
                />
              </div>

              <div>
                <Label htmlFor="country">Country</Label>
                <Input
                  id="country"
                  value={formData.country}
                  onChange={(e) => updateField("country", e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="latitude">Latitude (Optional)</Label>
                <Input
                  id="latitude"
                  type="number"
                  step="0.000001"
                  value={formData.latitude || ""}
                  onChange={(e) => updateField("latitude", parseFloat(e.target.value) || undefined)}
                  placeholder="50.8225"
                />
              </div>

              <div>
                <Label htmlFor="longitude">Longitude (Optional)</Label>
                <Input
                  id="longitude"
                  type="number"
                  step="0.000001"
                  value={formData.longitude || ""}
                  onChange={(e) => updateField("longitude", parseFloat(e.target.value) || undefined)}
                  placeholder="-0.1372"
                />
              </div>
            </div>
          </div>
        );

      case 3: // Rooms
        return (
          <div className="space-y-6">
            <div>
              <Label htmlFor="max_guests">Maximum Guests *</Label>
              <Input
                id="max_guests"
                type="number"
                min="1"
                value={formData.max_guests}
                onChange={(e) => updateField("max_guests", parseInt(e.target.value) || 0)}
                className={errors.max_guests ? "border-red-500" : ""}
              />
              {errors.max_guests && <p className="text-red-500 text-sm mt-1">{errors.max_guests}</p>}
            </div>

            <div>
              <Label htmlFor="bedrooms">Bedrooms</Label>
              <Input
                id="bedrooms"
                type="number"
                min="1"
                value={formData.bedrooms}
                onChange={(e) => updateField("bedrooms", parseInt(e.target.value) || 0)}
                className={errors.bedrooms ? "border-red-500" : ""}
              />
              {errors.bedrooms && <p className="text-red-500 text-sm mt-1">{errors.bedrooms}</p>}
            </div>

            <div>
              <Label htmlFor="bathrooms">Bathrooms</Label>
              <Input
                id="bathrooms"
                type="number"
                min="1"
                value={formData.bathrooms}
                onChange={(e) => updateField("bathrooms", parseInt(e.target.value) || 0)}
              />
            </div>
          </div>
        );

      case 4: // Amenities
        return (
          <div className="space-y-6">
            <div>
              <Label>Select Amenities</Label>
              <div className="grid grid-cols-2 gap-4 mt-3">
                {AMENITIES_OPTIONS.map(amenity => (
                  <div key={amenity} className="flex items-center space-x-2">
                    <Checkbox
                      id={amenity}
                      checked={formData.amenities.includes(amenity)}
                      onCheckedChange={() => toggleAmenity(amenity)}
                    />
                    <label htmlFor={amenity} className="text-sm cursor-pointer">
                      {amenity}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 5: // Policies
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="check_in_time">Check-in Time</Label>
                <Input
                  id="check_in_time"
                  type="time"
                  value={formData.check_in_time}
                  onChange={(e) => updateField("check_in_time", e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="check_out_time">Check-out Time</Label>
                <Input
                  id="check_out_time"
                  type="time"
                  value={formData.check_out_time}
                  onChange={(e) => updateField("check_out_time", e.target.value)}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="minimum_stay">Minimum Stay (nights)</Label>
              <Input
                id="minimum_stay"
                type="number"
                min="1"
                value={formData.minimum_stay}
                onChange={(e) => updateField("minimum_stay", parseInt(e.target.value) || 1)}
              />
            </div>

            <div>
              <Label htmlFor="cancellation_policy">Cancellation Policy</Label>
              <Textarea
                id="cancellation_policy"
                value={formData.cancellation_policy}
                onChange={(e) => updateField("cancellation_policy", e.target.value)}
                placeholder="Describe your cancellation policy..."
                rows={4}
              />
            </div>

            <div>
              <Label htmlFor="house_rules">House Rules</Label>
              <Textarea
                id="house_rules"
                value={formData.house_rules}
                onChange={(e) => updateField("house_rules", e.target.value)}
                placeholder="List your house rules..."
                rows={4}
              />
            </div>
          </div>
        );

      case 6: // Pricing
        return (
          <div className="space-y-6">
            <div>
              <Label htmlFor="base_price">Base Price (per night) *</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">£</span>
                <Input
                  id="base_price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.base_price}
                  onChange={(e) => updateField("base_price", parseFloat(e.target.value) || 0)}
                  className={`pl-7 ${errors.base_price ? "border-red-500" : ""}`}
                />
              </div>
              {errors.base_price && <p className="text-red-500 text-sm mt-1">{errors.base_price}</p>}
            </div>

            <div>
              <Label htmlFor="weekend_price">Weekend Price (per night)</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">£</span>
                <Input
                  id="weekend_price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.weekend_price || ""}
                  onChange={(e) => updateField("weekend_price", parseFloat(e.target.value) || undefined)}
                  className="pl-7"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="cleaning_fee">Cleaning Fee</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">£</span>
                <Input
                  id="cleaning_fee"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.cleaning_fee || ""}
                  onChange={(e) => updateField("cleaning_fee", parseFloat(e.target.value) || undefined)}
                  className="pl-7"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="security_deposit">Security Deposit</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">£</span>
                <Input
                  id="security_deposit"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.security_deposit || ""}
                  onChange={(e) => updateField("security_deposit", parseFloat(e.target.value) || undefined)}
                  className="pl-7"
                />
              </div>
            </div>
          </div>
        );

      case 7: // Media
        return (
          <div className="space-y-6">
            <div>
              <Label>Property Images</Label>
              <div className="space-y-4 mt-3">
                {formData.images.map((url, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Input value={url} readOnly className="flex-1" />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => removeImage(index)}
                    >
                      Remove
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  onClick={addImageUrl}
                  className="w-full"
                >
                  Add Image URL
                </Button>
              </div>
            </div>

            <div>
              <Label htmlFor="hero_video">Hero Video URL (Optional)</Label>
              <Input
                id="hero_video"
                value={formData.hero_video || ""}
                onChange={(e) => updateField("hero_video", e.target.value)}
                placeholder="https://example.com/video.mp4"
              />
            </div>
          </div>
        );

      case 8: // SEO
        return (
          <div className="space-y-6">
            <div>
              <Label htmlFor="slug">URL Slug</Label>
              <Input
                id="slug"
                value={formData.slug || ""}
                onChange={(e) => updateField("slug", e.target.value)}
                placeholder="brighton-manor"
              />
              <p className="text-sm text-gray-500 mt-1">Leave blank to auto-generate from title</p>
            </div>

            <div>
              <Label htmlFor="meta_title">Meta Title</Label>
              <Input
                id="meta_title"
                value={formData.meta_title || ""}
                onChange={(e) => updateField("meta_title", e.target.value)}
                placeholder="The Brighton Manor - Luxury Party House"
                maxLength={60}
              />
              <p className="text-sm text-gray-500 mt-1">{formData.meta_title?.length || 0}/60 characters</p>
            </div>

            <div>
              <Label htmlFor="meta_description">Meta Description</Label>
              <Textarea
                id="meta_description"
                value={formData.meta_description || ""}
                onChange={(e) => updateField("meta_description", e.target.value)}
                placeholder="Luxury 8-bedroom party house in Brighton with hot tub, pool, and games room. Perfect for hen parties and celebrations."
                rows={3}
                maxLength={160}
              />
              <p className="text-sm text-gray-500 mt-1">{formData.meta_description?.length || 0}/160 characters</p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex justify-between items-center">
          {STEPS.map((step, index) => {
            const Icon = step.icon;
            const isActive = currentStep === step.id;
            const isCompleted = currentStep > step.id;
            
            return (
              <div key={step.id} className="flex-1">
                <div className="flex items-center">
                  <button
                    onClick={() => setCurrentStep(step.id)}
                    className={`relative flex flex-col items-center group ${
                      isActive ? "text-[var(--color-accent-sage)]" : isCompleted ? "text-green-600" : "text-gray-400"
                    }`}
                  >
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${
                        isActive
                          ? "border-[var(--color-accent-sage)] bg-[var(--color-accent-sage)] text-white"
                          : isCompleted
                          ? "border-green-600 bg-green-600 text-white"
                          : "border-gray-300 bg-white"
                      }`}
                    >
                      {isCompleted ? <Check className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                    </div>
                    <span className="text-xs mt-2 font-medium hidden lg:block">{step.name}</span>
                  </button>
                  {index < STEPS.length - 1 && (
                    <div
                      className={`flex-1 h-0.5 mx-2 ${
                        currentStep > step.id ? "bg-green-600" : "bg-gray-300"
                      }`}
                    />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Form Content */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-2xl font-bold mb-6">{STEPS[currentStep - 1].name}</h2>
        {renderStepContent()}
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between items-center">
        <Button
          type="button"
          variant="outline"
          onClick={handlePrevious}
          disabled={currentStep === 1}
        >
          <ChevronLeft className="w-4 h-4 mr-2" />
          Previous
        </Button>

        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={handleSaveDraft}
            disabled={isLoading}
          >
            <Save className="w-4 h-4 mr-2" />
            Save Draft
          </Button>

          {currentStep < STEPS.length ? (
            <Button type="button" onClick={handleNext}>
              Next
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button
              type="button"
              onClick={handlePublish}
              disabled={isLoading}
              style={{ background: "var(--color-accent-sage)", color: "white" }}
            >
              <Check className="w-4 h-4 mr-2" />
              {propertyId ? "Update Property" : "Publish Property"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
