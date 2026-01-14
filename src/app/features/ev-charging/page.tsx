"use client";

import Link from "next/link";
import { Check, ArrowRight, Zap, Leaf, Car, ChevronDown } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import UKServiceSchema from "@/components/UKServiceSchema";

export default function EVChargingPage() {
  const highlights = [
    "On-site electric vehicle charging points",
    "Perfect for eco-conscious travellers",
    "Charge overnight during your stay",
    "Various charging speeds available",
    "Future-ready accommodation"
  ];

  const galleryImages = [
    {
      url: "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=1600&q=90",
      alt: "Electric car charging at luxury property"
    },
    {
      url: "https://images.unsplash.com/photo-1617788138017-80ad40651399?w=1600&q=90",
      alt: "EV charging station at holiday home"
    },
    {
      url: "https://images.unsplash.com/photo-1614030424754-24d0eebd46b2?w=1600&q=90",
      alt: "Tesla charging at countryside property"
    },
    {
      url: "https://images.unsplash.com/photo-1609273772118-85d7c4c7d71e?w=1600&q=90",
      alt: "Electric vehicle charging point installation"
    },
    {
      url: "https://images.unsplash.com/photo-1593941707874-ef25b8b4a92b?w=1600&q=90",
      alt: "Modern electric car at luxury accommodation"
    },
    {
      url: "https://images.unsplash.com/photo-1612544409025-abd4e4b4e0c7?w=1600&q=90",
      alt: "EV charging overnight at holiday property"
    }
  ];

  const faqs = [
    {
      question: "What type of EV charging is available?",
      answer: "Most properties offer Type 2 charging points, which are compatible with the majority of electric vehicles in the UK. Charging speeds vary by property, with options ranging from 7kW to 22kW chargers. Check individual property listings for specific details."
    },
    {
      question: "Is EV charging included in the rental price?",
      answer: "Charging policies vary by property. Some include electricity costs in the rental price, while others may charge separately for EV charging. All charging costs and policies are clearly stated on each property listing."
    },
    {
      question: "Do I need to bring my own charging cable?",
      answer: "Yes, we recommend bringing your own charging cable to ensure compatibility with your specific vehicle. Most properties have standard Type 2 sockets, but bringing your cable guarantees a perfect fit."
    },
    {
      question: "How long does it take to fully charge an electric vehicle?",
      answer: "Charging times depend on your vehicle's battery size and the charging speed available. Typically, a 7kW charger can fully charge most EVs overnight (8-10 hours), while faster 22kW chargers can reduce this to 3-4 hours."
    },
    {
      question: "Can multiple vehicles be charged simultaneously?",
      answer: "This depends on the property. Some larger properties have multiple charging points. Check the property listing or contact us to confirm if multiple charging points are available for your group."
    },
    {
      question: "What should I do if the charging point isn't working?",
      answer: "Contact the property owner immediately through the details provided in your booking confirmation. They will assist you with troubleshooting or arrange alternative charging solutions nearby."
    }
  ];

  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  return (
    <div className="min-h-screen">
      <UKServiceSchema
        type="breadcrumb"
        data={{
          breadcrumbs: [
            { name: "Home", url: "/" },
            { name: "Features", url: "/house-styles-and-features" },
            { name: "EV Charging", url: "/features/ev-charging" }
          ]
        }}
      />
      <Header />
      
      {/* Hero Section */}
      <section className="relative h-[70vh] min-h-[500px] flex items-center justify-center">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=1600&q=90')",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-black/60 to-black/40"></div>
        </div>
        
        <div className="relative z-10 max-w-[1200px] mx-auto px-6 text-center text-white">
          <nav className="flex justify-center gap-2 text-sm mb-6 text-white">
            <Link href="/" className="hover:underline text-white">Home</Link>
            <span className="text-white">/</span>
            <Link href="/house-styles-and-features" className="hover:underline text-white">Features</Link>
            <span className="text-white">/</span>
            <span className="text-white">EV Charging</span>
          </nav>
          
          <h1 className="mb-6 text-white" style={{ fontFamily: "var(--font-display)" }}>
            Properties with EV Charging
          </h1>
          <p className="text-xl max-w-3xl mx-auto text-white">
            Eco-friendly stays with electric vehicle charging points
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-24 bg-white">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <div>
              <h2 className="mb-6" style={{ fontFamily: "var(--font-display)" }}>
                Houses with Electric Vehicle Charging
              </h2>
              <p className="text-lg text-[var(--color-neutral-dark)] mb-8 leading-relaxed">
                Travel sustainably with properties featuring on-site EV charging points. Perfect for eco-conscious groups, these forward-thinking accommodations ensure you can charge your electric vehicle overnight, making your celebration both luxurious and environmentally responsible.
              </p>

              <h3 className="text-2xl font-semibold mb-4" style={{ fontFamily: "var(--font-body)" }}>
                What to Expect
              </h3>
              <ul className="space-y-3 mb-8">
                {highlights.map((highlight, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <Check className="w-6 h-6 text-[var(--color-accent-gold)] flex-shrink-0 mt-0.5" />
                    <span className="text-[var(--color-neutral-dark)]">{highlight}</span>
                  </li>
                ))}
              </ul>

              <Button
                asChild
                size="lg"
                className="rounded-2xl px-10 py-6 text-white font-medium transition-all duration-200 hover:shadow-lg"
                style={{ background: "var(--color-accent-gold)" }}
              >
                <Link href="/properties">
                  Browse Properties
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
            </div>

            <div className="space-y-6">
              <div className="bg-[var(--color-bg-primary)] rounded-2xl p-8">
                <Zap className="w-12 h-12 text-[var(--color-accent-gold)] mb-4" />
                <h3 className="text-3xl font-bold mb-2" style={{ fontFamily: "var(--font-display)" }}>
                  Fast Charging
                </h3>
                <p className="text-[var(--color-neutral-dark)]">
                  On-site charging points for convenient overnight charging
                </p>
              </div>

              <div className="bg-[var(--color-bg-primary)] rounded-2xl p-8">
                <Leaf className="w-12 h-12 text-[var(--color-accent-sage)] mb-4" />
                <h3 className="text-3xl font-bold mb-2" style={{ fontFamily: "var(--font-display)" }}>
                  Eco-Friendly
                </h3>
                <p className="text-[var(--color-neutral-dark)]">
                  Sustainable travel options for environmentally conscious groups
                </p>
              </div>

              <div className="bg-[var(--color-bg-primary)] rounded-2xl p-8">
                <Car className="w-12 h-12 text-[var(--color-accent-gold)] mb-4" />
                <h3 className="text-3xl font-bold mb-2" style={{ fontFamily: "var(--font-display)" }}>
                  Convenient
                </h3>
                <p className="text-[var(--color-neutral-dark)]">
                  Charge while you celebrate, ready for your journey home
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-24 bg-[var(--color-bg-primary)]">
        <div className="max-w-[1200px] mx-auto px-6">
          <h2 className="text-center mb-12" style={{ fontFamily: "var(--font-display)" }}>
            EV Charging Gallery
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {galleryImages.map((image, index) => (
              <div
                key={index}
                className="relative h-80 rounded-2xl overflow-hidden group cursor-pointer"
              >
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                  style={{ backgroundImage: `url('${image.url}')` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 bg-white">
        <div className="max-w-[900px] mx-auto px-6">
          <h2 className="text-center mb-12" style={{ fontFamily: "var(--font-display)" }}>
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="border border-[var(--color-border)] rounded-2xl overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaqIndex(openFaqIndex === index ? null : index)}
                  className="w-full flex items-center justify-between p-6 text-left hover:bg-[var(--color-bg-primary)] transition-colors"
                >
                  <span className="font-semibold text-lg pr-8">{faq.question}</span>
                  <ChevronDown
                    className={`w-5 h-5 flex-shrink-0 transition-transform duration-200 ${
                      openFaqIndex === index ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {openFaqIndex === index && (
                  <div className="px-6 pb-6 text-[var(--color-neutral-dark)] leading-relaxed">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}