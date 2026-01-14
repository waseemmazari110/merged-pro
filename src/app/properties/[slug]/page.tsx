import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PropertyCard from "@/components/PropertyCard";
import EnquiryForm from "@/components/EnquiryForm";
import FAQAccordion from "@/components/FAQAccordion";
import UKServiceSchema from "@/components/UKServiceSchema";
import { TrustBadges, BookingMessage } from "@/components/TrustBadges";
import { Button } from "@/components/ui/button";
import {
  Users,
  Bed,
  Bath,
  MapPin,
  Waves,
  Download,
  Calendar,
} from "lucide-react";
import { db } from "@/db";
import { properties, propertyFeatures, propertyImages } from "@/db/schema";
import { eq } from "drizzle-orm";
import PropertyClientActions from "./PropertyClientActions";

async function getProperty(slug: string) {
  const result = await db
    .select()
    .from(properties)
    .where(eq(properties.slug, slug))
    .limit(1);
  
  const property = result[0] || null;
  
  if (property && property.status !== 'Active' && !property.isPublished) {
    return null;
  }
  
  return property;
}

async function getPropertyFeatures(propertyId: number) {
  const result = await db
    .select()
    .from(propertyFeatures)
    .where(eq(propertyFeatures.propertyId, propertyId));
  
  return result;
}

async function getPropertyImages(propertyId: number) {
  const result = await db
    .select()
    .from(propertyImages)
    .where(eq(propertyImages.propertyId, propertyId))
    .orderBy(propertyImages.orderIndex);
  
  return result;
}

async function getRelatedProperties(excludeSlug: string, location: string) {
  const result = await db
    .select()
    .from(properties)
    .where(eq(properties.isPublished, true))
    .limit(3);
  
  return result.filter(p => p.slug !== excludeSlug).slice(0, 2);
}

