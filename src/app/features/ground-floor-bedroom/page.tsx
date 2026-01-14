"use client";

import Link from "next/link";
import { Check, ArrowRight, Accessibility, Heart, Users } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import UKServiceSchema from "@/components/UKServiceSchema";

export default function GroundFloorBedroomPage() {
  const highlights = [
    "Accessible ground floor bedroom layouts",
    "Perfect for guests with mobility needs",
    "Step-free access to essential facilities",
    "Inclusive accommodation for all",
    "Comfortable and practical design"
  ];

  const galleryImages = [
    {
      url: "https://images.unsplash.com/photo-1540518614846-7eded433c457?w=800&q=90",
      alt: "Spacious accessible ground floor bedroom with king size bed"
    },
    {
      url: "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=800&q=90",
      alt: "Modern accessible bedroom with step-free access"
    },
    {
      url: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800&q=90",
      alt: "Luxury ground floor bedroom with ensuite bathroom"
    },
    {
      url: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=90",
      alt: "Accessible bedroom with wide doorways and mobility features"
    }
  ];

  return (
    <div className="min-h-screen">
      <UKServiceSchema
        type="breadcrumb"
        data={{
          breadcrumbs: [
            { name: "Home", url: "/" },
            { name: "Features", url: "/house-styles-and-features" },
            { name: "Ground Floor Bedroom", url: "/features/ground-floor-bedroom" }
          ]
        }}
      />
      <Header />
      
      {/* Hero Section */}
      <section className="relative h-[70vh] min-h-[500px] flex items-center justify-center">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=1600&q=90')",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-black/60 to-black/40"></div>
        </div>
        
        <div className="relative z-10 max-w-[1200px] mx-auto px-6 text-center">
          <nav className="flex justify-center gap-2 text-sm mb-6" style={{ color: "white", textShadow: "0 2px 4px rgba(0,0,0,0.3)" }}>
            <Link href="/" className="hover:underline" style={{ color: "white" }}>Home</Link>
            <span style={{ color: "white" }}>/</span>
            <Link href="/house-styles-and-features" className="hover:underline" style={{ color: "white" }}>Features</Link>
            <span style={{ color: "white" }}>/</span>
            <span style={{ color: "white" }}>Ground Floor Bedroom</span>
          </nav>
          
          <h1 className="mb-6" style={{ fontFamily: "var(--font-display)", color: "white", textShadow: "0 2px 8px rgba(0,0,0,0.4)" }}>
            Properties with Ground Floor Bedrooms
          </h1>
          <p className="text-xl max-w-3xl mx-auto" style={{ color: "white", textShadow: "0 2px 4px rgba(0,0,0,0.3)" }}>
            Accessible accommodation for comfortable group stays
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-24 bg-white">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <div>
              <h2 className="mb-6" style={{ fontFamily: "var(--font-display)" }}>
                Accessible Accommodation
              </h2>
              <p className="text-lg text-[var(--color-neutral-dark)] mb-8 leading-relaxed">
                Ensure everyone in your group can enjoy their stay with properties featuring ground floor bedrooms. These accessibility-friendly layouts provide step-free access to bedrooms and essential facilities, making celebrations inclusive and comfortable for guests with mobility needs.
              </p>

              <h3 className="text-2xl font-semibold mb-4" style={{ fontFamily: "var(--font-body)" }}>
                What to Expect
              </h3>
              <ul className="space-y-3 mb-8">
                {highlights.map((highlight, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <Check className="w-6 h-6 text-[var(--color-accent-gold)] flex-shrink-0 mt-0.5" />
                    <span className="text-[var(--color-neutral-dark)]">{highlight}</span>
                  </li>
                ))}
              </ul>

              <Button
                asChild
                size="lg"
                className="rounded-2xl px-10 py-6 text-white font-medium transition-all duration-200 hover:shadow-lg"
                style={{ background: "var(--color-accent-gold)" }}
              >
                <Link href="/properties">
                  Browse Properties
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
            </div>

            <div className="space-y-6">
              <div className="bg-[var(--color-bg-primary)] rounded-2xl p-8">
                <Accessibility className="w-12 h-12 text-[var(--color-accent-gold)] mb-4" />
                <h3 className="text-3xl font-bold mb-2" style={{ fontFamily: "var(--font-display)" }}>
                  Step-Free Access
                </h3>
                <p className="text-[var(--color-neutral-dark)]">
                  Ground floor bedrooms with accessible layouts
                </p>
              </div>

              <div className="bg-[var(--color-bg-primary)] rounded-2xl p-8">
                <Heart className="w-12 h-12 text-[var(--color-accent-sage)] mb-4" />
                <h3 className="text-3xl font-bold mb-2" style={{ fontFamily: "var(--font-display)" }}>
                  Inclusive Design
                </h3>
                <p className="text-[var(--color-neutral-dark)]">
                  Thoughtful layouts that accommodate all guests
                </p>
              </div>

              <div className="bg-[var(--color-bg-primary)] rounded-2xl p-8">
                <Users className="w-12 h-12 text-[var(--color-accent-gold)] mb-4" />
                <h3 className="text-3xl font-bold mb-2" style={{ fontFamily: "var(--font-display)" }}>
                  Everyone Welcome
                </h3>
                <p className="text-[var(--color-neutral-dark)]">
                  Ensure all group members can join the celebration
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-24 bg-[var(--color-bg-primary)]">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="mb-4" style={{ fontFamily: "var(--font-display)" }}>
              Accessible Bedroom Features
            </h2>
            <p className="text-lg text-[var(--color-neutral-dark)] max-w-2xl mx-auto">
              Browse our collection of properties with thoughtfully designed ground floor bedrooms
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {galleryImages.map((image, index) => (
              <div key={index} className="relative h-[400px] rounded-2xl overflow-hidden group">
                <Image
                  src={image.url}
                  alt={image.alt}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-6 left-6 right-6">
                    <p className="text-white text-lg font-medium">{image.alt}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Highlights with Images */}
      <section className="py-24 bg-white">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
            <div className="relative h-[500px] rounded-2xl overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1617806118233-18e1de247200?w=800&q=90"
                alt="Wide accessible doorways and corridors"
                fill
                className="object-cover"
              />
            </div>
            <div>
              <h3 className="text-3xl font-bold mb-4" style={{ fontFamily: "var(--font-display)" }}>
                Designed for Comfort
              </h3>
              <p className="text-lg text-[var(--color-neutral-dark)] mb-6 leading-relaxed">
                Our ground floor bedrooms feature wide doorways, level thresholds, and spacious layouts. Many properties include accessible ensuite bathrooms with walk-in showers and grab rails for added safety and convenience.
              </p>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <Check className="w-6 h-6 text-[var(--color-accent-sage)] flex-shrink-0 mt-0.5" />
                  <span className="text-[var(--color-neutral-dark)]">Wide doorways (32 inches minimum)</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-6 h-6 text-[var(--color-accent-sage)] flex-shrink-0 mt-0.5" />
                  <span className="text-[var(--color-neutral-dark)]">Level or ramped access throughout</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-6 h-6 text-[var(--color-accent-sage)] flex-shrink-0 mt-0.5" />
                  <span className="text-[var(--color-neutral-dark)]">Accessible bathroom facilities</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <h3 className="text-3xl font-bold mb-4" style={{ fontFamily: "var(--font-display)" }}>
                Inclusive Group Stays
              </h3>
              <p className="text-lg text-[var(--color-neutral-dark)] mb-6 leading-relaxed">
                No one should miss out on celebrating together. Our properties with ground floor bedrooms ensure everyone in your group can stay comfortably, with easy access to communal areas, kitchens, and outdoor spaces.
              </p>
              <Button
                asChild
                size="lg"
                className="rounded-2xl px-10 py-6 text-white font-medium transition-all duration-200 hover:shadow-lg"
                style={{ background: "var(--color-accent-sage)" }}
              >
                <Link href="/contact">
                  Speak to Our Team
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
            </div>
            <div className="relative h-[500px] rounded-2xl overflow-hidden order-1 lg:order-2">
              <Image
                src="https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800&q=90"
                alt="Group of friends celebrating in accessible accommodation"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}