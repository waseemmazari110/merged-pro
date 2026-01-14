"use client";

import { motion } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Church, Camera, Utensils, Sparkles, Check, ChevronDown, Star, Users } from "lucide-react";
import { useState } from "react";
import Image from "next/image";
import UKServiceSchema from "@/components/UKServiceSchema";

  export default function WeddingsPage() {
    const [openFaq, setOpenFaq] = useState<number | null>(null);

    const features = [
      "Large houses with enough bedrooms for all your wedding guests",
      "Exclusive use of the house and grounds for your entire stay",
      "No corkage fees – bring your own drinks and save on costs",
      "Choice of ceremony locations, both on-site and nearby",
      "Beautiful spaces for your reception and wedding breakfast",
      "Option to extend your stay for a full wedding weekend"
    ];

    const galleryImages = [
      {
        url: "https://images.unsplash.com/photo-1519741497674-611481863552?w=1600&auto=format&fit=crop",
        alt: "Beautiful outdoor wedding ceremony"
      },
      {
        url: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=1600&auto=format&fit=crop",
        alt: "Elegant wedding reception table setting"
      },
      {
        url: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=1600&auto=format&fit=crop",
        alt: "Wedding celebration with decorations"
      },
      {
        url: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=1600&auto=format&fit=crop",
        alt: "Stunning venue for your special day"
      },
      {
        url: "https://images.unsplash.com/photo-1544161442-e3db36c4f67c?w=1600&auto=format&fit=crop",
        alt: "Intimate wedding dinner atmosphere"
      },
      {
        url: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=1600&auto=format&fit=crop",
        alt: "Magic wedding moments in the garden"
      }
    ];

    const benefits = [
      {
        title: "Exclusive Privacy",
        description: "Enjoy your special day in total privacy with exclusive use of the entire house and grounds.",
        icon: Sparkles
      },
      {
        title: "Guest Accommodation",
        description: "With enough rooms for family and friends, everyone can stay together under one roof.",
        icon: Users
      },
      {
        title: "Bespoke Freedom",
        description: "From catering to decor, you have the freedom to design your wedding exactly as you want.",
        icon: Utensils
      }
    ];

    const faqs = [
      {
        question: "Are your houses licensed for wedding ceremonies?",
        answer: "Many of our houses hold wedding licenses for civil ceremonies. Those that don't are often located very close to local churches or registry offices. Please check the individual property details or contact us for specific information."
      },
      {
        question: "Do you offer on-site catering for weddings?",
        answer: "Usually, we offer a 'blank canvas' where you can bring in your own caterers. However, we have a list of recommended local suppliers who know our properties well and can provide anything from formal dining to casual BBQs."
      },
      {
        question: "Is there a minimum stay for wedding bookings?",
        answer: "Most of our wedding houses have a minimum 2 or 3-night stay, typically over a weekend (Friday to Monday). This allows you plenty of time to set up, celebrate, and relax without any rush."
      },
      {
        question: "Can we have a marquee in the grounds?",
        answer: "Many of our properties have large gardens suitable for marquees, allowing you to accommodate even more guests for your reception. Please check the property's individual grounds capacity."
      },
      {
        question: "Is there enough parking for all our wedding guests?",
        answer: "Our large houses typically offer ample on-site parking for staying guests. If you have many additional day guests arriving, we can advise on local parking options or transport arrangements like shuttle buses."
      },
      {
        question: "Can you help with wedding planning?",
        answer: "While we provide the venue, we have excellent relationships with local wedding planners and suppliers. We're happy to share our recommendations to help you coordinate your perfect celebration."
      }
    ];

    return (
    <div className="min-h-screen bg-[var(--color-bg-primary)]">
      <title>Wedding Venues with Accommodation | Group Escape Houses</title>
      <meta name="description" content="Discover stunning wedding venues with accommodation across the UK. Perfect for intimate celebrations, ceremonies, and full-weekend group wedding stays." />
      <UKServiceSchema
        type="breadcrumb"
        data={{
          breadcrumbs: [
            { name: "Home", url: "/" },
            { name: "Occasions", url: "/occasions" },
            { name: "Weddings", url: "/occasions/weddings" }
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
            <Image
              src="https://images.unsplash.com/photo-1519741497674-611481863552?w=1600&auto=format&fit=crop"
              alt="Beautiful outdoor wedding ceremony in elegant garden setting"
              width={1600}
              height={500}
              className="w-full h-[500px] object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-8 left-8">
                <h1 
                  className="text-white mb-2" 
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  Wedding Venues with Accommodation
                </h1>

              <p className="text-white/90 text-lg">Intimate venues for unforgettable celebrations</p>
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
                Celebrate your special day in a setting that's truly yours. Our wedding houses offer elegant backdrops for intimate ceremonies, receptions, and full-weekend celebrations surrounded by family and friends. From countryside manors to coastal retreats, create memories in your perfect wedding venue.
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
                  <Link href="/properties">Browse Wedding Venues</Link>
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
                <Camera className="w-8 h-8 text-[var(--color-accent-sage)] mb-3" />
                <h4 className="font-semibold mb-2">Beautiful Grounds</h4>
                <p className="text-sm text-[var(--color-neutral-dark)]">
                  Photo-perfect backdrops for your special day
                </p>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-md">
                <Church className="w-8 h-8 text-[var(--color-accent-gold)] mb-3" />
                <h4 className="font-semibold mb-2">Ceremony Options</h4>
                <p className="text-sm text-[var(--color-neutral-dark)]">
                  On-site or nearby venues available
                </p>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-md">
                <Utensils className="w-8 h-8 text-[var(--color-accent-sage)] mb-3" />
                <h4 className="font-semibold mb-2">Catering Packages</h4>
                <p className="text-sm text-[var(--color-neutral-dark)]">
                  Full service available for your celebration
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
                <p className="text-sm font-medium">Perfect Wedding Venues</p>
                <p className="text-xs opacity-90 mt-1">Trusted by hundreds of couples</p>
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
              Wedding Venue Gallery
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
                <Image
                  src={image.url}
                  alt={image.alt}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
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
              Why Choose Our Wedding Houses
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
                  className="text-center group"
                >
                  <motion.div 
                    whileHover={{ scale: 1.1, rotate: index % 2 === 0 ? -5 : 5 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg transform transition-all duration-300"
                    style={{ 
                      backgroundColor: index === 0 ? '#96AD94' : index === 1 ? '#C6A76D' : '#E5989B'
                    }}
                  >
                    <Icon className="w-10 h-10 text-white" />
                  </motion.div>
                  <h3 className="text-xl font-semibold mb-3" style={{ fontFamily: "var(--font-display)" }}>{benefit.title}</h3>
                  <p className="text-[var(--color-neutral-dark)] leading-relaxed">{benefit.description}</p>
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
              Wedding FAQs
            </h2>
            <p className="text-lg text-[var(--color-neutral-dark)] max-w-2xl mx-auto">
              Common questions about booking wedding venues
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