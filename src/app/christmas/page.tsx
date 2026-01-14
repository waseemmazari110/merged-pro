"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Snowflake, Gift, Home, Users, Sparkles, Heart } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PropertyCard from "@/components/PropertyCard";
import { Button } from "@/components/ui/button";
import UKServiceSchema from "@/components/UKServiceSchema";

export default function ChristmasPage() {
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

  const christmasFeatures = [
    {
      icon: Home,
      title: "Cosy Festive Spaces",
      description: "Beautiful properties with fireplaces, spacious living areas, and warm interiors perfect for Christmas gatherings"
    },
    {
      icon: Users,
      title: "Bring Everyone Together",
      description: "Large houses sleeping 10-30+ guests so the whole family can celebrate Christmas under one roof"
    },
    {
      icon: Gift,
      title: "Fully Equipped Kitchens",
      description: "Prepare Christmas dinner with ease in well-equipped kitchens with plenty of space for cooking and entertaining"
    },
    {
      icon: Snowflake,
      title: "Winter Hot Tubs",
      description: "Relax in outdoor hot tubs surrounded by winter scenery for a magical festive experience"
    },
    {
      icon: Sparkles,
      title: "Entertainment for All",
      description: "Games rooms, cinemas, and entertainment spaces to keep everyone happy during the holidays"
    },
    {
      icon: Heart,
      title: "Create Memories",
      description: "Beautiful settings and ample space to create unforgettable Christmas memories with loved ones"
    },
  ];

  return (
    <div className="min-h-screen">
      <UKServiceSchema
        type="breadcrumb"
        data={{
          breadcrumbs: [
            { name: "Home", url: "/" },
            { name: "Christmas", url: "/christmas" }
          ]
        }}
      />
      <Header />

      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1482517967863-00e15c9b44be?w=1920&q=90')",
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
            Christmas Houses UK for Large Groups
          </h1>
          <p
            className="text-xl md:text-2xl mb-12 max-w-3xl mx-auto animate-fade-up"
            style={{
              color: "var(--color-neutral-dark)",
              animationDelay: "100ms",
            }}
          >
            Celebrate Christmas in luxury group accommodation. Cosy houses with hot tubs, fireplaces, and everything you need for a magical festive holiday together
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
              <Link href="/properties">Find Your Christmas House</Link>
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

      {/* Why Choose for Christmas */}
      <section className="py-24 bg-white scroll-reveal">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="mb-4" style={{ fontFamily: "var(--font-display)" }}>
              Perfect for Christmas Celebrations
            </h2>
            <p className="text-xl text-[var(--color-neutral-dark)] max-w-3xl mx-auto">
              Everything you need for a magical Christmas holiday with family and friends
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {christmasFeatures.map((feature, index) => {
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
              Festive Family Houses
            </h2>
            <p className="text-xl text-[var(--color-neutral-dark)] max-w-3xl mx-auto">
              Cosy luxury properties perfect for Christmas gatherings with large groups
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

      {/* Book Early */}
      <section className="py-24 bg-[var(--color-bg-secondary)] scroll-reveal">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <Snowflake className="w-16 h-16 mx-auto mb-6" style={{ color: "var(--color-accent-sage)" }} />
          <h2 className="mb-6" style={{ fontFamily: "var(--font-display)" }}>
            Book Early for Christmas
          </h2>
          <p className="text-xl text-[var(--color-neutral-dark)] mb-8">
            Our Christmas properties are in high demand. Book now to secure the perfect house for your festive family gathering
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
              <Link href="/contact">Check Availability</Link>
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

      {/* CTA Section */}
      <section className="py-24 bg-white scroll-reveal">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="mb-6" style={{ fontFamily: "var(--font-display)" }}>
            Make This Christmas Unforgettable
          </h2>
          <p className="text-xl text-[var(--color-neutral-dark)] mb-8">
            Get in touch today for availability check and start planning your magical Christmas celebration
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