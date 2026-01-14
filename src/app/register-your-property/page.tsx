"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { 
  Check, 
  ArrowRight, 
  Plus, 
  Minus,
  MessageSquare,
  CreditCard,
  BarChart3,
  ShieldCheck,
  Calendar,
  Sparkles,
  Download
} from "lucide-react";
import { useState } from "react";

const faqs = [
  {
    question: "Do you take bookings?",
    answer: "No. Every enquiry goes directly to you, the property owner. Bookings happen on your own website or via your preferred booking system. We do not sit in the middle of the transaction."
  },
  {
    question: "Can I sync my calendar?",
    answer: "Yes, via iCal. You can sync your Escape Houses calendar with Airbnb, Booking.com, VRBO, or any other platform that supports iCal, ensuring your availability is always up to date."
  },
  {
    question: "What happens after payment?",
    answer: "You will get immediate access to your property owner dashboard. From there, you can complete your property listing, upload photos, and set your preferences. Our team is also on hand to help with onboarding."
  },
  {
    question: "Can I upgrade later?",
    answer: "Yes, you can upgrade your plan at any time through your billing settings in the dashboard. The price difference will be calculated automatically."
  }
];

export default function RegisterYourProperty() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="pt-24">
        {/* Hero Section */}
        <section className="relative h-[600px] w-full overflow-hidden">
          <Image
            src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/luxurious-large-group-holiday-property-e-77c8a93c-20251127181030.jpg"
            alt="Luxury large group holiday property"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/40"></div>
          
          <div className="absolute inset-0 flex items-center">
            <div className="max-w-[1200px] mx-auto px-6 w-full text-center">
              <h1 className="text-5xl lg:text-7xl font-bold mb-6 text-white" style={{ fontFamily: "var(--font-display)", textShadow: "0 2px 4px rgba(0,0,0,0.3)" }}>
                Register Your Property
              </h1>
              <p className="text-xl lg:text-2xl text-white max-w-3xl mx-auto mb-10 leading-relaxed" style={{ textShadow: "0 2px 4px rgba(0,0,0,0.3)" }}>
                List your luxury group property, reach high-intent guests, and manage your enquiries with zero commission.
              </p>
              
              <div className="flex flex-wrap justify-center gap-4">
                <Button 
                  asChild
                  size="lg"
                  className="rounded-2xl px-10 py-6 text-lg font-semibold text-white shadow-lg hover:shadow-xl transition-all"
                  style={{ background: "var(--color-accent-sage)" }}
                >
                  <Link href="/owner-sign-up">
                    Register Now
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Link>
                </Button>

                <Button 
                  asChild
                  size="lg"
                  variant="outline"
                  className="rounded-2xl px-10 py-6 text-lg font-semibold bg-white/95 hover:bg-white border-0 text-[var(--color-text-primary)]"
                >
                  <a 
                    href="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/owners-guide.pdf" 
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View Owners Guide
                    <Download className="w-5 h-5 ml-2" />
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* 3 Step Strip */}
        <section className="py-16 bg-white border-y border-gray-100">
          <div className="max-w-[1200px] mx-auto px-6">
            <div className="grid md:grid-cols-3 gap-12">
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-[var(--color-accent-sage)] text-white flex items-center justify-center text-xl font-bold mx-auto mb-4">1</div>
                <h3 className="text-xl font-bold mb-2">Sign Up</h3>
                <p className="text-[var(--color-neutral-dark)]">Create your owner account in seconds.</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-[var(--color-accent-sage)] text-white flex items-center justify-center text-xl font-bold mx-auto mb-4">2</div>
                <h3 className="text-xl font-bold mb-2">Choose Plan & Pay</h3>
                <p className="text-[var(--color-neutral-dark)]">Select the advertising package that fits your needs.</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-[var(--color-accent-sage)] text-white flex items-center justify-center text-xl font-bold mx-auto mb-4">3</div>
                <h3 className="text-xl font-bold mb-2">Access Dashboard</h3>
                <p className="text-[var(--color-neutral-dark)]">Manage your listing and track performance immediately.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Plan Cards */}
        <section className="py-24 bg-[var(--color-bg-secondary)]" id="plans">
          <div className="max-w-[1200px] mx-auto px-6">
            <h2 className="text-4xl lg:text-5xl font-bold text-center mb-16" style={{ fontFamily: "var(--font-display)" }}>
              Choose Your Listing Plan
            </h2>
            
            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {/* Bronze Plan */}
              <div className="bg-white rounded-3xl p-8 border-2 border-gray-100 hover:shadow-xl transition-all flex flex-col">
                <div className="mb-8">
                  <h3 className="text-2xl font-bold mb-2 text-[#B87333]">Bronze Listing</h3>
                  <p className="text-[var(--color-neutral-dark)] text-sm">Everything you need to start receiving direct enquiries.</p>
                </div>
                
                <div className="mb-8">
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold">£99.99</span>
                    <span className="text-[var(--color-neutral-dark)]">+ VAT / year</span>
                  </div>
                  <p className="text-sm text-[var(--color-neutral-dark)] mt-1">or £9.99 per month</p>
                </div>
                
                <ul className="space-y-4 mb-8 flex-grow">
                  {[
                    "Full property listing page",
                    "Unlimited direct enquiries",
                    "iCal calendar sync",
                    "Direct website link",
                    "Standard SEO optimization"
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-[#B87333] flex-shrink-0" />
                      <span className="text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
                
                <Button 
                  asChild
                  className="w-full rounded-2xl py-6 font-semibold text-white"
                  style={{ background: "#B87333" }}
                >
                  <Link href="/owner-sign-up?plan=bronze">
                    Continue to sign up
                  </Link>
                </Button>
              </div>

              {/* Silver Plan */}
              <div className="bg-white rounded-3xl p-8 border-2 border-[#71717A] shadow-lg hover:shadow-2xl transition-all relative flex flex-col">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#71717A] text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                  Recommended
                </div>
                
                <div className="mb-8">
                  <h3 className="text-2xl font-bold mb-2 text-[#71717A]">Silver Listing</h3>
                  <p className="text-[var(--color-neutral-dark)] text-sm">Enhanced visibility and social media promotion.</p>
                </div>
                
                <div className="mb-8">
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold">£149.99</span>
                    <span className="text-[var(--color-neutral-dark)]">+ VAT / year</span>
                  </div>
                  <p className="text-sm text-[var(--color-neutral-dark)] mt-1 text-[#71717A] font-semibold">SAVE £30 VALUE</p>
                  <p className="text-xs text-[var(--color-neutral-dark)] mt-1">or £14.99 per month</p>
                </div>
                
                <ul className="space-y-4 mb-8 flex-grow">
                  {[
                    "Everything in Bronze",
                    "Professional page build & support",
                    "Social media promotion (inc Late Deals)",
                    "Enhanced search visibility",
                    "Priority support"
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-[#71717A] flex-shrink-0" />
                      <span className="text-sm font-medium">{item}</span>
                    </li>
                  ))}
                </ul>
                
                <Button 
                  asChild
                  className="w-full rounded-2xl py-6 font-semibold text-white"
                  style={{ background: "#71717A" }}
                >
                  <Link href="/owner-sign-up?plan=silver">
                    Continue to sign up
                  </Link>
                </Button>
              </div>

              {/* Gold Plan */}
              <div className="bg-white rounded-3xl p-8 border-2 border-gray-100 hover:shadow-xl transition-all flex flex-col">
                <div className="mb-8">
                  <h3 className="text-2xl font-bold mb-2 text-[var(--color-accent-gold)]">Gold Listing</h3>
                  <p className="text-[var(--color-neutral-dark)] text-sm">Maximum exposure across the entire platform.</p>
                </div>
                
                <div className="mb-8">
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold">£199.99</span>
                    <span className="text-[var(--color-neutral-dark)]">+ VAT / year</span>
                  </div>
                  <p className="text-sm text-[var(--color-neutral-dark)] mt-1 text-[var(--color-accent-gold)] font-semibold">SAVE £40 VALUE</p>
                  <p className="text-xs text-[var(--color-neutral-dark)] mt-1">or £19.99 per month</p>
                </div>
                
                <ul className="space-y-4 mb-8 flex-grow">
                  {[
                    "Everything in Silver",
                    "Themed blog feature",
                    "3 x Holiday Focus page inclusion",
                    "Homepage featured placement",
                    "Specialist page (Weddings/Corporate/etc)"
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-[var(--color-accent-gold)] flex-shrink-0" />
                      <span className="text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
                
                <Button 
                  asChild
                  className="w-full rounded-2xl py-6 font-semibold text-white"
                  style={{ background: "var(--color-accent-gold)" }}
                >
                  <Link href="/owner-sign-up?plan=gold">
                    Continue to sign up
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Trust Section */}
        <section className="py-24 bg-white">
          <div className="max-w-[1200px] mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-4xl lg:text-5xl font-bold mb-8" style={{ fontFamily: "var(--font-display)" }}>
                  Trusted by UK Property Owners
                </h2>
                <div className="space-y-6">
                  <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-xl bg-[var(--color-bg-primary)] flex items-center justify-center flex-shrink-0">
                      <BarChart3 className="w-6 h-6 text-[var(--color-accent-sage)]" />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg mb-1">Maximum Exposure</h4>
                      <p className="text-[var(--color-neutral-dark)]">Reach thousands of guests specifically searching for large group accommodation.</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-xl bg-[var(--color-bg-primary)] flex items-center justify-center flex-shrink-0">
                      <ShieldCheck className="w-6 h-6 text-[var(--color-accent-sage)]" />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg mb-1">No Guest Booking Fees</h4>
                      <p className="text-[var(--color-neutral-dark)]">Guests do not book on our site. They enquire and book with you directly, ensuring you keep full control.</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-xl bg-[var(--color-bg-primary)] flex items-center justify-center flex-shrink-0">
                      <MessageSquare className="w-6 h-6 text-[var(--color-accent-sage)]" />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg mb-1">Direct Communication</h4>
                      <p className="text-[var(--color-neutral-dark)]">Every enquiry goes straight to your inbox. No platform middleman.</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="relative h-[500px] rounded-3xl overflow-hidden shadow-2xl">
                <Image 
                  src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/stunning-luxury-group-accommodation-prop-b3cdd1f4-20251127181030.jpg"
                  alt="Luxury property"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-24 bg-[var(--color-bg-primary)]">
          <div className="max-w-[1200px] mx-auto px-6">
            <h2 className="text-4xl font-bold text-center mb-12" style={{ fontFamily: "var(--font-display)" }}>
              Frequently Asked Questions
            </h2>
            <div className="max-w-3xl mx-auto space-y-4">
              {faqs.map((faq, index) => (
                <div key={index} className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
                  <button
                    onClick={() => setOpenFaq(openFaq === index ? null : index)}
                    className="w-full p-6 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
                  >
                    <span className="font-bold text-lg">{faq.question}</span>
                    {openFaq === index ? <Minus className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                  </button>
                  {openFaq === index && (
                    <div className="px-6 pb-6">
                      <p className="text-[var(--color-neutral-dark)] leading-relaxed">{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Owners Guide Section */}
        <section className="py-24 bg-white border-y border-gray-100">
          <div className="max-w-[1200px] mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-4xl lg:text-5xl font-bold mb-6" style={{ fontFamily: "var(--font-display)" }}>
                  Download Our Advertising Guide
                </h2>
                <p className="text-xl text-[var(--color-neutral-dark)] mb-8 leading-relaxed">
                  Everything you need to know about advertising your property with Escape Houses. Learn about our audience, reach, and how we help you maximize your direct bookings.
                </p>
                <ul className="space-y-4 mb-10">
                  {[
                    "Detailed breakdown of listing options",
                    "Marketing and social media reach",
                    "How direct enquiries work",
                    "Success stories from other owners"
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-[var(--color-accent-sage)]/10 flex items-center justify-center flex-shrink-0">
                        <Check className="w-4 h-4 text-[var(--color-accent-sage)]" />
                      </div>
                      <span className="text-lg">{item}</span>
                    </li>
                  ))}
                </ul>
                <Button 
                  asChild
                  size="lg"
                  className="rounded-2xl px-10 py-6 text-lg font-semibold text-white shadow-lg hover:shadow-xl transition-all"
                  style={{ background: "var(--color-accent-gold)" }}
                >
                  <a 
                    href="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/owners-guide.pdf" 
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View PDF Guide
                    <Download className="w-5 h-5 ml-2" />
                  </a>
                </Button>
              </div>
              <div className="relative h-[450px] rounded-3xl overflow-hidden shadow-2xl">
                <Image 
                  src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/modern-businessman-using-tablet-device-v-9c3d19e0-20251127181031.jpg"
                  alt="Owner viewing guide"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-24 px-6 text-center bg-white">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6" style={{ fontFamily: "var(--font-display)" }}>
              Register Your Property
            </h2>
            <p className="text-xl text-[var(--color-neutral-dark)] mb-10">
              Join the UK's premier platform for luxury group accommodation and start receiving direct enquiries today.
            </p>
            <Button 
              asChild
              size="lg"
              className="rounded-2xl px-12 py-8 text-xl font-bold text-white shadow-xl hover:shadow-2xl transition-all"
              style={{ background: "var(--color-accent-sage)" }}
            >
              <Link href="/owner-sign-up">
                Get Started Now
                <ArrowRight className="w-6 h-6 ml-2" />
              </Link>
            </Button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
