"use client";

import Link from "next/link";
import { Check, ArrowRight, CircleDot, Users, Sun } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import UKServiceSchema from "@/components/UKServiceSchema";

export default function TennisCourtPage() {
  const highlights = [
    "Private or shared tennis courts",
    "Perfect for active group stays",
    "Racquets and equipment often provided",
    "Beautiful outdoor settings",
    "Great for tournaments and friendly matches"
  ];

  return (
    <div className="min-h-screen">
      <UKServiceSchema
        type="breadcrumb"
        data={{
          breadcrumbs: [
            { name: "Home", url: "/" },
            { name: "Features", url: "/house-styles-and-features" },
            { name: "Tennis Court", url: "/features/tennis-court" }
          ]
        }}
      />
      <Header />
      
      {/* Hero Section */}
      <section className="relative h-[70vh] min-h-[500px] flex items-center justify-center">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=1600&q=90')",
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
            <span>Tennis Court</span>
          </nav>
          
          <h1 className="mb-6" style={{ fontFamily: "var(--font-display)", color: "white" }}>
            Houses with Tennis Courts
          </h1>
          <p className="text-xl max-w-3xl mx-auto">
            Active stays with private tennis court access
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-24 bg-white">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <div>
              <h2 className="mb-6" style={{ fontFamily: "var(--font-display)" }}>
                Properties with Tennis Courts
              </h2>
              <p className="text-lg text-[var(--color-neutral-dark)] mb-8 leading-relaxed">
                Stay active during your celebration with properties featuring tennis courts. Whether you're organizing a friendly tournament or just enjoying a casual game, these properties offer the perfect blend of luxury accommodation and outdoor recreation for sports-loving groups.
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
                <CircleDot className="w-12 h-12 text-[var(--color-accent-gold)] mb-4" />
                <h3 className="text-3xl font-bold mb-2" style={{ fontFamily: "var(--font-display)" }}>
                  Private Courts
                </h3>
                <p className="text-[var(--color-neutral-dark)]">
                  Exclusive use for your group throughout your stay
                </p>
              </div>

              <div className="bg-[var(--color-bg-primary)] rounded-2xl p-8">
                <Sun className="w-12 h-12 text-[var(--color-accent-sage)] mb-4" />
                <h3 className="text-3xl font-bold mb-2" style={{ fontFamily: "var(--font-display)" }}>
                  Outdoor Recreation
                </h3>
                <p className="text-[var(--color-neutral-dark)]">
                  Beautiful outdoor settings for active pursuits
                </p>
              </div>

              <div className="bg-[var(--color-bg-primary)] rounded-2xl p-8">
                <Users className="w-12 h-12 text-[var(--color-accent-gold)] mb-4" />
                <h3 className="text-3xl font-bold mb-2" style={{ fontFamily: "var(--font-display)" }}>
                  Group Tournaments
                </h3>
                <p className="text-[var(--color-neutral-dark)]">
                  Perfect for organizing friendly competitions
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