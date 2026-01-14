"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import UKServiceSchema from "@/components/UKServiceSchema";
import { Button } from "@/components/ui/button";
import { 
  MessageSquare,
  CreditCard,
  BarChart3,
  FileEdit,
  Check,
  X,
  Plus,
  Minus,
  ArrowRight,
  Star,
  Download,
  Users,
  Home,
  Trophy,
  BookOpen,
  Calendar,
  Sparkles,
  ShieldCheck,
  TrendingUp,
  HeartHandshake
} from "lucide-react";
import { useState } from "react";

const faqs = [
  {
    question: "How does the fixed-fee model work?",
    answer: "Instead of taking a commission on every booking, you pay a single annual fee to advertise your property. This means you keep 100% of the booking revenue, regardless of how many bookings you receive through our platform."
  },
  {
    question: "Do I handle the bookings myself?",
    answer: "Yes. Every enquiry comes directly to you via email or your preferred contact method. You manage the guest relationship, the booking contract, and the payment processing using your own systems."
  },
  {
    question: "Can I sync my calendar with other platforms?",
    answer: "Absolutely. We support iCal synchronization, which means your availability calendar on Escape Houses will automatically stay up to date with Airbnb, Booking.com, VRBO, or your own property management system."
  },
  {
    question: "What kind of properties do you list?",
    answer: "We specialize in luxury large group accommodation across the UK. This includes manor houses, large cottages, estates, and unique properties that can accommodate 10 or more guests."
  },
  {
    question: "Is there a contract or long-term commitment?",
    answer: "Our standard listing is for 12 months. There are no hidden tie-ins or automatic renewals that you can't cancel. We believe our results speak for themselves, so most of our owners choose to renew year after year."
  },
  {
    question: "How many enquiries can I expect?",
    answer: "Enquiry volume varies by property type and location, but because we are a specialist platform for groups, the enquiries you receive are typically high-value and high-intent. Many of our owners find that just one booking covers their entire annual advertising cost."
  }
];

