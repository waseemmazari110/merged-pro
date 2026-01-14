"use client";

import Link from "next/link";
import { Check, ArrowRight, Home, Users, TreePine } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import UKServiceSchema from "@/components/UKServiceSchema";

export default function CountryHousesPage() {
  const highlights = [
    "Traditional English countryside properties",
    "Perfect for peaceful weekend retreats",
    "Beautiful rural locations with stunning views",
    "Ideal for groups of 8-20 guests",
    "Walking trails and outdoor activities nearby"
  ];

  return (
    <div className="min-h-screen">
      <UKServiceSchema
        type="breadcrumb"
        data={{
          breadcrumbs: [
            { name: "Home", url: "/" },
            { name: "House Styles", url: "/house-styles" },
            { name: "Country Houses", url: "/house-styles/country-houses" }
          ]
        }}
      />
      <Header />
      
      {/* Hero Section */}
      <section className="relative h-[70vh] min-h-[500px] flex items-center justify-center">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/serene-english-countryside-landscape-wit-6dd9916d-20251022152721.jpg')",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-black/70 to-black/50"></div>
        </div>
        
        <div className="relative z-10 max-w-[1200px] mx-auto px-6 text-center">
          <nav className="flex justify-center gap-2 text-sm mb-6 bg-white/95 backdrop-blur-sm px-6 py-3 rounded-full inline-flex" style={{ color: "var(--color-text-primary)" }}>
            <Link href="/" className="hover:underline" style={{ color: "var(--color-accent-sage)" }}>Home</Link>
            <span>/</span>
            <Link href="/house-styles-and-features" className="hover:underline" style={{ color: "var(--color-accent-sage)" }}>House Styles</Link>
            <span>/</span>
            <span style={{ color: "var(--color-accent-gold)", fontWeight: 500 }}>Country Houses</span>
          </nav>
          
          <div className="bg-white/95 backdrop-blur-sm rounded-3xl px-12 py-10 inline-block shadow-2xl">
            <h1 className="mb-4" style={{ fontFamily: "var(--font-display)", color: "var(--color-text-primary)" }}>
              Country Houses to Rent
            </h1>
            <p className="text-xl max-w-3xl mx-auto" style={{ color: "var(--color-neutral-dark)" }}>
              Traditional countryside properties for relaxing group getaways
            </p>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-24 bg-white">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <div>
              <h2 className="mb-6" style={{ fontFamily: "var(--font-display)", color: "var(--color-text-primary)" }}>
                Rural Holiday Homes UK
              </h2>
              <p className="text-lg text-[var(--color-neutral-dark)] mb-8 leading-relaxed">
                Escape to the English countryside with our selection of traditional country houses. These charming rural properties offer the perfect balance of comfort and tranquillity, ideal for family reunions, friends' weekends, and peaceful celebrations surrounded by nature.
              </p>

              <h3 className="text-2xl font-semibold mb-4" style={{ fontFamily: "var(--font-body)", color: "var(--color-text-primary)" }}>
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

              {/* Image Grid */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="relative h-48 rounded-2xl overflow-hidden shadow-lg">
                  <Image
                    src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/traditional-english-country-house-stone--414807ca-20251022152721.jpg"
                    alt="Traditional English country house exterior"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="relative h-48 rounded-2xl overflow-hidden shadow-lg">
                  <Image
                    src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/lush-countryside-landscape-with-ancient--eac967b2-20251022152722.jpg"
                    alt="Countryside landscape with oak trees"
                    fill
                    className="object-cover"
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
                  Browse Country Houses
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
            </div>

            <div className="space-y-6">
              {/* Feature Image */}
              <div className="relative h-64 rounded-2xl overflow-hidden shadow-lg mb-6">
                <Image
                  src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/elegant-traditional-english-country-hous-40359a54-20251022152723.jpg"
                  alt="Cozy country house interior"
                  fill
                  className="object-cover"
                />
              </div>

              <div className="bg-[var(--color-bg-primary)] rounded-2xl p-8 shadow-md">
                <TreePine className="w-12 h-12 text-[var(--color-accent-sage)] mb-4" />
                <h3 className="text-3xl font-bold mb-2" style={{ fontFamily: "var(--font-display)", color: "var(--color-text-primary)" }}>
                  Countryside Setting
                </h3>
                <p className="text-[var(--color-neutral-dark)]">
                  Peaceful rural locations with beautiful views and fresh country air
                </p>
              </div>

              <div className="bg-[var(--color-bg-primary)] rounded-2xl p-8 shadow-md">
                <Users className="w-12 h-12 text-[var(--color-accent-gold)] mb-4" />
                <h3 className="text-3xl font-bold mb-2" style={{ fontFamily: "var(--font-display)", color: "var(--color-text-primary)" }}>
                  8-20 Guests
                </h3>
                <p className="text-[var(--color-neutral-dark)]">
                  Comfortable accommodation for medium to large groups
                </p>
              </div>

              <div className="bg-[var(--color-bg-primary)] rounded-2xl p-8 shadow-md">
                <Home className="w-12 h-12 text-[var(--color-accent-sage)] mb-4" />
                <h3 className="text-3xl font-bold mb-2" style={{ fontFamily: "var(--font-display)", color: "var(--color-text-primary)" }}>
                  Traditional Charm
                </h3>
                <p className="text-[var(--color-neutral-dark)]">
                  Period features and cosy interiors for a home-away-from-home feel
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