"use client";

import Link from "next/link";
import { Check, ArrowRight, Castle, Users, Crown } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import UKServiceSchema from "@/components/UKServiceSchema";

export default function CastlesPage() {
  const highlights = [
    "Historic castles and converted fortresses",
    "Unique settings for truly memorable celebrations",
    "Impressive architecture and period features",
    "Exclusive use for your group",
    "Perfect for themed parties and grand occasions"
  ];

  return (
    <div className="min-h-screen">
      <UKServiceSchema
        type="breadcrumb"
        data={{
          breadcrumbs: [
            { name: "Home", url: "/" },
            { name: "House Styles", url: "/house-styles" },
            { name: "Castles", url: "/house-styles/castles" }
          ]
        }}
      />
      <Header />
      
      {/* Hero Section with Video */}
      <section className="relative h-[70vh] min-h-[500px] flex items-center justify-center overflow-hidden">
        {/* Video Background */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source
            src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_videos/aerial-drone-shot-gliding-over-a-majesti-efea54d4-20251022153221.mp4"
            type="video/mp4"
          />
        </video>
        
        {/* Fallback Image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1585155770958-025f7c90fc5d?w=1600&q=90')",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-black/70 to-black/50"></div>
        </div>
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/70 to-black/50"></div>
        
        <div className="relative z-10 max-w-[1200px] mx-auto px-6 text-center">
          {/* Breadcrumb with white background card */}
          <nav className="inline-flex items-center gap-2 text-sm mb-6 bg-white/95 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg">
            <Link href="/" className="text-[var(--color-accent-sage)] hover:underline font-medium">Home</Link>
            <span className="text-[var(--color-neutral-dark)]">/</span>
            <Link href="/house-styles-and-features" className="text-[var(--color-accent-sage)] hover:underline font-medium">House Styles</Link>
            <span className="text-[var(--color-neutral-dark)]">/</span>
            <span className="text-[var(--color-accent-gold)] font-semibold">Castles</span>
          </nav>
          
          {/* Hero text in white card */}
          <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-10 shadow-2xl max-w-4xl mx-auto">
            <h1 className="mb-4 text-[var(--color-text-primary)]" style={{ fontFamily: "var(--font-display)" }}>
              Castles to Rent UK
            </h1>
            <p className="text-xl text-[var(--color-neutral-dark)] max-w-3xl mx-auto">
              Unique castle stays for extraordinary celebrations
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
                Castle Stays & Luxury Castle Hire
              </h2>
              <p className="text-lg text-[var(--color-neutral-dark)] mb-8 leading-relaxed">
                Make your celebration truly unforgettable with a stay in one of our remarkable castles. From medieval fortresses to elegant Scottish estates, these unique properties offer an extraordinary setting for hen parties, milestone birthdays, and special occasions that deserve a touch of royal grandeur.
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
                  Browse Castles
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
            </div>

            <div className="space-y-6">
              {/* Large Feature Image */}
              <div className="rounded-2xl overflow-hidden shadow-lg">
                <img
                  src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/luxurious-grand-castle-interior-great-ha-c3d2fd68-20251022153203.jpg"
                  alt="Luxurious castle great hall interior"
                  className="w-full h-auto"
                />
              </div>

              <div className="bg-[var(--color-bg-primary)] rounded-2xl p-8">
                <Castle className="w-12 h-12 text-[var(--color-accent-sage)] mb-4" />
                <h3 className="text-3xl font-bold mb-2" style={{ fontFamily: "var(--font-display)" }}>
                  Historic Grandeur
                </h3>
                <p className="text-[var(--color-neutral-dark)]">
                  Authentic castles with centuries of history and character
                </p>
              </div>

              <div className="bg-[var(--color-bg-primary)] rounded-2xl p-8">
                <Crown className="w-12 h-12 text-[var(--color-accent-gold)] mb-4" />
                <h3 className="text-3xl font-bold mb-2" style={{ fontFamily: "var(--font-display)" }}>
                  Exclusive Use
                </h3>
                <p className="text-[var(--color-neutral-dark)]">
                  Private hire of the entire property for your group
                </p>
              </div>

              <div className="bg-[var(--color-bg-primary)] rounded-2xl p-8">
                <Users className="w-12 h-12 text-[var(--color-accent-sage)] mb-4" />
                <h3 className="text-3xl font-bold mb-2" style={{ fontFamily: "var(--font-display)" }}>
                  Grand Scale
                </h3>
                <p className="text-[var(--color-neutral-dark)]">
                  Spacious accommodation for large celebrations and gatherings
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Castle Features Gallery */}
      <section className="py-24 bg-[var(--color-bg-primary)]">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="mb-4" style={{ fontFamily: "var(--font-display)" }}>
              Inside Our Castle Properties
            </h2>
            <p className="text-lg text-[var(--color-neutral-dark)] max-w-2xl mx-auto">
              Experience the perfect blend of historic elegance and modern luxury
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Bedroom Image */}
            <div className="rounded-2xl overflow-hidden shadow-lg group">
              <img
                src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/elegant-castle-bedroom-suite-with-four-p-7dc4ba72-20251022153203.jpg"
                alt="Elegant castle bedroom with four-poster bed"
                className="w-full h-auto transition-transform duration-300 group-hover:scale-105"
              />
              <div className="p-6 bg-white">
                <h3 className="text-2xl font-semibold mb-2" style={{ fontFamily: "var(--font-display)" }}>
                  Luxury Bedrooms
                </h3>
                <p className="text-[var(--color-neutral-dark)]">
                  Period features with modern comforts and elegant furnishings
                </p>
              </div>
            </div>

            {/* Dining Room Image */}
            <div className="rounded-2xl overflow-hidden shadow-lg group">
              <img
                src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/castle-dining-room-set-for-celebration-d-cf352e43-20251022153203.jpg"
                alt="Castle dining room for celebrations"
                className="w-full h-auto transition-transform duration-300 group-hover:scale-105"
              />
              <div className="p-6 bg-white">
                <h3 className="text-2xl font-semibold mb-2" style={{ fontFamily: "var(--font-display)" }}>
                  Grand Dining Spaces
                </h3>
                <p className="text-[var(--color-neutral-dark)]">
                  Atmospheric settings perfect for celebration dinners and gatherings
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