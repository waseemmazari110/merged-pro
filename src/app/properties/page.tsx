import { Suspense } from "react";
import { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PropertyCard from "@/components/PropertyCard";
import UKServiceSchema from "@/components/UKServiceSchema";
import { db } from "@/db";
import { properties } from "@/db/schema";
import { eq } from "drizzle-orm";
import PropertiesClient from "./PropertiesClient";

export const metadata: Metadata = {
  title: "Luxury Group Houses to Rent",

  description: "Browse our collection of luxury group houses to rent across the UK. Perfect for hen parties, weddings, celebrations, and group getaways. Hot tubs, pools, games rooms and more.",
  keywords: "group houses to rent, luxury group accommodation, hen party houses, large holiday homes UK, party houses with hot tub",
  alternates: {
    canonical: "https://www.groupescapehouses.co.uk/properties",
  },
  openGraph: {
    title: "Luxury Group Houses to Rent",

    description: "Browse our collection of luxury group houses to rent across the UK. Perfect for hen parties, weddings, celebrations, and group getaways.",
    url: "https://www.groupescapehouses.co.uk/properties",
    siteName: "Group Escape Houses",
    type: "website",
  },
};

async function getProperties() {
  try {
    const result = await db
      .select()
      .from(properties)
      .where(eq(properties.isPublished, true));
    
    return result.map((prop) => ({
      id: prop.id.toString(),
      title: prop.title,
      location: prop.location,
      sleeps: prop.sleepsMax,
      bedrooms: prop.bedrooms,
      priceFrom: prop.priceFromWeekend,
      image: prop.heroImage,
      features: [],
      slug: prop.slug,
      description: prop.description,
    }));
  } catch (error) {
    console.error("Error fetching properties:", error);
    return [];
  }
}

export default async function PropertiesPage() {
  const allProperties = await getProperties();

  return (
    <div className="min-h-screen bg-[var(--color-bg-primary)]">
      <Header />
      
      <UKServiceSchema 
        type="itemList" 
        data={{
          items: allProperties
        }} 
      />
      <UKServiceSchema 
        type="breadcrumb" 
        data={{
          breadcrumbs: [
            { name: "Home", url: "/" },
            { name: "Properties", url: "/properties" }
          ]
        }}
      />
      <UKServiceSchema 
        type="faq" 
        data={{
          faqs: [
            { question: "How do I book a hen party house?", answer: "Browse our properties, select your preferred house, and submit an enquiry with your dates and group size. Our UK team will respond within 24 hours with availability and a quote." },
            { question: "What is included in the price?", answer: "All our properties include utilities, Wi-Fi, and standard amenities. Most houses feature hot tubs, games rooms, and entertainment facilities." }
          ]
        }} 
      />

      <section className="pt-24 sm:pt-32 pb-10 sm:pb-16 bg-gradient-to-br from-[var(--color-bg-primary)] to-[var(--color-bg-secondary)]">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          <div className="text-center sm:text-left">
            <h1 className="mb-4 text-3xl sm:text-4xl md:text-5xl" style={{ fontFamily: "var(--font-display)" }}>
              Luxury Group Houses to Rent
            </h1>
            <p className="text-lg sm:text-xl text-[var(--color-neutral-dark)] max-w-2xl mx-auto sm:mx-0">
              Perfect for hen parties, weddings, celebrations, and group getaways across the UK
            </p>
          </div>
        </div>
      </section>

      <section className="py-6 bg-white border-b border-[var(--color-bg-secondary)]">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          <div className="prose prose-base sm:prose-lg max-w-none">
              <p className="text-[var(--color-neutral-dark)] leading-relaxed">
                Discover our handpicked collection of luxury group houses to rent across the UK. 
                Whether you're planning a <Link href="/hen-party-houses" className="text-[var(--color-accent-sage)] hover:underline font-medium">hen party</Link>, 
                <Link href="/special-celebrations" className="text-[var(--color-accent-sage)] hover:underline font-medium"> special celebration</Link>, 
                or <Link href="/weekend-breaks" className="text-[var(--color-accent-sage)] hover:underline font-medium">weekend break</Link>, 
                we have the perfect property for your group. Our houses feature amazing amenities including 
                <Link href="/features/hot-tub" className="text-[var(--color-accent-sage)] hover:underline font-medium"> hot tubs</Link>, 
                <Link href="/features/swimming-pool" className="text-[var(--color-accent-sage)] hover:underline font-medium"> swimming pools</Link>, 
                and <Link href="/features/games-room" className="text-[var(--color-accent-sage)] hover:underline font-medium">games rooms</Link>. 
                Browse our <Link href="/destinations" className="text-[var(--color-accent-sage)] hover:underline font-medium">UK destinations</Link> including 
                <Link href="/destinations/london" className="text-[var(--color-accent-sage)] hover:underline font-medium"> London</Link>, 
                <Link href="/destinations/brighton" className="text-[var(--color-accent-sage)] hover:underline font-medium"> Brighton</Link>, 
                  <Link href="/destinations/bath" className="text-[var(--color-accent-sage)] hover:underline font-medium"> Bath</Link>, and 
                <Link href="/destinations/lake-district" className="text-[var(--color-accent-sage)] hover:underline font-medium"> the Lake District</Link>.
              </p>
          </div>
        </div>
      </section>

      <section className="py-12 pb-24">
        <div className="max-w-[1200px] mx-auto px-6">
          <noscript>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {allProperties.slice(0, 12).map((property) => (
                <article key={property.id} className="bg-white rounded-2xl overflow-hidden shadow-md">
                  <Link href={`/properties/${property.slug}`}>
                    <img 
                      src={property.image} 
                      alt={property.title}
                      className="w-full h-64 object-cover"
                    />
                    <div className="p-6">
                      <h2 className="text-xl font-semibold mb-2">{property.title}</h2>
                      <p className="text-[var(--color-neutral-dark)] mb-2">{property.location}</p>
                      <p className="text-sm text-[var(--color-neutral-dark)]">
                        Sleeps {property.sleeps} | {property.bedrooms} bedrooms
                      </p>
                      <p className="text-lg font-bold mt-4" style={{ color: "var(--color-accent-pink)" }}>
                        From £{property.priceFrom}/night
                      </p>
                    </div>
                  </Link>
                </article>
              ))}
            </div>
          </noscript>
          
          <Suspense fallback={
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-gray-100 animate-pulse rounded-2xl h-96"></div>
              ))}
            </div>
          }>
            <PropertiesClient initialProperties={allProperties} />
          </Suspense>
        </div>
      </section>

      <section className="py-16 bg-[var(--color-bg-secondary)]">
        <div className="max-w-[1200px] mx-auto px-6">
          <h2 className="text-2xl font-semibold mb-6" style={{ fontFamily: "var(--font-display)" }}>
            Popular Destinations
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[
              { name: "London", slug: "london" },
              { name: "Brighton", slug: "brighton" },
              { name: "Bath", slug: "bath" },
              { name: "Lake District", slug: "lake-district" },
              { name: "Cornwall", slug: "cornwall" },
              { name: "Cotswolds", slug: "cotswolds" },
              { name: "Manchester", slug: "manchester" },
              { name: "York", slug: "york" },
              { name: "Edinburgh", slug: "edinburgh" },
              { name: "Bristol", slug: "bristol" },
              { name: "Newcastle", slug: "newcastle" },
              { name: "Liverpool", slug: "liverpool" },
              ].map((dest) => (
                <Link
                  key={dest.slug}
                  href={`/destinations/${dest.slug}`}
                  className="bg-white rounded-xl p-4 text-center hover:shadow-lg transition-shadow"
                >
                  <span className="font-medium text-[var(--color-text-primary)]">{dest.name}</span>
                </Link>
              ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
