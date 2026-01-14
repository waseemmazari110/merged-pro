"use client";

import Link from "next/link";
import { Check, ArrowRight, Crown, Home, Sparkles } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import UKServiceSchema from "@/components/UKServiceSchema";

export default function StatelyHousesPage() {
  const highlights = [
    "Impressive period properties with elegant décor",
    "Historic architecture and grand interiors",
    "Perfect for sophisticated celebrations",
    "Beautiful grounds and formal gardens",
    "High-end amenities in heritage settings"
  ];

  return (
    <div className="min-h-screen">
      <UKServiceSchema
        type="breadcrumb"
        data={{
          breadcrumbs: [
            { name: "Home", url: "/" },
            { name: "House Styles", url: "/house-styles" },
            { name: "Stately Houses", url: "/house-styles/stately-houses" }
          ]
        }}
      />
      <Header />
      
      {/* Hero Section */}
      <section className="relative h-[70vh] min-h-[500px] flex items-center justify-center">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=1600&q=90')",
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
            <span className="text-[var(--color-accent-gold)] font-semibold">Stately Houses</span>
          </nav>
          
          {/* Hero text in white card */}
          <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-10 shadow-2xl max-w-4xl mx-auto">
            <h1 className="mb-4 text-[var(--color-text-primary)]" style={{ fontFamily: "var(--font-display)" }}>
              Stately Homes to Rent
            </h1>
            <p className="text-xl text-[var(--color-neutral-dark)] max-w-3xl mx-auto">
              Heritage properties with elegance and grandeur
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
                Heritage Houses UK
              </h2>
              <p className="text-lg text-[var(--color-neutral-dark)] mb-8 leading-relaxed">
                Experience the grandeur of a stately home with our collection of impressive period properties. These magnificent estates feature elegant interiors, historic architecture, and formal gardens, providing a sophisticated backdrop for milestone celebrations, weddings, and special group gatherings that deserve an extra touch of class.
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

              {/* Feature Image */}
              <div className="mb-8 rounded-2xl overflow-hidden shadow-lg">
                <Image
                  src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/impressive-stately-home-grand-entrance-h-11ae9083-20251022191855.jpg"
                  alt="Stately home grand entrance hall"
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
                  Browse Stately Houses
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
            </div>

            <div className="space-y-6">
              <div className="bg-[var(--color-bg-primary)] rounded-2xl p-8">
                <Crown className="w-12 h-12 text-[var(--color-accent-sage)] mb-4" />
                <h3 className="text-3xl font-bold mb-2" style={{ fontFamily: "var(--font-display)" }}>
                  Regal Elegance
                </h3>
                <p className="text-[var(--color-neutral-dark)]">
                  Period features, chandeliers, and elegant formal rooms
                </p>
              </div>

              <div className="bg-[var(--color-bg-primary)] rounded-2xl p-8">
                <Home className="w-12 h-12 text-[var(--color-accent-gold)] mb-4" />
                <h3 className="text-3xl font-bold mb-2" style={{ fontFamily: "var(--font-display)" }}>
                  Historic Grandeur
                </h3>
                <p className="text-[var(--color-neutral-dark)]">
                  Impressive architecture with centuries of character
                </p>
              </div>

              <div className="bg-[var(--color-bg-primary)] rounded-2xl p-8">
                <Sparkles className="w-12 h-12 text-[var(--color-accent-sage)] mb-4" />
                <h3 className="text-3xl font-bold mb-2" style={{ fontFamily: "var(--font-display)" }}>
                  Formal Gardens
                </h3>
                <p className="text-[var(--color-neutral-dark)]">
                  Beautiful grounds perfect for photos and outdoor gatherings
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