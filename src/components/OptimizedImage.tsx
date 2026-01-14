"use client";

import Image from "next/image";
import { useState, useCallback, useEffect } from "react";

// const PLACEHOLDER_IMAGE = 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/professional-real-estate-photograph-of-a-71429268-20251018131719.jpghttps://www.londonbay.com/hubfs/Naples%20Collection%20(Custom%20Clients%20and%20Models)/256%20Aqua%20Ct/256%20Aqua%20Court__Rear%20Elevation.jpg';
const PLACEHOLDER_IMAGE = 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80';
interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  fill?: boolean;
  priority?: boolean;
  sizes?: string;
  className?: string;
  aspectRatio?: "16/9" | "4/3" | "3/2" | "1/1" | "3/4";
  quality?: number;
  onLoad?: () => void;
}

function validateImageUrl(url: string): string {
  if (!url || url === '/placeholder-property.jpg') {
    return PLACEHOLDER_IMAGE;
  }
  
  if (url.includes('gstatic.com') || url.includes('google.com/images') || url.includes('googleusercontent.com')) {
    return PLACEHOLDER_IMAGE;
  }
  
  // Fix Supabase URLs - ensure proper format without trailing ?
  if (url.includes('supabase.co/storage')) {
    // Remove trailing '?' if present
    url = url.replace(/\?$/, '');
    // Clean up any malformed query strings
    url = url.replace(/\?+/g, '?');
    // Remove empty query params
    if (url.endsWith('?')) {
      url = url.slice(0, -1);
    }
  }
  
  const hasImageExtension = /\.(jpg|jpeg|png|webp|avif|gif)(\?.*)?$/i.test(url);
  const isImageCDN = 
    url.includes('supabase.co/storage') ||
    url.includes('unsplash.com') ||
    url.includes('fal.media') ||
    url.includes('butlersinthebuff') ||
    url.includes('propertista.co.uk') ||
    url.includes('londonbay.com') ||
    url.includes('gstatic.com');
  
  if (!hasImageExtension && !isImageCDN) {
    return PLACEHOLDER_IMAGE;
  }
  
  return url;
}

export default function OptimizedImage({
  src,
  alt,
  width,
  height,
  fill = false,
  priority = false,
  sizes = "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
  className = "",
  aspectRatio,
  quality = 80,
  onLoad,
}: OptimizedImageProps) {
  const [imageError, setImageError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const validatedSrc = validateImageUrl(src);
  const displaySrc = imageError ? PLACEHOLDER_IMAGE : validatedSrc;

  const handleError = useCallback(() => {
    setImageError(true);
  }, []);

  const handleLoad = useCallback(() => {
    setIsLoaded(true);
    onLoad?.();
  }, [onLoad]);

  // Fallback to show image after 2 seconds if onLoad hasn't fired
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const aspectRatioClass = aspectRatio ? `aspect-[${aspectRatio}]` : "";

  if (fill) {
    return (
      <Image
        src={displaySrc}
        alt={alt}
        fill
        sizes={sizes}
        quality={quality}
        priority={priority}
        unoptimized={false}
        loading={priority ? undefined : "lazy"}
        className={`object-cover ${className}`}
        onError={handleError}
        onLoad={handleLoad}
      />
    );
  }

  return (
    <Image
      src={displaySrc}
      alt={alt}
      width={width || 400}
      height={height || 300}
      sizes={sizes}
      quality={quality}
      priority={priority}
      unoptimized={false}
      loading={priority ? undefined : "lazy"}
      className={`${className}`}
      onError={handleError}
      onLoad={handleLoad}
    />
  );
}
