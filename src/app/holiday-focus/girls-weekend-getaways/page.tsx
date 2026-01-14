"use client";

import Link from "next/link";
import { Check, ArrowRight, Sparkles, Heart, Wine } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import UKServiceSchema from "@/components/UKServiceSchema";

export default function GirlsWeekendGetawaysPage() {
  const highlights = [
    "Luxury cottages with hot tubs and stylish interiors",
    "Prime locations near UK's best nightlife and shopping",
    "Spacious lounge areas perfect for socialising",
    "Option to add pamper sessions and private chefs",
    "Comfortable bedroom setups for large groups"
  ];

  return (
    <div className="min-h-screen">
      <title>Girls Weekend Getaways UK | Group Escape Houses</title>
      <meta name="description" content="Plan the ultimate girls' weekend getaway with our luxury group accommodation. Stunning houses and cottages across the UK perfect for relaxation and celebration." />

      <UKServiceSchema
        type="breadcrumb"
        data={{
          breadcrumbs: [
            { name: "Home", url: "/" },
            { name: "Holiday Focus", url: "/holiday-focus" },
            { name: "Girls Weekend Getaways", url: "/holiday-focus/girls-weekend-getaways" }
          ]
        }}
      />
      <Header />
      
      {/* Hero Section */}
      <section className="relative h-[70vh] min-h-[500px] flex items-center justify-center">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1529636798458-92182e662485?w=1600&q=90')",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-black/70 to-black/50"></div>
        </div>
        
        <div className="relative z-10 max-w-[1200px] mx-auto px-6 text-center">
          <nav className="inline-flex items-center gap-2 text-sm mb-6 bg-white/95 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg">
            <Link href="/" className="text-[var(--color-accent-sage)] hover:underline font-medium">Home</Link>
            <span className="text-[var(--color-neutral-dark)]">/</span>
            <Link href="/holiday-focus" className="text-[var(--color-accent-sage)] hover:underline font-medium">Holiday Focus</Link>
            <span className="text-[var(--color-neutral-dark)]">/</span>
            <span className="text-[var(--color-accent-gold)] font-semibold">Girls Weekend Getaways</span>
          </nav>
          
          <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-10 shadow-2xl max-w-4xl mx-auto">
            <h1 className="mb-4 text-[var(--color-text-primary)]" style={{ fontFamily: "var(--font-display)" }}>
              Girls Weekend Getaways
            </h1>
            <p className="text-xl text-[var(--color-neutral-dark)] max-w-3xl mx-auto">
              Stylish group houses for the perfect girls' trip away in the UK
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
                Celebrate with Style
              </h2>
              <p className="text-lg text-[var(--color-neutral-dark)] mb-8 leading-relaxed">
                Whether you're planning a birthday celebration, a long-overdue reunion, or just a relaxing break with your best friends, our girls' weekend houses provide the ultimate setting. From chic city apartments to large country manors with pools, we have the perfect base for your group.
              </p>

              <h3 className="text-2xl font-semibold mb-4" style={{ fontFamily: "var(--font-body)" }}>
                What Makes Our Getaways Special
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
                  Find Your Perfect House
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
            </div>

            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-[var(--color-bg-primary)] rounded-2xl p-8"
              >
                <Sparkles className="w-12 h-12 text-[var(--color-accent-sage)] mb-4" />
                <h3 className="text-3xl font-bold mb-2" style={{ fontFamily: "var(--font-display)" }}>
                  Pure Luxury
                </h3>
                <p className="text-[var(--color-neutral-dark)]">
                  Handpicked properties with high-end finishes and Instagram-worthy interiors.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="bg-[var(--color-bg-primary)] rounded-2xl p-8"
              >
                <Wine className="w-12 h-12 text-[var(--color-accent-gold)] mb-4" />
                <h3 className="text-3xl font-bold mb-2" style={{ fontFamily: "var(--font-display)" }}>
                  Social Spaces
                </h3>
                <p className="text-[var(--color-neutral-dark)]">
                  Open-plan kitchens and bars designed for hosting and celebrating together.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="bg-[var(--color-bg-primary)] rounded-2xl p-8"
              >
                <Heart className="w-12 h-12 text-[var(--color-accent-sage)] mb-4" />
                <h3 className="text-3xl font-bold mb-2" style={{ fontFamily: "var(--font-display)" }}>
                  Wellness Options
                </h3>
                <p className="text-[var(--color-neutral-dark)]">
                  Houses with hot tubs and space for in-house spa treatments or yoga sessions.
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
