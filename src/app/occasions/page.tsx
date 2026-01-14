"use client";

import { motion } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import UKServiceSchema from "@/components/UKServiceSchema";
import Link from "next/link";
import { 
  Sparkles, 
  Heart, 
  Church, 
  TreePine, 
  PartyPopper, 
  Egg,
  Calendar,
  ArrowRight,
  ChevronDown,
  Star,
  Users,
  Home
} from "lucide-react";
import { useState } from "react";

export default function OccasionsPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const occasions = [
    {
      title: "Special Celebrations",
      slug: "special-celebrations",
      icon: Sparkles,
      description: "Birthdays, anniversaries, and milestone moments",
      image: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=800&auto=format&fit=crop",
      color: "#89A38F"
    },
    {
      title: "Hen Party Houses",
      slug: "hen-party-houses",
      icon: Heart,
      description: "Luxury houses perfect for hen weekends",
      image: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800&auto=format&fit=crop",
      color: "#89A38F"
    },
    {
      title: "Weddings",
      slug: "weddings",
      icon: Church,
      description: "Intimate ceremonies and weekend celebrations",
      image: "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&auto=format&fit=crop",
      color: "#C6A76D"
    },
    {
      title: "Christmas",
      slug: "christmas",
      icon: TreePine,
      description: "Festive stays and family gatherings",
      image: "https://images.unsplash.com/photo-1576919228236-a097c32a5cd4?w=800&auto=format&fit=crop",
      color: "#89A38F"
    },
    {
      title: "New Year",
      slug: "new-year",
      icon: PartyPopper,
      description: "Ring in the New Year in style",
      image: "https://images.unsplash.com/photo-1467810563316-b5476525c0f9?w=800&auto=format&fit=crop",
      color: "#89A38F"
    },
    {
      title: "Easter",
      slug: "easter",
      icon: Egg,
      description: "Springtime family escapes",
      image: "https://images.unsplash.com/photo-1585060544812-6b45742d762f?w=800&auto=format&fit=crop",
      color: "#C6A76D"
    },
    {
      title: "Weekend Breaks",
      slug: "weekend-breaks",
      icon: Calendar,
      description: "Short luxury getaways",
      image: "https://images.unsplash.com/photo-1602343168117-bb8ffe3e2e9f?w=800&auto=format&fit=crop",
      color: "#89A38F"
    },
  ];

  const faqs = [
    {
      question: "What types of occasions do you cater for?",
      answer: "We specialise in all types of celebrations including hen parties, weddings, birthdays, anniversaries, Christmas, New Year, Easter, and weekend breaks. Our luxury houses are perfect for groups of 10-30 guests looking for an unforgettable experience."
    },
    {
      question: "Can I book add-on experiences for my occasion?",
      answer: "Absolutely! We offer a range of add-on experiences including cocktail masterclasses, butlers in the buff, life drawing sessions, private chefs, spa treatments, and decorations. These can be arranged when you make your booking."
    },
    {
      question: "Do you offer special rates for occasion bookings?",
      answer: "Yes, we have special offers including free stays for the bride on hen party bookings of 10+ guests. We also offer competitive weekend and midweek rates for all occasions. Contact us for a tailored quote."
    },
    {
      question: "What's included in the house rental?",
      answer: "All our properties come fully equipped with modern kitchens, spacious living areas, comfortable bedrooms, and luxury bathrooms. Many feature hot tubs, pools, games rooms, and beautiful grounds. Specific amenities vary by property."
    },
    {
      question: "How far in advance should I book for my occasion?",
      answer: "We recommend booking 6-12 months in advance for popular dates like Christmas, New Year, and summer weekends. However, we often have last-minute availability, so it's always worth checking with us."
    }
  ];

  return (
    <div className="min-h-screen bg-[var(--color-bg-primary)]">
      <UKServiceSchema 
        type="breadcrumb" 
        data={{
          breadcrumbs: [
            { name: "Home", url: "/" },
            { name: "Occasions", url: "/occasions" }
          ]
        }}
      />
      <Header />

      {/* Hero Section */}
      <section className="relative pt-24 pb-32 overflow-hidden">
        {/* Background with overlay */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=1600&auto=format&fit=crop"
            alt="Luxury celebration gathering"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#1F2937]/80 to-[#1F2937]/40"></div>
        </div>

        <div className="relative max-w-[1200px] mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl"
          >
            <h1 
              className="mb-6 text-white" 
              style={{ fontFamily: "var(--font-display)" }}
            >
              Luxury Houses for Every Occasion
            </h1>
            
            <p className="text-xl text-white/90 mb-8 leading-relaxed">
              Discover our collection of luxury houses for every special moment. Whether you're celebrating a milestone, hosting a hen weekend, or enjoying a festive break, our properties are designed for unforgettable experiences in the UK's most beautiful locations.
            </p>

            {/* Trust Badges */}
            <div className="flex flex-wrap gap-6 mb-8">
              <div className="flex items-center gap-2 text-white">
                <Star className="w-5 h-5 text-[var(--color-accent-gold)]" />
                <span className="font-semibold">3,000+ 5★ Reviews</span>
              </div>
              <div className="flex items-center gap-2 text-white">
                <Home className="w-5 h-5 text-[var(--color-accent-gold)]" />
                <span className="font-semibold">500+ Luxury Houses</span>
              </div>
              <div className="flex items-center gap-2 text-white">
                <Users className="w-5 h-5 text-[var(--color-accent-gold)]" />
                <span className="font-semibold">24/7 UK Support</span>
              </div>
            </div>

            <Link
              href="/properties"
              className="inline-flex items-center gap-2 px-8 py-4 bg-[var(--color-accent-sage)] text-white rounded-2xl font-semibold hover:bg-[var(--color-accent-gold)] transition-all duration-300 hover:scale-105"
            >
              Browse All Properties
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Occasions Grid */}
      <section className="py-20 bg-white">
        <div className="max-w-[1200px] mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="mb-4" style={{ fontFamily: "var(--font-display)" }}>
              Find Your Perfect Occasion
            </h2>
            <p className="text-lg text-[var(--color-neutral-dark)] max-w-2xl mx-auto">
              From intimate celebrations to grand gatherings, we have the perfect house for your special event
            </p>
          </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {occasions.map((occasion, index) => {
                const Icon = occasion.icon;
                return (
                  <motion.div
                    key={occasion.slug}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <Link
                      href={`/${occasion.slug}`}
                      className="group block rounded-2xl overflow-hidden bg-white shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
                    >
                    {/* Image */}
                    <div className="relative h-64 overflow-hidden">
                      <img
                        src={occasion.image}
                        alt={occasion.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                      
                      {/* Icon Badge */}
                      <div 
                        className="absolute top-4 right-4 w-12 h-12 rounded-full flex items-center justify-center shadow-lg"
                        style={{ backgroundColor: occasion.color }}
                      >
                        <Icon className="w-6 h-6 text-white" />
                      </div>

                      {/* Title Overlay */}
                      <div className="absolute bottom-0 left-0 right-0 p-6">
                        <h3 className="text-white font-bold text-2xl mb-1">
                          {occasion.title}
                        </h3>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <p className="text-[var(--color-neutral-dark)] mb-4">
                        {occasion.description}
                      </p>
                      <div className="flex items-center gap-2 text-[var(--color-accent-sage)] font-semibold group-hover:gap-3 transition-all">
                        Explore Houses
                        <ArrowRight className="w-5 h-5" />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Banner */}
      <section className="py-16 bg-[var(--color-bg-secondary)]">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-12 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="group"
            >
              <motion.div 
                whileHover={{ scale: 1.1, rotate: -5 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
                className="w-20 h-20 rounded-full bg-[#96AD94] flex items-center justify-center mx-auto mb-6 shadow-lg transform transition-all duration-300 group-hover:shadow-[#96AD94]/40"
              >
                <Home className="w-10 h-10 text-white" />
              </motion.div>
              <h3 className="font-semibold text-xl mb-3" style={{ fontFamily: "var(--font-display)" }}>Luxury Properties</h3>
              <p className="text-[var(--color-neutral-dark)] leading-relaxed">
                Hand-picked houses with hot tubs, pools, and unique features
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="group"
            >
              <motion.div 
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
                className="w-20 h-20 rounded-full bg-[#C6A76D] flex items-center justify-center mx-auto mb-6 shadow-lg transform transition-all duration-300 group-hover:shadow-[#C6A76D]/40"
              >
                <Users className="w-10 h-10 text-white" />
              </motion.div>
              <h3 className="font-semibold text-xl mb-3" style={{ fontFamily: "var(--font-display)" }}>Group Friendly</h3>
              <p className="text-[var(--color-neutral-dark)] leading-relaxed">
                Perfect for groups of 10-30 guests with spacious layouts
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="group"
            >
              <motion.div 
                whileHover={{ scale: 1.1, rotate: -5 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
                className="w-20 h-20 rounded-full bg-[#96AD94] flex items-center justify-center mx-auto mb-6 shadow-lg transform transition-all duration-300 group-hover:shadow-[#96AD94]/40"
              >
                <Star className="w-10 h-10 text-white" />
              </motion.div>
              <h3 className="font-semibold text-xl mb-3" style={{ fontFamily: "var(--font-display)" }}>Add-On Experiences</h3>
              <p className="text-[var(--color-neutral-dark)] leading-relaxed">
                Cocktail classes, private chefs, spa treatments, and more
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white">
        <div className="max-w-[1200px] mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="mb-4" style={{ fontFamily: "var(--font-display)" }}>
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-[var(--color-neutral-dark)] max-w-2xl mx-auto">
              Everything you need to know about booking for your special occasion
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