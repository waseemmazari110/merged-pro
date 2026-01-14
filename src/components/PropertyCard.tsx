"use client";

import Image from "next/image";
import Link from "next/link";
import { UsersRound, MapPinned } from "lucide-react";
import { useState, useMemo, useCallback, memo } from "react";
import dynamic from "next/dynamic";
import { SaveButton } from "./auth/SaveButton";

const BookingModal = dynamic(() => import("@/components/BookingModal"), {
  ssr: false,
  loading: () => null,
});

interface PropertyCardProps {
  id: string;
  title: string;
  location: string;
  sleeps: number;
  bedrooms: number;
  priceFrom: number;
  image: string;
  features: string[];
  slug: string;
  priority?: boolean;
}

const PLACEHOLDER_IMAGE = 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80';

function validateImageUrl(url: string): string {
  if (!url || url === '/placeholder-property.jpg') {
    return PLACEHOLDER_IMAGE;
  }
  
  if (url.includes('gstatic.com') || url.includes('google.com/images') || url.includes('googleusercontent.com')) {
    return PLACEHOLDER_IMAGE;
  }
  
  const hasImageExtension = /\.(jpg|jpeg|png|webp|avif|gif)(\?.*)?$/i.test(url);
  const isImageCDN = 
    url.includes('supabase.co/storage') ||
    url.includes('unsplash.com') ||
    url.includes('fal.media');
  
  if (!hasImageExtension && !isImageCDN) {
    return PLACEHOLDER_IMAGE;
  }
  
  return url;
}

function PropertyCard({
  id,
  title,
  location,
  sleeps,
  bedrooms,
  priceFrom,
  image,
  features,
  slug,
  priority = false,
}: PropertyCardProps) {
const [bookingModalOpen, setBookingModalOpen] = useState(false);
const [imageError, setImageError] = useState(false);
const [imageLoaded, setImageLoaded] = useState(false);

const validatedImage = useMemo(() => validateImageUrl(image), [image]);
const displayImage = imageError ? PLACEHOLDER_IMAGE : validatedImage;

const handleImageError = useCallback(() => setImageError(true), []);
const handleImageLoad = useCallback(() => setImageLoaded(true), []);

const getDestinationSlug = useCallback((loc: string) => {
const city = loc.split(',')[0].trim().toLowerCase();
return city.replace(/\s+/g, '-');
}, []);

const destinationSlug = getDestinationSlug(location);

return (
<>
<div className="group rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-xl transition-all duration-200 hover:-translate-y-1">
<div className="relative w-full aspect-[4/3] overflow-hidden bg-gray-100">
<Link href={`/properties/${slug}`}>
{!imageLoaded && (
<div className="absolute inset-0 bg-gray-200 animate-pulse" />
)}
<Image
src={displayImage}
alt={title}
fill
sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
quality={80}
className={`object-cover object-center transition-all duration-300 group-hover:scale-105 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
onError={handleImageError}
onLoad={handleImageLoad}
loading={priority ? undefined : "lazy"}
priority={priority}
/>
</Link>
          
          {/* Feature Tags */}
          <div className="absolute top-4 left-4 flex gap-2 flex-wrap">
            {features.slice(0, 2).map((feature) => (
              <span
                key={feature}
                className="px-3 py-1 text-xs font-medium rounded-full bg-white/90 backdrop-blur-sm"
                style={{ color: "var(--color-text-primary)" }}
              >
                {feature}
              </span>
            ))}
          </div>

          {/* Save Button */}
          <div className="absolute top-4 right-4">
            <SaveButton propertyId={parseInt(id)} />
          </div>
        </div>

        <div className="p-6">
          <Link href={`/properties/${slug}`}>
            <h3
              className="text-xl font-semibold mb-2 group-hover:text-[var(--color-accent-sage)] transition-colors"
              style={{ fontFamily: "var(--font-body)" }}
            >
              {title}
            </h3>
          </Link>

          <Link 
            href={`/destinations/${destinationSlug}`}
            className="flex items-center gap-2 text-sm text-[var(--color-neutral-dark)] mb-4 hover:text-[var(--color-accent-sage)] transition-colors w-fit"
            onClick={(e) => e.stopPropagation()}
          >
            <MapPinned className="w-4 h-4" />
            <span>{location}</span>
          </Link>

          <div className="flex items-center gap-4 mb-4 text-sm">
            <div className="flex items-center gap-2">
              <UsersRound className="w-4 h-4 text-[var(--color-accent-sage)]" />
              <span>Sleeps {sleeps}</span>
            </div>
            <span className="text-[var(--color-neutral-dark)]">•</span>
            <span>{bedrooms} bedrooms</span>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-[var(--color-bg-secondary)]">
            <div className="flex-1">
              <p className="text-sm text-[var(--color-neutral-dark)]">From</p>
              <p className="text-2xl font-semibold" style={{ color: "var(--color-accent-sage)" }}>
                £{priceFrom}
              </p>
              <p className="text-xs text-[var(--color-neutral-dark)]">per night</p>
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
              <Link
                href={`/properties/${slug}`}
                className="flex-1 sm:flex-none px-6 py-3 rounded-xl border-2 font-medium text-sm transition-all duration-200 hover:bg-[var(--color-accent-sage)] hover:text-white hover:border-[var(--color-accent-sage)] text-center flex items-center justify-center min-h-[48px]"
                style={{
                  borderColor: "var(--color-accent-sage)",
                  color: "var(--color-text-primary)",
                }}
              >
                View
              </Link>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  setBookingModalOpen(true);
                }}
                className="flex-2 sm:flex-none px-6 py-3 rounded-xl font-medium text-sm transition-all duration-200 hover:shadow-lg flex items-center justify-center min-h-[48px] bg-[var(--color-accent-sage)] text-white"
              >
                Book Now
              </button>
            </div>
          </div>
        </div>
      </div>

      {bookingModalOpen && (
        <BookingModal
          open={bookingModalOpen}
          onOpenChange={setBookingModalOpen}
          propertyId={id}
          propertyTitle={title}
          priceFrom={priceFrom}
        />
      )}
    </>
  );
}

export default memo(PropertyCard);
