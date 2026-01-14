"use client";

import Link from "next/link";
import { Check, ArrowRight, Home, Users, Calendar } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import UKServiceSchema from "@/components/UKServiceSchema";

export default function LargeHolidayHomesPage() {
  const highlights = [
    "Spacious homes perfect for long weekends and gatherings",
    "Multiple living areas for group socializing",
    "Modern kitchens and dining spaces for group meals",
    "Ideal for celebrations and reunions",
    "Convenient locations across the UK"
  ];

  return (
    <div className="min-h-screen">
      <UKServiceSchema
        type="breadcrumb"
        data={{
          breadcrumbs: [
            { name: "Home", url: "/" },
            { name: "House Styles", url: "/house-styles" },
            { name: "Large Holiday Homes", url: "/house-styles/large-holiday-homes" }
          ]
        }}
      />
      <Header />
      
      {/* Hero Section */}
      <section className="relative h-[70vh] min-h-[500px] flex items-center justify-center">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/spacious-modern-large-holiday-home-exter-a8a6c12f-20251022191905.jpg')",
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
            <span className="text-[var(--color-accent-gold)] font-semibold">Large Holiday Homes</span>
          </nav>
          
          {/* Hero text in white card */}
          <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-10 shadow-2xl max-w-4xl mx-auto">
            <h1 className="mb-4 text-[var(--color-text-primary)]" style={{ fontFamily: "var(--font-display)" }}>
              Large Holiday Homes UK
            </h1>
            <p className="text-xl text-[var(--color-neutral-dark)] max-w-3xl mx-auto">
              Spacious group accommodation for memorable getaways
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
                Group Holiday Lets
              </h2>
              <p className="text-lg text-[var(--color-neutral-dark)] mb-8 leading-relaxed">
                Our large holiday homes provide the perfect base for group celebrations and extended getaways. With spacious interiors, multiple living areas, and modern amenities, these properties offer comfort and convenience for hen parties, family reunions, milestone birthdays, and friends' weekends that deserve proper space to spread out.
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

              {/* Kitchen Image */}
              <div className="mb-8 rounded-2xl overflow-hidden shadow-lg">
                <Image
                  src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/luxury-large-holiday-home-spacious-moder-24fd9d3b-20251022192734.jpg"
                  alt="Modern kitchen with island seating in large holiday home"
                  width={800}
                  height={600}
                  className="w-full h-auto object-cover"
                />
              </div>

              {/* Living Area Image */}
              <div className="mb-8 rounded-2xl overflow-hidden shadow-lg">
                <Image
                  src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/large-holiday-home-open-plan-living-area-c48f6e12-20251022191855.jpg"
                  alt="Large holiday home open plan living area"
                  width={800}
                  height={600}
                  className="w-full h-auto object-cover"
                />
              </div>

              <Button
                asChild
                size="lg"
                className="rounded-2xl px-10 py-6 text-white font-medium transition-all duration-200 hover:shadow-lg"
                style={{ background: "var(--color-accent-sage)" }}
              >
                <Link href="/properties">
                  Browse Large Holiday Homes
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
            </div>

            <div className="space-y-6">
              {/* Outdoor Entertainment Image */}
              <div className="rounded-2xl overflow-hidden shadow-lg">
                <Image
                  src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/large-holiday-home-outdoor-entertainment-7fdc6cd3-20251022191905.jpg"
                  alt="Large holiday home outdoor entertainment area with hot tub"
                  width={800}
                  height={600}
                  className="w-full h-auto"
                />
              </div>

              {/* Dining Room Image */}
              <div className="rounded-2xl overflow-hidden shadow-lg">
                <Image
                  src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/spacious-holiday-home-dining-room-with-l-f62f7507-20251022192730.jpg"
                  alt="Spacious dining room with large table for group gatherings"
                  width={800}
                  height={600}
                  className="w-full h-auto"
                />
              </div>

              {/* Bedroom Image */}
              <div className="rounded-2xl overflow-hidden shadow-lg">
                <Image
                  src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/large-holiday-home-master-bedroom-suite--dc572282-20251022192732.jpg"
                  alt="Master bedroom suite in large holiday home"
                  width={800}
                  height={600}
                  className="w-full h-auto"
                />
              </div>

              <div className="bg-[var(--color-bg-primary)] rounded-2xl p-8">
                <Home className="w-12 h-12 text-[var(--color-accent-sage)] mb-4" />
                <h3 className="text-3xl font-bold mb-2" style={{ fontFamily: "var(--font-display)" }}>
                  Spacious Living
                </h3>
                <p className="text-[var(--color-neutral-dark)]">
                  Multiple living areas and bedrooms for comfortable group stays
                </p>
              </div>

              <div className="bg-[var(--color-bg-primary)] rounded-2xl p-8">
                <Users className="w-12 h-12 text-[var(--color-accent-gold)] mb-4" />
                <h3 className="text-3xl font-bold mb-2" style={{ fontFamily: "var(--font-display)" }}>
                  Perfect for Groups
                </h3>
                <p className="text-[var(--color-neutral-dark)]">
                  Designed for comfortable group gatherings and celebrations
                </p>
              </div>

              <div className="bg-[var(--color-bg-primary)] rounded-2xl p-8">
                <Calendar className="w-12 h-12 text-[var(--color-accent-sage)] mb-4" />
                <h3 className="text-3xl font-bold mb-2" style={{ fontFamily: "var(--font-display)" }}>
                  Weekend Getaways
                </h3>
                <p className="text-[var(--color-neutral-dark)]">
                  Ideal for long weekends and extended group holidays
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