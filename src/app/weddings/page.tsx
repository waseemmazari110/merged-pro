"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Heart, Users, Home, Sparkles, Calendar, Camera } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PropertyCard from "@/components/PropertyCard";
import { Button } from "@/components/ui/button";
import UKServiceSchema from "@/components/UKServiceSchema";

export default function WeddingsPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    const observerOptions = {
      threshold: 0.15,
      rootMargin: "0px 0px -100px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animate-fade-in");
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    const timeoutId = setTimeout(() => {
      const elements = document.querySelectorAll(".scroll-reveal");
      elements.forEach(el => observer.observe(el));
    }, 100);

    return () => {
      clearTimeout(timeoutId);
      observer.disconnect();
    };
  }, []);

  const featuredProperties = [
    {
      id: "1",
      title: "The Brighton Manor",
      location: "Brighton, East Sussex",
      sleeps: 16,
      bedrooms: 8,
      priceFrom: 89,
      image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/professional-real-estate-photograph-of-a-b6c21bf3-20251018131712.jpg",
      features: ["Hot Tub", "Pool"],
      slug: "brighton-manor",
    },
    {
      id: "2",
      title: "Bath Spa Retreat",
      location: "Bath, Somerset",
      sleeps: 20,
      bedrooms: 10,
      priceFrom: 95,
      image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/professional-real-estate-photograph-of-a-71429268-20251018131719.jpg",
      features: ["Games Room", "Cinema"],
      slug: "bath-spa-retreat",
    },
    {
      id: "3",
      title: "Manchester Party House",
      location: "Manchester, Greater Manchester",
      sleeps: 14,
      bedrooms: 7,
      priceFrom: 79,
      image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/professional-real-estate-photograph-of-a-303caf30-20251018131730.jpg",
      features: ["Hot Tub", "BBQ"],
      slug: "manchester-party-house",
    },
  ];

  const weddingFeatures = [
    {
      icon: Home,
      title: "Guest Accommodation",
      description: "Keep your closest family and friends together under one roof before and after your special day"
    },
    {
      icon: Users,
      title: "Pre-Wedding Gatherings",
      description: "Host rehearsal dinners, family meet-ups, or relaxed get-togethers in spacious, elegant settings"
    },
    {
      icon: Heart,
      title: "Post-Wedding Celebrations",
      description: "Continue the celebrations with your guests in a private, luxurious home with all amenities"
    },
    {
      icon: Sparkles,
      title: "Beautiful Venues",
      description: "Stunning properties with gorgeous interiors and grounds perfect for intimate wedding celebrations"
    },
    {
      icon: Camera,
      title: "Photo Opportunities",
      description: "Picturesque settings and elegant spaces that provide the perfect backdrop for wedding photos"
    },
    {
      icon: Calendar,
      title: "Flexible Bookings",
      description: "Weekend or midweek stays to suit your wedding timeline, with simple deposits and payments"
    },
  ];

  return (
    <div className="min-h-screen">
      <UKServiceSchema
        type="breadcrumb"
        data={{
          breadcrumbs: [
            { name: "Home", url: "/" },
            { name: "Weddings", url: "/weddings" }
          ]
        }}
      />
      <UKServiceSchema
        type="article"
        data={{
          title: "Wedding Guest Accommodation UK",
          description: "Beautiful luxury houses for wedding guests, pre-wedding gatherings, and post-wedding celebrations. Keep your loved ones close on your special day.",
          image: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=1920&q=90",
          datePublished: "2024-01-01T00:00:00Z", // Default date for static content
          dateModified: new Date().toISOString()
        }}
      />
      <Header />

      {/* Hero Section */}
      <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=1920&q=90')",
          }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-bg-primary)]/90 to-[var(--color-bg-secondary)]/80"></div>

        <div className="relative z-10 max-w-[1200px] mx-auto px-6 py-32 text-center">
          <h1
            className="mb-6 animate-fade-up"
            style={{
              fontFamily: "var(--font-display)",
              color: "var(--color-text-primary)",
            }}
          >
            Wedding Guest Accommodation UK
          </h1>
          <p
            className="text-xl md:text-2xl mb-12 max-w-3xl mx-auto animate-fade-up"
            style={{
              color: "var(--color-neutral-dark)",
              animationDelay: "100ms",
            }}
          >
            Beautiful luxury houses for wedding guests, pre-wedding gatherings, and post-wedding celebrations. Keep your loved ones close on your special day
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-up" style={{ animationDelay: "200ms" }}>
            <Button
              asChild
              size="lg"
              className="rounded-2xl px-10 py-6 text-lg font-medium transition-all duration-200 hover:shadow-xl hover:-translate-y-1"
              style={{
                background: "var(--color-accent-sage)",
                color: "white",
              }}
            >
              <Link href="/properties">Find Your Wedding House</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="rounded-2xl px-10 py-6 text-lg font-medium border-2 transition-all duration-200 hover:bg-[var(--color-accent-gold)] hover:text-white hover:border-[var(--color-accent-gold)]"
              style={{
                borderColor: "var(--color-accent-gold)",
                color: "var(--color-text-primary)",
              }}
            >
              <Link href="/contact">Check Availability and Book</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Why Choose for Weddings */}
      <section className="py-24 bg-white scroll-reveal">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="mb-4" style={{ fontFamily: "var(--font-display)" }}>
              Perfect for Wedding Celebrations
            </h2>
            <p className="text-xl text-[var(--color-neutral-dark)] max-w-3xl mx-auto">
              Everything you need to accommodate guests and celebrate your special day in style
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {weddingFeatures.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="bg-[var(--color-bg-primary)] p-8 rounded-2xl hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                >
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center mb-6"
                    style={{ background: "var(--color-accent-sage)" }}
                  >
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-semibold mb-3" style={{ fontFamily: "var(--font-body)" }}>
                    {feature.title}
                  </h3>
                  <p className="text-[var(--color-neutral-dark)]">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="py-24 bg-[var(--color-bg-primary)] scroll-reveal">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="mb-4" style={{ fontFamily: "var(--font-display)" }}>
              Elegant Wedding Guest Houses
            </h2>
            <p className="text-xl text-[var(--color-neutral-dark)] max-w-3xl mx-auto">
              Beautiful properties perfect for accommodating your wedding guests in comfort and style
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {featuredProperties.map((property) => (
              <PropertyCard key={property.id} {...property} />
            ))}
          </div>

          <div className="text-center">
            <Button
              asChild
              size="lg"
              className="rounded-2xl px-10 py-6 font-medium transition-all duration-200 hover:shadow-lg hover:-translate-y-1"
              style={{
                background: "var(--color-accent-sage)",
                color: "white",
              }}
            >
              <Link href="/properties">View All Properties</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-[var(--color-bg-secondary)] scroll-reveal">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="mb-4" style={{ fontFamily: "var(--font-display)" }}>
              Planning Wedding Accommodation
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center">
              <div
                className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center text-3xl font-bold"
                style={{ background: "var(--color-accent-sage)", color: "white", fontFamily: "var(--font-display)" }}
              >
                1
              </div>
              <h3 className="text-2xl font-semibold mb-4" style={{ fontFamily: "var(--font-body)" }}>
                Find Your House
              </h3>
              <p className="text-[var(--color-neutral-dark)]">
                Browse our selection of beautiful properties that can accommodate your wedding guests comfortably
              </p>
            </div>

            <div className="text-center">
              <div
                className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center text-3xl font-bold"
                style={{ background: "var(--color-accent-gold)", color: "white", fontFamily: "var(--font-display)" }}
              >
                2
              </div>
              <h3 className="text-2xl font-semibold mb-4" style={{ fontFamily: "var(--font-body)" }}>
                Get a Quote
              </h3>
              <p className="text-[var(--color-neutral-dark)]">
                Contact us with your wedding dates and requirements for availability check and personalised recommendations
              </p>
            </div>

            <div className="text-center">
              <div
                className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center text-3xl font-bold"
                style={{ background: "var(--color-accent-sage)", color: "white", fontFamily: "var(--font-display)" }}
              >
                3
              </div>
              <h3 className="text-2xl font-semibold mb-4" style={{ fontFamily: "var(--font-body)" }}>
                Secure Your Booking
              </h3>
              <p className="text-[var(--color-neutral-dark)]">
                Simple deposit to secure, then pay the balance before your stay and enjoy your celebration
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-white scroll-reveal">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="mb-6" style={{ fontFamily: "var(--font-display)" }}>
            Ready to Plan Your Wedding Weekend?
          </h2>
          <p className="text-xl text-[var(--color-neutral-dark)] mb-8">
            Contact us with your wedding dates and requirements for availability check and personalized recommendations
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              asChild
              size="lg"
              className="rounded-2xl px-10 py-6 text-lg font-medium transition-all duration-200 hover:shadow-xl"
              style={{
                background: "var(--color-accent-sage)",
                color: "white",
              }}
            >
              <Link href="/contact">Check Availability and Book</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="rounded-2xl px-10 py-6 text-lg font-medium border-2 transition-all duration-200 hover:bg-[var(--color-accent-gold)] hover:text-white"
              style={{
                borderColor: "var(--color-accent-gold)",
                color: "var(--color-text-primary)",
              }}
            >
              <Link href="/properties">Browse Houses</Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}