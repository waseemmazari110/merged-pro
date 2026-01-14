"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Cake, Users, Gift, Sparkles, Calendar, Heart } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PropertyCard from "@/components/PropertyCard";
import { Button } from "@/components/ui/button";
import UKServiceSchema from "@/components/UKServiceSchema";

export default function SpecialCelebrationsPage() {
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

  const celebrationTypes = [
    {
      icon: Cake,
      title: "Milestone Birthdays",
      description: "Celebrate 30th, 40th, 50th birthdays in style with luxury group accommodation perfect for unforgettable parties"
    },
    {
      icon: Users,
      title: "Family Reunions",
      description: "Bring everyone together under one roof with spacious houses designed for large family gatherings and celebrations"
    },
    {
      icon: Gift,
      title: "Anniversary Celebrations",
      description: "Mark special anniversaries with elegant properties featuring hot tubs, entertainment, and beautiful settings"
    },
    {
      icon: Sparkles,
      title: "Engagement Parties",
      description: "Start your wedding journey with an intimate celebration in a stunning house with all the amenities you need"
    },
    {
      icon: Calendar,
      title: "Retirement Parties",
      description: "Toast to new beginnings with luxury properties perfect for celebrating life's biggest transitions"
    },
    {
      icon: Heart,
      title: "Special Occasions",
      description: "Whatever you're celebrating, find the perfect backdrop for your special moment with our curated selection"
    },
  ];

  return (
    <div className="min-h-screen">
      <UKServiceSchema
        type="breadcrumb"
        data={{
          breadcrumbs: [
            { name: "Home", url: "/" },
            { name: "Special Celebrations", url: "/special-celebrations" }
          ]
        }}
      />
      <Header />

      {/* Hero Section */}
      <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=1920&q=90')",
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
            Special Celebrations in Luxury UK Houses
          </h1>
          <p
            className="text-xl md:text-2xl mb-12 max-w-3xl mx-auto animate-fade-up"
            style={{
              color: "var(--color-neutral-dark)",
              animationDelay: "100ms",
            }}
          >
            From milestone birthdays to family reunions, celebrate life's precious moments in stunning group accommodation across the UK
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
              <Link href="/properties">Find Your Perfect House</Link>
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

      {/* Celebration Types */}
      <section className="py-24 bg-white scroll-reveal">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="mb-4" style={{ fontFamily: "var(--font-display)" }}>
              Whatever You're Celebrating
            </h2>
            <p className="text-xl text-[var(--color-neutral-dark)] max-w-3xl mx-auto">
              Our luxury properties are perfect for all types of special occasions and memorable gatherings
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {celebrationTypes.map((type, index) => {
              const Icon = type.icon;
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
                    {type.title}
                  </h3>
                  <p className="text-[var(--color-neutral-dark)]">{type.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="py-24 pb-12 bg-[var(--color-bg-primary)] scroll-reveal">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="mb-4" style={{ fontFamily: "var(--font-display)" }}>
              Perfect Properties for Celebrations
            </h2>
            <p className="text-xl text-[var(--color-neutral-dark)] max-w-3xl mx-auto">
              Handpicked luxury houses with hot tubs, pools, and entertainment spaces for unforgettable gatherings
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

      {/* Why Choose Section */}
      <section className="pt-12 pb-24 bg-[var(--color-bg-secondary)] scroll-reveal">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="mb-4" style={{ fontFamily: "var(--font-display)" }}>
              Why Choose Group Escape Houses
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center">
              <div
                className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center"
                style={{ background: "var(--color-accent-sage)" }}
              >
                <Users className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-semibold mb-4" style={{ fontFamily: "var(--font-body)" }}>
                Perfect for Groups
              </h3>
              <p className="text-[var(--color-neutral-dark)]">
                Houses sleeping 10-30+ guests with spacious living areas, multiple bedrooms, and shared entertainment spaces
              </p>
            </div>

            <div className="text-center">
              <div
                className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center"
                style={{ background: "var(--color-accent-gold)" }}
              >
                <Sparkles className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-semibold mb-4" style={{ fontFamily: "var(--font-body)" }}>
                Luxury Amenities
              </h3>
              <p className="text-[var(--color-neutral-dark)]">
                Hot tubs, pools, games rooms, cinemas, and more to make your celebration truly special and memorable
              </p>
            </div>

            <div className="text-center">
              <div
                className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center"
                style={{ background: "var(--color-accent-sage)" }}
              >
                <Heart className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-semibold mb-4" style={{ fontFamily: "var(--font-body)" }}>
                Stress-Free Booking
              </h3>
              <p className="text-[var(--color-neutral-dark)]">
                Simple deposits, flexible payments, and UK-based support team to help plan your perfect celebration
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-white scroll-reveal">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="mb-6" style={{ fontFamily: "var(--font-display)" }}>
            Ready to Celebrate?
          </h2>
          <p className="text-xl text-[var(--color-neutral-dark)] mb-8">
            Get in touch today and let us help you find the perfect property for your special occasion
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