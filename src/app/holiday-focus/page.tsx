"use client";

import Link from "next/link";
import { TreePine, Users, Heart, School, Building2, ChefHat, Mountain, Tent, PartyPopper } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import UKServiceSchema from "@/components/UKServiceSchema";

export default function AllHolidayFocusPage() {
  const holidayTypes = [
    {
      title: "Rural Retreats",
      description: "Escape to the countryside in luxury group accommodation.",
      href: "/holiday-focus/rural-retreats",
      icon: TreePine
    },
    {
      title: "Multi-Generational Holidays",
      description: "Space for the whole family, from grandparents to grandchildren.",
      href: "/holiday-focus/multi-generational-holidays",
      icon: Users
    },
    {
      title: "Girls Weekend Getaways",
      description: "The perfect setting for a stylish and fun girls' weekend away.",
      href: "/holiday-focus/girls-weekend-getaways",
      icon: Heart
    },
    {
      title: "Group City Breaks",
      description: "Explore the UK's best cities from a luxury group house base.",
      href: "/holiday-focus/group-city-breaks",
      icon: Building2
    },
    {
      title: "Adventure Holidays",
      description: "Group accommodation near the best outdoor activities in the UK.",
      href: "/holiday-focus/adventure-holidays",
      icon: Mountain
    },
    {
      title: "Retreat Venues",
      description: "Quiet and inspiring spaces for wellness and creative retreats.",
      href: "/holiday-focus/retreat-venues",
      icon: Tent
    },
    {
      title: "Business Offsite and Corporate Accommodation",
      description: "Professional spaces for team building and business retreats.",
      href: "/holiday-focus/business-offsite-corporate-accommodation",
      icon: Building2
    },
    {
      title: "Youth and School Group Accommodation",
      description: "Safe and spacious houses perfect for educational group trips.",
      href: "/holiday-focus/youth-school-group-accommodation",
      icon: School
    },
    {
      title: "Stag Do Houses",
      description: "Epic group houses for the ultimate stag weekend celebration.",
      href: "/stag-do-houses",
      icon: PartyPopper
    },
    {
      title: "Book a Private Chef for Your Group Stay",
      description: "Enhance your stay with professional catering in your holiday home.",
      href: "/holiday-focus/book-private-chef",
      icon: ChefHat
    }
  ];

  return (
    <div className="min-h-screen">
      <UKServiceSchema
        type="breadcrumb"
        data={{
          breadcrumbs: [
            { name: "Home", url: "/" },
            { name: "Holiday Focus", url: "/holiday-focus" }
          ]
        }}
      />
      <Header />
      
      {/* Hero Section */}
      <section className="relative py-24 bg-[var(--color-bg-primary)]">
        <div className="max-w-[1200px] mx-auto px-6 text-center">
          <h1 className="mb-6" style={{ fontFamily: "var(--font-display)" }}>
            Holiday Focus and Group Accommodation
          </h1>
          <p className="text-xl text-[var(--color-neutral-dark)] max-w-3xl mx-auto">
            Discover the perfect focus for your next group getaway. From rural retreats to corporate offsites, we have the ideal house for every occasion.
          </p>
        </div>
      </section>

      {/* Grid Section */}
      <section className="py-24 bg-white">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {holidayTypes.map((type, index) => {
              const Icon = type.icon;
              return (
                <motion.div
                  key={index}
                  whileHover={{ y: -5 }}
                  className="bg-[var(--color-bg-primary)] rounded-2xl p-8 shadow-sm hover:shadow-md transition-all duration-300"
                >
                  <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center mb-6 text-[var(--color-accent-sage)] shadow-sm">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h2 className="text-2xl font-semibold mb-3" style={{ fontFamily: "var(--font-body)" }}>
                    {type.title}
                  </h2>
                  <p className="text-[var(--color-neutral-dark)] mb-6">
                    {type.description}
                  </p>
                  <Link 
                    href={type.href}
                    className="text-[var(--color-accent-gold)] font-medium hover:underline inline-flex items-center gap-2"
                  >
                    Explore Now
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
