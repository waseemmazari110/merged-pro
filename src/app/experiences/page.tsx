"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FAQAccordion from "@/components/FAQAccordion";
import UKServiceSchema from "@/components/UKServiceSchema";
import { Button } from "@/components/ui/button";
import { Sparkles, CheckCircle2, MapPin, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import ExperienceCard from "@/components/ExperienceCard";

export default function ExperiencesPage() {
  // State for dynamic data
  const [experiences, setExperiences] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch experiences from database
  useEffect(() => {
    const fetchExperiences = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch('/api/experiences?isPublished=true');
        
        if (!response.ok) {
          throw new Error('Failed to fetch experiences');
        }

        const data = await response.json();

        // Transform experiences data to match component props
        const transformedExperiences = data.map((exp: any) => ({
          title: exp.title,
          duration: exp.duration,
          priceFrom: exp.priceFrom,
          groupSize: `${exp.groupSizeMin}-${exp.groupSizeMax} guests`,
          image: exp.heroImage,
          slug: exp.slug,
          popular: exp.featured || false, // Use featured field for popular
        }));

        setExperiences(transformedExperiences);
      } catch (error) {
        console.error('Error fetching experiences:', error);
        setError('Unable to load experiences. Please refresh the page.');
        setExperiences([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchExperiences();
  }, []);

  const faqs = [
    {
      question: "Can we book experiences separately or only with a property?",
      answer:
        "You can book experiences alongside your property booking. Simply select your preferred experiences when making your enquiry and we'll arrange everything for you.",
    },
    {
      question: "How far in advance should we book experiences?",
      answer:
        "We recommend booking experiences at least 4-6 weeks in advance to ensure availability, especially for popular activities like cocktail masterclasses and private chefs. However, we can sometimes arrange last-minute bookings subject to provider availability.",
    },
    {
      question: "What happens if we need to change or cancel an experience?",
      answer:
        "Changes can be made up to 14 days before your arrival subject to availability. Cancellations within 14 days may incur a fee depending on the provider. Full details are provided when you book.",
    },
    {
      question: "Are experiences suitable for all group sizes?",
      answer:
        "Most experiences can accommodate groups of 8-20 guests. Some, like private chefs and butlers, can cater to any size. We'll confirm suitability when you enquire.",
    },
    {
      question: "Can we book multiple experiences during our stay?",
      answer:
        "Absolutely! Many groups combine experiences throughout their weekend. Popular combinations include a cocktail masterclass on arrival, spa treatments the next day, and a bottomless brunch before departure. We'll help you plan the perfect schedule.",
    },
    {
      question: "What's included in the experience price?",
      answer:
        "Each experience price includes all necessary equipment, materials, and instructor/provider fees. Cocktail classes include ingredients for 3-4 drinks, life drawing includes art supplies, and private chefs include food and preparation. Specific inclusions are listed on each experience page.",
    },
    {
      question: "Can we customise experiences?",
      answer:
        "Yes! Many of our experience providers offer customisation options. Let us know your preferences when enquiring and we'll work with you to create the perfect experience.",
    },
    {
      question: "Do you cater for dietary requirements?",
      answer:
        "Yes, all our food and drink experiences can accommodate dietary requirements including vegetarian, vegan, gluten-free, and allergies. Simply let us know when booking and we'll ensure everything is arranged with the provider.",
    },
    {
      question: "When do we pay for experiences?",
      answer:
        "Experience costs are typically paid alongside your final property balance, 8 weeks before arrival. We'll provide a clear breakdown of all costs when we confirm your booking.",
    },
    {
      question: "What happens if the weather affects our planned experience?",
      answer:
        "Most of our experiences take place indoors at your property or nearby venues. For any outdoor activities, providers have contingency plans and we can help reschedule or swap to an alternative experience if needed.",
    },
    {
      question: "Can we surprise someone with an experience?",
      answer:
        "Yes! Many groups arrange surprise experiences. Just let us know in your enquiry notes and we'll coordinate discreetly with you to keep it secret until the big reveal.",
    },
    {
      question: "How long do experiences typically last?",
      answer:
        "Most experiences run for 1.5-2 hours (cocktail masterclasses, life drawing), though some like private chefs and butlers can be booked for longer periods. Specific durations are shown on each experience card and can often be extended for an additional fee.",
    },
  ];

  const destinations = [
    { name: "Brighton", slug: "brighton", image: "https://images.unsplash.com/photo-1577742111582-7d04fde85611?w=800" },
    { name: "Bath", slug: "bath", image: "https://images.unsplash.com/photo-1543974010-a99ad70cb36d?w=800" },
    { name: "Bournemouth", slug: "bournemouth", image: "https://images.unsplash.com/photo-1563821731110-33230a10bac0?w=800" },
    { name: "York", slug: "york", image: "https://images.unsplash.com/photo-1569429548424-42f0689ced64?w=800" },
    { name: "Manchester", slug: "manchester", image: "https://images.unsplash.com/photo-1515586060485-259341a5b0df?w=800" },
    { name: "Cardiff", slug: "cardiff", image: "https://images.unsplash.com/photo-1549893072-4bc678117f45?w=800" },
  ];

  const popularExperiences = experiences.filter(exp => exp.popular);
  const otherExperiences = experiences.filter(exp => !exp.popular);

  return (
    <div className="min-h-screen bg-[var(--color-bg-primary)]">
      <UKServiceSchema 
        type="breadcrumb" 
        data={{
          breadcrumbs: [
            { name: "Home", url: "/" },
            { name: "Experiences", url: "/experiences" }
          ]
        }}
      />
      <Header />

      {/* Hero */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="pt-32 pb-16 bg-gradient-to-br from-[var(--color-bg-primary)] to-[var(--color-bg-secondary)]"
      >
        <div className="max-w-[1200px] mx-auto px-6 text-center">
          <h1 className="mb-6" style={{ fontFamily: "var(--font-display)", color: "var(--color-text-primary)" }}>
            Group Experiences UK – Unforgettable Activities for Your Celebration
          </h1>
            <p className="text-xl text-[var(--color-neutral-dark)] max-w-3xl mx-auto mb-8">
              Create your dream <Link href="/hen-party-houses" className="underline hover:text-[var(--color-accent-gold)] transition-colors font-medium">hen weekend</Link>, <Link href="/weddings" className="underline hover:text-[var(--color-accent-gold)] transition-colors font-medium">wedding celebration</Link>, or <Link href="/special-celebrations" className="underline hover:text-[var(--color-accent-gold)] transition-colors font-medium">birthday party</Link> with <Link href="/experiences/spa-treatments" className="underline hover:text-[var(--color-accent-gold)] transition-colors font-medium">spa treatments</Link>, <Link href="/experiences/private-chef" className="underline hover:text-[var(--color-accent-gold)] transition-colors font-medium">private chef dining</Link>, <Link href="/experiences/yoga-session" className="underline hover:text-[var(--color-accent-gold)] transition-colors font-medium">yoga mornings</Link>, and unforgettable moments across the UK.
            </p>
          <Button
            asChild
            size="lg"
            className="rounded-2xl px-10 py-6 font-medium transition-all duration-200 hover:shadow-lg hover:-translate-y-1"
            style={{
              background: "var(--color-accent-sage)",
              color: "white",
            }}
          >
            <Link href="/contact">Add Experiences to Your Stay</Link>
          </Button>
        </div>
      </motion.section>

      {/* Intro Paragraph */}
      <section className="py-12 bg-white">
        <div className="max-w-[1200px] mx-auto px-6">
          <p className="text-lg text-center max-w-4xl mx-auto leading-relaxed" style={{ color: "var(--color-neutral-dark)" }}>
            At <strong>Group Escape Houses</strong>, we make <Link href="/special-celebrations" className="font-medium text-[var(--color-accent-sage)] hover:text-[var(--color-accent-gold)] transition-colors underline decoration-dotted">group celebrations</Link> feel effortless. Our curated activities bring together everything you love – indulgent food, pampering, laughter, and a sprinkle of luxury. Choose from <Link href="/experiences/private-chef" className="font-medium text-[var(--color-accent-sage)] hover:text-[var(--color-accent-gold)] transition-colors">chef dining</Link>, <Link href="/experiences/spa-treatments" className="font-medium text-[var(--color-accent-sage)] hover:text-[var(--color-accent-gold)] transition-colors">spa treatments</Link>, <Link href="/experiences/yoga-session" className="font-medium text-[var(--color-accent-sage)] hover:text-[var(--color-accent-gold)] transition-colors">yoga sessions</Link>, or something a little livelier like <Link href="/experiences/cocktail-masterclass" className="font-medium text-[var(--color-accent-sage)] hover:text-[var(--color-accent-gold)] transition-colors">cocktail masterclasses</Link>. Available at our <Link href="/properties" className="font-medium text-[var(--color-accent-sage)] hover:text-[var(--color-accent-gold)] transition-colors underline decoration-dotted">luxury party houses across the UK</Link> – you tell us the vibe, and we'll make it happen.
          </p>
        </div>
      </section>

      {/* Loading State */}
      {isLoading && (
        <section className="py-24 bg-[var(--color-bg-secondary)]">
          <div className="max-w-[1200px] mx-auto px-6 flex items-center justify-center min-h-[400px]">
            <Loader2 className="w-12 h-12 text-[var(--color-accent-sage)] animate-spin" />
          </div>
        </section>
      )}

      {/* Error State */}
      {error && (
        <section className="py-24 bg-[var(--color-bg-secondary)]">
          <div className="max-w-[1200px] mx-auto px-6 text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>Refresh Page</Button>
          </div>
        </section>
      )}

      {/* Most Popular Experiences */}
      {!isLoading && !error && popularExperiences.length > 0 && (
        <section className="py-24 bg-[var(--color-bg-secondary)]">
          <div className="max-w-[1200px] mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-center mb-12"
            >
              <h2 className="mb-4" style={{ fontFamily: "var(--font-display)", color: "var(--color-text-primary)" }}>
                ⭐ Most Popular Group Experiences
              </h2>
              <p className="text-lg max-w-3xl mx-auto" style={{ color: "var(--color-neutral-dark)" }}>
                Our most searched and booked activities for <Link href="/hen-party-houses" className="underline hover:text-[var(--color-accent-gold)] transition-colors font-medium">hen parties</Link>, <Link href="/weddings" className="underline hover:text-[var(--color-accent-gold)] transition-colors font-medium">weddings</Link>, <Link href="/special-celebrations" className="underline hover:text-[var(--color-accent-gold)] transition-colors font-medium">birthdays</Link> and <Link href="/special-celebrations" className="underline hover:text-[var(--color-accent-gold)] transition-colors font-medium">group celebrations</Link>. These crowd-pleasers are guaranteed to make your weekend unforgettable at any of our <Link href="/properties" className="underline hover:text-[var(--color-accent-gold)] transition-colors font-medium">UK party houses</Link>.
              </p>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={{
                visible: {
                  transition: {
                    staggerChildren: 0.1,
                  },
                },
              }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
            >
              {popularExperiences.map((experience, idx) => (
                <ExperienceCard
                  key={idx}
                  title={experience.title}
                  duration={experience.duration}
                  priceFrom={experience.priceFrom}
                  groupSize={experience.groupSize}
                  image={experience.image}
                  slug={experience.slug}
                />
              ))}
            </motion.div>

            <div className="text-center">
              <Button
                asChild
                size="lg"
                className="rounded-2xl px-10 py-6 font-medium transition-all duration-200 hover:shadow-lg hover:-translate-y-1"
                style={{
                  background: "var(--color-accent-sage)",
                  color: "white",
                }}
              >
                <Link href="/contact">Book Popular Experiences</Link>
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* All Other Experiences */}
      {!isLoading && !error && otherExperiences.length > 0 && (
        <section className="py-24 bg-white">
          <div className="max-w-[1200px] mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-center mb-12"
            >
              <h2 className="mb-4" style={{ fontFamily: "var(--font-display)", color: "var(--color-text-primary)" }}>
                More Amazing Experiences
              </h2>
              <p className="text-lg max-w-3xl mx-auto" style={{ color: "var(--color-neutral-dark)" }}>
                Browse our full collection of activities to create your perfect celebration itinerary.
              </p>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={{
                visible: {
                  transition: {
                    staggerChildren: 0.08,
                  },
                },
              }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
            >
              {otherExperiences.map((experience, idx) => (
                <ExperienceCard
                  key={idx}
                  title={experience.title}
                  duration={experience.duration}
                  priceFrom={experience.priceFrom}
                  groupSize={experience.groupSize}
                  image={experience.image}
                  slug={experience.slug}
                />
              ))}
            </motion.div>

            <div className="text-center">
              <Button
                asChild
                size="lg"
                className="rounded-2xl px-10 py-6 font-medium transition-all duration-200 hover:shadow-lg hover:-translate-y-1"
                style={{
                  background: "var(--color-accent-sage)",
                  color: "white",
                }}
              >
                <Link href="/contact">Enquire About All Experiences</Link>
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* How It Works */}
      <section className="py-24 bg-[var(--color-bg-secondary)]">
        <div className="max-w-[1200px] mx-auto px-6">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-6"
            style={{ fontFamily: "var(--font-display)", color: "var(--color-text-primary)" }}>
            ✨ How Experience Booking Works
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-center text-lg max-w-3xl mx-auto mb-12"
            style={{ color: "var(--color-neutral-dark)" }}
          >
            All experiences are optional add-ons that can be arranged when you <Link href="/properties" className="font-medium text-[var(--color-accent-sage)] hover:text-[var(--color-accent-gold)] transition-colors underline decoration-dotted">book your party house</Link> or added later. Our UK-based team at <Link href="/our-story" className="font-medium text-[var(--color-accent-sage)] hover:text-[var(--color-accent-gold)] transition-colors">Group Escape Houses</Link> takes care of everything – timings, setup, and suppliers – so all you need to do is relax and enjoy. See our full <Link href="/how-it-works" className="font-medium text-[var(--color-accent-sage)] hover:text-[var(--color-accent-gold)] transition-colors">booking process here</Link>.
          </motion.p>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{
              visible: {
                transition: {
                  staggerChildren: 0.15,
                },
              },
            }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto"
          >
            {[
              "Tailored to your group size",
              "Flexible timings",
              "Trusted local suppliers",
              "No hidden fees",
            ].map((item, idx) => (
              <motion.div
                key={idx}
                variants={{
                  hidden: { opacity: 0, x: -20 },
                  visible: { opacity: 1, x: 0 },
                }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="flex items-center gap-3 bg-white p-4 rounded-xl shadow-sm"
              >
                <CheckCircle2 className="w-6 h-6 flex-shrink-0" style={{ color: "var(--color-accent-sage)" }} />
                <span className="text-sm font-medium" style={{ color: "var(--color-text-primary)" }}>
                  {item}
                </span>
              </motion.div>
            ))}
          </motion.div>

          <div className="text-center mt-12">
            <Button
              asChild
              size="lg"
              className="rounded-2xl px-10 py-6 font-medium transition-all duration-200 hover:shadow-lg hover:-translate-y-1"
              style={{
                background: "var(--color-accent-sage)",
                color: "white",
              }}
            >
              <Link href="/contact">Request My Weekend Plan</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Make It Yours */}
      <section className="py-24 bg-white">
        <div className="max-w-[1200px] mx-auto px-6 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-6"
            style={{ fontFamily: "var(--font-display)", color: "var(--color-text-primary)" }}
          >
            💕 Personalise Your Group Celebration
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-lg max-w-3xl mx-auto mb-8"
            style={{ color: "var(--color-neutral-dark)" }}
          >
            Every <Link href="/special-celebrations" className="font-medium text-[var(--color-accent-sage)] hover:text-[var(--color-accent-gold)] transition-colors">group celebration</Link> is different, and that's what we love. Whether you're planning a <Link href="/experiences/yoga-session" className="font-medium text-[var(--color-accent-sage)] hover:text-[var(--color-accent-gold)] transition-colors">wellness retreat</Link>, a <Link href="/experiences/cocktail-masterclass" className="font-medium text-[var(--color-accent-sage)] hover:text-[var(--color-accent-gold)] transition-colors">party-filled celebration</Link>, or a relaxing getaway, Group Escape Houses can be customised to match your perfect vibe. Combine experiences at our <Link href="/features/hot-tub" className="font-medium text-[var(--color-accent-sage)] hover:text-[var(--color-accent-gold)] transition-colors">luxury houses with hot tubs</Link>, <Link href="/features/swimming-pool" className="font-medium text-[var(--color-accent-sage)] hover:text-[var(--color-accent-gold)] transition-colors">pools</Link>, and <Link href="/features/games-room" className="font-medium text-[var(--color-accent-sage)] hover:text-[var(--color-accent-gold)] transition-colors">games rooms</Link> across the UK.
          </motion.p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              asChild
              size="lg"
              className="rounded-2xl px-10 py-6 font-medium transition-all duration-200 hover:shadow-lg hover:-translate-y-1"
              style={{
                background: "var(--color-accent-sage)",
                color: "white",
              }}
            >
              <Link href="/properties">Check Availability</Link>
            </Button>
            <Button
              asChild
              size="lg"
              className="rounded-2xl px-10 py-6 font-medium transition-all duration-200 hover:shadow-lg hover:-translate-y-1"
              style={{
                background: "var(--color-accent-sage)",
                color: "white",
              }}
            >
              <Link href="/contact">Contact Our Team</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Browse by Destination */}
      <section className="py-24 bg-[var(--color-bg-secondary)]">
        <div className="max-w-[1200px] mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h2 className="mb-4" style={{ fontFamily: "var(--font-display)", color: "var(--color-text-primary)" }}>
              🗺️ Group Experiences by UK Destination
            </h2>
            <p className="text-lg max-w-3xl mx-auto" style={{ color: "var(--color-neutral-dark)" }}>
              Each destination offers unique venues and providers for your perfect <Link href="/special-celebrations" className="underline hover:text-[var(--color-accent-gold)] transition-colors font-medium">group celebration</Link>. Browse <Link href="/properties" className="underline hover:text-[var(--color-accent-gold)] transition-colors font-medium">party houses</Link> and experiences by location to see what's available in your chosen area. All our properties feature <Link href="/features/hot-tub" className="underline hover:text-[var(--color-accent-gold)] transition-colors font-medium">hot tubs</Link>, luxury amenities, and easy access to local providers.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{
              visible: {
                transition: {
                  staggerChildren: 0.1,
                },
              },
            }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {destinations.map((destination, idx) => (
              <motion.div
                key={destination.slug}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 },
                }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              >
                <Link
                  href={`/destinations/${destination.slug}`}
                  className="group block relative overflow-hidden rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 h-64"
                >
                    <img
                      src={destination.image}
                      alt={`${destination.name} luxury group accommodation`}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-300" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-white" style={{ color: 'white' }}>
                      <MapPin className="w-8 h-8 mb-3 text-white transition-transform duration-300 group-hover:scale-110" />
                      <h3 className="text-3xl font-semibold mb-2 text-white" style={{ fontFamily: "var(--font-display)", color: "white" }}>
                        {destination.name}
                      </h3>
                      <div 
                        className="mt-4 px-6 py-2 rounded-full border border-white/60 bg-white/10 backdrop-blur-sm text-sm font-medium text-white transition-all duration-300 group-hover:bg-white group-hover:text-black group-hover:border-white"
                      >
                        View Properties & Experiences →
                      </div>
                    </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>

          <div className="text-center mt-12">
              <Button
                asChild
                size="lg"
                className="rounded-2xl px-10 py-6 font-medium transition-all duration-200 hover:shadow-lg hover:-translate-y-1"
                style={{
                  background: "var(--color-accent-sage)",
                  color: "white",
                }}
              >
                <Link href="/destinations">See all locations</Link>
              </Button>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-24 bg-white">
        <div className="max-w-[800px] mx-auto px-6">
          <h2 className="text-center mb-4" style={{ fontFamily: "var(--font-display)", color: "var(--color-text-primary)" }}>
            Group Experience FAQs
          </h2>
          <p className="text-center text-lg text-[var(--color-neutral-dark)] mb-12 max-w-2xl mx-auto">
            Everything you need to know about booking experiences with Group Escape Houses. For questions about <Link href="/properties" className="underline hover:text-[var(--color-accent-gold)] transition-colors">property bookings</Link>, see our <Link href="/how-it-works" className="underline hover:text-[var(--color-accent-gold)] transition-colors">how it works page</Link>.
          </p>
          <FAQAccordion faqs={faqs} />
        </div>
      </section>

      <Footer />
    </div>
  );
}