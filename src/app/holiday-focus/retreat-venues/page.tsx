"use client";

import Link from "next/link";
import { Check, ArrowRight, Tent, Wind, Sparkles } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import UKServiceSchema from "@/components/UKServiceSchema";

export default function RetreatVenuesPage() {
  const highlights = [
    "Secluded and quiet locations for deep focus",
    "Large communal areas for workshops and sessions",
    "Luxury bedrooms providing comfort for all attendees",
    "Fully equipped kitchens for group catering",
    "Beautiful outdoor spaces for meditation and exercise"
  ];

  return (
    <div className="min-h-screen">
      <title>Retreat Venues UK | Group Escape Houses</title>
      <meta name="description" content="Discover luxury retreat venues across the UK. Perfect group accommodation for wellness retreats, yoga workshops, and creative getaways in peaceful surroundings." />

      <UKServiceSchema
        type="breadcrumb"
        data={{
          breadcrumbs: [
            { name: "Home", url: "/" },
            { name: "Holiday Focus", url: "/holiday-focus" },
            { name: "Retreat Venues", url: "/holiday-focus/retreat-venues" }
          ]
        }}
      />
      <Header />
      
      {/* Hero Section */}
      <section className="relative h-[70vh] min-h-[500px] flex items-center justify-center">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1506126619008-df792e5c8059?w=1600&q=90')",
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
            <span className="text-[var(--color-accent-gold)] font-semibold">Retreat Venues</span>
          </nav>
          
          <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-10 shadow-2xl max-w-4xl mx-auto">
            <h1 className="mb-4 text-[var(--color-text-primary)]" style={{ fontFamily: "var(--font-display)" }}>
              Retreat Venues
            </h1>
            <p className="text-xl text-[var(--color-neutral-dark)] max-w-3xl mx-auto">
              Peaceful UK locations for wellness, creative, and group retreats
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
                Inspiring Spaces for Connection
              </h2>
              <p className="text-lg text-[var(--color-neutral-dark)] mb-8 leading-relaxed">
                Finding the right environment is crucial for a successful retreat. Our selection of retreat venues across the UK offers the perfect balance of tranquility, luxury, and functionality. Whether you're hosting a yoga retreat, a writing workshop, or a team wellness weekend, our houses provide a nurturing base.
              </p>

              <h3 className="text-2xl font-semibold mb-4" style={{ fontFamily: "var(--font-body)" }}>
                Retreat-Ready Highlights
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
                  Browse Retreat Venues
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
                <Tent className="w-12 h-12 text-[var(--color-accent-sage)] mb-4" />
                <h3 className="text-3xl font-bold mb-2" style={{ fontFamily: "var(--font-display)" }}>
                  Serene Settings
                </h3>
                <p className="text-[var(--color-neutral-dark)]">
                  Properties in peaceful locations to help your group disconnect and recharge.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="bg-[var(--color-bg-primary)] rounded-2xl p-8"
              >
                <Wind className="w-12 h-12 text-[var(--color-accent-gold)] mb-4" />
                <h3 className="text-3xl font-bold mb-2" style={{ fontFamily: "var(--font-display)" }}>
                  Open Spaces
                </h3>
                <p className="text-[var(--color-neutral-dark)]">
                  Large internal and external areas for group sessions and individual reflection.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="bg-[var(--color-bg-primary)] rounded-2xl p-8"
              >
                <Sparkles className="w-12 h-12 text-[var(--color-accent-sage)] mb-4" />
                <h3 className="text-3xl font-bold mb-2" style={{ fontFamily: "var(--font-display)" }}>
                  Luxury Finish
                </h3>
                <p className="text-[var(--color-neutral-dark)]">
                  High-quality interiors and amenities to ensure a comfortable stay for all.
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
