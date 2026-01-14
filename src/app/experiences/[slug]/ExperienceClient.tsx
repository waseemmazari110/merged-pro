"use client";

import Image from "next/image";
import ExperienceCard from "@/components/ExperienceCard";
import FAQAccordion from "@/components/FAQAccordion";
import { Button } from "@/components/ui/button";
import { Clock, Users, Check, Calendar, MessageCircle, ChefHat, Utensils, Paintbrush, Wine, Palette, Mic2, Sparkles, Camera, Heart, Coffee, Gift, Music, PartyPopper, Flower2, Scissors, Flame, Pizza, GlassWater, Dumbbell, type LucideIcon } from "lucide-react";
import Link from "next/link";

const iconMap: Record<string, LucideIcon> = {
  ChefHat,
  Utensils,
  Paintbrush,
  Wine,
  Palette,
  Mic2,
  Sparkles,
  Camera,
  Heart,
  Coffee,
  Gift,
  Music,
  PartyPopper,
  Flower2,
  Scissors,
  Flame,
  Pizza,
  GlassWater,
  Dumbbell,
  Users
};

interface ExperienceClientProps {
  experience: any;
  filteredRelated: any[];
  slug: string;
}

export default function ExperienceClient({ experience, filteredRelated, slug }: ExperienceClientProps) {
  const Icon = experience.iconName ? iconMap[experience.iconName] : null;
  const pricingType = experience.pricingType || "per person";

  return (
    <div className="pt-24">
      {/* Hero Image */}
      <div className="max-w-[1400px] mx-auto px-6 mb-12">
        <div className="relative h-[400px] md:h-[600px] rounded-2xl overflow-hidden">
          <Image 
            src={experience.image} 
            alt={experience.title} 
            fill 
            className="object-cover" 
            priority
            sizes="(max-width: 768px) 100vw, (max-width: 1400px) 90vw, 1400px"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent"></div>
          <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12 text-white">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-full bg-white/20 backdrop-blur-sm">
                {Icon && <Icon className="w-8 h-8" />}
              </div>
              <h1 className="mb-0 drop-shadow-lg text-white" style={{ fontFamily: "var(--font-display)", color: "white" }}>
                {experience.title}
              </h1>
            </div>
            <div className="flex flex-wrap gap-6 text-lg drop-shadow-md text-white">
              <div className="flex items-center gap-2 bg-black/30 backdrop-blur-sm px-4 py-2 rounded-full">
                <Clock className="w-5 h-5" />
                <span className="text-white">{experience.duration}</span>
              </div>
              <div className="flex items-center gap-2 bg-black/30 backdrop-blur-sm px-4 py-2 rounded-full">
                <Users className="w-5 h-5" />
                <span className="text-white">{experience.groupSize}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Gallery Section */}
      {experience.gallery && experience.gallery.length > 0 && (
        <div className="max-w-[1400px] mx-auto px-6 mb-12">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {experience.gallery.map((img: string, index: number) => (
              <div key={index} className="relative h-[200px] md:h-[280px] rounded-xl overflow-hidden">
                <Image 
                  src={img} 
                  alt={`${experience.title} - Image ${index + 1}`}
                  fill 
                  className="object-cover hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                  sizes="(max-width: 768px) 50vw, (max-width: 1400px) 33vw, 450px"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Content */}
      <div className="max-w-[1200px] mx-auto px-6 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Description */}
            <div className="mb-12">
              <h2 className="text-3xl font-semibold mb-6" style={{ fontFamily: "var(--font-display)" }}>
                About this experience
              </h2>
              <p className="text-lg text-[var(--color-neutral-dark)] leading-relaxed">
                {experience.description}
              </p>
            </div>

            {/* What's Included */}
            <div className="bg-white rounded-2xl p-8 mb-8 shadow-md border-2 border-[var(--color-accent-gold)]">
              <div className="flex items-center gap-3 mb-6">
                <Check className="w-6 h-6 text-[var(--color-accent-gold)]" />
                <h3 className="text-2xl font-semibold mb-0" style={{ fontFamily: "var(--font-body)" }}>
                  What's included
                </h3>
              </div>
              <ul className="space-y-4">
                {experience.included.map((item: string, index: number) => (
                  <li key={index} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-[var(--color-accent-gold)] flex-shrink-0 mt-0.5" />
                    <span className="text-[var(--color-neutral-dark)]">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* What to Provide */}
            <div className="bg-[var(--color-bg-secondary)] rounded-2xl p-8 mb-8">
              <h3 className="text-2xl font-semibold mb-6" style={{ fontFamily: "var(--font-body)" }}>
                What you need to provide
              </h3>
              <ul className="space-y-4">
                {experience.whatToProvide.map((item: string, index: number) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="text-[var(--color-accent-gold)] text-xl mt-0.5">•</span>
                    <span className="text-[var(--color-neutral-dark)]">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Pricing */}
            <div className="bg-white rounded-2xl p-8 shadow-md mb-8">
              <h3 className="text-2xl font-semibold mb-6" style={{ fontFamily: "var(--font-body)" }}>
                Pricing
              </h3>
              <div className="space-y-4">
                {experience.pricing.map((tier: any, index: number) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 rounded-xl border-2 border-[var(--color-accent-gold)] bg-gradient-to-r from-[var(--color-bg-primary)] to-white"
                  >
                    <div className="flex items-center gap-3">
                      <Users className="w-5 h-5 text-[var(--color-accent-gold)]" />
                      <span className="font-medium">{tier.size}</span>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold" style={{ color: "var(--color-accent-gold)" }}>
                        £{tier.price}
                      </p>
                      <p className="text-xs text-[var(--color-neutral-dark)]">{pricingType}</p>
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-sm text-[var(--color-neutral-dark)] mt-6">
                All prices include materials, instructor/provider fees, and setup. Book alongside your property for the best experience.
              </p>
            </div>

            {/* FAQs */}
            {experience.faqs && experience.faqs.length > 0 && (
              <div className="bg-[var(--color-bg-secondary)] rounded-2xl p-8">
                <h3 className="text-2xl font-semibold mb-6" style={{ fontFamily: "var(--font-body)" }}>
                  Frequently Asked Questions
                </h3>
                <FAQAccordion faqs={experience.faqs} />
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-8 shadow-lg sticky top-24 border-2 border-[var(--color-accent-gold)]">
              <div className="mb-6">
                <p className="text-sm text-[var(--color-neutral-dark)] mb-2">From</p>
                <p className="text-4xl font-bold mb-1" style={{ color: "var(--color-accent-gold)" }}>
                  £{experience.priceFrom}
                </p>
                <p className="text-sm text-[var(--color-neutral-dark)]">{pricingType}</p>
              </div>

              <div className="space-y-4 mb-8 pb-8 border-b border-[var(--color-bg-secondary)]">
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-[var(--color-accent-gold)]" />
                  <span className="text-sm">{experience.duration}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-[var(--color-accent-gold)]" />
                  <span className="text-sm">{experience.groupSize}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-[var(--color-accent-gold)]" />
                  <span className="text-sm">Available any day of the week</span>
                </div>
              </div>

              <Button
                asChild
                className="w-full rounded-2xl py-6 text-base font-medium mb-4 hover:opacity-90 transition-opacity"
                style={{
                  background: "var(--color-accent-gold)",
                  color: "white",
                }}
              >
                <Link href="/contact">Add to Enquiry</Link>
              </Button>

              <Button
                variant="outline"
                className="w-full rounded-2xl py-6 text-base font-medium border-2 border-[var(--color-accent-gold)] text-[var(--color-accent-gold)] hover:bg-[var(--color-accent-gold)] hover:text-white"
                asChild
              >
                <Link href="/contact">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Ask a Question
                </Link>
              </Button>

              <p className="text-xs text-center text-[var(--color-neutral-dark)] mt-6">
                Book alongside your property for the best rates. Our team will coordinate everything for you.
              </p>
            </div>
          </div>
        </div>

        {/* Related Experiences */}
        {filteredRelated.length > 0 && (
          <div className="mt-24">
            <h3 className="text-3xl font-semibold mb-8" style={{ fontFamily: "var(--font-display)" }}>
              You might also like
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {filteredRelated.map((exp) => (
                <ExperienceCard key={exp.slug} {...exp} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
