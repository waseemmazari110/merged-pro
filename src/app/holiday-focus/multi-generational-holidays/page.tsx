"use client";

import Link from "next/link";
import { Check, ArrowRight, Users, Heart, Baby } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import UKServiceSchema from "@/components/UKServiceSchema";

export default function MultiGenerationalHolidaysPage() {
  const highlights = [
    "Spacious communal areas for the whole family",
    "Accessible ground floor bedrooms and bathrooms",
    "Fully equipped kitchens for large family meals",
    "Enclosed gardens safe for children and pets",
    "Entertainment options for all ages and interests"
  ];

  return (
    <div className="min-h-screen">
      <title>Multi-Generational Holidays UK | Group Escape Houses</title>
      <meta name="description" content="Find the perfect multi-generational holiday homes across the UK. Luxury group accommodation designed for children, parents, and grandparents to enjoy together." />

      <UKServiceSchema
        type="breadcrumb"
        data={{
          breadcrumbs: [
            { name: "Home", url: "/" },
            { name: "Holiday Focus", url: "/holiday-focus" },
            { name: "Multi Generational Holidays", url: "/holiday-focus/multi-generational-holidays" }
          ]
        }}
      />
      <Header />
      
      {/* Hero Section */}
      <section className="relative h-[70vh] min-h-[500px] flex items-center justify-center">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1543269664-56bc441f5f62?w=1600&q=90')",
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
            <span className="text-[var(--color-accent-gold)] font-semibold">Multi-Generational Holidays</span>
          </nav>
          
          <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-10 shadow-2xl max-w-4xl mx-auto">
            <h1 className="mb-4 text-[var(--color-text-primary)]" style={{ fontFamily: "var(--font-display)" }}>
              Multi-Generational Holidays
            </h1>
            <p className="text-xl text-[var(--color-neutral-dark)] max-w-3xl mx-auto">
              Luxury UK accommodation designed for all ages to enjoy together
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
                Family Spaces for Everyone
              </h2>
              <p className="text-lg text-[var(--color-neutral-dark)] mb-8 leading-relaxed">
                Planning a getaway for parents, children, and grandparents requires a special kind of home. Our multi-generational holiday houses feature flexible sleeping arrangements, accessible facilities, and plenty of space for both collective activities and quiet moments.
              </p>

              <h3 className="text-2xl font-semibold mb-4" style={{ fontFamily: "var(--font-body)" }}>
                Key Features for Family Stays
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
                  Browse Family Houses
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
                <Users className="w-12 h-12 text-[var(--color-accent-sage)] mb-4" />
                <h3 className="text-3xl font-bold mb-2" style={{ fontFamily: "var(--font-display)" }}>
                  Spacious Living
                </h3>
                <p className="text-[var(--color-neutral-dark)]">
                  Large dining rooms and lounges designed for the whole family to gather.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="bg-[var(--color-bg-primary)] rounded-2xl p-8"
              >
                <Baby className="w-12 h-12 text-[var(--color-accent-gold)] mb-4" />
                <h3 className="text-3xl font-bold mb-2" style={{ fontFamily: "var(--font-display)" }}>
                  Family Friendly
                </h3>
                <p className="text-[var(--color-neutral-dark)]">
                  Safety features and entertainment areas specifically for younger guests.
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
                  Comfort for All
                </h3>
                <p className="text-[var(--color-neutral-dark)]">
                  Accessible ground floor options to ensure comfort for older family members.
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
