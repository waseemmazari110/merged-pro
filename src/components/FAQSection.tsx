"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import Link from "next/link";

interface FAQ {
  question: string;
  answer: string | React.JSX.Element;
}

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs: FAQ[] = [
    {
      question: "How do I book a hen party house?",
      answer: (
        <>
          Browse our <Link href="/properties" className="text-[var(--color-accent-sage)] underline">properties</Link>, select your preferred house, and submit an enquiry with your dates and group size. Our UK team will respond within 24 hours with availability and a quote. You can also call us for instant assistance. Learn more about <Link href="/how-it-works" className="text-[var(--color-accent-sage)] underline">how booking works</Link>.
        </>
      )
    },
    {
      question: "What is included in the price?",
      answer: (
        <>
          All our properties include utilities, Wi-Fi, and standard amenities. Most houses feature <Link href="/features/hot-tub" className="text-[var(--color-accent-sage)] underline">hot tubs</Link>, <Link href="/features/games-room" className="text-[var(--color-accent-sage)] underline">games rooms</Link>, and entertainment facilities. Additional <Link href="/experiences" className="text-[var(--color-accent-sage)] underline">experiences</Link> like <Link href="/experiences/cocktail-masterclass" className="text-[var(--color-accent-sage)] underline">cocktail classes</Link>, butlers, and <Link href="/experiences/private-chef" className="text-[var(--color-accent-sage)] underline">private chefs</Link> can be added to your booking.
        </>
      )
    },
    {
      question: "What is the deposit and payment schedule?",
      answer: (
        <>
          Bookings, payments and contracts are handled directly between guests and property owners. Each owner will have their own preferred payment methods and schedules, which you can discuss with them once you enquire. Read more about our <Link href="/booking-terms" className="text-[var(--color-accent-sage)] underline">booking terms</Link>.
        </>
      )
    },
    {
      question: "Can I cancel or change my booking?",
      answer: (
        <>
          Cancellation policies vary by property. Most bookings are non-refundable within 8 weeks of arrival. We recommend booking travel insurance. Contact our team to discuss any changes to your reservation. Full details are available in our <Link href="/booking-terms" className="text-[var(--color-accent-sage)] underline">booking terms</Link>.
        </>
      )
    },
    {
      question: "How many people can stay in a house?",
      answer: (
        <>
          Our houses accommodate groups from 8 to 30+ guests. Each <Link href="/properties" className="text-[var(--color-accent-sage)] underline">property listing</Link> shows the maximum capacity, number of bedrooms, and bed configurations. Check the property details for exact sleeping arrangements. Browse our <Link href="/house-styles/luxury-houses" className="text-[var(--color-accent-sage)] underline">luxury houses</Link> or <Link href="/house-styles/large-holiday-homes" className="text-[var(--color-accent-sage)] underline">large holiday homes</Link> for bigger groups.
        </>
      )
    },
    {
      question: "Are hen party houses suitable for other celebrations?",
      answer: (
        <>
          Absolutely! While we specialise in <Link href="/hen-party-houses" className="text-[var(--color-accent-sage)] underline">hen weekends</Link>, our properties are perfect for <Link href="/special-celebrations" className="text-[var(--color-accent-sage)] underline">birthdays</Link>, anniversaries, family reunions, and any group celebration. Browse our <Link href="/experiences" className="text-[var(--color-accent-sage)] underline">experiences</Link> to find activities for your occasion. We also cater to <Link href="/weekend-breaks" className="text-[var(--color-accent-sage)] underline">weekend breaks</Link> and <Link href="/christmas" className="text-[var(--color-accent-sage)] underline">Christmas</Link> gatherings.
        </>
      )
    },
      {
        question: "What about house rules and damage deposits?",
        answer: (
          <>
            Each property has specific house rules regarding noise, parties, and check-in times. A refundable damage deposit (typically £250-500) is required. Read our full <Link href="/how-it-works" className="text-[var(--color-accent-sage)] underline">terms and conditions</Link> for complete details. We also have helpful tips in our <Link href="/blog/hen-party-checklist" className="text-[var(--color-accent-sage)] underline">planning checklist</Link>.
          </>
        )
      },
      {
        question: "Can you arrange activities and experiences?",
        answer: (
          <>
            Yes! We offer <Link href="/experiences/cocktail-masterclass" className="text-[var(--color-accent-sage)] underline">cocktail masterclasses</Link>, <Link href="/experiences/life-drawing" className="text-[var(--color-accent-sage)] underline">butlers in the buff and life drawing</Link>, <Link href="/experiences/private-chef" className="text-[var(--color-accent-sage)] underline">private chefs</Link>, <Link href="/spa-treatments" className="text-[var(--color-accent-sage)] underline">spa treatments</Link>, and more. View our <Link href="/experiences" className="text-[var(--color-accent-sage)] underline">experiences page</Link> to see all available add-ons and pricing. Looking for inspiration? Check out our <Link href="/blog/alternative-hen-party-ideas" className="text-[var(--color-accent-sage)] underline">10 alternative hen party ideas</Link>.
          </>
        )
      }

  ];

  return (
    <section className="py-24 bg-white">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="mb-4" style={{ fontFamily: "var(--font-display)" }}>
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-[var(--color-neutral-dark)] max-w-2xl mx-auto">
            Everything you need to know about booking your perfect hen party house
          </p>
        </div>

        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="border border-[var(--color-accent-gold)]/30 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-[var(--color-accent-gold)]"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-6 py-5 flex items-center justify-between text-left transition-all duration-200 hover:bg-[var(--color-accent-gold)]/10"
              >
                <h3
                  className="text-lg font-semibold pr-4"
                  style={{ fontFamily: "var(--font-body)", color: "var(--color-text-primary)" }}
                >
                  {faq.question}
                </h3>
                <ChevronDown
                  className={`w-5 h-5 flex-shrink-0 transition-transform duration-300 ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                  style={{ color: "var(--color-accent-gold)" }}
                />
              </button>
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  openIndex === index ? "max-h-96" : "max-h-0"
                }`}
              >
                <div className="px-6 pb-5 text-[var(--color-neutral-dark)]">
                  {faq.answer}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-[var(--color-neutral-dark)] mb-4">
            Still have questions? We're here to help!
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 text-lg font-semibold hover:underline"
            style={{ color: "var(--color-accent-gold)" }}
          >
            Contact our UK team
          </Link>
        </div>
      </div>
    </section>
  );
}