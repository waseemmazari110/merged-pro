"use client";

import { motion } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sparkles, Users, Calendar, Utensils, Check, ChevronDown, Star } from "lucide-react";
import { useState } from "react";
import UKServiceSchema from "@/components/UKServiceSchema";

export default function SpecialCelebrationsPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const features = [
    "Large dining and entertaining areas perfect for group celebrations",
    "Optional catering, decorations, or private chef services",
    "Flexible weekend or midweek stays with competitive rates",
    "Hot tubs, games rooms, and entertainment spaces",
    "Beautiful grounds for photos and outdoor activities",
    "Dedicated UK support team to help plan your celebration"
  ];

  const galleryImages = [
    {
      url: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=1600&q=90",
      alt: "Elegant dining setup for special celebrations"
    },
    {
      url: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=1600&q=90",
      alt: "Birthday celebration with balloons and decorations"
    },
    {
      url: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=1600&q=90",
      alt: "Group celebrating anniversary milestone"
    },
    {
      url: "https://images.unsplash.com/photo-1505236858219-8359eb29e329?w=1600&q=90",
      alt: "Elegant celebration table setup"
    },
    {
      url: "https://images.unsplash.com/photo-1478145787956-f6f12c59624d?w=1600&q=90",
      alt: "Family reunion celebration outdoors"
    },
    {
      url: "https://images.unsplash.com/photo-1527529482837-4698179dc6ce?w=1600&q=90",
      alt: "Milestone birthday celebration with cake"
    }
  ];

  const benefits = [
    {
      title: "Perfect for Groups",
      description: "Houses that comfortably sleep 10-30 guests with spacious communal areas",
      icon: Users
    },
    {
      title: "Celebration Ready",
      description: "Large dining tables, entertainment systems, and party-perfect layouts",
      icon: Sparkles
    },
    {
      title: "Flexible Booking",
      description: "Choose weekend or midweek stays to suit your schedule and budget",
      icon: Calendar
    }
  ];

  const faqs = [
    {
      question: "What makes your houses perfect for special celebrations?",
      answer: "Our houses are specifically chosen for their spacious layouts, large dining areas, and entertainment facilities. Many feature hot tubs, games rooms, and beautiful gardens perfect for making memories with loved ones."
    },
    {
      question: "Can you arrange catering for our celebration?",
      answer: "Yes! We can arrange everything from private chefs to full catering packages. We also offer decorations, birthday cakes, and other celebration extras. Just let us know your requirements when booking."
    },
    {
      question: "What's the minimum group size for a celebration booking?",
      answer: "Most of our celebration houses accommodate groups of 10-30 guests. We have properties suitable for various group sizes, so get in touch and we'll find the perfect match for your party."
    },
    {
      question: "Can we decorate the house for the celebration?",
      answer: "Absolutely! You're welcome to bring decorations. We can also arrange professional decoration services including balloons, banners, and table settings. Just no confetti or fixtures that damage walls."
    },
    {
      question: "Are there any noise restrictions we should know about?",
      answer: "Each property has specific house rules regarding noise levels and quiet hours, typically from 11pm. We'll provide full details when you book. Many of our houses are in secluded locations perfect for celebrations."
    },
    {
      question: "How far in advance should we book?",
      answer: "For popular dates and larger properties, we recommend booking 6-12 months ahead. However, we often have last-minute availability, so it's always worth checking with us even for shorter notice."
    }
  ];

  return (
    <div className="min-h-screen bg-[var(--color-bg-primary)]">
      <UKServiceSchema
        type="breadcrumb"
        data={{
          breadcrumbs: [
            { name: "Home", url: "/" },
            { name: "Occasions", url: "/occasions" },
            { name: "Special Celebrations", url: "/occasions/special-celebrations" }
          ]
        }}
      />
      <Header />

      {/* Hero Section */}
      <section className="pt-32 pb-16 relative">
        <div className="max-w-[1200px] mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="relative rounded-2xl overflow-hidden shadow-2xl mb-12"
          >
            <img
              src="https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=1600&auto=format&fit=crop"
              alt="Elegant dining setup for special celebrations"
              className="w-full h-[500px] object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-8 left-8">
              <h1 
                className="text-white mb-2" 
                style={{ fontFamily: "var(--font-display)" }}
              >
                Special Celebrations
              </h1>
              <p className="text-white/90 text-lg">Milestone birthdays, anniversaries, and family reunions</p>
            </div>
          </motion.div>

          {/* Content Grid */}
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {/* Main Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="md:col-span-2"
            >
              <p className="text-xl text-[var(--color-neutral-dark)] mb-8 leading-relaxed">
                Celebrate life's biggest moments in style and comfort. Our exclusive collection of large luxury homes offers everything you need for unforgettable birthdays, anniversaries, and family gatherings. With spacious dining areas, entertainment spaces, and beautiful surroundings, create memories that last a lifetime.
              </p>

              <h3 className="mb-6 flex items-center gap-2" style={{ fontFamily: "var(--font-body)" }}>
                <Sparkles className="w-6 h-6 text-[var(--color-accent-gold)]" />
                What's Included
              </h3>

              <div className="grid md:grid-cols-2 gap-4 mb-8">
                {features.map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                    className="flex items-start gap-3"
                  >
                    <div className="w-6 h-6 rounded-full bg-[var(--color-accent-sage)] bg-opacity-20 flex items-center justify-center flex-shrink-0 mt-1">
                      <Check className="w-4 h-4 text-[var(--color-accent-sage)]" />
                    </div>
                    <p className="text-[var(--color-neutral-dark)]">{feature}</p>
                  </motion.div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  asChild
                  size="lg"
                  className="rounded-2xl px-8 py-6 font-medium transition-all duration-300 hover:scale-[1.02]"
                  style={{
                    background: "var(--color-accent-sage)",
                    color: "white",
                  }}
                >
                  <Link href="/properties">Browse Celebration Houses</Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="rounded-2xl px-8 py-6 font-medium border-2"
                  style={{
                    borderColor: "var(--color-accent-gold)",
                    color: "var(--color-text-primary)",
                  }}
                >
                  <Link href="/contact">Check Availability and Book</Link>
                </Button>
              </div>
            </motion.div>

            {/* Sidebar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="space-y-6"
            >
              <div className="bg-white rounded-2xl p-6 shadow-md">
                <Users className="w-8 h-8 text-[var(--color-accent-sage)] mb-3" />
                <h4 className="font-semibold mb-2">Large Groups</h4>
                <p className="text-sm text-[var(--color-neutral-dark)]">
                  Properties that sleep 10-30 guests comfortably
                </p>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-md">
                <Utensils className="w-8 h-8 text-[var(--color-accent-gold)] mb-3" />
                <h4 className="font-semibold mb-2">Dining Spaces</h4>
                <p className="text-sm text-[var(--color-neutral-dark)]">
                  Large dining areas perfect for celebration meals
                </p>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-md">
                <Calendar className="w-8 h-8 text-[var(--color-accent-sage)] mb-3" />
                <h4 className="font-semibold mb-2">Flexible Stays</h4>
                <p className="text-sm text-[var(--color-neutral-dark)]">
                  Weekend or midweek availability
                </p>
              </div>

              {/* Trust Badge */}
              <div className="bg-gradient-to-br from-[var(--color-accent-sage)] to-[var(--color-accent-gold)] rounded-2xl p-6 text-white">
                <div className="flex items-center gap-2 mb-2">
                  <Star className="w-5 h-5 fill-current" />
                  <Star className="w-5 h-5 fill-current" />
                  <Star className="w-5 h-5 fill-current" />
                  <Star className="w-5 h-5 fill-current" />
                  <Star className="w-5 h-5 fill-current" />
                </div>
                <p className="text-sm font-medium">3,000+ Five Star Reviews</p>
                <p className="text-xs opacity-90 mt-1">Trusted by thousands of celebrators</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-16 bg-white">
        <div className="max-w-[1200px] mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="mb-4" style={{ fontFamily: "var(--font-display)" }}>
              Celebration House Gallery
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {galleryImages.map((image, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="relative h-80 rounded-2xl overflow-hidden group cursor-pointer"
              >
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                  style={{ backgroundImage: `url('${image.url}')` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-[var(--color-bg-primary)]">
        <div className="max-w-[1200px] mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="mb-4" style={{ fontFamily: "var(--font-display)" }}>
              Why Choose Us for Your Celebration
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="w-16 h-16 rounded-full bg-[var(--color-accent-sage)] bg-opacity-10 flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-8 h-8 text-[var(--color-accent-sage)]" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
                  <p className="text-[var(--color-neutral-dark)]">{benefit.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-white">
        <div className="max-w-[1200px] mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="mb-4" style={{ fontFamily: "var(--font-display)" }}>
              Celebration FAQs
            </h2>
            <p className="text-lg text-[var(--color-neutral-dark)] max-w-2xl mx-auto">
              Common questions about booking for special celebrations
            </p>
          </motion.div>

          <div className="max-w-3xl mx-auto space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="bg-[var(--color-bg-primary)] rounded-xl overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full flex items-center justify-between p-6 text-left hover:bg-[var(--color-bg-secondary)] transition-colors"
                >
                  <span className="font-semibold text-[var(--color-text-primary)] pr-4">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-[var(--color-accent-gold)] flex-shrink-0 transition-transform ${
                      openFaq === index ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {openFaq === index && (
                  <div className="px-6 pb-6">
                    <p className="text-[var(--color-neutral-dark)] leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}