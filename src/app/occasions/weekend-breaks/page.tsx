"use client";

import { motion } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Clock, Sparkles, Check, ChevronDown, Star } from "lucide-react";
import { useState } from "react";
import UKServiceSchema from "@/components/UKServiceSchema";

export default function WeekendBreaksPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const features = [
    "2–3 night stay options",
    "Hot tubs and entertainment areas",
    "Add-on activities and local guides",
  ];

  const galleryImages = [
    {
      url: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=1600&q=80",
      alt: "Friends relaxing in countryside hot tub escape"
    },
    {
      url: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1600&q=80",
      alt: "Luxury weekend break cottage with hot tub"
    },
    {
      url: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1600&q=80",
      alt: "Group of friends enjoying weekend getaway"
    },
    {
      url: "https://images.unsplash.com/photo-1523217582562-09d0def993a6?w=1600&q=80",
      alt: "Countryside holiday home for weekend break"
    },
    {
      url: "https://images.unsplash.com/photo-1587061949409-02df41d5e562?w=1600&q=80",
      alt: "Relaxing weekend break in luxury accommodation"
    },
    {
      url: "https://images.unsplash.com/photo-1510798831971-661eb04b3739?w=1600&q=80",
      alt: "Friends toasting during weekend celebration"
    }
  ];

  const faqs = [
    {
      question: "What's the minimum stay for a weekend break?",
      answer: "Most of our properties have a 2-night minimum stay for weekends, with many offering 3-night options Friday to Monday. This gives you plenty of time to relax and enjoy the house and local area."
    },
    {
      question: "Can we book midweek breaks instead of weekends?",
      answer: "Absolutely! Midweek breaks (Monday-Friday) often offer better value and quieter locations. Many properties have flexible check-in days, so you can plan your break to suit your schedule."
    },
    {
      question: "What activities are available during our weekend break?",
      answer: "We can arrange add-on experiences including spa treatments, private chefs, cocktail classes, and local activity guides. Each property also comes with information about nearby attractions, walks, and restaurants."
    },
    {
      question: "Are weekend breaks more expensive than midweek?",
      answer: "Weekend stays are typically priced at a premium compared to midweek rates. However, splitting the cost between your group still makes them excellent value. Contact us for exact pricing for your dates."
    },
    {
      question: "Can we extend our weekend break?",
      answer: "Subject to availability, you can often extend your stay. If you'd like to add extra nights, just let us know when booking or get in touch before your stay and we'll check availability."
    },
    {
      question: "What's included in a weekend break?",
      answer: "All properties come fully equipped with kitchens, linens, towels, and Wi-Fi. Many include hot tubs, games rooms, and entertainment systems. Specific amenities vary by property - check individual listings for full details."
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
            { name: "Weekend Breaks", url: "/occasions/weekend-breaks" }
          ]
        }}
      />
      <Header />

      {/* Hero Section */}
      <section className="pt-32 pb-16 relative">
        <div className="max-w-[1200px] mx-auto px-6">
          {/* Hero Image */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="relative rounded-2xl overflow-hidden shadow-2xl mb-12"
          >
            <img
              src="https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=1600&q=80"
              alt="Friends relaxing in countryside hot tub escape"
              className="w-full h-[500px] object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-8 left-8">
              <h1 
                className="text-white mb-2" 
                style={{ fontFamily: "var(--font-display)" }}
              >
                Weekend Breaks
              </h1>
              <p className="text-white/90 text-lg">Short luxury getaways for rest and celebration</p>
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
                Take a well-deserved break with a weekend away. From countryside manors to coastal retreats, our properties offer everything you need for rest, celebration, or adventure.
              </p>

              <h3 className="mb-6 flex items-center gap-2" style={{ fontFamily: "var(--font-body)" }}>
                <Sparkles className="w-6 h-6 text-[var(--color-accent-gold)]" />
                What's Included
              </h3>

              <div className="space-y-4 mb-8">
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
                  <Link href="/properties">Browse Houses</Link>
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

            {/* Sidebar Icons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="space-y-6"
            >
              <div className="bg-white rounded-2xl p-6 shadow-md">
                <Calendar className="w-8 h-8 text-[var(--color-accent-sage)] mb-3" />
                <h4 className="font-semibold mb-2">Short Stays</h4>
                <p className="text-sm text-[var(--color-neutral-dark)]">
                  2-3 night break options available
                </p>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-md">
                <Clock className="w-8 h-8 text-[var(--color-accent-gold)] mb-3" />
                <h4 className="font-semibold mb-2">Flexible Booking</h4>
                <p className="text-sm text-[var(--color-neutral-dark)]">
                  Late checkout and flexible dates
                </p>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-md">
                <MapPin className="w-8 h-8 text-[var(--color-accent-sage)] mb-3" />
                <h4 className="font-semibold mb-2">UK Locations</h4>
                <p className="text-sm text-[var(--color-neutral-dark)]">
                  Coastal and countryside retreats
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
                <p className="text-sm font-medium">Perfect Weekend Escapes</p>
                <p className="text-xs opacity-90 mt-1">Trusted by weekend breakers</p>
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
              Weekend Break Gallery
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

      {/* FAQ Section */}
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
              Weekend Break FAQs
            </h2>
            <p className="text-lg text-[var(--color-neutral-dark)] max-w-2xl mx-auto">
              Common questions about short stay bookings
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
                className="bg-white rounded-xl overflow-hidden"
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