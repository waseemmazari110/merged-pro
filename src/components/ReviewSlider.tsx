"use client";

import { useState, useEffect } from "react";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";

interface Review {
  name: string;
  rating: number;
  comment: string;
  date: string;
  property?: string;
  image?: string;
}

interface ReviewSliderProps {
  reviews: Review[];
}

export default function ReviewSlider({ reviews }: ReviewSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const slidesToShow = {
    mobile: 1,
    tablet: 2,
    desktop: 3
  };

  const maxIndex = Math.max(0, reviews.length - 1); // Allow sliding through all on mobile

  useEffect(() => {
    if (!isAutoPlaying || reviews.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % reviews.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, reviews.length]);

  const next = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev >= reviews.length - 1 ? 0 : prev + 1));
  };

  const prev = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev <= 0 ? reviews.length - 1 : prev - 1));
  };

  return (
    <div className="relative px-12 sm:px-4">
      <div className="overflow-hidden rounded-xl sm:rounded-2xl">
        <div
          className="flex transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {/* For better performance and zero CLS, we'll show 1 at a time on small, 
              but using a simpler 1-at-a-time transition logic is more stable for LCP/CLS 
              Slider components are notorious for CLS if they try to be too clever with JS widths */}
          {reviews.map((review, index) => (
            <div
              key={index}
              className="flex-shrink-0 w-full px-2 sm:px-3"
            >
              <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 shadow-md h-full max-w-4xl mx-auto">
                <div className="flex flex-col md:flex-row gap-6 items-center md:items-start text-center md:text-left">
                  <div className="flex-1">
                    {/* Quote Icon */}
                    <svg
                      className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 mb-2 sm:mb-3 md:mb-4 opacity-20 mx-auto md:mx-0"
                      fill="var(--color-accent-gold)"
                      viewBox="0 0 24 24"
                    >
                      <path d="M6 17h3l2-4V7H5v6h3zm8 0h3l2-4V7h-6v6h3z" />
                    </svg>

                    {/* Stars */}
                    <div className="flex justify-center md:justify-start gap-0.5 sm:gap-1 mb-2 sm:mb-3 md:mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 ${
                            i < review.rating
                              ? "fill-[var(--color-accent-gold)] text-[var(--color-accent-gold)]"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>

                    {/* Review Text */}
                    <p className="text-sm sm:text-base md:text-lg text-[var(--color-neutral-dark)] mb-3 sm:mb-4 md:mb-6 leading-relaxed italic">
                      "{review.comment}"
                    </p>

                    {/* Reviewer Info */}
                    <div className="pt-2 sm:pt-3 md:pt-4 border-t border-[var(--color-bg-secondary)] flex flex-wrap items-center justify-center md:justify-start gap-2 sm:gap-3 md:gap-4">
                      {review.image && (
                        <div className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden flex-shrink-0">
                          <Image
                            src={review.image}
                            alt={review.name}
                            fill
                            className="object-cover"
                            loading="lazy"
                          />
                        </div>
                      )}
                      <div className="min-w-0">
                        <p className="text-sm sm:text-base font-semibold text-[var(--color-text-primary)] truncate">{review.name}</p>
                        {review.property && (
                          <p className="text-xs sm:text-sm text-[var(--color-neutral-dark)] truncate">{review.property}</p>
                        )}
                        <p className="text-xs text-[var(--color-neutral-dark)] mt-0.5 sm:mt-1 truncate">{review.date}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Buttons */}
      {maxIndex > 0 && (
        <>
          <button
            onClick={prev}
            className="absolute left-0 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full bg-white shadow-lg flex items-center justify-center hover:bg-[var(--color-accent-sage)] hover:text-white transition-all duration-200 hover:scale-110 z-10 border border-gray-200"
            aria-label="Previous reviews"
          >
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
          </button>

          <button
            onClick={next}
            className="absolute right-0 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full bg-white shadow-lg flex items-center justify-center hover:bg-[var(--color-accent-sage)] hover:text-white transition-all duration-200 hover:scale-110 z-10 border border-gray-200"
            aria-label="Next reviews"
          >
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
          </button>
        </>
      )}

      {/* Dots Indicator */}
      {maxIndex > 0 && (
        <div className="flex justify-center gap-1.5 sm:gap-2 mt-4 sm:mt-6 md:mt-8">
          {[...Array(maxIndex + 1)].map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setIsAutoPlaying(false);
                setCurrentIndex(index);
              }}
              className={`h-1.5 sm:h-2 rounded-full transition-all duration-200 ${
                index === currentIndex
                  ? "w-5 sm:w-6 md:w-8 bg-[var(--color-accent-sage)]"
                  : "w-1.5 sm:w-2 bg-[var(--color-bg-secondary)]"
              }`}
              aria-label={`Go to review ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}