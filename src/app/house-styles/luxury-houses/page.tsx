"use client";

import Link from "next/link";
import { Check, ArrowRight, Sparkles, Users, Waves } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import UKServiceSchema from "@/components/UKServiceSchema";

export default function LuxuryHousesPage() {
  const highlights = [
    "Premium homes with modern interiors and design",
    "High-end amenities including pools and hot tubs",
    "Perfect for special celebrations and milestones",
    "Concierge services and additional experiences available",
    "Stunning locations across the UK"
  ];

  return (
    <div className="min-h-screen">
      <UKServiceSchema
        type="breadcrumb"
        data={{
          breadcrumbs: [
            { name: "Home", url: "/" },
            { name: "House Styles", url: "/house-styles" },
            { name: "Luxury Houses", url: "/house-styles/luxury-houses" }
          ]
        }}
      />
      <Header />
      
      {/* Hero Section */}
      <section className="relative h-[70vh] min-h-[500px] flex items-center justify-center">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/stunning-luxury-mansion-exterior-with-mo-b1b962c1-20251022153011.jpg')",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-black/70 to-black/50"></div>
        </div>
        
        <div className="relative z-10 max-w-[1200px] mx-auto px-6 text-center">
          {/* Breadcrumb with better visibility */}
          <nav className="flex justify-center gap-2 text-sm mb-6 bg-white/95 backdrop-blur-sm rounded-full px-6 py-3 shadow-lg w-fit mx-auto">
            <Link href="/" className="text-[var(--color-accent-sage)] hover:underline font-medium">
              Home
            </Link>
            <span className="text-[var(--color-neutral-dark)]">/</span>
            <Link href="/house-styles-and-features" className="text-[var(--color-accent-sage)] hover:underline font-medium">
              House Styles
            </Link>
            <span className="text-[var(--color-neutral-dark)]">/</span>
            <span className="text-[var(--color-accent-gold)] font-semibold">Luxury Houses</span>
          </nav>
          
          {/* Hero text card with better contrast */}
          <div className="bg-white/95 backdrop-blur-md rounded-3xl px-10 py-8 shadow-2xl max-w-4xl mx-auto">
            <h1 className="mb-4" style={{ fontFamily: "var(--font-display)", color: "var(--color-text-primary)" }}>
              Luxury Houses UK
            </h1>
            <p className="text-xl text-[var(--color-neutral-dark)]">
              High-end group accommodation for unforgettable celebrations
            </p>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-24 bg-white">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <div>
              <h2 className="mb-6" style={{ fontFamily: "var(--font-display)" }}>
                High-End Group Accommodation
              </h2>
              <p className="text-lg text-[var(--color-neutral-dark)] mb-8 leading-relaxed">
                Indulge in our collection of luxury houses designed for exceptional group experiences. Featuring contemporary interiors, premium amenities, and stunning locations, these properties offer the ultimate setting for hen parties, milestone birthdays, and special celebrations that deserve something extraordinary.
              </p>

              <h3 className="text-2xl font-semibold mb-4" style={{ fontFamily: "var(--font-body)" }}>
                What to Expect
              </h3>
              <ul className="space-y-3 mb-8">
                {highlights.map((highlight, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <Check className="w-6 h-6 text-[var(--color-accent-sage)] flex-shrink-0 mt-0.5" />
                    <span className="text-[var(--color-neutral-dark)]">{highlight}</span>
                  </li>
                ))}
              </ul>

              {/* Large feature image */}
              <div className="mb-8 rounded-2xl overflow-hidden shadow-lg">
                <Image
                  src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/luxurious-modern-living-room-interior-wi-7bd73f84-20251022153010.jpg"
                  alt="Luxurious modern living room"
                  width={800}
                  height={600}
                  className="w-full h-auto object-cover"
                />
              </div>

              {/* Two smaller images in a grid */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="rounded-2xl overflow-hidden shadow-lg">
                  <Image
                    src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/high-end-outdoor-hot-tub-spa-on-luxury-p-a4c3ca50-20251022153010.jpg"
                    alt="Luxury hot tub spa"
                    width={400}
                    height={300}
                    className="w-full h-48 object-cover"
                  />
                </div>
                <div className="rounded-2xl overflow-hidden shadow-lg">
                  <Image
                    src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/luxury-kitchen-with-marble-countertops-h-b23cdb7c-20251022153010.jpg"
                    alt="High-end luxury kitchen"
                    width={400}
                    height={300}
                    className="w-full h-48 object-cover"
                  />
                </div>
              </div>

              <Button
                asChild
                size="lg"
                className="rounded-2xl px-10 py-6 text-white font-medium transition-all duration-200 hover:shadow-lg"
                style={{ background: "var(--color-accent-sage)" }}
              >
                <Link href="/properties">
                  Browse Luxury Houses
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
            </div>

            <div className="space-y-6">
              <div className="bg-[var(--color-bg-primary)] rounded-2xl p-8 shadow-md">
                <Sparkles className="w-12 h-12 text-[var(--color-accent-sage)] mb-4" />
                <h3 className="text-3xl font-bold mb-2" style={{ fontFamily: "var(--font-display)" }}>
                  Premium Features
                </h3>
                <p className="text-[var(--color-neutral-dark)]">
                  Modern design, top-spec kitchens, and luxury bathrooms throughout
                </p>
              </div>

              <div className="bg-[var(--color-bg-primary)] rounded-2xl p-8 shadow-md">
                <Waves className="w-12 h-12 text-[var(--color-accent-gold)] mb-4" />
                <h3 className="text-3xl font-bold mb-2" style={{ fontFamily: "var(--font-display)" }}>
                  Pools & Hot Tubs
                </h3>
                <p className="text-[var(--color-neutral-dark)]">
                  Indoor and outdoor pools, hot tubs, and spa facilities
                </p>
              </div>

              <div className="bg-[var(--color-bg-primary)] rounded-2xl p-8 shadow-md">
                <Users className="w-12 h-12 text-[var(--color-accent-sage)] mb-4" />
                <h3 className="text-3xl font-bold mb-2" style={{ fontFamily: "var(--font-display)" }}>
                  Concierge Service
                </h3>
                <p className="text-[var(--color-neutral-dark)]">
                  Add private chefs, spa treatments, and bespoke experiences
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}