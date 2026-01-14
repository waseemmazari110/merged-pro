"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import UKServiceSchema from "@/components/UKServiceSchema";

export default function HouseStylesAndFeaturesPage() {
  const houseStyles = [
    { title: "Manor Houses", slug: "manor-houses" },
    { title: "Country Houses", slug: "country-houses" },
    { title: "Luxury Houses", slug: "luxury-houses" },
    { title: "Castles", slug: "castles" },
    { title: "Luxury Dog Friendly Cottages", slug: "luxury-dog-friendly-cottages" },
    { title: "Unusual & Quirky", slug: "unusual-and-quirky" },
    { title: "Family Holidays", slug: "family-holidays" },
    { title: "Party Houses", slug: "party-houses" },
    { title: "Large Cottages", slug: "large-cottages" },
    { title: "Stately Houses", slug: "stately-houses" },
    { title: "Large Holiday Homes", slug: "large-holiday-homes" },
    { title: "Luxury Cottages with Sea Views", slug: "luxury-cottages-with-sea-views" },
  ];

  const features = [
    { title: "Games Room", slug: "games-room" },
    { title: "Tennis Court", slug: "tennis-court" },
    { title: "Swimming Pool", slug: "swimming-pool" },
    { title: "Cinema Room", slug: "cinema-room" },
    { title: "Hot Tub", slug: "hot-tub" },
    { title: "EV Charging", slug: "ev-charging" },
    { title: "Fishing Lake", slug: "fishing-lake" },
    { title: "Direct Beach Access", slug: "direct-beach-access" },
    { title: "Ground Floor Bedroom", slug: "ground-floor-bedroom" },
    { title: "Indoor Swimming Pool", slug: "indoor-swimming-pool" },
  ];

  return (
    <div className="min-h-screen">
      <UKServiceSchema 
        type="breadcrumb" 
        data={{
          breadcrumbs: [
            { name: "Home", url: "/" },
            { name: "Styles & Features", url: "/house-styles-and-features" }
          ]
        }}
      />
      <Header />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-[var(--color-bg-primary)]">
        <div className="max-w-[1200px] mx-auto px-6">
          <h1 className="mb-6 text-center" style={{ fontFamily: "var(--font-display)" }}>
            House Styles & Must-Have Features
          </h1>
          <p className="text-xl text-center text-[var(--color-neutral-dark)] max-w-3xl mx-auto leading-relaxed">
            Explore our range of unique UK group accommodation — from grand manor houses to cosy countryside retreats. Whether you're after a swimming pool, hot tub, or cinema room, find the perfect setting for your next celebration.
          </p>
        </div>
      </section>

      {/* Main Content Grid */}
      <section className="py-16 bg-white">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* House Styles - Left 2/3 */}
            <div className="lg:col-span-2">
              <h2 className="mb-8" style={{ fontFamily: "var(--font-display)" }}>
                House Styles
              </h2>
              <div className="space-y-4">
                {houseStyles.map((style) => (
                  <Link
                    key={style.slug}
                    href={`/house-styles/${style.slug}`}
                    className="group flex items-center justify-between p-5 rounded-xl bg-[var(--color-bg-primary)] hover:bg-[var(--color-bg-secondary)] transition-all duration-300 hover:shadow-md"
                  >
                    <span className="text-lg font-medium text-[var(--color-text-primary)] group-hover:text-[var(--color-accent-sage)] transition-colors">
                      {style.title}
                    </span>
                    <ArrowRight className="w-5 h-5 text-[var(--color-accent-sage)] group-hover:translate-x-1 transition-transform duration-300" />
                  </Link>
                ))}
              </div>
            </div>

            {/* Must-Have Features - Right 1/3 */}
            <div>
              <h2 className="mb-8" style={{ fontFamily: "var(--font-display)" }}>
                Must-Have Features
              </h2>
              <div className="space-y-4 mb-8">
                {features.map((feature) => (
                  <Link
                    key={feature.slug}
                    href={`/features/${feature.slug}`}
                    className="group flex items-center justify-between p-5 rounded-xl bg-[var(--color-bg-primary)] hover:bg-[var(--color-bg-secondary)] transition-all duration-300 hover:shadow-md"
                  >
                    <span className="text-lg font-medium text-[var(--color-text-primary)] group-hover:text-[var(--color-accent-gold)] transition-colors">
                      {feature.title}
                    </span>
                    <ArrowRight className="w-5 h-5 text-[var(--color-accent-gold)] group-hover:translate-x-1 transition-transform duration-300" />
                  </Link>
                ))}
              </div>

              {/* Feature Image */}
              <div className="rounded-2xl overflow-hidden shadow-xl">
                <img
                  src="https://images.unsplash.com/photo-1576610616656-d3aa5d1f4534?w=800&q=90"
                  alt="Indoor swimming pool"
                  className="w-full h-64 object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Middle Feature Image */}
      <section className="py-16 bg-[var(--color-bg-primary)]">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="rounded-3xl overflow-hidden shadow-2xl">
            <img
              src="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1600&q=90"
              alt="Luxury property with pool"
              className="w-full h-[500px] object-cover"
            />
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}