"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Calendar, MapPin, Users, Home, Sparkles, Clock } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PropertyCard from "@/components/PropertyCard";
import { Button } from "@/components/ui/button";
import UKServiceSchema from "@/components/UKServiceSchema";

export default function WeekendBreaksPage() {
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

  const weekendFeatures = [
    {
      icon: Clock,
      title: "Friday to Sunday",
      description: "Perfect 2-3 night stays from Friday evening to Sunday afternoon for a refreshing break"
    },
    {
      icon: MapPin,
      title: "Great Locations",
      description: "Properties close to city centres, coastal towns, and countryside perfect for exploring"
    },
    {
      icon: Users,
      title: "Perfect for Groups",
      description: "Houses sleeping 10-30+ guests ideal for friend reunions, family gatherings, or celebrations"
    },
    {
      icon: Home,
      title: "Luxury Amenities",
      description: "Hot tubs, pools, games rooms, and entertainment spaces to make the most of your time"
    },
    {
      icon: Sparkles,
      title: "Add Experiences",
      description: "Enhance your weekend with cocktail classes, spa treatments, or private dining experiences"
    },
    {
      icon: Calendar,
      title: "Flexible Booking",
      description: "Easy deposits, simple payments, and UK support to help you plan your perfect weekend"
    },
  ];

  const destinations = [
    { name: "Brighton", image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/wide-angle-photograph-of-brighton-seafro-11bd7734-20251017161212.jpg" },
    { name: "Bath", image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/historic-bath-city-center-photograph%2c--eef16b18-20251017161220.jpg" },
    { name: "Manchester", image: "https://v3b.fal.media/files/b/tiger/TnJnPy7geHZHAjOwxZKxO_output.png" },
    { name: "York", image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/historic-york-city-photograph%2c-medieva-87040b2f-20251017161235.jpg" },
    { name: "Bournemouth", image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/bournemouth-beach-photograph%2c-golden-s-804727ac-20251017161243.jpg" },
    { name: "Cardiff", image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/cardiff-city-center-photograph%2c-iconic-caf939c9-20251017161252.jpg" },
  ];

  return (
    <div className="min-h-screen">
      <UKServiceSchema
        type="breadcrumb"
        data={{
          breadcrumbs: [
            { name: "Home", url: "/" },
            { name: "Weekend Breaks", url: "/weekend-breaks" }
          ]
        }}
      />
      <Header />

      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=90')",
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
            Weekend Breaks UK for Large Groups
          </h1>
          <p
            className="text-xl md:text-2xl mb-12 max-w-3xl mx-auto animate-fade-up"
            style={{
              color: "var(--color-neutral-dark)",
              animationDelay: "100ms",
            }}
          >
            Escape for the weekend in luxury group accommodation. Perfect houses with hot tubs, entertainment, and everything you need for an unforgettable short break
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
              <Link href="/properties">Find Your Weekend House</Link>
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

      {/* Why Choose for Weekend Breaks */}
      <section className="py-24 bg-white scroll-reveal">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="mb-4" style={{ fontFamily: "var(--font-display)" }}>
              Perfect for Weekend Getaways
            </h2>
            <p className="text-xl text-[var(--color-neutral-dark)] max-w-3xl mx-auto">
              Everything you need for a relaxing and fun-filled weekend with your group
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {weekendFeatures.map((feature, index) => {
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
              Top Weekend Break Houses
            </h2>
            <p className="text-xl text-[var(--color-neutral-dark)] max-w-3xl mx-auto">
              Luxury properties perfect for weekend getaways across the UK
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

      {/* Popular Destinations */}
      <section className="py-24 bg-[var(--color-bg-secondary)] scroll-reveal">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="mb-4" style={{ fontFamily: "var(--font-display)" }}>
              Popular Weekend Destinations
            </h2>
            <p className="text-xl text-[var(--color-neutral-dark)] max-w-3xl mx-auto">
              Discover amazing UK cities and coastal towns perfect for weekend breaks
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {destinations.map((destination) => (
              <Link
                key={destination.name}
                href={`/destinations/${destination.name.toLowerCase()}`}
                className="group relative aspect-square rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300"
              >
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-300 group-hover:scale-110"
                  style={{ backgroundImage: `url('${destination.image}')` }}
                ></div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-white/90 backdrop-blur-sm">
                  <h3
                    className="text-xl font-semibold text-[var(--color-text-primary)]"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {destination.name}
                  </h3>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button
              asChild
              size="lg"
              variant="outline"
              className="rounded-2xl px-10 py-6 font-medium border-2 transition-all duration-200 hover:bg-[var(--color-accent-sage)] hover:text-white hover:border-[var(--color-accent-sage)]"
              style={{
                borderColor: "var(--color-accent-sage)",
                color: "var(--color-text-primary)",
              }}
            >
              <Link href="/destinations">See all locations</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-white scroll-reveal">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="mb-6" style={{ fontFamily: "var(--font-display)" }}>
            Plan Your Weekend Break
          </h2>
          <p className="text-xl text-[var(--color-neutral-dark)] mb-8">
            Get in touch today for availability check and discover the perfect property for your next escape
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