"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Mail, Phone, MessageCircle, Clock, Calendar, Check, Star, Shield, Users, ChevronDown, ChevronUp } from "lucide-react";
import { DayPicker } from "react-day-picker";
import { formatDateUKLong } from "@/lib/date-utils";
import "react-day-picker/dist/style.css";
import "./datepicker-styles.css";
import { toast } from "sonner";
import Script from "next/script";
import UKServiceSchema from "@/components/UKServiceSchema";

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  groupSize?: string;
  dates?: string;
  location?: string;
}

const faqs = [
  {
    question: "How quickly will you respond to my enquiry?",
    answer: "We typically respond within 2 hours during office hours (Mon-Fri 9am-6pm, Sat 10am-4pm). For urgent requests, call us directly on 01273 569301."
  },
  {
    question: "Is there any obligation when I submit an enquiry?",
    answer: "No obligation at all. We'll provide you with options and pricing, and you're free to decide in your own time. No pressure, no hidden fees."
  },
  {
    question: "How does pricing work for group bookings?",
    answer: "Pricing varies by property, dates, and group size. We'll send you a clear quote with all costs included—no surprises. Many properties offer midweek discounts too."
  }
];

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    groupSize: "",
    dates: "",
    location: "",
    message: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [showCalendar, setShowCalendar] = useState(false);
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

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

  const validateField = (name: string, value: string): string | undefined => {
    switch (name) {
      case 'name':
        if (!value.trim()) return 'Please enter your name';
        if (value.trim().length < 2) return 'Name must be at least 2 characters';
        break;
      case 'email':
        if (!value.trim()) return 'Please enter your email';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Please enter a valid email address';
        break;
      case 'phone':
        if (value && !/^[\d\s+()-]{10,}$/.test(value.replace(/\s/g, ''))) return 'Please enter a valid UK phone number';
        break;
      case 'groupSize':
        if (!value) return 'Please select your group size';
        break;
      case 'dates':
        if (!value) return 'Please select your preferred dates';
        break;
    }
    return undefined;
  };

  const handleBlur = (name: string) => {
    setTouched(prev => ({ ...prev, [name]: true }));
    const error = validateField(name, formData[name as keyof typeof formData]);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const handleChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    if (touched[name]) {
      const error = validateField(name, value);
      setErrors(prev => ({ ...prev, [name]: error }));
    }
  };

  const handleDateSelect = (range: { from?: Date; to?: Date } | undefined) => {
    if (range) {
      setDateRange(range);
      if (range.from && range.to) {
        const formattedDates = `${formatDateUKLong(range.from)} - ${formatDateUKLong(range.to)}`;
        handleChange('dates', formattedDates);
      } else if (range.from) {
        const formattedDate = formatDateUKLong(range.from);
        handleChange('dates', formattedDate);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors: FormErrors = {};
    Object.keys(formData).forEach(key => {
      if (key !== 'message' && key !== 'location') {
        const error = validateField(key, formData[key as keyof typeof formData]);
        if (error) newErrors[key as keyof FormErrors] = error;
      }
    });

    setErrors(newErrors);
    setTouched({ name: true, email: true, phone: true, groupSize: true, dates: true });

    if (Object.keys(newErrors).length > 0) {
      toast.error('Please fill in all required fields correctly');
      return;
    }

    setIsSubmitting(true);

    try {
      const challenge = Math.floor(Date.now() / 10000).toString();

      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          honeypot,
          timestamp: formLoadTime.toString(),
          challenge,
          userInteraction
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send enquiry');
      }

      toast.success("Enquiry sent! We'll be in touch within 2 hours.");
      
      setFormData({
        name: "",
        email: "",
        phone: "",
        groupSize: "",
        dates: "",
        location: "",
        message: "",
      });
      setDateRange({});
      setTouched({});
      setErrors({});
      setUserInteraction({ clicks: 0, keystrokes: 0 });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to send enquiry. Please try again.");
      console.error("Form submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactPageSchema = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "name": "Contact Group Escape Houses - Group Accommodation UK",
    "description": "Get a free, no-obligation quote for your group stay. Fast response from our UK-based team. Book luxury accommodation for groups of 10-30+.",
    "url": "https://www.groupescapehouses.co.uk/contact",
    "mainEntityOfPage": { "@id": "https://www.groupescapehouses.co.uk/#organization" }
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };

  return (
    <>
      <UKServiceSchema
        type="breadcrumb"
        data={{
          breadcrumbs: [
            { name: "Home", url: "/" },
            { name: "Contact", url: "/contact" }
          ]
        }}
      />
      <UKServiceSchema type="faq" data={{ faqs }} />

      <div className="min-h-screen bg-[var(--color-bg-primary)]">
        <Header />

        <section className="pt-28 pb-8 md:pt-32 md:pb-12 px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4" style={{ fontFamily: "var(--font-display)" }}>
              Contact Group Escape Houses
            </h1>
            <p className="text-lg md:text-xl text-[var(--color-neutral-dark)] mb-6">
              Large Group Accommodation Across the UK
            </p>
            
            <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm mb-6">
              <div className="flex -space-x-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <span className="text-sm font-medium">Trusted by 10,000+ groups</span>
            </div>
          </div>
        </section>

        <section className="pb-16 md:pb-24 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
              
              <div className="lg:col-span-3 order-1">
                  <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
                    <div className="text-center mb-6">
                      <h2 className="text-2xl md:text-3xl font-bold mb-2" style={{ fontFamily: "var(--font-display)" }}>
                        Get Your Group Quote
                      </h2>
                      <p className="text-[var(--color-neutral-dark)]">
                        Fast response, no obligation
                      </p>
                    </div>


                  <form ref={formRef} onSubmit={handleSubmit} className="space-y-5">
                    <input
                      type="text"
                      name="website"
                      value={honeypot}
                      onChange={(e) => setHoneypot(e.target.value)}
                      style={{ position: 'absolute', left: '-9999px', width: '1px', height: '1px' }}
                      tabIndex={-1}
                      autoComplete="off"
                      aria-hidden="true"
                    />

                    <div>
                      <label htmlFor="name" className="block text-sm font-semibold mb-2">
                        Your Name <span className="text-red-500">*</span>
                      </label>
                        <input
                          id="name"
                          type="text"
                          value={formData.name}
                          onChange={(e) => handleChange('name', e.target.value)}
                          onBlur={() => handleBlur('name')}
                          autoComplete="name"
                          className={`w-full px-4 py-3.5 rounded-xl border-2 transition-colors text-base ${
                            errors.name && touched.name 
                              ? 'border-red-400 focus:border-red-500' 
                              : 'border-gray-200 focus:border-[var(--color-accent-sage)]'
                          } focus:outline-none min-h-[48px]`}
                          aria-invalid={!!errors.name}
                          aria-describedby={errors.name ? 'name-error' : undefined}
                        />
                        {errors.name && touched.name && (
                          <p id="name-error" className="mt-1.5 text-sm text-red-500 flex items-center gap-1">
                            {errors.name}
                          </p>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                          <label htmlFor="email" className="block text-sm font-semibold mb-2">
                            Email Address <span className="text-red-500">*</span>
                          </label>
                          <input
                            id="email"
                            type="email"
                            value={formData.email}
                            onChange={(e) => handleChange('email', e.target.value)}
                            onBlur={() => handleBlur('email')}
                            inputMode="email"
                            autoComplete="email"
                            autoCapitalize="none"
                            className={`w-full px-4 py-3.5 rounded-xl border-2 transition-colors text-base ${
                              errors.email && touched.email 
                                ? 'border-red-400 focus:border-red-500' 
                                : 'border-gray-200 focus:border-[var(--color-accent-sage)]'
                            } focus:outline-none min-h-[48px]`}
                            aria-invalid={!!errors.email}
                            aria-describedby={errors.email ? 'email-error' : undefined}
                          />
                          {errors.email && touched.email && (
                            <p id="email-error" className="mt-1.5 text-sm text-red-500">
                              {errors.email}
                            </p>
                          )}
                        </div>
                        <div>
                          <label htmlFor="phone" className="block text-sm font-semibold mb-2">
                            Phone Number
                          </label>
                          <input
                            id="phone"
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => handleChange('phone', e.target.value)}
                            onBlur={() => handleBlur('phone')}
                            inputMode="tel"
                            autoComplete="tel"
                            className={`w-full px-4 py-3.5 rounded-xl border-2 transition-colors text-base ${
                              errors.phone && touched.phone 
                                ? 'border-red-400 focus:border-red-500' 
                                : 'border-gray-200 focus:border-[var(--color-accent-sage)]'
                            } focus:outline-none min-h-[48px]`}
                            aria-invalid={!!errors.phone}
                            aria-describedby={errors.phone ? 'phone-error' : undefined}
                          />
                          {errors.phone && touched.phone && (
                            <p id="phone-error" className="mt-1.5 text-sm text-red-500">
                              {errors.phone}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="relative">
                          <label htmlFor="dates" className="block text-sm font-semibold mb-2">
                            Event Date <span className="text-red-500">*</span>
                          </label>
                          <div className="relative">
                            <input
                              id="dates"
                              type="text"
                              value={formData.dates}
                              onClick={() => setShowCalendar(!showCalendar)}
                              onBlur={() => handleBlur('dates')}
                              readOnly
                              inputMode="none"
                              className={`w-full px-4 py-3.5 pr-12 rounded-xl border-2 transition-colors text-base cursor-pointer ${
                                errors.dates && touched.dates 
                                  ? 'border-red-400 focus:border-red-500' 
                                  : 'border-gray-200 focus:border-[var(--color-accent-sage)]'
                              } focus:outline-none min-h-[48px]`}
                              placeholder="Select dates"
                              aria-invalid={!!errors.dates}
                              aria-describedby={errors.dates ? 'dates-error' : undefined}
                            />
                            <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                          </div>
                          {errors.dates && touched.dates && (
                            <p id="dates-error" className="mt-1.5 text-sm text-red-500">
                              {errors.dates}
                            </p>
                          )}
                          {showCalendar && (
                            <div className="absolute z-50 mt-2 bg-white border border-gray-200 rounded-xl shadow-xl p-4 left-0 right-0 md:left-auto md:right-auto">
                              <DayPicker
                                mode="range"
                                selected={dateRange as any}
                                onSelect={handleDateSelect}
                                disabled={{ before: new Date() }}
                              />
                              <div className="mt-3 flex gap-2">
                                {dateRange.from && dateRange.to && (
                                  <button
                                    type="button"
                                    onClick={() => setShowCalendar(false)}
                                    className="flex-1 px-4 py-2.5 text-sm font-medium text-white rounded-lg transition-colors min-h-[44px]"
                                    style={{ background: "var(--color-accent-sage)" }}
                                  >
                                    Confirm Dates
                                  </button>
                                )}
                                <button
                                  type="button"
                                  onClick={() => {
                                    setDateRange({});
                                    handleChange('dates', '');
                                  }}
                                  className="px-4 py-2.5 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors min-h-[44px]"
                                >
                                  Clear
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                        <div>
                          <label htmlFor="location" className="block text-sm font-semibold mb-2">
                            Preferred Location
                          </label>
                          <select
                            id="location"
                            value={formData.location}
                            onChange={(e) => handleChange('location', e.target.value)}
                            className="w-full px-4 py-3.5 rounded-xl border-2 border-gray-200 focus:border-[var(--color-accent-sage)] focus:outline-none text-base appearance-none bg-white min-h-[48px]"
                            style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%239ca3af'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem center', backgroundSize: '1.25rem' }}
                          >
                            <option value="">Any location</option>
                            <option value="bath">Bath</option>
                            <option value="brighton">Brighton</option>
                            <option value="bristol">Bristol</option>
                            <option value="cotswolds">Cotswolds</option>
                            <option value="lake-district">Lake District</option>
                            <option value="london">London</option>
                            <option value="manchester">Manchester</option>
                            <option value="newquay">Newquay</option>
                            <option value="york">York</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label htmlFor="groupSize" className="block text-sm font-semibold mb-2">
                          Group Size <span className="text-red-500">*</span>
                        </label>
                        <select
                          id="groupSize"
                          value={formData.groupSize}
                          onChange={(e) => handleChange('groupSize', e.target.value)}
                          onBlur={() => handleBlur('groupSize')}
                          className={`w-full px-4 py-3.5 rounded-xl border-2 transition-colors text-base appearance-none bg-white ${
                            errors.groupSize && touched.groupSize 
                              ? 'border-red-400 focus:border-red-500' 
                              : 'border-gray-200 focus:border-[var(--color-accent-sage)]'
                          } focus:outline-none min-h-[48px]`}
                          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%239ca3af'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem center', backgroundSize: '1.25rem' }}
                          aria-invalid={!!errors.groupSize}
                          aria-describedby={errors.groupSize ? 'groupSize-error' : undefined}
                        >
                          <option value="">Select group size</option>
                          <option value="6-10">6-10 guests</option>
                          <option value="11-15">11-15 guests</option>
                          <option value="16-20">16-20 guests</option>
                          <option value="21-30">21-30 guests</option>
                          <option value="30+">30+ guests</option>
                        </select>
                        {errors.groupSize && touched.groupSize && (
                          <p id="groupSize-error" className="mt-1.5 text-sm text-red-500">
                            {errors.groupSize}
                          </p>
                        )}
                      </div>

                      <div>
                        <label htmlFor="message" className="block text-sm font-semibold mb-2">
                          Anything else we should know? <span className="text-gray-400 font-normal">(optional)</span>
                        </label>
                        <textarea
                          id="message"
                          value={formData.message}
                          onChange={(e) => handleChange('message', e.target.value)}
                          rows={3}
                          className="w-full px-4 py-3.5 rounded-xl border-2 border-gray-200 focus:border-[var(--color-accent-sage)] focus:outline-none resize-none text-base min-h-[100px]"
                          placeholder="E.g. activities you're interested in, special requirements..."
                        />
                      </div>

                      <Button
                        type="submit"
                        size="lg"
                        disabled={isSubmitting}
                        className="w-full rounded-xl py-4 md:py-5 text-base md:text-lg font-semibold transition-all duration-200 hover:shadow-lg active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed min-h-[56px] relative z-10"
                        style={{ background: "var(--color-accent-sage)", color: "white" }}
                      >
                        {isSubmitting ? "Sending..." : "Get Your Free Quote"}
                      </Button>

                    <p className="text-center text-sm text-[var(--color-neutral-dark)] flex items-center justify-center gap-2">
                      <Clock className="w-4 h-4" />
                      We usually reply within 2 hours
                    </p>
                  </form>
                </div>
              </div>

              <div className="lg:col-span-2 order-2 space-y-6">
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h3 className="font-bold text-lg mb-4" style={{ fontFamily: "var(--font-display)" }}>
                    Why Book With Us
                  </h3>
                  <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-full bg-[var(--color-accent-sage)]/10 flex items-center justify-center flex-shrink-0">
                          <Clock className="w-5 h-5 text-[var(--color-accent-sage)]" />
                        </div>
                        <div>
                          <p className="font-semibold text-sm">10+ Years Experience</p>
                          <p className="text-sm text-[var(--color-neutral-dark)]">Trusted group accommodation specialists since 2014</p>
                        </div>
                      </div>

                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-[var(--color-accent-sage)]/10 flex items-center justify-center flex-shrink-0">
                        <Star className="w-5 h-5 text-[var(--color-accent-sage)]" />
                      </div>
                      <div>
                        <p className="font-semibold text-sm">5-Star Reviews</p>
                        <p className="text-sm text-[var(--color-neutral-dark)]">Rated excellent by thousands of groups</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-[var(--color-accent-sage)]/10 flex items-center justify-center flex-shrink-0">
                        <Shield className="w-5 h-5 text-[var(--color-accent-sage)]" />
                      </div>
                      <div>
                        <p className="font-semibold text-sm">UK-Based Support</p>
                        <p className="text-sm text-[var(--color-neutral-dark)]">Real people, based in Brighton</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-[var(--color-accent-sage)]/10 flex items-center justify-center flex-shrink-0">
                        <Users className="w-5 h-5 text-[var(--color-accent-sage)]" />
                      </div>
                      <div>
                        <p className="font-semibold text-sm">10,000+ Groups Helped</p>
                        <p className="text-sm text-[var(--color-neutral-dark)]">We know what makes a great hen do</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h3 className="font-bold text-lg mb-4" style={{ fontFamily: "var(--font-display)" }}>
                    Other Ways to Reach Us
                  </h3>
                  <div className="space-y-3">
                    <a
                      href="tel:+441273569301"
                      className="flex items-center gap-3 p-3 rounded-xl bg-[var(--color-bg-primary)] hover:bg-gray-100 transition-colors"
                    >
                      <div className="w-10 h-10 rounded-full bg-[var(--color-accent-sage)] flex items-center justify-center">
                        <Phone className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="font-semibold text-sm">Call Us</p>
                        <p className="text-[var(--color-accent-sage)]">01273 569301</p>
                      </div>
                    </a>
                        <a
                          href="mailto:hello@groupescapehouses.co.uk"
                          className="flex items-center gap-3 p-3 rounded-xl bg-[var(--color-bg-primary)] hover:bg-gray-100 transition-colors"
                        >
                          <div className="w-10 h-10 rounded-full bg-[var(--color-accent-sage)] flex items-center justify-center">
                            <Mail className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <p className="font-semibold text-sm">Email Us</p>
                            <p className="text-[var(--color-accent-sage)] text-sm">hello@groupescapehouses.co.uk</p>
                          </div>
                        </a>

                    <a
                      href="https://wa.me/441273569301"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 rounded-xl bg-[var(--color-bg-primary)] hover:bg-gray-100 transition-colors"
                    >
                      <div className="w-10 h-10 rounded-full bg-[#25D366] flex items-center justify-center">
                        <MessageCircle className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="font-semibold text-sm">WhatsApp</p>
                        <p className="text-[#25D366] text-sm">Message us directly</p>
                      </div>
                    </a>
                  </div>
                </div>

                <div className="text-center py-4">
                  <p className="text-sm text-[var(--color-neutral-dark)] mb-2">Popular searches:</p>
                  <div className="flex flex-wrap justify-center gap-2">
                    <Link href="/hen-party-houses" className="text-sm text-[var(--color-accent-sage)] hover:underline">Hen Party Houses</Link>
                    <span className="text-gray-300">•</span>
                    <Link href="/destinations/brighton" className="text-sm text-[var(--color-accent-sage)] hover:underline">Brighton</Link>
                    <span className="text-gray-300">•</span>
                    <Link href="/destinations/cotswolds" className="text-sm text-[var(--color-accent-sage)] hover:underline">Cotswolds</Link>
                    <span className="text-gray-300">•</span>
                    <Link href="/experiences" className="text-sm text-[var(--color-accent-sage)] hover:underline">Activities</Link>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-12 max-w-3xl mx-auto">
              <h2 className="text-2xl font-bold text-center mb-6" style={{ fontFamily: "var(--font-display)" }}>
                Frequently Asked Questions
              </h2>
              <div className="space-y-3">
                {faqs.map((faq, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-xl shadow-sm overflow-hidden"
                  >
                    <button
                      onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                      className="w-full px-5 py-4 text-left flex items-center justify-between gap-4 hover:bg-gray-50 transition-colors"
                      aria-expanded={expandedFaq === index}
                    >
                      <span className="font-semibold text-[15px]">{faq.question}</span>
                      {expandedFaq === index ? (
                        <ChevronUp className="w-5 h-5 text-[var(--color-accent-sage)] flex-shrink-0" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                      )}
                    </button>
                    {expandedFaq === index && (
                      <div className="px-5 pb-4">
                        <p className="text-[var(--color-neutral-dark)] text-[15px] leading-relaxed">
                          {faq.answer}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
}
