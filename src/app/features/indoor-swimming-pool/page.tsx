"use client";

import Link from "next/link";
import { Check, ArrowRight, Waves, Snowflake, Users } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import UKServiceSchema from "@/components/UKServiceSchema";

export default function IndoorSwimmingPoolPage() {
  const highlights = [
    "Heated indoor pools for year-round use",
    "Perfect for all-season celebrations",
    "Luxury spa-like settings",
    "Private swimming whatever the weather",
    "Ultimate relaxation and entertainment"
  ];

  return (
    <div className="min-h-screen">
      <UKServiceSchema
        type="breadcrumb"
        data={{
          breadcrumbs: [
            { name: "Home", url: "/" },
            { name: "Features", url: "/house-styles-and-features" },
            { name: "Indoor Swimming Pool", url: "/features/indoor-swimming-pool" }
          ]
        }}
      />
      <Header />
      
      {/* Hero Section */}
      <section className="relative h-[70vh] min-h-[500px] flex items-center justify-center">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1576610616656-d3aa5d1f4534?w=1600&q=90')",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-black/60 to-black/40"></div>
        </div>
        
        <div className="relative z-10 max-w-[1200px] mx-auto px-6 text-center text-white">
          <nav className="flex justify-center gap-2 text-sm mb-6">
            <Link href="/" className="hover:underline">Home</Link>
            <span>/</span>
            <Link href="/house-styles-and-features" className="hover:underline">Features</Link>
            <span>/</span>
            <span>Indoor Swimming Pool</span>
          </nav>
          
          <h1 className="mb-6" style={{ fontFamily: "var(--font-display)", color: "white" }}>
            Properties with Indoor Swimming Pools
          </h1>
          <p className="text-xl max-w-3xl mx-auto">
            Luxury indoor pools for year-round swimming
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-24 bg-white">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <div>
              <h2 className="mb-6" style={{ fontFamily: "var(--font-display)" }}>
                Luxury Homes with Indoor Pools
              </h2>
              <p className="text-lg text-[var(--color-neutral-dark)] mb-8 leading-relaxed">
                Experience the ultimate luxury with properties featuring heated indoor swimming pools. Perfect for year-round celebrations, these impressive facilities offer spa-like relaxation and entertainment whatever the season. Ideal for hen parties, milestone birthdays, and groups seeking that extra special touch.
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
                <Waves className="w-12 h-12 text-[var(--color-accent-gold)] mb-4" />
                <h3 className="text-3xl font-bold mb-2" style={{ fontFamily: "var(--font-display)" }}>
                  Heated Pools
                </h3>
                <p className="text-[var(--color-neutral-dark)]">
                  Warm indoor pools for comfortable year-round swimming
                </p>
              </div>

              <div className="bg-[var(--color-bg-primary)] rounded-2xl p-8">
                <Snowflake className="w-12 h-12 text-[var(--color-accent-sage)] mb-4" />
                <h3 className="text-3xl font-bold mb-2" style={{ fontFamily: "var(--font-display)" }}>
                  All Season
                </h3>
                <p className="text-[var(--color-neutral-dark)]">
                  Perfect for winter weekends and rainy days
                </p>
              </div>

              <div className="bg-[var(--color-bg-primary)] rounded-2xl p-8">
                <Users className="w-12 h-12 text-[var(--color-accent-gold)] mb-4" />
                <h3 className="text-3xl font-bold mb-2" style={{ fontFamily: "var(--font-display)" }}>
                  Premium Luxury
                </h3>
                <p className="text-[var(--color-neutral-dark)]">
                  Spa-like facilities for ultimate group indulgence
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