"use client";

import { motion } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PartyPopper, Music, Waves, Sparkles, Check, ChevronDown, Star, Clock } from "lucide-react";
import { useState } from "react";
import UKServiceSchema from "@/components/UKServiceSchema";

export default function NewYearPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const features = [
    "Hot tubs, sound systems, and games rooms for celebration",
    "Optional catering or bar service for your party",
    "Late checkout available for relaxed New Year's Day",
    "Exclusive use properties for private celebrations",
    "Spacious entertaining areas perfect for parties",
    "Beautiful locations for scenic New Year's Day walks"
  ];

  const galleryImages = [
    {
      url: "https://images.unsplash.com/photo-1467810563316-b5476525c0f9?w=1600&q=90",
      alt: "Spectacular New Year's Eve fireworks celebration with champagne"
    },
    {
      url: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=1600&q=90",
      alt: "New Year party celebration with friends toasting"
    },
    {
      url: "https://images.unsplash.com/photo-1482575832494-771f74bf6857?w=1600&q=90",
      alt: "Champagne glasses ready for New Year celebration"
    },
    {
      url: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=1600&q=90",
      alt: "NYE party decorations and celebration setup"
    },
    {
      url: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=1600&q=90",
      alt: "Elegant dining for New Year celebration"
    },
    {
      url: "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?w=1600&q=90",
      alt: "Friends celebrating New Year together"
    }
  ];

  const benefits = [
    {
      title: "Party Perfect",
      description: "Houses with entertainment systems, games rooms, and spaces designed for celebration",
      icon: PartyPopper
    },
    {
      title: "Relax in Style",
      description: "Hot tubs and luxury amenities for the ultimate New Year escape",
      icon: Waves
    },
    {
      title: "Flexible Times",
      description: "Late checkout options so you can enjoy a leisurely New Year's Day",
      icon: Clock
    }
  ];

  const faqs = [
    {
      question: "Can we have a party on New Year's Eve?",
      answer: "Yes! Many of our properties are perfect for celebrations. We do ask that you respect house rules and quiet hours (usually 11pm-midnight extension allowed for NYE). Many houses are in secluded locations ideal for parties."
    },
    {
      question: "Is there a premium for New Year bookings?",
      answer: "New Year's Eve is a premium period, so rates may be higher than standard dates. However, we offer competitive pricing and the cost split between a group makes it excellent value. Get in touch for an exact quote."
    },
    {
      question: "Can you arrange catering or a bar service?",
      answer: "Absolutely! We can arrange everything from canapés and buffets to full party catering and bar service. Many groups also bring their own supplies and use the fully equipped kitchens."
    },
    {
      question: "What about entertainment and music?",
      answer: "Most of our properties have sound systems, and many feature games rooms, hot tubs, and entertainment areas. You're welcome to bring your own entertainment, just keep noise levels respectful after quiet hours."
    },
    {
      question: "Can we do a late checkout on New Year's Day?",
      answer: "We offer late checkout options (usually until 12pm or 2pm) for an additional fee, perfect for recovering from celebrations. This needs to be arranged in advance and depends on property availability."
    },
    {
      question: "How many people can stay at the properties?",
      answer: "Our New Year properties typically accommodate 10-30 guests. We have a range of sizes to suit different group sizes. Contact us to find the perfect house for your celebration."
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
            { name: "New Year", url: "/occasions/new-year" }
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
              src="https://images.unsplash.com/photo-1467810563316-b5476525c0f9?w=1600&auto=format&fit=crop"
              alt="Spectacular New Year's Eve fireworks celebration with champagne"
              className="w-full h-[500px] object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-8 left-8">
              <h1 
                className="text-white mb-2" 
                style={{ fontFamily: "var(--font-display)" }}
              >
                New Year Breaks
              </h1>
              <p className="text-white/90 text-lg">Ring in the new year in luxury and style</p>
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
                Ring in the New Year in total comfort and style with friends and family. Whether you're hosting a party, enjoying a peaceful countryside escape, or celebrating in the city, our luxury homes provide the perfect setting for creating unforgettable New Year memories.
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
                  <Link href="/properties">Browse New Year Houses</Link>
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
                <PartyPopper className="w-8 h-8 text-[var(--color-accent-sage)] mb-3" />
                <h4 className="font-semibold mb-2">Party Ready</h4>
                <p className="text-sm text-[var(--color-neutral-dark)]">
                  Perfect spaces for New Year celebrations
                </p>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-md">
                <Music className="w-8 h-8 text-[var(--color-accent-gold)] mb-3" />
                <h4 className="font-semibold mb-2">Sound Systems</h4>
                <p className="text-sm text-[var(--color-neutral-dark)]">
                  Entertainment systems included
                </p>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-md">
                <Waves className="w-8 h-8 text-[var(--color-accent-sage)] mb-3" />
                <h4 className="font-semibold mb-2">Hot Tubs</h4>
                <p className="text-sm text-[var(--color-neutral-dark)]">
                  Relax and celebrate in style
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
                <p className="text-sm font-medium">Perfect NYE Venues</p>
                <p className="text-xs opacity-90 mt-1">Celebrate in luxury</p>
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
              New Year House Gallery
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
              Why Book Your New Year With Us
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
              New Year FAQs
            </h2>
            <p className="text-lg text-[var(--color-neutral-dark)] max-w-2xl mx-auto">
              Common questions about New Year's Eve bookings
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