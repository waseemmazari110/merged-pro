"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  Users,
  Bed,
  Bath,
  MapPin,
  Wifi,
  Car,
  Flame,
  Waves,
  Music,
  ChefHat,
  Calendar,
  Eye,
  CheckCircle,
  Clock,
  XCircle,
  ExternalLink,
  Home,
  Loader2,
} from "lucide-react";

interface Property {
  id: number;
  title: string;
  slug: string;
  location: string;
  region: string;
  sleepsMax: number;
  bedrooms: number;
  bathrooms: number;
  priceFromWeekend: number;
  priceFromMidweek?: number;
  heroImage: string;
  galleryImages?: string[];
  description?: string;
  shortDescription?: string;
  amenities?: string[];
  features?: string[];
  houseRules?: string[];
  isPublished: boolean;
  status?: string;
  statusInfo?: {
    status: string;
    approvedAt?: string;
    rejectionReason?: string;
  };
}

function PropertyViewContent() {
  const params = useParams();
  const router = useRouter();
  const propertyId = params.id as string;
  
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    fetchProperty();
  }, [propertyId]);

  const fetchProperty = async () => {
    try {
      setLoading(true);
      setError(null);
      
      if (!propertyId) {
        throw new Error('Property ID is missing');
      }
      
      const url = `/api/owner/properties/${propertyId}`;
      console.log('Fetching property from:', url);
      
      const res = await fetch(url, { cache: 'no-store' });
      
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || `Property not found (${res.status})`);
      }
      
      const data = await res.json();
      console.log('Property data received:', data);
      
      // Handle both response formats: direct property or wrapped in {property: ...}
      const propertyData = data.property || data;
      
      if (!propertyData || !propertyData.id) {
        console.error('Invalid property data:', data);
        throw new Error('Invalid property data received');
      }
      
      setProperty(propertyData);
    } catch (err) {
      const errorMsg = (err as Error).message;
      console.error('Error fetching property:', errorMsg);
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = () => {
    const status = property?.statusInfo?.status || property?.status || 'pending';
    
    switch (status) {
      case 'approved':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-green-100 text-green-700 text-sm font-medium">
            <CheckCircle className="w-4 h-4" />
            Approved & Live
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-yellow-100 text-yellow-700 text-sm font-medium">
            <Clock className="w-4 h-4" />
            Pending Approval
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-100 text-red-700 text-sm font-medium">
            <XCircle className="w-4 h-4" />
            Rejected
          </span>
        );
      default:
        return null;
    }
  };

  const getAmenityIcon = (amenity: string) => {
    const amenityLower = amenity.toLowerCase();
    if (amenityLower.includes('wifi') || amenityLower.includes('internet')) return <Wifi className="w-5 h-5" />;
    if (amenityLower.includes('parking') || amenityLower.includes('car')) return <Car className="w-5 h-5" />;
    if (amenityLower.includes('fireplace') || amenityLower.includes('fire')) return <Flame className="w-5 h-5" />;
    if (amenityLower.includes('pool') || amenityLower.includes('hot tub') || amenityLower.includes('spa')) return <Waves className="w-5 h-5" />;
    if (amenityLower.includes('music') || amenityLower.includes('entertainment')) return <Music className="w-5 h-5" />;
    if (amenityLower.includes('kitchen') || amenityLower.includes('chef')) return <ChefHat className="w-5 h-5" />;
    return <Home className="w-5 h-5" />;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="animate-spin h-12 w-12 text-[var(--color-accent-sage)] mx-auto" />
          <p className="mt-4 text-gray-600">Loading property...</p>
        </div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="p-8 text-center max-w-md">
          <XCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Property Not Found</h2>
          <p className="text-gray-600 mb-6">{error || 'This property could not be found.'}</p>
          <Button onClick={() => router.push('/owner/properties')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Properties
          </Button>
        </Card>
      </div>
    );
  }

  const allImages = property.galleryImages && property.galleryImages.length > 0
    ? [property.heroImage, ...property.galleryImages]
    : [property.heroImage];

  const status = property.statusInfo?.status || property.status || 'pending';
  const isApproved = status === 'approved';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                onClick={() => router.push('/owner/properties')}
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-xl font-bold text-gray-900 flex items-center gap-3">
                  <Eye className="w-6 h-6 text-[var(--color-accent-sage)]" />
                  Property Preview
                </h1>
                <p className="text-sm text-gray-500">View how your property looks to guests</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {getStatusBadge()}
              {isApproved && (
                <Link href={`/owner/properties/${property.id}/availability`}>
                  <Button className="gap-2 bg-[var(--color-accent-sage)] hover:bg-emerald-700">
                    <Calendar className="w-4 h-4" />
                    View Availability
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Image Gallery */}
        <div className="bg-white rounded-xl overflow-hidden shadow-sm mb-8">
          <div className="relative h-[400px] md:h-[500px]">
            <Image
              src={allImages[currentImageIndex] || '/placeholder-property.svg'}
              alt={property.title}
              fill
              className="object-cover"
              priority
            />
            {allImages.length > 1 && (
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                {allImages.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentImageIndex(idx)}
                    className={`w-3 h-3 rounded-full transition-all ${
                      idx === currentImageIndex
                        ? 'bg-white scale-110'
                        : 'bg-gray-100 hover:bg-gray-200'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
          {allImages.length > 1 && (
            <div className="flex gap-2 p-4 overflow-x-auto">
              {allImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentImageIndex(idx)}
                  className={`relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                    idx === currentImageIndex
                      ? 'border-[var(--color-accent-sage)]'
                      : 'border-transparent hover:border-gray-300'
                  }`}
                >
                  <Image
                    src={img || '/placeholder-property.svg'}
                    alt={`Gallery ${idx + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Property Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Title & Location */}
            <Card className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{property.title}</h2>
              <div className="flex items-center gap-2 text-gray-600 mb-4">
                <MapPin className="w-5 h-5 text-[var(--color-accent-sage)]" />
                <span>{property.location}</span>
                {property.region && (
                  <span className="text-gray-400">• {property.region}</span>
                )}
              </div>
              
              {/* Key Stats */}
              <div className="flex flex-wrap gap-6 text-gray-700">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-[var(--color-accent-sage)]" />
                  <span>Sleeps {property.sleepsMax}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Bed className="w-5 h-5 text-[var(--color-accent-sage)]" />
                  <span>{property.bedrooms} Bedrooms</span>
                </div>
                <div className="flex items-center gap-2">
                  <Bath className="w-5 h-5 text-[var(--color-accent-sage)]" />
                  <span>{property.bathrooms} Bathrooms</span>
                </div>
              </div>
            </Card>

            {/* Description */}
            {(property.description || property.shortDescription) && (
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">About This Property</h3>
                <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                  {property.description || property.shortDescription}
                </p>
              </Card>
            )}

            {/* Amenities */}
            {property.amenities && property.amenities.length > 0 && (
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Amenities</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {property.amenities.map((amenity, idx) => (
                    <div key={idx} className="flex items-center gap-3 text-gray-700">
                      <span className="text-[var(--color-accent-sage)]">
                        {getAmenityIcon(amenity)}
                      </span>
                      <span>{amenity}</span>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Features */}
            {property.features && property.features.length > 0 && (
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Features</h3>
                <div className="grid grid-cols-2 gap-3">
                  {property.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-gray-700">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* House Rules */}
            {property.houseRules && property.houseRules.length > 0 && (
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">House Rules</h3>
                <ul className="space-y-2">
                  {property.houseRules.map((rule, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-gray-700">
                      <span className="text-gray-400">•</span>
                      <span>{rule}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Pricing */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Pricing</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Weekend (per night)</span>
                  <span className="text-xl font-bold text-[var(--color-accent-sage)]">
                    £{property.priceFromWeekend}
                  </span>
                </div>
                {property.priceFromMidweek && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Midweek (per night)</span>
                    <span className="text-xl font-bold text-[var(--color-accent-sage)]">
                      £{property.priceFromMidweek}
                    </span>
                  </div>
                )}
              </div>
            </Card>

            {/* Status Info */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Listing Status</h3>
              <div className="space-y-4">
                {getStatusBadge()}
                
                {status === 'pending' && (
                  <p className="text-sm text-yellow-700 bg-yellow-50 p-3 rounded-lg">
                    Your property is awaiting admin review. Once approved, it will be visible to guests on the website.
                  </p>
                )}
                
                {status === 'rejected' && property.statusInfo?.rejectionReason && (
                  <div className="bg-red-50 p-3 rounded-lg">
                    <p className="text-sm font-medium text-red-700 mb-1">Rejection Reason:</p>
                    <p className="text-sm text-red-600">{property.statusInfo.rejectionReason}</p>
                  </div>
                )}
                
                {isApproved && (
                  <div className="space-y-3">
                    <p className="text-sm text-green-700 bg-green-50 p-3 rounded-lg">
                      ✓ Your property is live and visible to guests
                    </p>
                    <Link href={`/properties/${property.slug}`} target="_blank">
                      <Button variant="outline" className="w-full gap-2">
                        <ExternalLink className="w-4 h-4" />
                        View Public Listing
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </Card>

            {/* Property Info Card */}
            {isApproved && (
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Availability</h3>
                <div className="space-y-3">
                  <Link href={`/owner/properties/${property.id}/availability`} className="block">
                    <Button className="w-full gap-2 bg-[var(--color-accent-sage)] hover:bg-emerald-700">
                      <Calendar className="w-4 h-4" />
                      View Availability Calendar
                    </Button>
                  </Link>
                  <p className="text-xs text-gray-500 text-center">
                    View booking status and date availability
                  </p>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function OwnerPropertyViewPage() {
  return (
    <ProtectedRoute allowedRoles={["owner", "admin"]}>
      <PropertyViewContent />
    </ProtectedRoute>
  );
}
