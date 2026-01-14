"use client";

import { useState } from "react";
import Link from "next/link";
import { X, ChevronDown, User as UserIcon, LogOut, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  session: any;
  isPending: boolean;
  onSignOut: () => void;
  houseStyles: any[];
  features: any[];
  destinations: any[];
  occasions: any[];
  experiences: any[];
}

export default function MobileMenu({
  isOpen,
  onClose,
  session,
  isPending,
  onSignOut,
  houseStyles,
  features,
  destinations,
  occasions,
  experiences,
}: MobileMenuProps) {
  const [isStylesOpen, setIsStylesOpen] = useState(false);
  const [isFeaturesOpen, setIsFeaturesOpen] = useState(false);
  const [isDestinationsOpen, setIsDestinationsOpen] = useState(false);
  const [isOccasionsOpen, setIsOccasionsOpen] = useState(false);
  const [isExperiencesOpen, setIsExperiencesOpen] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="lg:hidden fixed inset-0 z-[55] bg-[#E5D8C5] flex flex-col overflow-hidden">
      {/* Menu Content - Scrollable */}
      <div className="flex-1 overflow-y-auto px-8 pt-32 pb-12">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-8">
            {/* Left Column - Main Navigation */}
            <nav className="space-y-5">
              <Link
                href="/"
                className="block text-3xl md:text-4xl font-semibold hover:text-[var(--color-accent-sage)] transition-colors text-[var(--color-text-primary)]"
                style={{ fontFamily: "var(--font-display)" }}
                onClick={onClose}
              >
                Home
              </Link>

              <div className="space-y-2.5">
                <Link
                  href="/properties"
                  className="block text-3xl md:text-4xl font-semibold hover:text-[var(--color-accent-sage)] transition-colors text-[var(--color-text-primary)]"
                  style={{ fontFamily: "var(--font-display)" }}
                  onClick={onClose}
                >
                  Properties
                </Link>
                
                <button
                  onClick={() => setIsStylesOpen(!isStylesOpen)}
                  className="flex items-center gap-2 text-base text-[var(--color-neutral-dark)] hover:text-[var(--color-accent-sage)] transition-colors"
                >
                  House Styles
                  <ChevronDown className={`w-4 h-4 transition-transform ${isStylesOpen ? "rotate-180" : ""}`} />
                </button>
                {isStylesOpen && (
                  <div className="pl-4 space-y-1.5 text-[var(--color-neutral-dark)] text-sm">
                    {houseStyles.map((style) => (
                      <Link
                        key={style.slug}
                        href={`/house-styles/${style.slug}`}
                        className="block py-1 hover:text-[var(--color-accent-sage)] transition-colors"
                        onClick={onClose}
                      >
                        {style.title}
                      </Link>
                    ))}
                  </div>
                )}

                <button
                  onClick={() => setIsFeaturesOpen(!isFeaturesOpen)}
                  className="flex items-center gap-2 text-base text-[var(--color-neutral-dark)] hover:text-[var(--color-accent-sage)] transition-colors"
                >
                  Must-Have Features
                  <ChevronDown className={`w-4 h-4 transition-transform ${isFeaturesOpen ? "rotate-180" : ""}`} />
                </button>
                {isFeaturesOpen && (
                  <div className="pl-4 space-y-1.5 text-[var(--color-neutral-dark)] text-sm">
                    {features.map((feature) => (
                      <Link
                        key={feature.slug}
                        href={`/features/${feature.slug}`}
                        className="block py-1 hover:text-[var(--color-accent-sage)] transition-colors"
                        onClick={onClose}
                      >
                        {feature.title}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-2.5">
                <Link
                  href="/occasions"
                  className="block text-3xl md:text-4xl font-semibold hover:text-[var(--color-accent-sage)] transition-colors text-[var(--color-text-primary)]"
                  style={{ fontFamily: "var(--font-display)" }}
                  onClick={onClose}
                >
                  Occasions
                </Link>
                
                <button
                  onClick={() => setIsOccasionsOpen(!isOccasionsOpen)}
                  className="flex items-center gap-2 text-base text-[var(--color-neutral-dark)] hover:text-[var(--color-accent-sage)] transition-colors"
                >
                  View By Occasion
                  <ChevronDown className={`w-4 h-4 transition-transform ${isOccasionsOpen ? "rotate-180" : ""}`} />
                </button>
                  {isOccasionsOpen && (
                    <div className="pl-4 space-y-1.5 text-[var(--color-neutral-dark)] text-sm">
                      {occasions.map((occasion) => (
                        <Link
                          key={occasion.slug}
                          href={`/${occasion.slug}`}
                          className="block py-1 hover:text-[var(--color-accent-sage)] transition-colors"
                          onClick={onClose}
                        >
                          {occasion.title}
                        </Link>
                      ))}
                    </div>
                  )}
              </div>

              <div className="space-y-2.5">
                <Link
                  href="/experiences"
                  className="block text-3xl md:text-4xl font-semibold hover:text-[var(--color-accent-sage)] transition-colors text-[var(--color-text-primary)]"
                  style={{ fontFamily: "var(--font-display)" }}
                  onClick={onClose}
                >
                  Experiences
                </Link>
                
                <button
                  onClick={() => setIsExperiencesOpen(!isExperiencesOpen)}
                  className="flex items-center gap-2 text-base text-[var(--color-neutral-dark)] hover:text-[var(--color-accent-sage)] transition-colors"
                >
                  Popular Experiences
                  <ChevronDown className={`w-4 h-4 transition-transform ${isExperiencesOpen ? "rotate-180" : ""}`} />
                </button>
                {isExperiencesOpen && (
                  <div className="pl-4 space-y-1.5 text-[var(--color-neutral-dark)] text-sm">
                    {experiences.map((experience) => (
                      <Link
                        key={experience.slug}
                        href={`/experiences/${experience.slug}`}
                        className="block py-1 hover:text-[var(--color-accent-sage)] transition-colors"
                        onClick={onClose}
                      >
                        {experience.title}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-2.5">
                <Link
                  href="/destinations"
                  className="block text-3xl md:text-4xl font-semibold hover:text-[var(--color-accent-sage)] transition-colors text-[var(--color-text-primary)]"
                  style={{ fontFamily: "var(--font-display)" }}
                  onClick={onClose}
                >
                  Destinations
                </Link>
                
                <button
                  onClick={() => setIsDestinationsOpen(!isDestinationsOpen)}
                  className="flex items-center gap-2 text-base text-[var(--color-neutral-dark)] hover:text-[var(--color-accent-sage)] transition-colors"
                >
                  Popular Locations
                  <ChevronDown className={`w-4 h-4 transition-transform ${isDestinationsOpen ? "rotate-180" : ""}`} />
                </button>
                {isDestinationsOpen && (
                  <div className="pl-4 space-y-1.5 text-[var(--color-neutral-dark)] text-sm">
                     {destinations.map((destination) => (
                       <Link
                         key={destination.slug}
                         href={`/destinations/${destination.slug}`}
                         className="block py-1 hover:text-[var(--color-accent-sage)] transition-colors"
                         onClick={onClose}
                       >
                         {destination.title}
                       </Link>
                     ))}
                     <Link
                       href="/destinations"
                       className="block py-2 mt-2 font-semibold text-[var(--color-accent-sage)]"
                       onClick={onClose}
                     >
                       See all locations →
                     </Link>
                   </div>
                )}
              </div>
            </nav>

            <nav className="space-y-3.5 md:pt-0 pt-6">
              <Link href="/how-it-works" className="block text-xl font-medium" onClick={onClose}>How It Works</Link>
              <Link href="/register-your-property" className="block text-xl font-medium text-[var(--color-accent-sage)]" onClick={onClose}>List Your Property</Link>
              <Link href="/our-story" className="block text-xl font-medium" onClick={onClose}>Our Story</Link>
              <Link href="/contact" className="block text-xl font-medium" onClick={onClose}>Contact Us</Link>
            </nav>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="border-t border-[var(--color-text-primary)]/20 px-8 py-6 bg-[#E5D8C5] space-y-3">
        {isPending ? (
          <div className="w-full h-12 rounded-2xl bg-white/50 animate-pulse"></div>
        ) : session?.user ? (
          <>
            <div className="flex items-center justify-between p-4 bg-white/90 rounded-xl">
                <Link 
                  href={session.user.role === "owner" ? "/owner-dashboard" : "/account/dashboard"}
                  className="flex items-center gap-2"
                  onClick={onClose}
                >
                <UserIcon className="w-5 h-5 text-[var(--color-accent-sage)]" />
                <span className="font-medium">
                  {session.user.role === "owner" ? "Owner Dashboard" : "My Account"}
                </span>
              </Link>
              <div className="flex items-center gap-2">
                {session.user.role === "guest" && (
                  <Link href="/account/dashboard" onClick={onClose} className="p-2">
                    <Heart className="w-5 h-5 text-[var(--color-accent-sage)]" />
                  </Link>
                )}
                <button onClick={onSignOut} className="p-2 text-red-600">
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            </div>
          </>
        ) : (
            <>
                <div className="grid grid-cols-1 gap-3">
                  <Button asChild size="lg" variant="outline" className="rounded-2xl bg-white border-2 border-[var(--color-accent-sage)]">
                    <Link href="/login" onClick={onClose}>Customer Login</Link>
                  </Button>
                  <Button asChild size="lg" variant="outline" className="rounded-2xl bg-white border-2 border-[var(--color-accent-sage)]">
                    <Link href="/owner-login" onClick={onClose}>Owner Login</Link>
                  </Button>
                  <Button asChild size="lg" className="rounded-2xl bg-[var(--color-accent-gold)] text-white mt-2">
                    <Link href="/account/guest/sign-up" onClick={onClose}>Sign Up</Link>
                  </Button>
                </div>
            </>
        )}
        <Button asChild size="lg" className="w-full rounded-2xl bg-[var(--color-accent-sage)] text-white">
          <Link href="/properties" onClick={onClose}>Browse All Properties</Link>
        </Button>
      </div>
    </div>
  );
}
