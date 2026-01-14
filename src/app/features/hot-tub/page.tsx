import Link from "next/link";
import Image from "next/image";
import { Check, ArrowRight, Droplets, Star, Users, Waves, Film, Gamepad2 } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import UKServiceSchema from "@/components/UKServiceSchema";
import { Button } from "@/components/ui/button";
import { db } from "@/db";
import { properties, propertyFeatures } from "@/db/schema";
import { eq } from "drizzle-orm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Houses with Hot Tubs | Hen Party Houses UK",

  description: "Luxury hen party houses in the UK with private hot tubs. Perfect for relaxation, celebration, and unforgettable group experiences.",
  alternates: {
    canonical: "https://www.groupescapehouses.co.uk/features/hot-tub",
  },
};

export default async function HotTubPage() {
  // Fetch properties with hot tubs for the schema
  const hotTubProperties = await db
    .select({
      id: properties.id,
      title: properties.title,
      slug: properties.slug,
      heroImage: properties.heroImage,
      location: properties.location,
    })
    .from(properties)
    .innerJoin(propertyFeatures, eq(properties.id, propertyFeatures.propertyId))
    .where(eq(propertyFeatures.featureName, "Hot Tub"))
    .limit(8);

  const highlights = [
    "Outdoor and indoor hot tubs available",
    "Perfect for relaxation after a day out",
    "Ideal for year-round celebrations",
    "Stunning views and privacy",
    "Most popular feature for hen parties"
  ];

  const galleryImages = [
    { url: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&q=90", alt: "Luxury outdoor hot tub with scenic countryside views" },
    { url: "https://images.unsplash.com/photo-1578991624414-276ef23a534f?w=800&q=90", alt: "Hot tub with champagne for hen party celebration" },
    { url: "https://images.unsplash.com/photo-1584132915807-fd1f5fbc078f?w=800&q=90", alt: "Relaxing in hot tub at sunset" },
    { url: "https://images.unsplash.com/photo-1560185007-c5ca9d2c014d?w=800&q=90", alt: "Private hot tub at luxury holiday home" },
    { url: "https://images.unsplash.com/photo-1529230117010-b6c6d3158e8e?w=800&q=90", alt: "Hot tub deck with garden views" },
    { url: "https://images.unsplash.com/photo-1596178060671-7a80dc8059ea?w=800&q=90", alt: "Evening hot tub under the stars" },
  ];

  const relatedFeatures = [
    { title: "Swimming Pool", slug: "swimming-pool", icon: Waves },
    { title: "Cinema Room", slug: "cinema-room", icon: Film },
    { title: "Games Room", slug: "games-room", icon: Gamepad2 },
  ];

  const popularHouseStyles = [
    { title: "Party Houses", slug: "party-houses" },
    { title: "Luxury Houses", slug: "luxury-houses" },
    { title: "Manor Houses", slug: "manor-houses" },
  ];

  return (
    <div className="min-h-screen">
      <UKServiceSchema 
        type="itemList" 
        data={{
          items: hotTubProperties
        }} 
      />
      <UKServiceSchema 
        type="breadcrumb" 
        data={{
          breadcrumbs: [
            { name: "Home", url: "/" },
            { name: "Features", url: "/house-styles-and-features" },
            { name: "Hot Tub", url: "/features/hot-tub" }
          ]
        }}
      />
      <Header />
      
      {/* Hero Section */}
      <section className="relative h-[70vh] min-h-[500px] flex items-center justify-center overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1540541338287-41700207dee6?w=1600&q=90"
          alt="Luxury property with hot tub"
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
            <span className="text-white font-medium">Hot Tub</span>
          </nav>
          
          <h1 className="mb-6 text-white" style={{ fontFamily: "var(--font-display)" }}>
            Houses with Hot Tubs
          </h1>
          <p className="text-xl max-w-3xl mx-auto text-white/95">
            Luxury relaxation with private hot tub access for your hen party or group celebration
          </p>
        </div>
      </section>

      {/* Image Gallery Section */}
      <section className="py-16 bg-[var(--color-bg-primary)]">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {galleryImages.map((image, index) => (
              <div key={index} className="group relative aspect-[4/3] rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300">
                <Image
                  src={image.url}
                  alt={image.alt}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-24 bg-white">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <div>
              <h2 className="mb-6 text-[var(--color-text-primary)]" style={{ fontFamily: "var(--font-display)" }}>
                Hen Party Houses with Hot Tubs UK
              </h2>
              <p className="text-lg text-[var(--color-neutral-dark)] mb-6 leading-relaxed">
                Our most sought-after feature! Unwind in style with properties featuring private hot tubs. Perfect for hen parties and celebrations, these luxurious additions provide the ultimate relaxation experience, whether you're watching the sunset or stargazing with your group.
              </p>
              <p className="text-lg text-[var(--color-neutral-dark)] mb-8 leading-relaxed">
                Hot tub houses are ideal for year-round celebrations. Imagine soaking in warm bubbles after a day of exploring the countryside, or enjoying a glass of fizz under the stars with your best friends. Many of our <Link href="/house-styles/party-houses" className="text-[var(--color-accent-gold)] hover:underline font-medium">party houses</Link> and <Link href="/house-styles/luxury-houses" className="text-[var(--color-accent-gold)] hover:underline font-medium">luxury houses</Link> feature hot tubs as standard.
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
                  Browse Hot Tub Properties
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
            </div>

            <div className="space-y-6">
              <div className="bg-[var(--color-bg-primary)] rounded-2xl p-8">
                <Droplets className="w-12 h-12 text-[var(--color-accent-gold)] mb-4" />
                <h3 className="text-3xl font-bold mb-2 text-[var(--color-text-primary)]" style={{ fontFamily: "var(--font-display)" }}>
                  Private Hot Tubs
                </h3>
                <p className="text-[var(--color-neutral-dark)]">
                  Exclusive use for your group throughout your stay
                </p>
              </div>

              <div className="bg-[var(--color-bg-primary)] rounded-2xl p-8">
                <Star className="w-12 h-12 text-[var(--color-accent-sage)] mb-4" />
                <h3 className="text-3xl font-bold mb-2 text-[var(--color-text-primary)]" style={{ fontFamily: "var(--font-display)" }}>
                  Year-Round
                </h3>
                <p className="text-[var(--color-neutral-dark)]">
                  Enjoy hot tub relaxation in any season
                </p>
              </div>

              <div className="bg-[var(--color-bg-primary)] rounded-2xl p-8">
                <Users className="w-12 h-12 text-[var(--color-accent-gold)] mb-4" />
                <h3 className="text-3xl font-bold mb-2 text-[var(--color-text-primary)]" style={{ fontFamily: "var(--font-display)" }}>
                  Group Relaxation
                </h3>
                <p className="text-[var(--color-neutral-dark)]">
                  Perfect for unwinding together after celebrations
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
              House Styles with Hot Tubs
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
