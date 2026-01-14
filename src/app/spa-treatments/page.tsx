"use client";

import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FAQAccordion from "@/components/FAQAccordion";
import { Button } from "@/components/ui/button";
import { Sparkles, Heart, Wine, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import UKServiceSchema from "@/components/UKServiceSchema";

export default function SpaPage() {
  const faqs = [
    {
      question: "How long are the treatment sessions?",
      answer: "Choose from 30 or 45-minute treatments per person. We also offer express treatments for a lower cost – ask our booking team for more details on these shorter options.",
    },
    {
      question: "What treatments can we choose from?",
      answer: "You can select from manicures, pedicures, Swedish or deep tissue massage, and mini facials. All treatments use premium products and are delivered by experienced, insured therapists.",
    },
    {
      question: "Do you really offer a free treatment for the bride?",
      answer: "Yes! On all bookings of 10 or more guests, the bride or special person goes FREE. It's our way of making the weekend extra special.",
    },
    {
      question: "Can we add a butler service?",
      answer: "Absolutely! A butler can be added to your spa experience for an additional cost. They'll keep drinks topped up and help create the perfect pamper atmosphere.",
    },
    {
      question: "What's included in the spa setup?",
      answer: "Our mobile therapists arrive with everything needed – massage tables, premium skincare products, towels, candles, and relaxing music. You just need to provide the space.",
    },
    {
      question: "How far in advance should we book?",
      answer: "We recommend booking spa treatments at least 4-6 weeks in advance to ensure therapist availability, especially for larger groups or weekend bookings.",
    },
    {
      question: "Can we book treatments for different times throughout the day?",
      answer: "Yes! We can stagger treatments throughout your stay. Many groups book morning sessions before activities or afternoon slots before evening celebrations.",
    },
    {
      question: "What if someone has sensitive skin or allergies?",
      answer: "Our therapists use hypoallergenic products and can accommodate most sensitivities. Just let us know about any allergies or skin conditions when booking.",
    },
    {
      question: "How many therapists will come to our property?",
      answer: "This depends on your group size and timing preferences. We'll coordinate the right number of therapists to ensure everyone gets their treatment within your preferred timeframe.",
    },
    {
      question: "Can we customize the treatment menu?",
      answer: "Yes! While we offer our core treatments, we can often arrange special requests. Speak to our booking team about any specific treatments you'd like.",
    },
    {
      question: "When do we need to pay for the spa package?",
      answer: "Spa package costs are typically paid alongside your final property balance, 8 weeks before arrival. We'll provide a clear breakdown when we confirm your booking.",
    },
    {
      question: "What happens if we need to change numbers?",
      answer: "Minor adjustments can usually be accommodated up to 14 days before arrival. Contact us as soon as possible if your group size changes.",
    },
  ];

  return (
    <div className="min-h-screen bg-[var(--color-bg-primary)]">
      <UKServiceSchema
        type="breadcrumb"
        data={{
          breadcrumbs: [
            { name: "Home", url: "/" },
            { name: "Spa Treatments", url: "/spa-treatments" }
          ]
        }}
      />
      <Header />

      {/* Hero */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="pt-32 pb-16 relative overflow-hidden"
      >
        {/* Hero Image Background */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/professional-stock-photo-of-luxury-spa-t-0db740ac-20251018122325.jpg?"
            alt="Mobile spa treatments for group celebrations at Group Escape Houses"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-bg-primary)]/95 to-[var(--color-bg-secondary)]/90"></div>
        </div>

        <div className="max-w-[1200px] mx-auto px-6 text-center relative z-10">
          <h1 className="mb-6" style={{ fontFamily: "var(--font-display)", color: "var(--color-text-primary)" }}>
            Mobile Spa Treatments UK – Luxury Pampering for Group Celebrations
          </h1>
          <p className="text-xl text-[var(--color-neutral-dark)] max-w-3xl mx-auto mb-8">
            The ultimate pamper experience, brought straight to your <Link href="/properties" className="underline hover:text-[var(--color-accent-gold)] transition-colors font-medium">luxury rental house</Link>. Perfect for <Link href="/hen-party-houses" className="underline hover:text-[var(--color-accent-gold)] transition-colors font-medium">hen parties</Link>, <Link href="/weddings" className="underline hover:text-[var(--color-accent-gold)] transition-colors font-medium">weddings</Link>, <Link href="/special-celebrations" className="underline hover:text-[var(--color-accent-gold)] transition-colors font-medium">birthdays</Link>, and group getaways at any of our <Link href="/destinations" className="underline hover:text-[var(--color-accent-gold)] transition-colors font-medium">UK destinations</Link>.
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
            <Link href="/contact">Add Spa to Your Stay</Link>
          </Button>
        </div>
      </motion.section>

      {/* Intro Section */}
      <section className="py-12 bg-white">
        <div className="max-w-[1200px] mx-auto px-6">
          <p className="text-lg text-center max-w-4xl mx-auto leading-relaxed" style={{ color: "var(--color-neutral-dark)" }}>
            At <strong>Group Escape Houses</strong>, we bring luxury spa experiences directly to your <Link href="/properties" className="font-medium text-[var(--color-accent-sage)] hover:text-[var(--color-accent-gold)] transition-colors underline decoration-dotted">party house rental</Link>. Perfect for <Link href="/hen-party-houses" className="font-medium text-[var(--color-accent-sage)] hover:text-[var(--color-accent-gold)] transition-colors">hen weekends</Link>, <Link href="/weddings" className="font-medium text-[var(--color-accent-sage)] hover:text-[var(--color-accent-gold)] transition-colors">wedding celebrations</Link>, <Link href="/special-celebrations" className="font-medium text-[var(--color-accent-sage)] hover:text-[var(--color-accent-gold)] transition-colors">birthday parties</Link>, and group getaways across the UK. Our professional mobile therapists arrive with premium equipment, creating a relaxing spa atmosphere in the comfort of your own accommodation.
          </p>
        </div>
      </section>

      {/* What's Included */}
      <section className="py-16 bg-gradient-to-br from-[#89A38F]/20 to-[#E5D8C5]/30">
        <div className="max-w-[1200px] mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h2 className="mb-6" style={{ fontFamily: "var(--font-display)", color: "var(--color-text-primary)" }}>
              What's Included in Our Mobile Spa Service
            </h2>
            <p className="text-lg max-w-3xl mx-auto" style={{ color: "var(--color-neutral-dark)" }}>
              Professional spa treatments delivered to any of our <Link href="/properties" className="underline hover:text-[var(--color-accent-gold)] transition-colors font-medium">luxury group houses</Link> across the UK
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
            className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-8"
          >
            {[
              "30 or 45-minute treatment per person (choose from manicure, pedicure, massage, or mini facial)",
              "Express treatments available for lower cost (ask our booking team for more details)",
              "Butler can be added for an additional cost",
              "Bride or special person goes FREE on all bookings of 10 or more guests",
            ].map((item, idx) => (
              <motion.div
                key={idx}
                variants={{
                  hidden: { opacity: 0, x: -20 },
                  visible: { opacity: 1, x: 0 },
                }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="flex items-start gap-3 bg-white p-5 rounded-xl shadow-sm"
              >
                <CheckCircle2 className="w-6 h-6 flex-shrink-0 mt-0.5" style={{ color: "var(--color-accent-sage)" }} />
                <span className="text-base" style={{ color: "var(--color-text-primary)" }}>
                  {item}
                </span>
              </motion.div>
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
              <Link href="/contact">Book Your Spa Experience</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* The Experience */}
      <section className="py-24 bg-white">
        <div className="max-w-[1200px] mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h2 className="mb-6" style={{ fontFamily: "var(--font-display)", color: "var(--color-text-primary)" }}>
              Luxury Pampering at Your UK Party House
            </h2>
            <p className="text-lg max-w-3xl mx-auto mb-8" style={{ color: "var(--color-neutral-dark)" }}>
              At <strong>Group Escape Houses</strong>, we bring the spa to you. Whether it's a morning of calm before <Link href="/experiences/cocktail-masterclass" className="font-medium text-[var(--color-accent-sage)] hover:text-[var(--color-accent-gold)] transition-colors">cocktails</Link> or a full afternoon of indulgence at your <Link href="/features/hot-tub" className="font-medium text-[var(--color-accent-sage)] hover:text-[var(--color-accent-gold)] transition-colors">luxury house with hot tub</Link>, our experienced therapists arrive with everything needed to transform your space into a private retreat.
            </p>
          </motion.div>

          {/* Treatment Options */}
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
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12"
          >
            {[
              {
                title: "Massage",
                description: "Swedish or deep tissue massage",
                image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/professional-stock-photo-of-massage-ther-4de196aa-20251018110153.jpg?",
                icon: Heart,
              },
              {
                title: "Facials",
                description: "Mini facials with premium skincare",
                image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/professional-stock-photo-of-spa-treatmen-27824bbd-20251018110215.jpg?",
                icon: Sparkles,
              },
              {
                title: "Nails",
                description: "Express manicures or pedicures",
                image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/professional-stock-photo-of-manicure-and-ecc16183-20251018110159.jpg?",
                icon: Sparkles,
              },
              {
                title: "Full Setup",
                description: "Full pamper party setup with candles and towels",
                image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/professional-stock-photo-of-group-of-wom-1eeffd8f-20251018110207.jpg?",
                icon: Wine,
              },
            ].map((treatment, idx) => (
              <motion.div
                key={idx}
                variants={{
                  hidden: { opacity: 0, y: 30 },
                  visible: { opacity: 1, y: 0 },
                }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="bg-[var(--color-neutral-light)] rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={treatment.image}
                    alt={treatment.title}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                  />
                  <div className="absolute top-4 left-4 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm">
                    <treatment.icon className="w-5 h-5" style={{ color: "var(--color-accent-sage)" }} />
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2" style={{ color: "var(--color-text-primary)" }}>
                    {treatment.title}
                  </h3>
                  <p className="text-sm" style={{ color: "var(--color-neutral-dark)" }}>
                    {treatment.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Locations */}
      <section className="py-24 bg-[var(--color-bg-secondary)]">
        <div className="max-w-[1200px] mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-8"
          >
            <h2 className="mb-4" style={{ fontFamily: "var(--font-display)", color: "var(--color-text-primary)" }}>
              Available Across the UK
            </h2>
            <p className="text-lg max-w-2xl mx-auto mb-6" style={{ color: "var(--color-neutral-dark)" }}>
              Our mobile spa teams cover the most popular <Link href="/destinations" className="underline hover:text-[var(--color-accent-gold)] transition-colors font-medium">group celebration destinations</Link> in England, Wales and Scotland
            </p>
          </motion.div>

          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {[
              { name: "Bath", slug: "bath" },
              { name: "Birmingham", slug: "birmingham" },
              { name: "Blackpool", slug: "blackpool" },
              { name: "Bournemouth", slug: "bournemouth" },
              { name: "Brighton", slug: "brighton" },
              { name: "Bristol", slug: "bristol" },
              { name: "Cambridge", slug: "cambridge" },
              { name: "Cardiff", slug: "cardiff" },
            ].map((location, idx) => (
              <Link
                key={idx}
                href={`/destinations/${location.slug}`}
                className="px-6 py-3 bg-white rounded-full text-sm font-medium hover:bg-[var(--color-accent-sage)] hover:text-white transition-all duration-200 shadow-sm"
                style={{ color: "var(--color-text-primary)" }}
              >
                {location.name}
              </Link>
            ))}
          </div>

          <div className="text-center">
            <Button
              asChild
              size="lg"
              variant="outline"
              className="rounded-2xl px-10 py-6 font-medium border-2 transition-all duration-200 hover:bg-[var(--color-accent-sage)] hover:text-white hover:border-[var(--color-accent-sage)]"
              style={{
                borderColor: "var(--color-accent-sage)",
                color: "var(--color-text-primary)",
              }}
            >
              <Link href="/destinations">Check Your Location</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-white">
        <div className="max-w-[1200px] mx-auto px-6">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-6"
            style={{ fontFamily: "var(--font-display)", color: "var(--color-text-primary)" }}
          >
            How It Works
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-center text-lg max-w-3xl mx-auto mb-12"
            style={{ color: "var(--color-neutral-dark)" }}
          >
            Booking your spa package is simple and stress-free:
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
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto mb-8"
          >
            {[
              { step: "1", text: "Choose your date and group size" },
              { step: "2", text: "Select your treatments and add-ons" },
              { step: "3", text: "We confirm your therapists and arrival times" },
              { step: "4", text: "Sit back, sip prosecco, and enjoy being pampered" },
            ].map((item, idx) => (
              <motion.div
                key={idx}
                variants={{
                  hidden: { opacity: 0, y: 30 },
                  visible: { opacity: 1, y: 0 },
                }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="bg-[var(--color-neutral-light)] p-6 rounded-xl shadow-sm text-center"
              >
                <div
                  className="w-12 h-12 rounded-full mx-auto mb-4 flex items-center justify-center text-xl font-bold text-white"
                  style={{ background: "var(--color-accent-sage)" }}
                >
                  {item.step}
                </div>
                <p className="text-sm font-medium" style={{ color: "var(--color-text-primary)" }}>
                  {item.text}
                </p>
              </motion.div>
            ))}
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
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto mb-8"
          >
            {[
              "Tailored to your group",
              "Trusted, insured therapists",
              "Bride goes free for 10+ guests",
              "All equipment provided",
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
              <Link href="/contact">Request My Spa Package</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section className="py-24 bg-[var(--color-bg-secondary)]">
        <div className="max-w-[1200px] mx-auto px-6">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
            style={{ fontFamily: "var(--font-display)", color: "var(--color-text-primary)" }}
          >
            What Our Guests Say
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                quote: "The best part of our weekend! The therapists were amazing, and it felt so luxurious without leaving the house.",
                name: "Emma",
                location: "Brighton",
              },
              {
                quote: "We booked massages for all 12 of us and it was perfect. The bride was thrilled to get hers free!",
                name: "Sophie",
                location: "Bath",
              },
              {
                quote: "Such a lovely way to start the weekend. The mobile spa setup was beautiful and so relaxing.",
                name: "Rachel",
                location: "Bournemouth",
              },
            ].map((review, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="bg-white p-8 rounded-2xl shadow-md"
              >
                <p className="text-base mb-6 italic" style={{ color: "var(--color-neutral-dark)" }}>
                  "{review.quote}"
                </p>
                <div className="flex items-center gap-2">
                  <p className="font-semibold" style={{ color: "var(--color-text-primary)" }}>
                    {review.name}
                  </p>
                  <span className="text-sm" style={{ color: "var(--color-neutral-dark)" }}>
                    · {review.location}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
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
            Make Your Weekend Extra Special
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-lg max-w-2xl mx-auto mb-8"
            style={{ color: "var(--color-neutral-dark)" }}
          >
            Pamper, prosecco, and perfect memories. Book your spa experience today and let us take care of everything.
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
              variant="outline"
              className="rounded-2xl px-10 py-6 font-medium border-2 transition-all duration-200 hover:bg-[var(--color-accent-gold)] hover:text-white hover:border-[var(--color-accent-gold)]"
              style={{
                borderColor: "var(--color-accent-gold)",
                color: "var(--color-text-primary)",
              }}
            >
              <Link href="/contact">Add to My Stay</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-24 bg-[var(--color-bg-secondary)]">
        <div className="max-w-[800px] mx-auto px-6">
          <h2 className="text-center mb-4" style={{ fontFamily: "var(--font-display)", color: "var(--color-text-primary)" }}>
            Mobile Spa Treatment FAQs
          </h2>
          <p className="text-center text-lg text-[var(--color-neutral-dark)] mb-12 max-w-2xl mx-auto">
            Everything you need to know about booking mobile spa treatments with Group Escape Houses. For general booking questions, see our <Link href="/how-it-works" className="underline hover:text-[var(--color-accent-gold)] transition-colors">how it works page</Link>.
          </p>
          <FAQAccordion faqs={faqs} />
        </div>
      </section>

      <Footer />
    </div>
  );
}