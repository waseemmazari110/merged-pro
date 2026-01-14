"use client";

import { motion } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import UKServiceSchema from "@/components/UKServiceSchema";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { steps, faqs } from "@/data/how-it-works";

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen">
      <UKServiceSchema 
        type="faq" 
        data={{ faqs }} 
      />
      <UKServiceSchema 
        type="breadcrumb" 
        data={{
          breadcrumbs: [
            { name: "Home", url: "/" },
            { name: "How It Works", url: "/how-it-works" }
          ]
        }}
      />
      <Header />

      {/* Hero */}
      <section className="pt-32 pb-16 bg-gradient-to-br from-[var(--color-bg-primary)] to-[var(--color-bg-secondary)]">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="mb-6" style={{ fontFamily: "var(--font-display)" }}>
                How to Book Your Perfect Hen Weekend
              </h1>
              <p className="text-xl text-[var(--color-neutral-dark)]">
                Booking with Group Escape Houses is simple and transparent. Here's how it works.
              </p>
            </div>
            <div className="relative h-[400px] rounded-2xl overflow-hidden shadow-xl">
              <Image
                src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/wide-photograph-of-diverse-group-of-wome-782e4e08-20251024132157.jpg"
                alt="Women planning hen party weekend together"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 600px"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Steps */}
      <section className="py-24 bg-white">
        <div className="max-w-[1200px] mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
              {steps.map((item, index) => {
                const Icon = item.icon;
                return (
                  <motion.div 
                    key={item.step} 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="text-center group"
                  >
                      <motion.div
                        whileHover={{ scale: 1.1, rotate: index % 2 === 0 ? -5 : 5 }}
                        transition={{ type: "spring", stiffness: 400, damping: 10 }}
                        className="w-32 h-32 rounded-full mx-auto mb-6 flex items-center justify-center shadow-lg transform transition-all duration-300 group-hover:shadow-black/20"
                        style={{
                          background: item.color,
                          color: "white",
                        }}
                      >
                        <Icon className="w-12 h-12" />
                      </motion.div>
                    <h3 className="mb-4 font-semibold text-xl" style={{ fontFamily: "var(--font-body)" }}>
                      {item.title}
                    </h3>
                    <p className="text-[var(--color-neutral-dark)] leading-relaxed">{item.description}</p>
                  </motion.div>
                );
              })}
            </div>
        </div>
      </section>

      {/* Visual Steps Gallery */}
      <section className="py-12 bg-[var(--color-bg-primary)]">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="relative h-[280px] rounded-2xl overflow-hidden shadow-lg">
              <Image
                src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/elegant-luxury-house-exterior-with-hot-t-a1be0c95-20251024132155.jpg"
                alt="Choose your perfect house"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 50vw, 300px"
                loading="lazy"
              />
            </div>
            <div className="relative h-[280px] rounded-2xl overflow-hidden shadow-lg">
              <Image
                src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/group-of-women-friends-doing-cocktail-ma-1a36aa32-20251024132155.jpg"
                alt="Add experiences to your booking"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 50vw, 300px"
                loading="lazy"
              />
            </div>
            <div className="relative h-[280px] rounded-2xl overflow-hidden shadow-lg">
                <Image
                  src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/close-up-of-elegant-hands-holding-credit-36b540a7-20251024132157.jpg"
                  alt="Confirm your booking direct"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 50vw, 300px"
                  loading="lazy"
                />
              </div>
              <div className="relative h-[280px] rounded-2xl overflow-hidden shadow-lg">
                <Image
                  src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/happy-group-of-women-friends-celebrating-8672ffae-20251024132156.jpg"
                  alt="Enjoy your perfect group getaway"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 50vw, 300px"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Detailed Information */}
        <section className="py-24 bg-white">
          <div className="max-w-[1200px] mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-16 items-start">
              <div className="space-y-12">
                <div>
                  <h2 className="mb-6" style={{ fontFamily: "var(--font-display)" }}>
                    Booking & Payment
                  </h2>
                  <div className="space-y-4 text-lg" style={{ color: "var(--color-neutral-dark)" }}>
                    <p>
                      Group Escape Houses is an advertising platform. When you find your perfect property, simply submit an enquiry through our instant enquiry form. This sends your details directly to the property owner.
                    </p>
                    <p>
                      All booking confirmations, payments and contracts are handled directly between you and the property owner. Each owner will have their own preferred payment methods and schedules.
                    </p>
                    <p>
                      Typically, a deposit is required to secure your reservation, with the remaining balance due before arrival. Please clarify these terms directly with the owner during the enquiry process.
                    </p>
                  </div>
                </div>

                <div>
                  <h2 className="mb-6" style={{ fontFamily: "var(--font-display)" }}>
                    Security Deposit
                  </h2>
                  <div className="space-y-4 text-lg" style={{ color: "var(--color-neutral-dark)" }}>
                    <p>
                      Most property owners require a refundable security deposit to cover any potential damage. The amount and handling of this deposit (such as pre-authorisation or bank transfer) is manages directly by the owner.
                    </p>
                    <p>
                      The deposit is usually returned shortly after departure, provided the property is left in good condition. We recommend checking the specific security deposit terms for each property.
                    </p>
                  </div>
                </div>

                <div>
                  <h2 className="mb-6" style={{ fontFamily: "var(--font-display)" }}>
                    Check-In & Check-Out
                  </h2>
                  <div className="space-y-4 text-lg" style={{ color: "var(--color-neutral-dark)" }}>
                    <p>
                      Arrival and departure times are set by the individual property owners. Generally, check-in is from 4pm and check-out is by 10am, but these can vary.
                    </p>
                    <p>
                      The property owner or manager will provide you with detailed check-in instructions and access details once your booking is confirmed and paid in full.
                    </p>
                  </div>
                </div>
              </div>

              <div className="lg:sticky lg:top-32">
                <div className="relative h-[600px] rounded-2xl overflow-hidden shadow-2xl">
                  <Image
                    src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/beautiful-welcome-hamper-with-champagne--433b9f64-20251024132155.jpg"
                    alt="Welcome hamper and luxury amenities"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 600px"
                    loading="lazy"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Policies Section */}
        <section className="py-24 bg-[var(--color-bg-primary)]">
          <div className="max-w-[900px] mx-auto px-6">
            <div className="space-y-12">
              <div>
                <h2 className="mb-6" style={{ fontFamily: "var(--font-display)" }}>
                  Cancellations & Insurance
                </h2>
                <div className="space-y-4 text-lg" style={{ color: "var(--color-neutral-dark)" }}>
                  <p>
                    Cancellation policies vary by property and are set by the individual house owners. You will agree these terms directly with the owner when you book.
                  </p>
                  <p>
                    We strongly recommend taking out group travel insurance to cover unexpected cancellations or changes to your plans.
                  </p>
                </div>
              </div>

              <div>
                <h2 className="mb-6" style={{ fontFamily: "var(--font-display)" }}>
                  House Rules
                </h2>
                <div className="space-y-4 text-lg" style={{ color: "var(--color-neutral-dark)" }}>
                  <p>All properties have specific house rules including:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Maximum occupancy must not be exceeded</li>
                    <li>No smoking inside properties</li>
                    <li>Respect quiet hours (typically 11pm-8am)</li>
                    <li>No parties beyond the booked group size</li>
                    <li>Be considerate of neighbours</li>
                  </ul>
                  <p className="pt-4">
                    Full house rules are provided by the property owner and must be respected throughout your stay.
                  </p>
                </div>
              </div>
            </div>

          <div className="text-center pt-12">
            <Button
              asChild
              size="lg"
              className="rounded-2xl px-10 py-6 text-lg font-medium transition-all duration-200 hover:shadow-xl hover:-translate-y-1"
              style={{
                background: "var(--color-accent-sage)",
                color: "white",
              }}
            >
              <Link href="/properties">Browse Properties</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 bg-white">
        <div className="max-w-[900px] mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="mb-4" style={{ fontFamily: "var(--font-display)" }}>
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-[var(--color-neutral-dark)]">
              Got questions? We've got answers.
            </p>
          </div>
          
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem 
                key={index} 
                value={`item-${index}`}
                className="border border-[var(--color-bg-secondary)] rounded-2xl px-6 data-[state=open]:bg-[var(--color-bg-primary)]"
              >
                <AccordionTrigger 
                  className="text-left hover:no-underline py-6"
                  style={{ 
                    fontFamily: "var(--font-body)",
                    fontWeight: 600,
                    fontSize: "18px",
                    color: "var(--color-text-primary)"
                  }}
                >
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent 
                  className="text-[var(--color-neutral-dark)] pb-6"
                  style={{ fontSize: "16px", lineHeight: "1.7" }}
                >
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          <div className="text-center mt-12">
            <p className="text-lg text-[var(--color-neutral-dark)] mb-6">
              Still have questions?
            </p>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="rounded-2xl px-10 py-6 text-lg font-medium transition-all duration-200 hover:shadow-lg"
              style={{
                borderColor: "var(--color-accent-sage)",
                color: "var(--color-accent-sage)",
              }}
            >
              <Link href="/contact">Get in Touch</Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}