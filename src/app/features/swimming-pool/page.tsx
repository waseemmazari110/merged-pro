import Link from "next/link";
import Image from "next/image";
import { Check, ArrowRight, Waves, Sun, Users, Droplets, Film, Gamepad2 } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import UKServiceSchema from "@/components/UKServiceSchema";
import { Button } from "@/components/ui/button";
import { db } from "@/db";
import { properties, propertyFeatures } from "@/db/schema";
import { eq } from "drizzle-orm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cottages with Pools | Large Group Houses UK",

  description: "Luxury hen party houses in the UK with outdoor swimming pools. Perfect for summer celebrations, pool parties, and unforgettable group weekends.",
  alternates: {
    canonical: "https://www.groupescapehouses.co.uk/features/swimming-pool",
  },
};

export default async function SwimmingPoolPage() {
  // Fetch properties with swimming pools for the schema and potentially a listing section
  const poolProperties = await db
    .select({
      id: properties.id,
      title: properties.title,
      slug: properties.slug,
      heroImage: properties.heroImage,
      location: properties.location,
    })
    .from(properties)
    .innerJoin(propertyFeatures, eq(properties.id, propertyFeatures.propertyId))
    .where(eq(propertyFeatures.featureName, "Swimming Pool"))
    .limit(8);

  const highlights = [
    "Outdoor pools for summer celebrations",
    "Perfect for pool parties and relaxation",
    "Beautiful garden settings with sun loungers",
    "Ideal for hot summer weekends",
    "Create unforgettable poolside memories"
  ];

  const relatedFeatures = [
    { title: "Hot Tub", slug: "hot-tub", icon: Droplets },
    { title: "Cinema Room", slug: "cinema-room", icon: Film },
    { title: "Games Room", slug: "games-room", icon: Gamepad2 },
  ];

  const popularHouseStyles = [
    { title: "Party Houses", slug: "party-houses" },
    { title: "Luxury Houses", slug: "luxury-houses" },
    { title: "Large Holiday Homes", slug: "large-holiday-homes" },
  ];

  return (
    <div className="min-h-screen">
      <UKServiceSchema 
        type="itemList" 
        data={{
          items: poolProperties
        }} 
      />
      <UKServiceSchema 
        type="breadcrumb" 
        data={{
          breadcrumbs: [
            { name: "Home", url: "/" },
            { name: "Features", url: "/house-styles-and-features" },
            { name: "Swimming Pool", url: "/features/swimming-pool" }
          ]
        }}
      />
      <Header />
      
      {/* Hero Section */}
      <section className="relative h-[70vh] min-h-[500px] flex items-center justify-center overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?w=1600&q=90"
          alt="Luxury property with swimming pool"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black/70 to-black/50"></div>
        
        <div className="relative z-10 max-w-[1200px] mx-auto px-6 text-center">
          <nav className="flex justify-center gap-2 text-sm mb-6 text-white/90">
            <Link href="/" className="hover:underline hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <Link href="/house-styles-and-features" className="hover:underline hover:text-white transition-colors">Features</Link>
            <span>/</span>
            <span className="text-white font-medium">Swimming Pool</span>
          </nav>
          
          <h1 className="mb-6 text-white" style={{ fontFamily: "var(--font-display)" }}>
            Cottages with Pools
          </h1>

          <p className="text-xl max-w-3xl mx-auto text-white/95">
            Outdoor pools for unforgettable summer celebrations and hen parties
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-24 bg-white">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <div>
              <h2 className="mb-6 text-[var(--color-text-primary)]" style={{ fontFamily: "var(--font-display)" }}>
                Hen Party Houses with Swimming Pools UK
              </h2>
              <p className="text-lg text-[var(--color-neutral-dark)] mb-6 leading-relaxed">
                Make a splash with our properties featuring outdoor swimming pools. Perfect for summer hen parties and celebrations, these houses offer beautiful poolside settings for relaxation, parties, and creating Instagram-worthy moments with your group.
              </p>
              <p className="text-lg text-[var(--color-neutral-dark)] mb-8 leading-relaxed">
                Our swimming pool properties are ideal for warm summer weekends. Combine with <Link href="/features/hot-tub" className="text-[var(--color-accent-gold)] hover:underline font-medium">hot tubs</Link> for year-round water fun, or pair with <Link href="/house-styles/luxury-houses" className="text-[var(--color-accent-gold)] hover:underline font-medium">luxury houses</Link> featuring games rooms and entertainment spaces for the ultimate hen party experience.
              </p>

              <h3 className="text-2xl font-semibold mb-4 text-[var(--color-text-primary)]" style={{ fontFamily: "var(--font-body)" }}>
                What to Expect
              </h3>
              <ul className="space-y-3 mb-8">
                {highlights.map((highlight, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <Check className="w-6 h-6 text-[var(--color-accent-gold)] flex-shrink-0 mt-0.5" />
                    <span className="text-[var(--color-neutral-dark)]">{highlight}</span>
                  </li>
                ))}
              </ul>

              <Button
                asChild
                size="lg"
                className="rounded-2xl px-10 py-6 text-white font-medium transition-all duration-200 hover:shadow-lg"
                style={{ background: "var(--color-accent-gold)" }}
              >
                <Link href="/properties">
                  Browse Pool Properties
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
            </div>

            <div className="space-y-6">
              <div className="bg-[var(--color-bg-primary)] rounded-2xl p-8">
                <Waves className="w-12 h-12 text-[var(--color-accent-gold)] mb-4" />
                <h3 className="text-3xl font-bold mb-2 text-[var(--color-text-primary)]" style={{ fontFamily: "var(--font-display)" }}>
                  Outdoor Pools
                </h3>
                <p className="text-[var(--color-neutral-dark)]">
                  Beautiful outdoor pools in stunning garden settings
                </p>
              </div>

              <div className="bg-[var(--color-bg-primary)] rounded-2xl p-8">
                <Sun className="w-12 h-12 text-[var(--color-accent-sage)] mb-4" />
                <h3 className="text-3xl font-bold mb-2 text-[var(--color-text-primary)]" style={{ fontFamily: "var(--font-display)" }}>
                  Summer Perfect
                </h3>
                <p className="text-[var(--color-neutral-dark)]">
                  Ideal for hot summer weekends and celebrations
                </p>
              </div>

              <div className="bg-[var(--color-bg-primary)] rounded-2xl p-8">
                <Users className="w-12 h-12 text-[var(--color-accent-gold)] mb-4" />
                <h3 className="text-3xl font-bold mb-2 text-[var(--color-text-primary)]" style={{ fontFamily: "var(--font-display)" }}>
                  Pool Parties
                </h3>
                <p className="text-[var(--color-neutral-dark)]">
                  Perfect setting for memorable poolside celebrations
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Features Section */}
      <section className="py-16 bg-[var(--color-bg-primary)]">
        <div className="max-w-[1200px] mx-auto px-6">
          <h2 className="mb-8 text-center text-[var(--color-text-primary)]" style={{ fontFamily: "var(--font-display)" }}>
            Other Popular Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {relatedFeatures.map((feature) => (
              <Link
                key={feature.slug}
                href={`/features/${feature.slug}`}
                className="group bg-white rounded-2xl p-8 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                <feature.icon className="w-10 h-10 text-[var(--color-accent-gold)] mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="text-xl font-semibold mb-2 text-[var(--color-text-primary)] group-hover:text-[var(--color-accent-gold)] transition-colors">
                  {feature.title}
                </h3>
                <span className="text-[var(--color-accent-gold)] text-sm font-medium inline-flex items-center gap-2">
                  Explore <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
            ))}
          </div>

          <div className="text-center">
            <h3 className="text-xl font-semibold mb-6 text-[var(--color-text-primary)]">
              House Styles with Swimming Pools
            </h3>
            <div className="flex flex-wrap justify-center gap-4">
              {popularHouseStyles.map((style) => (
                <Link
                  key={style.slug}
                  href={`/house-styles/${style.slug}`}
                  className="px-6 py-3 bg-white rounded-full text-[var(--color-text-primary)] hover:bg-[var(--color-accent-sage)] hover:text-white transition-all duration-300 font-medium"
                >
                  {style.title}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
