"use client";

import { motion } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Heart, Waves, Gamepad2, Sparkles, Check, ChevronDown, Star } from "lucide-react";
import { useState } from "react";
import UKServiceSchema from "@/components/UKServiceSchema";

export default function HenPartyHousesPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const features = [
    "Hot tubs, swimming pools, and games rooms for non-stop fun",
    "Add-on experiences: cocktail masterclass, butlers, life drawing, or pamper spa sessions",
    "Stylish interiors perfect for Instagram-worthy photos",
    "Spacious communal areas for group activities and celebrations",
    "24/7 UK support team for any last-minute requests"
  ];

  const galleryImages = [
    {
      url: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=1600&q=90",
      alt: "Group of women celebrating hen party by hot tub with champagne"
    },
    {
      url: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1600&q=90",
      alt: "Luxury hot tub with champagne glasses for hen celebration"
    },
    {
      url: "https://images.unsplash.com/photo-1540479859555-17af45c78602?w=1600&q=90",
      alt: "Friends celebrating hen party weekend together"
    },
    {
      url: "https://images.unsplash.com/photo-1529636798458-92182e662485?w=1600&q=90",
      alt: "Stylish hen party decorations and celebration setup"
    },
    {
      url: "https://images.unsplash.com/photo-1523438885200-e635ba2c371e?w=1600&q=90",
      alt: "Girls enjoying cocktails at hen party celebration"
    },
    {
      url: "https://images.unsplash.com/photo-1522158637959-30385a09e0da?w=1600&q=90",
      alt: "Group photo of hen party weekend celebration"
    }
  ];

  const benefits = [
    {
      title: "Ultimate Hen Houses",
      description: "Handpicked luxury properties with hot tubs, pools, and party-perfect features",
      icon: Heart
    },
    {
      title: "Add-On Experiences",
      description: "Cocktail classes, spa treatments, butlers, and more to make it unforgettable",
      icon: Sparkles
    }
  ];

  const faqs = [
    {
      question: "Do you really offer a free stay for the bride?",
      answer: "Yes! On all hen party bookings of 10 or more guests, the bride stays completely free. This is automatically applied when you book, making it even more affordable for the whole group."
    },
    {
      question: "What hen party add-ons do you offer?",
      answer: "We offer cocktail masterclasses, butlers in the buff, life drawing sessions, private chefs, spa treatments, and decoration packages. These can all be arranged when you make your booking to create the perfect hen weekend."
    },
    {
      question: "Are your houses suitable for wild hen parties?",
      answer: "Our houses are perfect for fun celebrations, but we do ask guests to respect house rules and neighbours. Many properties are in secluded locations ideal for hen parties. We'll match you with the right house for your group's vibe."
    },
    {
      question: "Can we arrive and leave at flexible times?",
      answer: "Standard check-in is typically 4pm and checkout is 10am, but we can often arrange early arrival or late checkout for an additional fee. Just let us know your requirements when booking."
    },
    {
      question: "How do we split the cost between the group?",
      answer: "We provide a clear breakdown of costs that's easy to share with your group. Many hen parties use apps like Splitwise or collect money in advance. We're happy to take payment from multiple cards if that helps."
    },
    {
      question: "What if someone drops out last minute?",
      answer: "We understand group bookings can be tricky. Contact us as soon as possible if your group size changes. While we can't always offer refunds, we'll work with you to find the best solution."
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
            { name: "Hen Party Houses", url: "/occasions/hen-party-houses" }
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
              src="https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=1600&auto=format&fit=crop"
              alt="Group of women celebrating hen party by hot tub with champagne"
              className="w-full h-[500px] object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-8 left-8">
              <h1 
                className="text-white mb-2" 
                style={{ fontFamily: "var(--font-display)" }}
              >
                Hen Party Houses
              </h1>
              <p className="text-white/90 text-lg">Luxury houses for unforgettable hen weekends</p>
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
                Make it a weekend to remember with our luxury hen party houses across the UK. From chic cottages with hot tubs to countryside manors with pools and games rooms, our properties are designed for laughter, luxury, and making memories with your favourite people.
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
                    <Check className="w-5 h-5 text-[var(--color-accent-sage)] flex-shrink-0 mt-1" />
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
                  <Link href="/properties">Browse Hen Party Houses</Link>
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
                <Waves className="w-8 h-8 text-[var(--color-accent-sage)] mb-3" />
                <h4 className="font-semibold mb-2">Hot Tubs & Pools</h4>
                <p className="text-sm text-[var(--color-neutral-dark)]">
                  Perfect for relaxing and celebrating with the girls
                </p>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-md">
                <Gamepad2 className="w-8 h-8 text-[var(--color-accent-gold)] mb-3" />
                <h4 className="font-semibold mb-2">Games Rooms</h4>
                <p className="text-sm text-[var(--color-neutral-dark)]">
                  Entertainment and fun for the whole group
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
                <p className="text-sm font-medium">Hen Party Specialists</p>
                <p className="text-xs opacity-90 mt-1">Trusted by thousands of hen parties</p>
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
              Hen Party House Gallery
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
                className="relative aspect-[4/3] rounded-2xl overflow-hidden group cursor-pointer"
              >
                <img
                  src={image.url}
                  alt={image.alt}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
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
              Why Book Your Hen Party With Us
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
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
                  <Icon className="w-8 h-8 text-[var(--color-accent-sage)] mx-auto mb-4" />
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
              Hen Party FAQs
            </h2>
            <p className="text-lg text-[var(--color-neutral-dark)] max-w-2xl mx-auto">
              Everything you need to know about booking your hen weekend
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