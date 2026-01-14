"use client";

import Link from "next/link";
import { Check, ArrowRight, Baby, Users, Smile } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import UKServiceSchema from "@/components/UKServiceSchema";

export default function FamilyHolidaysPage() {
  const highlights = [
    "Spacious, safe family homes with child-friendly amenities",
    "Enclosed gardens and outdoor play areas",
    "Cots, highchairs, and family equipment available",
    "Games rooms and entertainment for all ages",
    "Close to family attractions and activities"
  ];

  return (
    <div className="min-h-screen">
      <UKServiceSchema
        type="breadcrumb"
        data={{
          breadcrumbs: [
            { name: "Home", url: "/" },
            { name: "House Styles", url: "/house-styles" },
            { name: "Family Holidays", url: "/house-styles/family-holidays" }
          ]
        }}
      />
      <Header />
      
      {/* Hero Section */}
      <section className="relative h-[70vh] min-h-[500px] flex items-center justify-center">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/luxury-family-holiday-home-with-children-74185e0c-20251022191856.jpg')",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-black/70 to-black/50"></div>
        </div>
        
        <div className="relative z-10 max-w-[1200px] mx-auto px-6 text-center">
          {/* Breadcrumb with white background card */}
          <nav className="inline-flex items-center gap-2 text-sm mb-6 bg-white/95 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg">
            <Link href="/" className="text-[var(--color-accent-sage)] hover:underline font-medium">Home</Link>
            <span className="text-[var(--color-neutral-dark)]">/</span>
            <Link href="/house-styles-and-features" className="text-[var(--color-accent-sage)] hover:underline font-medium">House Styles</Link>
            <span className="text-[var(--color-neutral-dark)]">/</span>
            <span className="text-[var(--color-accent-gold)] font-semibold">Family Holidays</span>
          </nav>
          
          {/* Hero text in white card */}
          <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-10 shadow-2xl max-w-4xl mx-auto">
            <h1 className="mb-4 text-[var(--color-text-primary)]" style={{ fontFamily: "var(--font-display)" }}>
              Family Holiday Homes
            </h1>
            <p className="text-xl text-[var(--color-neutral-dark)] max-w-3xl mx-auto">
              Spacious, safe family homes perfect for multi-generational getaways
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
                Large Family Cottages UK
              </h2>
              <p className="text-lg text-[var(--color-neutral-dark)] mb-8 leading-relaxed">
                Create lasting memories with our family-friendly holiday homes designed for multi-generational gatherings. These spacious properties offer safe environments with child-friendly features, plenty of space for everyone, and easy access to family attractions. Perfect for reunions, milestone celebrations, and quality time together.
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

              <Button
                asChild
                size="lg"
                className="rounded-2xl px-10 py-6 text-white font-medium transition-all duration-200 hover:shadow-lg"
                style={{ background: "var(--color-accent-sage)" }}
              >
                <Link href="/properties">
                  Browse Family Homes
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
            </div>

            <div className="space-y-6">
              <div className="bg-[var(--color-bg-primary)] rounded-2xl p-8">
                <Baby className="w-12 h-12 text-[var(--color-accent-sage)] mb-4" />
                <h3 className="text-3xl font-bold mb-2" style={{ fontFamily: "var(--font-display)" }}>
                  Child-Friendly
                </h3>
                <p className="text-[var(--color-neutral-dark)]">
                  Safe spaces with cots, highchairs, and family equipment
                </p>
              </div>

              <div className="bg-[var(--color-bg-primary)] rounded-2xl p-8">
                <Users className="w-12 h-12 text-[var(--color-accent-gold)] mb-4" />
                <h3 className="text-3xl font-bold mb-2" style={{ fontFamily: "var(--font-display)" }}>
                  Multi-Generational
                </h3>
                <p className="text-[var(--color-neutral-dark)]">
                  Spacious layouts perfect for extended family gatherings
                </p>
              </div>

              <div className="bg-[var(--color-bg-primary)] rounded-2xl p-8">
                <Smile className="w-12 h-12 text-[var(--color-accent-sage)] mb-4" />
                <h3 className="text-3xl font-bold mb-2" style={{ fontFamily: "var(--font-display)" }}>
                  Entertainment
                </h3>
                <p className="text-[var(--color-neutral-dark)]">
                  Games rooms and activities to keep everyone happy
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