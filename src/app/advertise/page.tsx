"use client";

import Image from "next/image";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { 
  Home, 
  TrendingUp, 
  Shield, 
  Clock, 
  Users, 
  Star, 
  CheckCircle2, 
  Calendar,
  CreditCard,
  HeartHandshake,
  Sparkles,
  ArrowRight,
  MessageSquare,
  BarChart3,
  FileEdit,
  Bell,
  Megaphone,
  Award,
  Check,
  X,
  Loader2
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";

export default function AdvertisePage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  // Spam protection state
  const [formLoadTime, setFormLoadTime] = useState<number>(0);
  const [honeypot, setHoneypot] = useState("");
  const [userInteraction, setUserInteraction] = useState({ clicks: 0, keystrokes: 0 });
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    setFormLoadTime(Date.now());
    
    const trackClick = () => {
      setUserInteraction(prev => ({ ...prev, clicks: prev.clicks + 1 }));
    };

    const trackKeypress = () => {
      setUserInteraction(prev => ({ ...prev, keystrokes: prev.keystrokes + 1 }));
    };

    if (formRef.current) {
      formRef.current.addEventListener('click', trackClick);
      formRef.current.addEventListener('keydown', trackKeypress);
      
      return () => {
        formRef.current?.removeEventListener('click', trackClick);
        formRef.current?.removeEventListener('keydown', trackKeypress);
      };
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const payload = Object.fromEntries(formData.entries());
    
    try {
      // Generate JavaScript challenge
      const challenge = Math.floor(Date.now() / 10000).toString();

      const response = await fetch('/api/partners/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...payload,
          honeypot,
          timestamp: formLoadTime.toString(),
          challenge,
          userInteraction
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit registration');
      }

      setIsSubmitted(true);
      toast.success("Registration submitted! Our team will be in touch within 48 hours.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to submit. Please try again.");
      console.error("Registration error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const benefits = [
    {
      icon: MessageSquare,
      title: "Direct Contact with Guests",
      description: "We're all about direct bookings. Prospective guests can contact you directly through your page making it easier for everyone - and of course, there is no commission to pay."
    },
    {
      icon: CreditCard,
      title: "Commission-Free Bookings",
      description: "We simply charge a simple annual subscription to list on the site. There's no commission to pay. Just take direct bookings."
    },
    {
      icon: BarChart3,
      title: "Owner's Dashboard",
      description: "You have access to a dashboard where you can monitor enquiries and stats for your listing."
    },
    {
      icon: FileEdit,
      title: "Unique Property Page",
      description: "You have full control over your own property listing page. Make edits, update photos, and share deals and availability."
    },
    {
      icon: Bell,
      title: "Free Late Availability Feature",
      description: "You can populate your late availability entries for up to three months ahead. Premium slots for Christmas and New Year are always available."
    },
    {
      icon: HeartHandshake,
      title: "Dedicated Team Support",
      description: "Our production team are on hand to support you at every step - from building your property page to securing more enquiries."
    }
  ];

  const membershipTiers = [
    {
      name: "Essential",
      price: "£450",
      features: [
        { name: "Annual Membership with Fully Optimised Listing", included: true },
        { name: "Page Build and Ongoing Production Support", included: false },
        { name: "Social Media Promotion, inc Late Deals", included: false },
        { name: "Themed Blog Feature", included: false },
        { name: "3 x Holiday Focus Pages", included: false },
        { name: "Homepage Features", included: false },
        { name: "Specialist Page (Weddings, Youth or Business)", included: false }
      ]
    },
    {
      name: "Professional",
      price: "£650",
      popular: true,
      features: [
        { name: "Annual Membership with Fully Optimised Listing", included: true },
        { name: "Page Build and Ongoing Production Support", included: true },
        { name: "Social Media Promotion, inc Late Deals", included: true },
        { name: "Themed Blog Feature", included: false },
        { name: "3 x Holiday Focus Pages", included: false },
        { name: "Homepage Features", included: false },
        { name: "Specialist Page (Weddings, Youth or Business)", included: false }
      ]
    },
    {
      name: "Premium",
      price: "£850",
      features: [
        { name: "Annual Membership with Fully Optimised Listing", included: true },
        { name: "Page Build and Ongoing Production Support", included: true },
        { name: "Social Media Promotion, inc Late Deals", included: true },
        { name: "Themed Blog Feature", included: true },
        { name: "3 x Holiday Focus Pages", included: true },
        { name: "Homepage Features", included: true },
        { name: "Specialist Page (Weddings, Youth or Business)", included: true }
      ]
    }
  ];

  const testimonials = [
    {
      quote: "A great company to work with. Set up the profile quickly and to a high quality - the whole process could not be easier. Within 24 hours we were getting enquiries leading to bookings, paying back the annual subscription immediately.",
      author: "Graeme McFall",
      property: "The Hollies, Argyll, Bute"
    },
    {
      quote: "What an amazing year we have had with Group Escape Houses. A day doesn't go by without an enquiry and we are pleased with our conversion rate. Their site is so user-friendly also and the team always greets you personally. Keep up the good work.",
      author: "Sharon",
      property: "Walnut Barn Estate"
    },
    {
      quote: "We finally joined in late February 23 and - wow! We are so pleased at the responses we have had in only 2 months and confirmed bookings. The team are easy to work with and we are excited to be onboard and work with them in the future.",
      author: "Tony",
      property: "Radcliffes Lodge"
    }
  ];

  const faqs = [
    {
      question: "What are the membership fees?",
      answer: "We offer three annual membership tiers: Essential (£450 + VAT), Professional (£650 + VAT), and Premium (£850 + VAT). Each tier includes different levels of marketing support and features. There are no commission fees - you keep 100% of your booking revenue."
    },
    {
      question: "Do I need professional photos?",
      answer: "High-quality photos significantly improve booking rates. Professional photography support is included in our Professional and Premium tiers, or you can submit your own professional images with the Essential tier."
    },
    {
      question: "How do I manage my calendar and availability?",
      answer: "You have access to an owner dashboard where you can manage availability, view bookings, and update your late availability entries. You can also sync with other platforms via iCal."
    },
    {
      question: "Who handles guest communication?",
      answer: "Guests contact you directly through your property page. This gives you full control over your bookings and allows you to build direct relationships with your guests - with no commission to pay."
    },
    {
      question: "What marketing support do I get?",
      answer: "This depends on your membership tier. All tiers include an optimised listing. Higher tiers include social media promotion, inspiration features, holiday focus pages, and homepage features to maximise your property's visibility."
    },
    {
      question: "Can I upgrade my membership tier later?",
      answer: "Absolutely. You can upgrade to a higher tier at any time to access additional marketing features and support. Contact our team to discuss your options."
    }
  ];

  return (
    <>
      <Header />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-bg-primary)] to-[var(--color-bg-secondary)]"></div>
        
        <div className="max-w-[1200px] mx-auto px-6 relative z-10">
          <div className="text-center max-w-4xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--color-accent-sage)]/10 rounded-full border border-[var(--color-accent-sage)]/20 mb-6">
              <Sparkles className="w-4 h-4 text-[var(--color-accent-sage)]" />
              <span className="text-sm font-medium text-[var(--color-accent-sage)]">
                No Hidden Costs. No Hidden Surprises.
              </span>
            </div>
            
            <h1 className="text-5xl lg:text-6xl font-bold leading-tight mb-6" style={{ fontFamily: "var(--font-display)" }}>
              Advertise Your Property to Large Groups
            </h1>
            
            <p className="text-xl text-[var(--color-neutral-dark)] leading-relaxed mb-8">
              If you're looking for more control, more flexibility to do what you want, and a straightforward partner with no hidden fees, then Group Escape Houses could be just the thing for your luxury holiday property.
            </p>
            
            <Button 
              asChild
              size="lg"
              className="rounded-2xl px-8 py-6 text-lg font-medium text-white shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5"
              style={{ background: "var(--color-accent-sage)" }}
            >
              <Link href="#pricing">
                View Membership Options
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-white">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6" style={{ fontFamily: "var(--font-display)" }}>
              What You Get With Your Listing
            </h2>
            <p className="text-xl text-[var(--color-neutral-dark)]">
              Everything you need to maximise your bookings and take control of your property marketing.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <div 
                key={index}
                className="group p-8 rounded-2xl bg-[var(--color-bg-primary)] hover:bg-[var(--color-bg-secondary)] transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
              >
                <div className="w-14 h-14 rounded-2xl bg-[var(--color-accent-sage)]/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <benefit.icon className="w-7 h-7 text-[var(--color-accent-sage)]" />
                </div>
                <h3 className="text-xl font-bold mb-3" style={{ fontFamily: "var(--font-display)" }}>
                  {benefit.title}
                </h3>
                <p className="text-[var(--color-neutral-dark)] leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Different Section */}
      <section className="py-20 bg-[var(--color-bg-secondary)]">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl lg:text-5xl font-bold mb-6" style={{ fontFamily: "var(--font-display)" }}>
                Why is Group Escape Houses Different?
              </h2>
              <p className="text-xl text-[var(--color-neutral-dark)] mb-6 leading-relaxed">
                Group Escape Houses puts you back in control. We don't charge any commission, just an annual subscription fee. You dictate your prices, have complete control over your calendar and have unfettered access to your potential guests.
              </p>
              <p className="text-xl text-[var(--color-neutral-dark)] leading-relaxed">
                If you need a hand with your marketing or listing, our experienced team is ready to help increase the visibility of your amazing property and increase your bookings.
              </p>
            </div>
            
              <div className="grid grid-cols-2 gap-4">
                <Image
                  src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400&q=80"
                  alt="Luxury modern living room interior in group holiday house"
                  width={400}
                  height={500}
                  className="rounded-2xl w-full h-full object-cover"
                />
                <Image
                  src="https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?w=400&q=80"
                  alt="Private outdoor swimming pool at luxury group accommodation"
                  width={400}
                  height={500}
                  className="rounded-2xl w-full h-full object-cover mt-8"
                />
              </div>
          </div>
        </div>
      </section>

      {/* Membership Pricing Section */}
      <section id="pricing" className="py-20 bg-white">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6" style={{ fontFamily: "var(--font-display)" }}>
              Membership Options
            </h2>
            <p className="text-xl text-[var(--color-neutral-dark)] max-w-2xl mx-auto">
              Choose the membership tier that best suits your property and marketing needs.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {membershipTiers.map((tier, index) => (
              <div 
                key={index}
                className={`relative rounded-3xl p-8 ${
                  tier.popular 
                    ? 'bg-gradient-to-br from-[var(--color-accent-sage)] to-[var(--color-accent-gold)] text-white shadow-2xl scale-105' 
                    : 'bg-[var(--color-bg-primary)] border-2 border-gray-200'
                }`}
              >
                {tier.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-[var(--color-accent-gold)] text-white px-4 py-1 rounded-full text-sm font-semibold">
                      Most Popular
                    </span>
                  </div>
                )}
                
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold mb-4" style={{ fontFamily: "var(--font-display)" }}>
                    {tier.name}
                  </h3>
                  <div className="flex items-baseline justify-center gap-2">
                    <span className="text-5xl font-bold" style={{ fontFamily: "var(--font-display)" }}>
                      {tier.price}
                    </span>
                    <span className={tier.popular ? "text-white/80" : "text-[var(--color-neutral-dark)]"}>
                      + VAT
                    </span>
                  </div>
                  <p className={`mt-2 ${tier.popular ? "text-white/80" : "text-[var(--color-neutral-dark)]"}`}>
                    per year
                  </p>
                </div>
                
                <ul className="space-y-4 mb-8">
                  {tier.features.map((feature, fIndex) => (
                    <li key={fIndex} className="flex items-start gap-3">
                      {feature.included ? (
                        <Check className={`w-5 h-5 flex-shrink-0 mt-0.5 ${tier.popular ? 'text-white' : 'text-[var(--color-accent-sage)]'}`} />
                      ) : (
                        <X className={`w-5 h-5 flex-shrink-0 mt-0.5 ${tier.popular ? 'text-white/40' : 'text-gray-300'}`} />
                      )}
                      <span className={`text-sm ${tier.popular ? (feature.included ? 'text-white' : 'text-white/60') : (feature.included ? 'text-[var(--color-text-primary)]' : 'text-gray-400')}`}>
                        {feature.name}
                      </span>
                    </li>
                  ))}
                </ul>
                
                <Button 
                  asChild
                  size="lg"
                  className={`w-full rounded-2xl px-8 py-6 font-medium transition-all hover:-translate-y-0.5 ${
                    tier.popular 
                      ? 'bg-white text-[var(--color-accent-sage)] hover:bg-white/90' 
                      : 'text-white'
                  }`}
                  style={!tier.popular ? { background: "var(--color-accent-sage)" } : {}}
                >
                  <Link href="#apply">
                    Get Started
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Link>
                </Button>
              </div>
            ))}
          </div>
          
          <p className="text-center text-sm text-[var(--color-neutral-dark)] mt-8">
            All prices shown are exclusive of VAT. Annual subscription renews automatically.
          </p>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-[var(--color-bg-primary)]">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6" style={{ fontFamily: "var(--font-display)" }}>
              Success Stories
            </h2>
            <p className="text-xl text-[var(--color-neutral-dark)]">
              Hear from property owners who have joined Group Escape Houses
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div 
                key={index}
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-[var(--color-accent-gold)] text-[var(--color-accent-gold)]" />
                  ))}
                </div>
                <p className="text-[var(--color-neutral-dark)] leading-relaxed mb-6 italic">
                  "{testimonial.quote}"
                </p>
                <div className="border-t pt-4">
                  <p className="font-semibold text-[var(--color-text-primary)]">{testimonial.author}</p>
                  <p className="text-sm text-[var(--color-neutral-dark)]">{testimonial.property}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Application Form Section */}
      <section id="apply" className="py-20 bg-white">
        <div className="max-w-[800px] mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6" style={{ fontFamily: "var(--font-display)" }}>
              Register Your Interest
            </h2>
            <p className="text-xl text-[var(--color-neutral-dark)]">
              {isSubmitted 
                ? "Thank you for your interest! Our team will be in touch within 48 hours."
                : "Fill in the form below and we'll be in touch within 48 hours to discuss your property."}
            </p>
          </div>
          
          {!isSubmitted ? (
            <div className="bg-[var(--color-bg-primary)] rounded-3xl shadow-xl p-8 md:p-12">
              <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
                {/* Honeypot field - hidden from users */}
                <input
                  type="text"
                  name="website_url"
                  value={honeypot}
                  onChange={(e) => setHoneypot(e.target.value)}
                  style={{ 
                    position: 'absolute', 
                    left: '-9999px', 
                    width: '1px', 
                    height: '1px' 
                  }}
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                />

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-semibold mb-2 text-[var(--color-text-primary)]">
                      First Name *
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      required
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[var(--color-accent-sage)] focus:outline-none transition-colors bg-white"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-semibold mb-2 text-[var(--color-text-primary)]">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      required
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[var(--color-accent-sage)] focus:outline-none transition-colors bg-white"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold mb-2 text-[var(--color-text-primary)]">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[var(--color-accent-sage)] focus:outline-none transition-colors bg-white"
                  />
                </div>
                
                <div>
                  <label htmlFor="phone" className="block text-sm font-semibold mb-2 text-[var(--color-text-primary)]">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    required
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[var(--color-accent-sage)] focus:outline-none transition-colors bg-white"
                  />
                </div>
                
                <div>
                  <label htmlFor="propertyName" className="block text-sm font-semibold mb-2 text-[var(--color-text-primary)]">
                    Property Name
                  </label>
                  <input
                    type="text"
                    id="propertyName"
                    name="propertyName"
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[var(--color-accent-sage)] focus:outline-none transition-colors bg-white"
                  />
                </div>
                
                <div>
                  <label htmlFor="location" className="block text-sm font-semibold mb-2 text-[var(--color-text-primary)]">
                    Property Location (City/Region) *
                  </label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    required
                    placeholder="e.g. Brighton, Cotswolds, Lake District"
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[var(--color-accent-sage)] focus:outline-none transition-colors bg-white"
                  />
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="bedrooms" className="block text-sm font-semibold mb-2 text-[var(--color-text-primary)]">
                      Number of Bedrooms *
                    </label>
                    <input
                      type="number"
                      id="bedrooms"
                      name="bedrooms"
                      required
                      min="1"
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[var(--color-accent-sage)] focus:outline-none transition-colors bg-white"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="sleeps" className="block text-sm font-semibold mb-2 text-[var(--color-text-primary)]">
                      Maximum Guests *
                    </label>
                    <input
                      type="number"
                      id="sleeps"
                      name="sleeps"
                      required
                      min="8"
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[var(--color-accent-sage)] focus:outline-none transition-colors bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="membershipTier" className="block text-sm font-semibold mb-2 text-[var(--color-text-primary)]">
                    Preferred Membership Tier
                  </label>
                  <select
                    id="membershipTier"
                    name="membershipTier"
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[var(--color-accent-sage)] focus:outline-none transition-colors bg-white"
                  >
                    <option value="">Select a tier</option>
                    <option value="essential">Essential - £450 + VAT</option>
                    <option value="professional">Professional - £650 + VAT</option>
                    <option value="premium">Premium - £850 + VAT</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="features" className="block text-sm font-semibold mb-2 text-[var(--color-text-primary)]">
                    Key Features
                  </label>
                  <textarea
                    id="features"
                    name="features"
                    rows={3}
                    placeholder="e.g. Hot tub, swimming pool, games room, cinema room..."
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[var(--color-accent-sage)] focus:outline-none transition-colors resize-none bg-white"
                  ></textarea>
                </div>
                
                <div>
                  <label htmlFor="website" className="block text-sm font-semibold mb-2 text-[var(--color-text-primary)]">
                    Property Website or Listing URL (if available)
                  </label>
                  <input
                    type="url"
                    id="website"
                    name="website"
                    placeholder="https://"
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[var(--color-accent-sage)] focus:outline-none transition-colors bg-white"
                  />
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-semibold mb-2 text-[var(--color-text-primary)]">
                    Additional Information
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    placeholder="Tell us anything else about your property or any questions you have..."
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[var(--color-accent-sage)] focus:outline-none transition-colors resize-none bg-white"
                  ></textarea>
                </div>
                
                <Button 
                  type="submit"
                  size="lg"
                  disabled={isSubmitting}
                  className="w-full rounded-2xl px-8 py-6 text-lg font-medium text-white shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5 disabled:opacity-70"
                  style={{ background: "var(--color-accent-sage)" }}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      Submit Registration
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </>
                  )}
                </Button>
                
                <p className="text-sm text-center text-[var(--color-neutral-dark)]">
                  By submitting this form, you agree to be contacted by Group Escape Houses regarding your property listing.
                </p>
              </form>
            </div>
          ) : (
            <div className="bg-white rounded-3xl shadow-xl p-12 text-center border-2 border-[var(--color-accent-sage)]/20">
              <div className="w-20 h-20 bg-[var(--color-accent-sage)]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-10 h-10 text-[var(--color-accent-sage)]" />
              </div>
              <h3 className="text-3xl font-bold mb-4" style={{ fontFamily: "var(--font-display)" }}>Registration Received!</h3>
              <p className="text-xl text-[var(--color-neutral-dark)] mb-8">
                One of our account managers will review your property and contact you within 48 hours to discuss the next steps.
              </p>
              <Button asChild variant="outline" className="rounded-xl px-8 py-4">
                <Link href="/">Return to Homepage</Link>
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* FAQs Section */}
      <section className="py-20 bg-[var(--color-bg-primary)]">
        <div className="max-w-[900px] mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6" style={{ fontFamily: "var(--font-display)" }}>
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-[var(--color-neutral-dark)]">
              Everything you need to know about listing your property with us.
            </p>
          </div>
          
          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <details 
                key={index}
                className="group bg-white rounded-2xl p-6 hover:shadow-lg transition-all"
              >
                <summary className="flex items-start justify-between cursor-pointer list-none">
                  <h3 className="text-xl font-bold pr-8" style={{ fontFamily: "var(--font-display)" }}>
                    {faq.question}
                  </h3>
                  <ArrowRight className="w-6 h-6 text-[var(--color-accent-sage)] transform group-open:rotate-90 transition-transform flex-shrink-0" />
                </summary>
                <p className="mt-4 text-[var(--color-neutral-dark)] leading-relaxed">
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 bg-[var(--color-bg-secondary)]">
        <div className="max-w-[1200px] mx-auto px-6 text-center">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6" style={{ fontFamily: "var(--font-display)" }}>
            Join Group Escape Houses Today
          </h2>
          <p className="text-xl text-[var(--color-neutral-dark)] mb-8 max-w-3xl mx-auto">
            Ready to elevate your property's potential? Partner with us for direct bookings and seamless management.
          </p>
          
          <div className="flex flex-wrap gap-4 justify-center mb-12">
            <Button 
              asChild
              size="lg"
              className="rounded-2xl px-8 py-6 text-lg font-medium text-white shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5"
              style={{ background: "var(--color-accent-sage)" }}
            >
              <Link href="#apply">
                Register Now
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
            
            <Button 
              asChild
              size="lg"
              variant="outline"
              className="rounded-2xl px-8 py-6 text-lg font-medium border-2"
              style={{ borderColor: "var(--color-accent-gold)" }}
            >
              <Link href="/contact">Contact Our Team</Link>
            </Button>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-2xl mx-auto text-left">
            <div className="bg-white rounded-2xl p-6">
              <h3 className="font-bold text-lg mb-2" style={{ fontFamily: "var(--font-display)" }}>
                Email Us
              </h3>
              <a href="mailto:hello@groupescapehouses.co.uk" className="text-[var(--color-accent-sage)] hover:underline">
                hello@groupescapehouses.co.uk
              </a>
            </div>
            
            <div className="bg-white rounded-2xl p-6">
              <h3 className="font-bold text-lg mb-2" style={{ fontFamily: "var(--font-display)" }}>
                Visit Our Office
              </h3>
              <p className="text-[var(--color-neutral-dark)]">
                11a North St, Brighton and Hove<br />
                Brighton BN41 1DH
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}