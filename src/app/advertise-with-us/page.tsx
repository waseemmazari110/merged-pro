"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { 
  MessageSquare,
  CreditCard,
  BarChart3,
  FileEdit,
  Check,
  ArrowRight,
  Star,
  Download,
  Users,
  Home,
  Trophy,
  BookOpen,
  Calendar,
  Sparkles
} from "lucide-react";

export default function AdvertiseWithUs() {
  return (
    <div className="min-h-screen">
      <Header />

      <main>
        <section className="relative pt-24 pb-0 overflow-hidden">
          <div className="relative h-[600px] w-full">
            <Image
              src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/luxurious-large-group-holiday-property-e-77c8a93c-20251127181030.jpg"
              alt="Luxury large group holiday property"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70"></div>
            
            <div className="absolute inset-0 flex items-center">
              <div className="max-w-[1200px] mx-auto px-6 w-full">
                <div className="max-w-3xl">
                    <h1 className="text-5xl lg:text-7xl font-bold leading-tight mb-6 text-white" style={{ fontFamily: "var(--font-display)", textShadow: "0 2px 4px rgba(0,0,0,0.3)" }}>
                      Advertise Your Property to Large Groups
                    </h1>
                  
                  <p className="text-2xl mb-10 leading-relaxed text-white max-w-2xl" style={{ textShadow: "0 2px 4px rgba(0,0,0,0.3)" }}>
                    The UK&apos;s specialist platform for luxury large group properties. Reach guests directly, set your own terms, and keep 100% of your booking revenue.
                  </p>
                  
                  <div className="flex flex-wrap gap-4 mb-8">
                      <Button 
                        asChild
                        size="lg"
                        className="rounded-2xl px-10 py-6 text-lg font-semibold text-white shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5"
                        style={{ background: "var(--color-accent-sage)" }}
                      >
                        <Link href="/contact">
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
                      <a 
                        href="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/owners-guide.pdf" 
                        download="owners-guide.pdf"
                      >
                        Download Owners Guide
                        <Download className="w-5 h-5 ml-2" />
                      </a>
                    </Button>
                  </div>

                  <div className="flex items-center gap-4 text-white/90">
                    <div className="flex -space-x-2">
                      {[
                        "co-c2a10f6e-20251127184832.jpg",
                        "fr-81c7fcec-20251127184832.jpg",
                        "su-474d0a6c-20251127184832.jpg"
                      ].map((img, i) => (
                        <div key={i} className="w-10 h-10 rounded-full border-2 border-white overflow-hidden bg-white/20">
                            <Image 
                              src={`https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/professional-portrait-photograph-of-a-${img}`}
                              alt={`Happy property owner avatar ${i + 1}`}
                              width={40}
                              height={40}
                              className="object-cover"
                            />
                        </div>
                      ))}
                    </div>
                    <div>
                      <div className="flex gap-0.5 mb-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-[var(--color-accent-gold)] text-[var(--color-accent-gold)]" />
                        ))}
                      </div>
                      <p className="text-sm font-medium text-white" style={{ textShadow: "0 1px 2px rgba(0,0,0,0.5)" }}>
                        Over 3,000 five-star reviews from happy groups & owners
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

          <section className="py-24 bg-white">
            <div className="max-w-[1200px] mx-auto px-6">
              <div className="max-w-4xl mx-auto">
                <h2 className="text-4xl lg:text-6xl font-bold mb-10 text-center" style={{ fontFamily: "var(--font-display)" }}>
                  Fixed-fee Advertising for Property Owners
                </h2>
                
                <div className="space-y-8 text-xl text-[var(--color-neutral-dark)] leading-relaxed">
                  <p>
                    Group Escape Houses is the UK&apos;s specialist platform for luxury group accommodation. We connect high-quality properties—barns, estates, and lodges sleeping 10 or more—directly with guests who value excellence.
                  </p>
                  
                  <p>
                    We operate a simple fixed-fee listing model. This means you pay a single annual or monthly fee to advertise your property, with absolutely no commission charged on bookings. You keep full control of your pricing, your guests, and your calendar.
                  </p>
                  
                  <p>
                    Our platform is designed for efficiency and transparency. Every enquiry goes directly to you, the property owner, allowing you to manage the relationship with your guests from the very start. No middleman, no gatekeepers—just direct bookings and pure profit.
                  </p>
                </div>
              </div>
            </div>
          </section>

        <section className="py-20 bg-[var(--color-bg-primary)]">
          <div className="max-w-[1200px] mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl lg:text-5xl font-bold mb-6" style={{ fontFamily: "var(--font-display)" }}>
                What You Get With Your Group Escape Houses Listing
              </h2>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-12">
                {[
                  {
                    title: "Direct Guest Enquiries",
                    description: "Every enquiry goes straight to your inbox. Guests deal directly with you, the owner, with no platform interference in the booking process.",
                    icon: MessageSquare
                  },
                  {
                    title: "No Commission on Bookings",
                    description: "We charge a simple fixed fee for your listing, not a slice of your revenue. Keep 100% of what you earn from every guest stay.",
                    icon: CreditCard
                  },
                  {
                    title: "Sync Your Availability",
                    description: "Easily integrate your existing property calendar via iCal. Keep your availability up to date across all platforms automatically.",
                    icon: Calendar
                  },
                  {
                    title: "Optional Activity Exposure",
                    description: "Reach guests looking for the full experience. We offer additional exposure for groups looking for activities and services linked to their stay.",
                    icon: Sparkles
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
                    className="bg-white rounded-2xl p-8 hover:shadow-lg transition-all group"
                  >
                    <motion.div 
                      whileHover={{ scale: 1.1, rotate: index % 2 === 0 ? -5 : 5 }}
                      transition={{ type: "spring", stiffness: 400, damping: 10 }}
                      className="w-16 h-16 rounded-full flex items-center justify-center mb-6 shadow-md transform transition-all duration-300 group-hover:shadow-[var(--color-accent-sage)]/40"
                      style={{ backgroundColor: "#96AD94" }}
                    >
                      <Icon className="w-8 h-8 text-white" />
                    </motion.div>
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

            <div className="bg-[var(--color-accent-sage)]/10 border-l-4 border-[var(--color-accent-sage)] rounded-lg p-8 max-w-5xl mx-auto">
              <p className="text-lg text-[var(--color-neutral-dark)] leading-relaxed">
                <strong className="text-[var(--color-text-primary)]">Bonus:</strong> You also get a free Late Availability feature where you can promote last minute dates up to three months ahead, including peak times such as Christmas and New Year.
              </p>
            </div>
          </div>
        </section>

        <section className="py-24 bg-white">
          <div className="max-w-[1200px] mx-auto px-6">
            <h2 className="text-4xl lg:text-6xl font-bold mb-16 text-center" style={{ fontFamily: "var(--font-display)" }}>
              The Smarter Way to Market Your Property
            </h2>
            
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div>
                <ul className="space-y-6">
                  {[
                    "Set your own prices and manage guest enquiries directly",
                    "Maintain full control over your property data and calendar",
                    "Direct links to your own website for seamless bookings",
                    "Manage availability and visibility with total flexibility",
                    "Rich media support for photos, floorplans, and video",
                    "Dedicated support from our expert property team",
                    "Ongoing SEO and PR activity to drive high-quality traffic"
                  ].map((benefit, i) => (
                    <li key={i} className="flex items-start gap-4">
                      <div className="w-6 h-6 rounded-full bg-[var(--color-accent-sage)]/10 flex items-center justify-center flex-shrink-0 mt-1">
                        <Check className="w-4 h-4 text-[var(--color-accent-sage)]" />
                      </div>
                      <span className="text-lg text-[var(--color-neutral-dark)] leading-snug">
                        {benefit}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="relative h-[500px] rounded-2xl overflow-hidden shadow-xl">
                <Image
                  src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/stunning-luxury-group-accommodation-prop-b3cdd1f4-20251127181030.jpg"
                  alt="Luxury group property"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </section>

          <section id="pricing" className="py-20 bg-[var(--color-bg-secondary)]">
            <div className="max-w-[1200px] mx-auto px-6">
              <div className="text-center mb-4">
                <h2 className="text-4xl lg:text-5xl font-bold mb-4" style={{ fontFamily: "var(--font-display)" }}>
                  Fixed-fee Listing Options
                </h2>
                <p className="text-xl text-[var(--color-neutral-dark)]">
                  Choose the subscription that suits your marketing needs, with zero commission on bookings.
                </p>
              </div>
            
            <div className="grid md:grid-cols-3 gap-8 mb-8 mt-12">
              <div className="bg-white rounded-3xl p-8 border-2 border-gray-100 hover:shadow-xl transition-all">
                <div className="text-center mb-8">
                  <h3 className="text-3xl font-bold mb-2 text-[var(--color-text-primary)]" style={{ fontFamily: "var(--font-display)" }}>
                    Bronze
                  </h3>
                  <p className="text-[var(--color-neutral-dark)] text-sm">
                    Everything you need to start receiving direct, commission-free enquiries.
                  </p>
                </div>
                
                <div className="mb-8">
                  <div className="mb-4">
                    <div className="flex items-baseline gap-2 justify-center mb-1">
                      <span className="text-4xl font-bold text-[var(--color-text-primary)]" style={{ fontFamily: "var(--font-display)" }}>
                        £99.99
                      </span>
                      <span className="text-[var(--color-neutral-dark)] font-medium">+ VAT</span>
                    </div>
                    <p className="text-sm text-center text-[var(--color-neutral-dark)] font-medium">per year</p>
                  </div>
                  
                  <div className="text-center">
                    <p className="text-sm text-[var(--color-neutral-dark)] mb-1">
                      Or <strong>£9.99 per month</strong>
                    </p>
                    <p className="text-xs text-[var(--color-neutral-dark)]">
                      Minimum 12 months
                    </p>
                  </div>
                </div>
                
                <ul className="space-y-4 mb-8">
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 flex-shrink-0 mt-0.5 text-[var(--color-accent-sage)]" />
                    <span className="text-sm">High-impact property page</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 flex-shrink-0 mt-0.5 text-[var(--color-accent-sage)]" />
                    <span className="text-sm">Direct, commission-free enquiries</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 flex-shrink-0 mt-0.5 text-[var(--color-accent-sage)]" />
                    <span className="text-sm">Full calendar management</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 flex-shrink-0 mt-0.5 text-[var(--color-accent-sage)]" />
                    <span className="text-sm">Direct link to your website</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 flex-shrink-0 mt-0.5 text-[var(--color-accent-sage)]" />
                    <span className="text-sm">Standard SEO optimization</span>
                  </li>
                </ul>
                
                  <Button 
                    asChild
                    size="lg"
                    variant="outline"
                    className="w-full rounded-2xl px-8 py-6 font-semibold border-2 border-[var(--color-accent-sage)] text-[var(--color-accent-sage)] hover:bg-[var(--color-accent-sage)] hover:text-white transition-all shadow-sm"
                  >
                    <Link href="/owner-sign-up?plan=bronze">
                      Choose Bronze
                    </Link>
                  </Button>
                </div>

                <div className="bg-white rounded-3xl p-8 border-2 border-[var(--color-accent-sage)] shadow-2xl relative lg:scale-105 z-10 hover:shadow-xl transition-all">
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-[var(--color-accent-sage)] text-white px-6 py-2 rounded-full text-xs font-bold uppercase tracking-wider">
                      Most Popular
                    </span>
                  </div>
                  
                  <div className="text-center mb-8">
                    <h3 className="text-3xl font-bold mb-2 text-[var(--color-text-primary)]" style={{ fontFamily: "var(--font-display)" }}>
                      Silver
                    </h3>
                    <p className="text-[var(--color-neutral-dark)] text-sm">
                      Enhanced visibility and targeted social media promotion to boost your bookings.
                    </p>
                  </div>
                  
                  <div className="mb-8">
                    <div className="mb-4">
                      <div className="flex items-baseline gap-2 justify-center mb-1">
                        <span className="text-4xl font-bold text-[var(--color-text-primary)]" style={{ fontFamily: "var(--font-display)" }}>
                          £149.99
                        </span>
                        <span className="text-[var(--color-neutral-dark)] font-medium">+ VAT</span>
                      </div>
                      <p className="text-sm text-center text-[var(--color-neutral-dark)] font-medium">per year</p>
                    </div>
                    
                    <div className="text-center">
                      <p className="text-sm text-[var(--color-neutral-dark)] mb-1">
                        Or <strong>£14.99 per month</strong>
                      </p>
                      <p className="text-xs text-[var(--color-neutral-dark)]">
                        Minimum 12 months
                      </p>
                    </div>
                  </div>
                  
                  <ul className="space-y-4 mb-8">
                    <li className="flex items-start gap-2 font-medium">
                      <Check className="w-5 h-5 flex-shrink-0 mt-0.5 text-[var(--color-accent-sage)]" />
                      <span className="text-sm">Everything in Bronze</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-5 h-5 flex-shrink-0 mt-0.5 text-[var(--color-accent-sage)]" />
                      <span className="text-sm">Featured social media promotion</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-5 h-5 flex-shrink-0 mt-0.5 text-[var(--color-accent-sage)]" />
                      <span className="text-sm">Themed inspiration feature spotlight</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-5 h-5 flex-shrink-0 mt-0.5 text-[var(--color-accent-sage)]" />
                      <span className="text-sm">Three dedicated Holiday Focus pages</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-5 h-5 flex-shrink-0 mt-0.5 text-[var(--color-accent-sage)]" />
                      <span className="text-sm">Ongoing listing production support</span>
                    </li>
                  </ul>
                  
                  <Button 
                    asChild
                    size="lg"
                    className="w-full rounded-2xl px-8 py-6 font-semibold text-white transition-all hover:-translate-y-0.5 shadow-lg"
                    style={{ background: "var(--color-accent-sage)" }}
                  >
                    <Link href="/owner-sign-up?plan=silver">
                      Choose Silver
                    </Link>
                  </Button>
                </div>

                <div className="bg-white rounded-3xl p-8 border-2 border-gray-100 hover:shadow-xl transition-all">
                  <div className="text-center mb-8">
                    <h3 className="text-3xl font-bold mb-2 text-[var(--color-text-primary)]" style={{ fontFamily: "var(--font-display)" }}>
                      Gold
                    </h3>
                    <p className="text-[var(--color-neutral-dark)] text-sm">
                      The ultimate marketing package with homepage placement and priority support.
                    </p>
                  </div>
                  
                  <div className="mb-8">
                    <div className="mb-4">
                      <div className="flex items-baseline gap-2 justify-center mb-1">
                        <span className="text-4xl font-bold text-[var(--color-text-primary)]" style={{ fontFamily: "var(--font-display)" }}>
                          £199.99
                        </span>
                        <span className="text-[var(--color-neutral-dark)] font-medium">+ VAT</span>
                      </div>
                      <p className="text-sm text-center text-[var(--color-neutral-dark)] font-medium">per year</p>
                    </div>
                    
                    <div className="text-center">
                      <p className="text-sm text-[var(--color-neutral-dark)] mb-1">
                        Or <strong>£19.99 per month</strong>
                      </p>
                      <p className="text-xs text-[var(--color-neutral-dark)]">
                        Minimum 12 months
                      </p>
                    </div>
                  </div>
                  
                  <ul className="space-y-4 mb-8">
                    <li className="flex items-start gap-2 font-medium">
                      <Check className="w-5 h-5 flex-shrink-0 mt-0.5 text-[var(--color-accent-sage)]" />
                      <span className="text-sm">Everything in Silver</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-5 h-5 flex-shrink-0 mt-0.5 text-[var(--color-accent-sage)]" />
                      <span className="text-sm">Homepage feature placement</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-5 h-5 flex-shrink-0 mt-0.5 text-[var(--color-accent-sage)]" />
                      <span className="text-sm">Specialist page spotlighting</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-5 h-5 flex-shrink-0 mt-0.5 text-[var(--color-accent-sage)]" />
                      <span className="text-sm">Priority production support</span>
                    </li>
                  </ul>
                  
                  <Button 
                    asChild
                    size="lg"
                    variant="outline"
                    className="w-full rounded-2xl px-8 py-6 font-semibold border-2 border-[var(--color-accent-sage)] text-[var(--color-accent-sage)] hover:bg-[var(--color-accent-sage)] hover:text-white transition-all shadow-sm"
                  >
                    <Link href="/owner-sign-up?plan=gold">
                      Choose Gold
                    </Link>
                  </Button>
              </div>
            </div>

            <div className="text-center">
              <p className="text-sm text-[var(--color-neutral-dark)] max-w-2xl mx-auto">
                All subscriptions include unlimited enquiries, with no commission charged on bookings.
              </p>
            </div>
          </div>
        </section>

        <section id="download" className="py-20 bg-white">
          <div className="max-w-[1200px] mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-4xl lg:text-5xl font-bold mb-6" style={{ fontFamily: "var(--font-display)" }}>
                  Reach More Guests – Download The Owners Guide
                </h2>
                
                <p className="text-lg text-[var(--color-neutral-dark)] leading-relaxed mb-8">
                  Want to see exactly how Group Escape Houses can work for your property? The Owners Guide walks you through listings, marketing, subscription options and how to maximise direct enquiries from large groups.
                </p>
                
                <Button 
                  asChild
                  size="lg"
                  className="rounded-2xl px-10 py-6 text-lg font-semibold text-white shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5"
                  style={{ background: "var(--color-accent-sage)" }}
                >
                  <a 
                    href="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/owners-guide.pdf" 
                    download="owners-guide.pdf"
                  >
                    Download Owners Guide
                    <Download className="w-5 h-5 ml-2" />
                  </a>
                </Button>
                
                <p className="text-sm text-[var(--color-neutral-dark)] mt-4">
                  We will email you a copy and give you access to any future updates.
                </p>
              </div>

              <div className="relative h-[400px] rounded-2xl overflow-hidden shadow-xl">
                <Image
                  src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/modern-businessman-using-tablet-device-v-9c3d19e0-20251127181031.jpg"
                  alt="Property owner viewing enquiry dashboard on tablet"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 bg-[var(--color-bg-primary)]">
          <div className="max-w-[1200px] mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-4xl lg:text-5xl font-bold mb-6" style={{ fontFamily: "var(--font-display)" }}>
                Owner Resources
              </h2>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto mb-16">
              <Link 
                href="/our-story"
                className="group p-6 rounded-2xl bg-white hover:bg-[var(--color-accent-sage)] transition-all hover:shadow-lg text-center"
              >
                <Users className="w-10 h-10 mx-auto mb-3 text-[var(--color-accent-sage)] group-hover:text-white transition-colors" />
                <h3 className="font-semibold text-[var(--color-text-primary)] group-hover:text-white transition-colors">
                  Meet the Team
                </h3>
              </Link>

              <Link 
                href="/properties"
                className="group p-6 rounded-2xl bg-white hover:bg-[var(--color-accent-sage)] transition-all hover:shadow-lg text-center"
              >
                <Home className="w-10 h-10 mx-auto mb-3 text-[var(--color-accent-sage)] group-hover:text-white transition-colors" />
                <h3 className="font-semibold text-[var(--color-text-primary)] group-hover:text-white transition-colors">
                  Properties Recently Joined
                </h3>
              </Link>

              <Link 
                href="#testimonials"
                className="group p-6 rounded-2xl bg-white hover:bg-[var(--color-accent-sage)] transition-all hover:shadow-lg text-center"
              >
                <Trophy className="w-10 h-10 mx-auto mb-3 text-[var(--color-accent-sage)] group-hover:text-white transition-colors" />
                <h3 className="font-semibold text-[var(--color-text-primary)] group-hover:text-white transition-colors">
                  Success Stories
                </h3>
              </Link>

              <Link 
                href="#download"
                className="group p-6 rounded-2xl bg-white hover:bg-[var(--color-accent-sage)] transition-all hover:shadow-lg text-center"
              >
                <BookOpen className="w-10 h-10 mx-auto mb-3 text-[var(--color-accent-sage)] group-hover:text-white transition-colors" />
                <h3 className="font-semibold text-[var(--color-text-primary)] group-hover:text-white transition-colors">
                  Owner Guides
                </h3>
              </Link>
            </div>

            <div id="testimonials" className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-[var(--color-accent-gold)] text-[var(--color-accent-gold)]" />
                  ))}
                </div>
                <p className="text-[var(--color-neutral-dark)] leading-relaxed italic mb-6">
                  "Set up was quick, the listing looks great and our subscription paid for itself in the first week with quality enquiries."
                </p>
                <div className="flex items-center gap-4 pt-4 border-t border-[var(--color-bg-secondary)]">
                  <div className="relative w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                    <Image
                      src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/professional-portrait-photograph-of-a-co-c2a10f6e-20251127184832.jpg"
                      alt="Sarah Mitchell"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-semibold text-[var(--color-text-primary)]">Sarah Mitchell</p>
                    <p className="text-sm text-[var(--color-neutral-dark)]">Manor House Owner, Cotswolds</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-[var(--color-accent-gold)] text-[var(--color-accent-gold)]" />
                  ))}
                </div>
                <p className="text-[var(--color-neutral-dark)] leading-relaxed italic mb-6">
                  "We get regular enquiries for large groups and the team are always helpful and proactive."
                </p>
                <div className="flex items-center gap-4 pt-4 border-t border-[var(--color-bg-secondary)]">
                  <div className="relative w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                    <Image
                      src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/professional-portrait-photograph-of-a-fr-81c7fcec-20251127184832.jpg"
                      alt="James Thornton"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-semibold text-[var(--color-text-primary)]">James Thornton</p>
                    <p className="text-sm text-[var(--color-neutral-dark)]">Estate Owner, Lake District</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-[var(--color-accent-gold)] text-[var(--color-accent-gold)]" />
                  ))}
                </div>
                <p className="text-[var(--color-neutral-dark)] leading-relaxed italic mb-6">
                  "Professional support from start to finish. The subscription model makes so much more sense for our business than paying commission."
                </p>
                <div className="flex items-center gap-4 pt-4 border-t border-[var(--color-bg-secondary)]">
                  <div className="relative w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                    <Image
                      src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/professional-portrait-photograph-of-a-su-474d0a6c-20251127184832.jpg"
                      alt="Emma Richardson"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-semibold text-[var(--color-text-primary)]">Emma Richardson</p>
                    <p className="text-sm text-[var(--color-neutral-dark)]">Country House Owner, Yorkshire</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="contact" className="py-20 bg-[var(--color-bg-secondary)]">
          <div className="max-w-[1200px] mx-auto px-6 text-center">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6" style={{ fontFamily: "var(--font-display)" }}>
              Join Group Escape Houses Today
            </h2>
            <p className="text-xl text-[var(--color-neutral-dark)] mb-12 max-w-3xl mx-auto leading-relaxed">
              Ready to unlock more direct enquiries for your large group property? Subscribe to Group Escape Houses and reach guests who are searching specifically for luxury houses and estates for groups.
            </p>

            <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto mb-12">
              <div className="bg-white rounded-2xl p-8 text-left hover:shadow-lg transition-all">
                <h3 className="font-bold text-xl mb-3" style={{ fontFamily: "var(--font-display)" }}>
                  Email Us
                </h3>
                <a 
                  href="mailto:hello@groupescapehouses.co.uk" 
                  className="text-[var(--color-accent-sage)] hover:text-[var(--color-accent-gold)] transition-colors text-lg font-medium"
                >
                  hello@groupescapehouses.co.uk
                </a>
              </div>
              
              <div className="bg-white rounded-2xl p-8 text-left hover:shadow-lg transition-all">
                <h3 className="font-bold text-xl mb-3" style={{ fontFamily: "var(--font-display)" }}>
                  Visit Our Office
                </h3>
                <p className="text-[var(--color-neutral-dark)] leading-relaxed">
                  11a North St<br />
                  Brighton and Hove<br />
                  Brighton BN41 1DH
                </p>
              </div>
            </div>

            <Button 
              asChild
              size="lg"
              className="rounded-2xl px-10 py-6 text-lg font-semibold text-white shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5"
              style={{ background: "var(--color-accent-sage)" }}
            >
              <Link href="/contact">
                Register Your Property
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