export default function WhyListWithUs() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

    return (
      <div className="min-h-screen bg-white">
        <UKServiceSchema 
          type="faq" 
          data={{ faqs }} 
        />
        <UKServiceSchema 
          type="breadcrumb" 
          data={{
            breadcrumbs: [
              { name: "Home", url: "/" },
              { name: "Why List With Us", url: "/why-list-with-escape-houses" }
            ]
          }}
        />
        <Header />


      <main>
        {/* Hero Section */}
        <section className="relative pt-24 pb-0 overflow-hidden">
          <div className="relative h-[650px] w-full">
            <Image
              src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/luxurious-large-group-holiday-property-e-77c8a93c-20251127181030.jpg"
              alt="Luxury large group holiday property"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70"></div>
            
            <div className="absolute inset-0 flex items-center">
              <div className="max-w-[1200px] mx-auto px-6 w-full">
                <div className="max-w-3xl">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                  >
                    <h1 className="text-5xl lg:text-7xl font-bold leading-tight mb-6 text-white" style={{ fontFamily: "var(--font-display)", textShadow: "0 2px 4px rgba(0,0,0,0.3)" }}>
                      Why List with Escape Houses?
                    </h1>
                    
                    <p className="text-2xl mb-10 leading-relaxed text-white max-w-2xl" style={{ textShadow: "0 2px 4px rgba(0,0,0,0.3)" }}>
                      The UK&apos;s specialist platform for luxury large group properties. Reach high-intent guests directly, set your own terms, and keep 100% of your booking revenue.
                    </p>
                    
                      <div className="flex flex-wrap gap-4 mb-8">
                        <Button 
                          asChild
                          size="lg"
                          className="rounded-2xl px-10 py-6 text-lg font-semibold text-white shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5"
                          style={{ background: "var(--color-accent-sage)" }}
                        >
                          <Link href="/register-your-property">
                            Register Your Property
                            <ArrowRight className="w-5 h-5 ml-2" />
                          </Link>
                        </Button>
                        
                        <Button 
                          asChild
                          size="lg"
                          variant="outline"
                          className="rounded-2xl px-10 py-6 text-lg font-semibold bg-white/95 hover:bg-white border-0 text-[var(--color-text-primary)]"
                        >
                          <Link href="/owner-login">
                            Owner Login
                            <ArrowRight className="w-5 h-5 ml-2" />
                          </Link>
                        </Button>
                      </div>
                  </motion.div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Comparison Section */}
        <section className="py-24 bg-white">
          <div className="max-w-[1200px] mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl lg:text-5xl font-bold mb-6" style={{ fontFamily: "var(--font-display)" }}>
                Escape Houses vs. The Competition
              </h2>
              <p className="text-xl text-[var(--color-neutral-dark)] max-w-2xl mx-auto">
                See how our owner-first model compares to traditional booking platforms.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b-2 border-gray-100">
                    <th className="py-6 px-4 text-left text-lg font-bold text-gray-400">Feature</th>
                    <th className="py-6 px-4 text-center text-xl font-bold bg-[var(--color-bg-primary)] rounded-t-3xl" style={{ color: "var(--color-accent-sage)" }}>Escape Houses</th>
                    <th className="py-6 px-4 text-center text-lg font-bold text-gray-600">Typical OTAs</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {[
                    {
                      feature: "Booking Commission",
                      ours: "0% Commission",
                      theirs: "15% - 20% + Fees",
                      highlight: true
                    },
                    {
                      feature: "Guest Communication",
                      ours: "Direct & Instant",
                      theirs: "Filtered & Monitored",
                      highlight: true
                    },
                    {
                      feature: "Payment Terms",
                      ours: "Paid Direct to You",
                      theirs: "Held by Platform",
                      highlight: true
                    },
                    {
                      feature: "Your Own Branding",
                      ours: "Links to Your Website",
                      theirs: "Strictly Prohibited",
                      highlight: false
                    },
                    {
                      feature: "Guest Data Ownership",
                      ours: "100% Yours",
                      theirs: "Owned by Platform",
                      highlight: false
                    },
                    {
                      feature: "Pricing Control",
                      ours: "Total Flexibility",
                      theirs: "Algorithm Driven",
                      highlight: false
                    },
                    {
                      feature: "Cancellation Policy",
                      ours: "Set Your Own",
                      theirs: "Platform Imposed",
                      highlight: false
                    }
                  ].map((row, i) => (
                    <tr key={i} className={row.highlight ? "bg-white" : ""}>
                      <td className="py-6 px-4 font-semibold text-[var(--color-text-primary)]">{row.feature}</td>
                      <td className="py-6 px-4 text-center font-bold bg-[var(--color-bg-primary)] last:rounded-b-3xl">
                        <div className="flex items-center justify-center gap-2" style={{ color: "var(--color-accent-sage)" }}>
                          <Check className="w-5 h-5" />
                          {row.ours}
                        </div>
                      </td>
                      <td className="py-6 px-4 text-center text-gray-500">
                        <div className="flex items-center justify-center gap-2">
                          <X className="w-5 h-5 text-red-300" />
                          {row.theirs}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-12 text-center">
                <p className="text-lg text-[var(--color-neutral-dark)] italic">
                  "We saved over £12,000 in commissions last year by switching our primary focus to Group Escape Houses."
                </p>
              <p className="font-bold mt-2">— Manor House Owner, Somerset</p>
            </div>
          </div>
        </section>

        {/* Benefits Grid */}
        <section className="py-24 bg-[var(--color-bg-primary)]">
          <div className="max-w-[1200px] mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl lg:text-5xl font-bold mb-6" style={{ fontFamily: "var(--font-display)" }}>
                Why Our Owners Love Us
              </h2>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {[
                {
                  title: "100% Commission Free",
                  description: "Keep every penny of your booking revenue. Our simple annual fee means no more paying away 15-20% of your earnings.",
                  icon: CreditCard
                },
                {
                  title: "Direct Guest Access",
                  description: "Build direct relationships. Enquiries come straight to your inbox, giving you full control over guest screening and terms.",
                  icon: MessageSquare
                },
                {
                  title: "High-Intent Traffic",
                  description: "Our platform is built specifically for groups. We attract guests looking for exactly what you offer—luxury group spaces.",
                  icon: TrendingUp
                },
                {
                  title: "Sync with Ease",
                  description: "Keep your calendar up to date effortlessly. We support iCal syncing with all major platforms and booking systems.",
                  icon: Calendar
                },
                {
                  title: "Premium Presentation",
                  description: "Your property deserves to look its best. We provide high-impact listing pages with rich media support and professional copy.",
                  icon: Sparkles
                },
                {
                  title: "Expert Support",
                  description: "You're not just a listing to us. Our dedicated property team is here to help you optimise your profile and boost performance.",
                  icon: HeartHandshake
                }
              ].map((item, index) => {
                const Icon = item.icon;
                return (
                  <motion.div 
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="bg-white rounded-3xl p-8 shadow-sm hover:shadow-xl transition-all group border border-gray-100"
                  >
                    <div 
                      className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform duration-300"
                      style={{ backgroundColor: "#96AD94" }}
                    >
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold mb-4" style={{ fontFamily: "var(--font-display)" }}>
                      {item.title}
                    </h3>
                    <p className="text-[var(--color-neutral-dark)] leading-relaxed">
                      {item.description}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-24 bg-[var(--color-bg-primary)]">
          <div className="max-w-[1200px] mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl lg:text-5xl font-bold mb-6" style={{ fontFamily: "var(--font-display)" }}>
                Common Questions
              </h2>
              <p className="text-xl text-[var(--color-neutral-dark)] max-w-2xl mx-auto">
                Everything you need to know about listing your property with us.
              </p>
            </div>

            <div className="max-w-3xl mx-auto space-y-4">
              {faqs.map((faq, index) => (
                <div 
                  key={index}
                  className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm"
                >
                  <button
                    onClick={() => setOpenFaq(openFaq === index ? null : index)}
                    className="w-full p-6 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
                  >
                    <span className="text-xl font-bold text-[var(--color-text-primary)]">
                      {faq.question}
                    </span>
                    {openFaq === index ? (
                      <Minus className="w-5 h-5 text-[var(--color-accent-sage)]" />
                    ) : (
                      <Plus className="w-5 h-5 text-gray-400" />
                    )}
                  </button>
                  
                  {openFaq === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      transition={{ duration: 0.3 }}
                      className="px-6 pb-6"
                    >
                      <p className="text-lg text-[var(--color-neutral-dark)] leading-relaxed">
                        {faq.answer}
                      </p>
                    </motion.div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-24 bg-white">
          <div className="max-w-[1200px] mx-auto px-6 text-center">
            <h2 className="text-4xl lg:text-6xl font-bold mb-6" style={{ fontFamily: "var(--font-display)" }}>
              Ready to Escape the Commissions?
            </h2>
            <p className="text-xl text-[var(--color-neutral-dark)] mb-12 max-w-2xl mx-auto leading-relaxed">
              Join the UK's premier platform for luxury group properties and start receiving direct, commission-free enquiries today.
            </p>
              <div className="flex flex-wrap justify-center gap-6">
                <Button 
                  asChild
                  size="lg"
                  className="rounded-2xl px-10 py-7 text-xl font-bold text-white shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1"
                  style={{ background: "var(--color-accent-sage)" }}
                >
                  <Link href="/register-your-property">Register Your Property</Link>
                </Button>
                <Button 
                  asChild
                  size="lg"
                  variant="outline"
                  className="rounded-2xl px-10 py-7 text-xl font-bold border-2 border-[var(--color-accent-sage)] text-[var(--color-accent-sage)] shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1"
                >
                  <Link href="/owner-login">Owner Login</Link>
                </Button>
              </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