function getDestinationSlug(location: string): string | null {
  const locationLower = location.toLowerCase();
  const destinationMap: Record<string, string> = {
    'lake district': 'lake-district',
    'cumbria': 'lake-district',
    'cornwall': 'cornwall',
    'devon': 'devon',
    'cotswolds': 'cotswolds',
    'yorkshire': 'yorkshire',
    'north yorkshire': 'yorkshire',
    'peak district': 'peak-district',
    'derbyshire': 'peak-district',
    'norfolk': 'norfolk',
    'suffolk': 'suffolk',
    'sussex': 'sussex',
    'east sussex': 'sussex',
    'west sussex': 'sussex',
    'brighton': 'brighton',
    'bath': 'bath',
    'somerset': 'bath',
    'london': 'london',
    'manchester': 'manchester',
    'liverpool': 'liverpool',
    'newcastle': 'newcastle',
    'york': 'york',
    'bristol': 'bristol',
    'oxford': 'oxford',
    'cambridge': 'cambridge',
    'cardiff': 'cardiff',
  };
  
  for (const [key, value] of Object.entries(destinationMap)) {
    if (locationLower.includes(key)) {
      return value;
    }
  }
  return null;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const property = await getProperty(slug);
  
  if (!property) {
    return {
      title: "Property Not Found",

      description: "The property you're looking for could not be found.",
    };
  }

  const title = `${property.title} | Group Stay in ${property.location}`;
  const description = `${property.title} in ${property.location}. Sleeps ${property.sleepsMin}-${property.sleepsMax} guests with ${property.bedrooms} bedrooms and ${property.bathrooms} bathrooms. ${property.description.substring(0, 120)}...`;
  const canonicalUrl = `https://www.groupescapehouses.co.uk/properties/${slug}`;

  return {
    title,
    description,
    keywords: `${property.title}, ${property.location} accommodation, group house ${property.location}, ${property.sleepsMax} sleeps, ${property.bedrooms} bedroom house, large group accommodation`,
    authors: [{ name: "Group Escape Houses" }],
    creator: "Group Escape Houses",
    publisher: "Group Escape Houses",
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      type: "website",
      locale: "en_GB",
      url: canonicalUrl,
      title,
      description,
      siteName: "Group Escape Houses",
      images: [
        {
          url: property.heroImage,
          width: 1200,
          height: 630,
          alt: property.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [property.heroImage],
    },
  };
}

export default async function PropertyDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const property = await getProperty(slug);
  
  if (!property) {
    notFound();
  }

  const [features, images, relatedProperties] = await Promise.all([
    getPropertyFeatures(property.id),
    getPropertyImages(property.id),
    getRelatedProperties(slug, property.location),
  ]);

  const destinationSlug = getDestinationSlug(property.location);
  const destinationName = destinationSlug ? destinationSlug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') : null;

  const allImages = [property.heroImage, ...images.map(img => img.imageURL)];
  const checkInTime = property.checkInOut?.split('-')[0]?.trim() || '4pm';
  const checkOutTime = property.checkInOut?.split('-')[1]?.trim() || '10am';

  const houseRules = [
    `Check-in: ${checkInTime}`,
    `Check-out: ${checkOutTime}`,
    "No smoking inside",
    "Quiet hours: 11pm - 8am",
    `Maximum occupancy: ${property.sleepsMax} guests`,
    "Damage deposit: £500 (refundable)",
  ];

  const faqs = [
    {
      question: "What is included in the price?",
      answer: `The price includes full use of ${property.title} and all facilities. Bedding and towels are provided. Additional cleaning during your stay can be arranged for an extra fee.`,
    },
    {
      question: "How do deposits and payments work?",
      answer: "A deposit is typically required to secure your booking. The remaining balance is due before your arrival. A refundable damage deposit may also be required - please check with the property owner for exact terms.",
    },
    {
      question: "Can we bring pets?",
      answer: "Pet policies vary by property. Please contact the property owner directly to confirm whether pets are permitted.",
    },
    {
      question: "Is there parking available?",
      answer: "Yes, there is typically parking available at this property. Please confirm parking capacity with the property owner.",
    },
  ];

  const defaultFeatures = [
    { icon: "Waves", label: "Hot Tub" },
    { icon: "Wifi", label: "Fast Wi-Fi" },
    { icon: "Car", label: "Free Parking" },
    { icon: "Flame", label: "BBQ Area" },
    { icon: "ChefHat", label: "Gourmet Kitchen" },
    { icon: "Music", label: "Sound System" },
  ];

  const transformedRelated = relatedProperties.map(p => ({
    id: p.id.toString(),
    title: p.title,
    location: p.location,
    sleeps: p.sleepsMax,
    bedrooms: p.bedrooms,
    priceFrom: Math.round(p.priceFromMidweek / 3),
    image: p.heroImage,
    features: [],
    slug: p.slug,
  }));

  return (
    <div className="min-h-screen bg-[var(--color-bg-primary)]">
      <Header />
      
      <UKServiceSchema 
        type="property" 
        data={{
          name: property.title,
          description: property.description,
          image: property.heroImage,
          location: property.location,
          sleeps: property.sleepsMax,
          bedrooms: property.bedrooms,
          bathrooms: property.bathrooms,
          priceFrom: property.priceFromMidweek,
        }} 
      />
      <UKServiceSchema 
        type="breadcrumb" 
        data={{
          breadcrumbs: [
            { name: "Home", url: "/" },
            { name: "Properties", url: "/properties" },
            { name: property.title, url: `/properties/${slug}` }
          ]
        }}
      />
      <UKServiceSchema type="faq" data={{ faqs }} />

      <div className="pt-24">
          {/* Image Gallery */}
          <div className="max-w-[1400px] mx-auto px-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 rounded-2xl overflow-hidden">
              <div className="relative aspect-[4/3] md:aspect-auto md:h-[600px] bg-gray-100">
                <Image
                  src={allImages[0]}
                  alt={property.title}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                {allImages.slice(1, 5).map((image, index) => (
                  <div key={index} className="relative aspect-[4/3] md:aspect-auto md:h-[290px] bg-gray-100">
                    <Image
                      src={image}
                      alt={`${property.title} ${index + 2}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 50vw, 25vw"
                      loading="lazy"
                    />
                  </div>
                ))}
                {allImages.length < 5 && (
                  <>
                    {[...Array(5 - allImages.length)].map((_, index) => (
                      <div key={`placeholder-${index}`} className="relative aspect-[4/3] md:aspect-auto md:h-[290px] bg-gray-200"></div>
                    ))}
                  </>
                )}
              </div>
            </div>
            
            {/* Above-the-fold CTA for mobile */}
            <div className="mt-6 md:hidden">
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm text-[var(--color-neutral-dark)]">Weekend from</p>
                    <p className="text-3xl font-bold" style={{ color: "var(--color-accent-pink)" }}>
                      £{property.priceFromWeekend}
                    </p>
                  </div>
                  <Button
                    asChild
                    size="lg"
                    className="rounded-xl px-6 font-medium"
                    style={{ background: "var(--color-accent-sage)", color: "white" }}
                  >
                    <a href="#enquiry">Enquire Now</a>
                  </Button>
                </div>
                <TrustBadges variant="compact" />
              </div>
            </div>
          </div>

        {/* Content */}
        <div className="max-w-[1200px] mx-auto px-6 pb-24">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Left Column - SEO-critical content rendered server-side */}
            <div className="lg:col-span-2">
              {/* Title and Location */}
              <div className="mb-8">
                <h1 className="mb-4" style={{ fontFamily: "var(--font-display)" }}>
                  {property.title}
                </h1>
                <div className="flex items-center gap-2 text-lg text-[var(--color-neutral-dark)] mb-6">
                  <MapPin className="w-5 h-5" />
                  <span>{property.location}</span>
                </div>

                  <PropertyClientActions propertyId={property.id} propertyTitle={property.title} />

              </div>

              {/* Fast Facts - Critical SEO content */}
              <div className="bg-white rounded-2xl p-8 mb-8 shadow-md">
                <h2 className="text-2xl font-semibold mb-6" style={{ fontFamily: "var(--font-body)" }}>
                  Property Details
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div className="text-center">
                    <Users className="w-8 h-8 mx-auto mb-2 text-[var(--color-accent-pink)]" />
                    <p className="text-2xl font-bold">{property.sleepsMax}</p>
                    <p className="text-sm text-[var(--color-neutral-dark)]">Sleeps</p>
                  </div>
                  <div className="text-center">
                    <Bed className="w-8 h-8 mx-auto mb-2 text-[var(--color-accent-sage)]" />
                    <p className="text-2xl font-bold">{property.bedrooms}</p>
                    <p className="text-sm text-[var(--color-neutral-dark)]">Bedrooms</p>
                  </div>
                  <div className="text-center">
                    <Bath className="w-8 h-8 mx-auto mb-2 text-[var(--color-accent-gold)]" />
                    <p className="text-2xl font-bold">{property.bathrooms}</p>
                    <p className="text-sm text-[var(--color-neutral-dark)]">Bathrooms</p>
                  </div>
                  <div className="text-center">
                    <Calendar className="w-8 h-8 mx-auto mb-2 text-[var(--color-accent-pink)]" />
                    <p className="text-2xl font-bold">3</p>
                    <p className="text-sm text-[var(--color-neutral-dark)]">Night min</p>
                  </div>
                </div>

                <div className="mt-8 pt-8 border-t border-[var(--color-bg-secondary)]">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-[var(--color-neutral-dark)] mb-1">Weekend from</p>
                      <p className="text-3xl font-bold" style={{ color: "var(--color-accent-pink)" }}>
                        £{property.priceFromWeekend}
                      </p>
                      <p className="text-xs text-[var(--color-neutral-dark)]">
                        Split from £{Math.round(property.priceFromWeekend / property.sleepsMax)} per guest
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-[var(--color-neutral-dark)] mb-1">Midweek from</p>
                      <p className="text-3xl font-bold" style={{ color: "var(--color-accent-sage)" }}>
                        £{property.priceFromMidweek}
                      </p>
                      <p className="text-xs text-[var(--color-neutral-dark)]">
                        Split from £{Math.round(property.priceFromMidweek / property.sleepsMax)} per guest
                      </p>
                    </div>
                  </div>
                </div>
              </div>

                {/* Description - Critical SEO content */}
                <div className="mb-8">
                  <h2 className="text-2xl font-semibold mb-4" style={{ fontFamily: "var(--font-body)" }}>
                    About {property.title}
                  </h2>
                  <div className="prose prose-lg max-w-none">
                    <p className="text-[var(--color-neutral-dark)] leading-relaxed mb-4">
                      {property.description}
                    </p>
                    <p className="text-[var(--color-neutral-dark)] leading-relaxed mb-4">
                      This luxury property in {property.location} is part of our{" "}
                      <Link href="/large-group-accommodation" className="text-[var(--color-accent-sage)] hover:underline font-medium">large group accommodation</Link>{" "}
                      collection, perfect for{" "}
                      <Link href="/hen-party-houses" className="text-[var(--color-accent-sage)] hover:underline font-medium">hen parties</Link>,{" "}
                      <Link href="/special-celebrations" className="text-[var(--color-accent-sage)] hover:underline font-medium">special celebrations</Link>, and{" "}
                      <Link href="/weekend-breaks" className="text-[var(--color-accent-sage)] hover:underline font-medium">weekend breaks</Link>.{" "}
                      Browse our selection of{" "}
                      <Link href="/houses-with-hot-tubs" className="text-[var(--color-accent-sage)] hover:underline font-medium">houses with hot tubs</Link>{" "}
                      or explore <Link href="/large-holiday-houses" className="text-[var(--color-accent-sage)] hover:underline font-medium">large holiday houses</Link>{" "}
                      across the UK.
                    </p>
                    {destinationSlug && destinationName && (
                      <p className="text-[var(--color-neutral-dark)] leading-relaxed">
                        Discover more{" "}
                        <Link href={`/destinations/${destinationSlug}`} className="text-[var(--color-accent-sage)] hover:underline font-medium">
                          group accommodation in {destinationName}
                        </Link>{" "}
                        or explore other{" "}
                        <Link href="/destinations" className="text-[var(--color-accent-sage)] hover:underline font-medium">UK destinations</Link>{" "}
                        for your next group getaway.
                      </p>
                    )}
                    {!destinationSlug && (
                      <p className="text-[var(--color-neutral-dark)] leading-relaxed">
                        Explore more{" "}
                        <Link href="/properties" className="text-[var(--color-accent-sage)] hover:underline font-medium">luxury group houses</Link>{" "}
                        or discover other{" "}
                        <Link href="/destinations" className="text-[var(--color-accent-sage)] hover:underline font-medium">UK destinations</Link>{" "}
                        perfect for your celebration.
                      </p>
                    )}
                  </div>
                </div>

              {/* Features */}
              <div className="bg-white rounded-2xl p-8 mb-8 shadow-md">
                <h2 className="text-2xl font-semibold mb-6" style={{ fontFamily: "var(--font-body)" }}>
                  Facilities & Features
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  {(features.length > 0 ? features.map(f => ({ label: f.featureName })) : defaultFeatures).map((feature, index) => (
                    <div key={index} className="text-center">
                      <div
                        className="w-16 h-16 rounded-full mx-auto mb-3 flex items-center justify-center bg-[var(--color-accent-pink)]/20"
                      >
                        <Waves className="w-8 h-8 text-[var(--color-accent-pink)]" />
                      </div>
                      <p className="text-sm font-medium">{feature.label}</p>
                    </div>
                  ))}
                </div>

                {property.floorplanURL && (
                  <div className="mt-8 pt-8 border-t border-[var(--color-bg-secondary)]">
                    <Button variant="outline" className="rounded-xl" asChild>
                      <a href={property.floorplanURL} target="_blank" rel="noopener noreferrer">
                        <Download className="w-4 h-4 mr-2" />
                        Download Floorplan
                      </a>
                    </Button>
                  </div>
                )}
              </div>

              {/* House Rules */}
              <div className="bg-[var(--color-bg-secondary)] rounded-2xl p-8 mb-8">
                <h2 className="text-2xl font-semibold mb-6" style={{ fontFamily: "var(--font-body)" }}>
                  House Rules
                </h2>
                <ul className="space-y-3">
                  {houseRules.map((rule, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <span className="text-[var(--color-accent-pink)] mt-1">•</span>
                      <span>{rule}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* FAQs */}
              <div className="mb-8">
                <h2 className="text-2xl font-semibold mb-6" style={{ fontFamily: "var(--font-body)" }}>
                  Frequently Asked Questions
                </h2>
                <FAQAccordion faqs={faqs} />
              </div>
            </div>

              {/* Right Column - Enquiry Form */}
              <div className="lg:col-span-1">
                <div className="sticky top-28">
                  <EnquiryForm propertyTitle={property.title} propertySlug={slug} />
                  <BookingMessage className="mt-4" />
                </div>
              </div>
          </div>

          {/* Related Properties */}
          {transformedRelated.length > 0 && (
            <div className="mt-24">
              <h2 className="text-3xl font-semibold mb-8" style={{ fontFamily: "var(--font-display)" }}>
                Similar Properties
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {transformedRelated.map((relatedProperty) => (
                  <PropertyCard key={relatedProperty.id} {...relatedProperty} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Sticky Bottom Bar (Mobile) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white shadow-2xl p-4 z-40 border-t border-gray-200 pb-[env(safe-area-inset-bottom,16px)]">
        <div className="flex items-center justify-between gap-4 max-w-md mx-auto">
          <div>
            <p className="text-xs text-[var(--color-neutral-dark)]">Weekend from</p>
            <p className="text-xl font-bold" style={{ color: "var(--color-accent-pink)" }}>
              £{property.priceFromWeekend}
            </p>
          </div>
          <Button
            asChild
            className="flex-1 rounded-xl h-14 font-semibold shadow-lg active:scale-95 transition-transform"
            style={{
              background: "var(--color-accent-pink)",
              color: "var(--color-text-primary)",
            }}
          >
            <a href="#enquiry">Enquire Now</a>
          </Button>
        </div>
      </div>

      <Footer />
    </div>
  );
}
