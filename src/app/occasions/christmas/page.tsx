"use client";

import { motion } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { TreePine, Flame, ChefHat, Sparkles, Check, ChevronDown, Star, Gift } from "lucide-react";
import { useState } from "react";
import UKServiceSchema from "@/components/UKServiceSchema";

export default function ChristmasPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const features = [
    "Fully equipped kitchens and large dining areas for festive feasts",
    "Optional tree delivery and decoration services",
    "Winter activity and catering packages available",
    "Cosy log fires and heating for ultimate winter comfort",
    "Beautiful countryside locations for winter walks",
    "Flexible arrival dates for Christmas and New Year stays"
  ];

  const galleryImages = [
    {
      url: "https://images.unsplash.com/photo-1576919228236-a097c32a5cd4?w=1600&q=90",
      alt: "Festive Christmas dining table with family gathering"
    },
    {
      url: "https://images.unsplash.com/photo-1512389142860-9c449e58a543?w=1600&q=90",
      alt: "Cosy log fire with Christmas stockings"
    },
    {
      url: "https://images.unsplash.com/photo-1543589077-47d81606c1bf?w=1600&q=90",
      alt: "Decorated Christmas tree in luxury living room"
    },
    {
      url: "https://images.unsplash.com/photo-1482517967863-00e15c9b44be?w=1600&q=90",
      alt: "Snowy countryside house with festive lights"
    },
    {
      url: "https://images.unsplash.com/photo-1608588563989-e937d76838f9?w=1600&q=90",
      alt: "Christmas dinner spread on elegant table"
    },
    {
      url: "https://images.unsplash.com/photo-1545048702-79362596cdc9?w=1600&q=90",
      alt: "Family gathered around fireplace at Christmas"
    }
  ];

  const benefits = [
    {
      title: "Magical Settings",
      description: "Cosy cottages and grand manors perfect for festive family gatherings",
      icon: TreePine
    },
    {
      title: "Fully Equipped",
      description: "Large kitchens, dining tables, and everything needed for Christmas cooking",
      icon: ChefHat
    },
    {
      title: "Extra Services",
      description: "Tree delivery, decoration packages, and Christmas catering available",
      icon: Gift
    }
  ];

  const faqs = [
    {
      question: "Can you deliver and decorate a Christmas tree?",
      answer: "Yes! We offer Christmas tree delivery and decoration services for many of our properties. We can provide a beautifully decorated tree ready for your arrival, or a plain tree if you prefer to decorate it yourselves as part of the festive fun."
    },
    {
      question: "What about Christmas Day catering?",
      answer: "We can arrange everything from prepared Christmas dinner delivery to private chefs who'll cook the full festive feast in your house. We also work with local caterers for Boxing Day and other meals during your stay."
    },
    {
      question: "Are the houses warm enough for winter?",
      answer: "Absolutely! All our properties have central heating, and many feature log fires or wood burners for extra cosiness. We ensure houses are warm and welcoming for your Christmas celebration."
    },
    {
      question: "Can we arrive on Christmas Eve?",
      answer: "Yes, we offer flexible arrival dates including Christmas Eve check-ins. Many families prefer to arrive early to settle in and enjoy Christmas morning together in the house."
    },
    {
      question: "What if it snows and we can't travel?",
      answer: "We understand winter weather can be unpredictable. Our cancellation policy is flexible, and we'll work with you if severe weather prevents travel. We recommend taking out travel insurance for complete peace of mind."
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
            { name: "Christmas", url: "/occasions/christmas" }
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
              src="https://images.unsplash.com/photo-1576919228236-a097c32a5cd4?w=1600&auto=format&fit=crop"
              alt="Festive Christmas dining table with decorations and family gathering"
              className="w-full h-[500px] object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-8 left-8">
              <h1 
                className="text-white mb-2" 
                style={{ fontFamily: "var(--font-display)" }}
              >
                Christmas Houses
              </h1>
              <p className="text-white/90 text-lg">Magical festive stays for the whole family</p>
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
                Experience a Christmas to remember in one of our luxury festive homes. Perfect for families and groups, our properties offer cosy fires, large dining rooms, and magical surroundings for your Christmas celebration. Create traditions and memories in your home away from home this festive season.
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
                  <Link href="/properties">Browse Christmas Houses</Link>
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
                <Flame className="w-8 h-8 text-[var(--color-accent-sage)] mb-3" />
                <h4 className="font-semibold mb-2">Cosy Fires</h4>
                <p className="text-sm text-[var(--color-neutral-dark)]">
                  Open fires for magical winter warmth
                </p>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-md">
                <TreePine className="w-8 h-8 text-[var(--color-accent-gold)] mb-3" />
                <h4 className="font-semibold mb-2">Tree Delivery</h4>
                <p className="text-sm text-[var(--color-neutral-dark)]">
                  Optional decoration service available
                </p>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-md">
                <ChefHat className="w-8 h-8 text-[var(--color-accent-sage)] mb-3" />
                <h4 className="font-semibold mb-2">Catering Options</h4>
                <p className="text-sm text-[var(--color-neutral-dark)]">
                  Christmas meal packages available
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
                <p className="text-sm font-medium">Magical Christmas Stays</p>
                <p className="text-xs opacity-90 mt-1">Trusted by festive families</p>
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
              Christmas House Gallery
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
              Why Spend Christmas With Us
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
              Christmas FAQs
            </h2>
            <p className="text-lg text-[var(--color-neutral-dark)] max-w-2xl mx-auto">
              Everything you need to know about Christmas bookings
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