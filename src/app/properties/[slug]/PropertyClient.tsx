"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import PropertyCard from "@/components/PropertyCard";
import EnquiryForm from "@/components/EnquiryForm";
import FAQAccordion from "@/components/FAQAccordion";
import { Button } from "@/components/ui/button";
import {
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
  Download,
  Share2,
  Heart,
  Calendar,
} from "lucide-react";

interface PropertyClientProps {
  property: any;
  relatedProperties: any[];
  slug: string;
}

export default function PropertyClient({ property, relatedProperties, slug }: PropertyClientProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isSaved, setIsSaved] = useState(false);

  const faqs = [
    {
      question: "What is included in the price?",
      answer:
        "The price includes full use of the property and all facilities including hot tub, pool, games room, and all utilities. Bedding and towels are provided.",
    },
    {
      question: "How do deposits and payments work?",
      answer:
        "A 25% deposit is required to secure your booking. The remaining balance is due 6 weeks before your arrival. A refundable damage deposit of £500 is also required.",
    },
    {
      question: "Can we bring pets?",
      answer:
        "Unfortunately, pets are not permitted at this property. Please check our other listings for pet-friendly options.",
    },
    {
      question: "Is there parking available?",
      answer:
        "Yes, there is free private parking for up to 6 cars on the property.",
    },
  ];

  const houseRules = [
    `Check-in: ${property.checkInTime || '4pm'}`,
    `Check-out: ${property.checkOutTime || '10am'}`,
    "No smoking inside",
    "Quiet hours: 11pm - 8am",
    `Maximum occupancy: ${property.sleeps} guests`,
    "Damage deposit: £500 (refundable)",
  ];

  return (
    <div className="pt-24">
      {/* Image Gallery */}
      <div className="max-w-[1400px] mx-auto px-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 rounded-2xl overflow-hidden">
          <div className="relative h-[400px] md:h-[600px]">
            <Image
              src={property.heroImage || property.images?.[0]}
              alt={property.title}
              fill
              className="object-cover"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            {(property.images || []).slice(1, 4).map((image: string, index: number) => (
              <div key={index} className="relative h-[190px] md:h-[290px] cursor-pointer">
                <Image
                  src={image}
                  alt={`${property.title} ${index + 2}`}
                  fill
                  className="object-cover hover:opacity-80 transition-opacity"
                  onClick={() => setCurrentImageIndex(index + 1)}
                />
              </div>
            ))}
            {(!property.images || property.images.length < 4) && (
              <>
                {[...Array(4 - (property.images?.length || 1))].map((_, index) => (
                  <div key={`placeholder-${index}`} className="relative h-[190px] md:h-[290px] bg-gray-200 flex items-center justify-center">
                    <Image src={property.heroImage} alt="placeholder" fill className="object-cover opacity-20" />
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-[1200px] mx-auto px-6 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left Column */}
          <div className="lg:col-span-2">
            {/* Title and Location */}
            <div className="mb-8">
              <h1 className="mb-4" style={{ fontFamily: "var(--font-display)" }}>
                {property.title}
              </h1>
              <div className="flex items-center gap-2 text-lg text-[var(--color-neutral-dark)] mb-6">
                <MapPin className="w-5 h-5" />
                <span>{property.location}</span>
              </div>

              {/* Quick Actions */}
              <div className="flex gap-4">
                <Button
                  variant="outline"
                  className="rounded-xl"
                  onClick={() => setIsSaved(!isSaved)}
                >
                  <Heart
                    className={`w-4 h-4 mr-2 ${isSaved ? "fill-red-500 text-red-500" : ""}`}
                  />
                  {isSaved ? "Saved" : "Save"}
                </Button>
                <Button variant="outline" className="rounded-xl">
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </Button>
              </div>
            </div>

            {/* Fast Facts */}
            <div className="bg-white rounded-2xl p-8 mb-8 shadow-md">
              <h3 className="text-2xl font-semibold mb-6" style={{ fontFamily: "var(--font-body)" }}>
                Fast Facts
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <Users className="w-8 h-8 mx-auto mb-2 text-[var(--color-accent-pink)]" />
                  <p className="text-2xl font-bold">{property.sleeps}</p>
                  <p className="text-sm text-[var(--color-neutral-dark)]">Sleeps</p>
                </div>
                <div className="text-center">
                  <Bed className="w-8 h-8 mx-auto mb-2 text-[var(--color-accent-sage)]" />
                  <p className="text-2xl font-bold">{property.bedrooms}</p>
                  <p className="text-sm text-[var(--color-neutral-dark)]">Bedrooms</p>
                </div>
                <div className="text-center">
                  <Bath className="w-8 h-8 mx-auto mb-2 text-[var(--color-accent-gold)]" />
                  <p className="text-2xl font-bold">{property.bathrooms}</p>
                  <p className="text-sm text-[var(--color-neutral-dark)]">Bathrooms</p>
                </div>
                <div className="text-center">
                  <Calendar className="w-8 h-8 mx-auto mb-2 text-[var(--color-accent-pink)]" />
                  <p className="text-2xl font-bold">3</p>
                  <p className="text-sm text-[var(--color-neutral-dark)]">Night min</p>
                </div>
              </div>

              <div className="mt-8 pt-8 border-t border-[var(--color-bg-secondary)]">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div>
                    <p className="text-sm text-[var(--color-neutral-dark)] mb-1">Weekend from</p>
                    <p className="text-3xl font-bold" style={{ color: "var(--color-accent-pink)" }}>
                      £{property.priceWeekend}
                    </p>
                    <p className="text-xs text-[var(--color-neutral-dark)]">
                      Split from £{Math.round(property.priceWeekend / property.sleeps)} per guest
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-[var(--color-neutral-dark)] mb-1">Midweek from</p>
                    <p className="text-3xl font-bold" style={{ color: "var(--color-accent-sage)" }}>
                      £{property.priceMidweek}
                    </p>
                    <p className="text-xs text-[var(--color-neutral-dark)]">
                      Split from £{Math.round(property.priceMidweek / property.sleeps)} per guest
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="mb-8">
              <h3 className="text-2xl font-semibold mb-4" style={{ fontFamily: "var(--font-body)" }}>
                About this property
              </h3>
              <p className="text-[var(--color-neutral-dark)] leading-relaxed mb-4 whitespace-pre-line">
                {property.description}
              </p>
            </div>

            {/* Features */}
            <div className="bg-white rounded-2xl p-8 mb-8 shadow-md">
              <h3 className="text-2xl font-semibold mb-6" style={{ fontFamily: "var(--font-body)" }}>
                Features
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {[
                  { icon: Waves, label: "Hot Tub" },
                  { icon: Wifi, label: "Fast Wi-Fi" },
                  { icon: Car, label: "Free Parking" },
                  { icon: Flame, label: "BBQ Area" },
                  { icon: ChefHat, label: "Gourmet Kitchen" },
                  { icon: Music, label: "Sound System" },
                ].map((feature, index) => {
                  const Icon = feature.icon;
                  return (
                    <div key={index} className="text-center">
                      <div
                        className="w-16 h-16 rounded-full mx-auto mb-3 flex items-center justify-center bg-[var(--color-bg-secondary)]"
                      >
                        <Icon className="w-8 h-8 text-[var(--color-accent-sage)]" />
                      </div>
                      <p className="text-sm font-medium">{feature.label}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* House Rules */}
            <div className="bg-[var(--color-bg-secondary)] rounded-2xl p-8 mb-8">
              <h3 className="text-2xl font-semibold mb-6" style={{ fontFamily: "var(--font-body)" }}>
                House Rules
              </h3>
              <ul className="space-y-3">
                {houseRules.map((rule: string, index: number) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="text-[var(--color-accent-pink)] mt-1">•</span>
                    <span>{rule}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* FAQs */}
            <div className="mb-8">
              <h3 className="text-2xl font-semibold mb-6" style={{ fontFamily: "var(--font-body)" }}>
                Frequently Asked Questions
              </h3>
              <FAQAccordion faqs={faqs} />
            </div>
          </div>

          {/* Right Column - Enquiry Form */}
          <div className="lg:col-span-1">
            <EnquiryForm propertyTitle={property.title} propertySlug={slug} />
          </div>
        </div>

        {/* Related Properties */}
        {relatedProperties.length > 0 && (
          <div className="mt-24">
            <h3 className="text-3xl font-semibold mb-8" style={{ fontFamily: "var(--font-display)" }}>
              Similar Properties
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {relatedProperties.map((relatedProperty) => (
                <PropertyCard key={relatedProperty.id} {...relatedProperty} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Sticky Bottom Bar (Mobile) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white shadow-2xl p-4 z-40 border-t border-gray-200">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm text-[var(--color-neutral-dark)]">From</p>
            <p className="text-2xl font-bold" style={{ color: "var(--color-accent-pink)" }}>
              £{property.priceMidweek}
            </p>
          </div>
          <Button
            asChild
            className="rounded-2xl px-8 py-6 font-medium bg-[var(--color-accent-pink)] text-[var(--color-text-primary)]"
          >
            <a href="#enquiry">Enquire Now</a>
          </Button>
        </div>
      </div>
    </div>
  );
}
