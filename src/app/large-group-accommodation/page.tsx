import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PropertyCard from "@/components/PropertyCard";
import UKServiceSchema from "@/components/UKServiceSchema";
import { TrustBadges } from "@/components/TrustBadges";
import { Button } from "@/components/ui/button";
import { Users, Home, MapPin, Waves, Gamepad2, ChefHat, Car, TreePine, Building, Castle, ChevronDown } from "lucide-react";
import { db } from "@/db";
import { properties } from "@/db/schema";
import { eq, desc } from "drizzle-orm";

export const metadata: Metadata = {
  title: "Large Group Accommodation UK | Houses for 10-30+ Guests",

  description: "Find large group accommodation across the UK sleeping 10 to 30+ guests. Luxury houses with hot tubs, games rooms, and spacious living areas perfect for family reunions, birthdays, corporate retreats, and group celebrations.",
  keywords: "large group accommodation UK, group houses UK, large holiday houses, houses sleeping 10, houses sleeping 20, houses sleeping 30, group accommodation, large house rental UK, big houses to rent",
  alternates: {
    canonical: "https://www.groupescapehouses.co.uk/large-group-accommodation",
  },
  openGraph: {
    title: "Large Group Accommodation UK | Houses for 10-30+ Guests",
    description: "Find large group accommodation across the UK sleeping 10 to 30+ guests. Luxury houses with hot tubs, games rooms, and spacious living areas.",
    url: "https://www.groupescapehouses.co.uk/large-group-accommodation",
    siteName: "Group Escape Houses",
    locale: "en_GB",
    type: "website",
  },
};

async function getFeaturedProperties() {
  try {
    const result = await db
      .select()
      .from(properties)
      .where(eq(properties.isPublished, true))
      .orderBy(desc(properties.sleepsMax))
      .limit(6);
    return result;
  } catch (error) {
    return [];
  }
}

const faqs = [
  {
    question: "What is considered large group accommodation?",
    answer: "Large group accommodation typically refers to properties that can sleep 10 or more guests. Our collection includes houses sleeping from 10 to over 30 guests, with multiple bedrooms, bathrooms, and spacious communal areas designed for group gatherings.",
  },
  {
    question: "What group sizes do you cater for?",
    answer: "We specialise in accommodation for groups of 10 to 30+ guests. Whether you're planning a weekend away for 10 friends, a family reunion for 20, or a corporate retreat for 30 colleagues, we have properties to suit every group size.",
  },
  {
    question: "Are your properties suitable for midweek stays?",
    answer: "Absolutely. Many groups prefer midweek stays for better availability and often lower rates. Our properties are available throughout the week, making them perfect for corporate events, school groups, and flexible travellers.",
  },
  {
    question: "Can we host events at your properties?",
    answer: "Many of our properties are event-friendly, suitable for birthday celebrations, anniversary parties, and small weddings. Each property has its own guidelines, so please enquire about specific event requirements when booking.",
  },
  {
    question: "How do weekend vs midweek prices compare?",
    answer: "Midweek stays (Monday to Thursday) are typically 15-25% less expensive than weekend bookings. Split between your group, this can make luxury accommodation remarkably affordable per person.",
  },
  {
    question: "What amenities are included in large group houses?",
    answer: "Our large group properties feature spacious communal areas, fully equipped kitchens, multiple bathrooms, and often premium amenities like hot tubs, games rooms, cinema rooms, and extensive grounds. All properties include essentials like WiFi, heating, and parking.",
  },
];

const topDestinations = [
  { name: "Lake District", slug: "lake-district", description: "Stunning lakeside lodges and mountain retreats" },
  { name: "Cotswolds", slug: "cotswolds", description: "Picturesque country houses and converted barns" },
  { name: "Cornwall", slug: "cornwall", description: "Coastal properties with sea views and beach access" },
  { name: "Yorkshire", slug: "yorkshire", description: "Moors and dales with traditional country estates" },
  { name: "Devon", slug: "devon", description: "Dartmoor lodges and seaside retreats" },
  { name: "Peak District", slug: "peak-district", description: "Stone cottages and countryside retreats" },
  { name: "Norfolk", slug: "norfolk", description: "Broads and coastline with peaceful retreats" },
  { name: "Sussex", slug: "sussex", description: "South Downs and coastal properties" },
  { name: "Suffolk", slug: "suffolk", description: "Heritage coastline and countryside charm" },
  { name: "Bath", slug: "bath", description: "Georgian elegance and spa town luxury" },
];

export default async function LargeGroupAccommodationPage() {
  const featuredProperties = await getFeaturedProperties();

  const transformedProperties = featuredProperties.map(p => ({
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
        type="breadcrumb" 
        data={{
          breadcrumbs: [
            { name: "Home", url: "/" },
            { name: "Large Group Accommodation", url: "/large-group-accommodation" }
          ]
        }}
      />
      <UKServiceSchema type="faq" data={{ faqs }} />

        {/* Hero Section */}
        <section className="relative min-h-[60vh] flex items-center justify-center pt-20">
          <div className="absolute inset-0">
            <Image
              src="https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1920&q=90"
              alt="Large group accommodation UK"
              fill
              className="object-cover"
              priority
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60" />
          </div>
          
          <div className="relative z-10 max-w-[1200px] mx-auto px-6 py-20 text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6" style={{ fontFamily: "var(--font-display)" }}>
              Large Group Accommodation UK
            </h1>
            <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto mb-8">
              Luxury houses sleeping 10 to 30+ guests across the UK. Perfect for family reunions, group weekends, birthdays, and corporate retreats.
            </p>
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <Button asChild size="lg" className="rounded-2xl px-8 py-6 text-lg font-medium" style={{ background: "var(--color-accent-sage)", color: "white" }}>
                <Link href="/contact">Check Availability</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="rounded-2xl px-8 py-6 text-lg font-medium bg-white/10 border-white text-white hover:bg-white hover:text-black">
                <Link href="/properties">Browse All Properties</Link>
              </Button>
            </div>
            <TrustBadges variant="compact" className="text-white/90" />
          </div>
        </section>

      {/* Introduction Section - SEO Content */}
      <section className="py-16 bg-white">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="prose prose-lg max-w-none">
            <h2 className="text-3xl font-bold mb-6" style={{ fontFamily: "var(--font-display)" }}>
              Find the Perfect Large Group House for Your Next Getaway
            </h2>
            
            <p className="text-lg text-[var(--color-neutral-dark)] leading-relaxed mb-6">
              Planning a getaway for a large group can be challenging, but finding the right accommodation shouldn't be. At Group Escape Houses, we specialise in <strong>large group accommodation across the UK</strong>, offering carefully selected properties that sleep anywhere from 10 to over 30 guests. Whether you're organising a family reunion, milestone birthday celebration, corporate away day, or simply a weekend break with friends, our collection of luxury houses provides the space, amenities, and atmosphere your group needs.
            </p>

            <p className="text-lg text-[var(--color-neutral-dark)] leading-relaxed mb-6">
              Our properties are designed with groups in mind. You'll find spacious communal areas where everyone can gather together, multiple bedrooms ensuring comfortable sleeping arrangements, and kitchens equipped to cater for large numbers. Many of our <Link href="/houses-with-hot-tubs" className="text-[var(--color-accent-sage)] hover:underline font-medium">houses feature hot tubs</Link> for relaxation, <Link href="/houses-with-games-rooms" className="text-[var(--color-accent-sage)] hover:underline font-medium">games rooms</Link> for entertainment, and extensive grounds for outdoor activities.
            </p>

            <h3 className="text-2xl font-semibold mt-8 mb-4">Who Is Large Group Accommodation For?</h3>
            
            <p className="text-lg text-[var(--color-neutral-dark)] leading-relaxed mb-6">
              Large group accommodation suits a wide range of occasions and group types. <strong>Families</strong> planning multi-generational holidays find our properties ideal for bringing grandparents, parents, children, and grandchildren together under one roof. The shared spaces encourage quality time together, while separate bedrooms ensure everyone has their own retreat.
            </p>

            <p className="text-lg text-[var(--color-neutral-dark)] leading-relaxed mb-6">
              <strong>Friend groups</strong> celebrating birthdays, reunions, or simply catching up appreciate the convenience of having everyone together. No more coordinating between multiple hotels or holiday rentals—a single large house means shared meals, late-night conversations, and memories made together. For those planning <Link href="/hen-party-houses" className="text-[var(--color-accent-sage)] hover:underline font-medium">hen parties</Link> or stag weekends, our properties offer private spaces away from public venues.
            </p>

            <p className="text-lg text-[var(--color-neutral-dark)] leading-relaxed mb-6">
              <strong>Corporate groups</strong> use our properties for team building retreats, strategy away days, and company celebrations. The informal setting encourages collaboration and bonding in ways that traditional conference venues simply cannot match. With WiFi, large dining tables, and breakout spaces, work and leisure blend seamlessly.
            </p>

            <h3 className="text-2xl font-semibold mt-8 mb-4">Group Sizes We Accommodate</h3>
            
            <p className="text-lg text-[var(--color-neutral-dark)] leading-relaxed mb-6">
              Our properties cater for groups of all sizes. <strong>Houses sleeping 10-15 guests</strong> are perfect for intimate gatherings, extended family weekends, or small friend groups. These properties typically offer 5-7 bedrooms with comfortable living areas and often feature premium amenities like hot tubs and gardens.
            </p>

            <p className="text-lg text-[var(--color-neutral-dark)] leading-relaxed mb-6">
              <strong>Properties sleeping 15-20 guests</strong> provide even more space for larger family reunions and group celebrations. Expect generous communal areas, multiple reception rooms, and often additional facilities like games rooms or home cinemas. These houses work brilliantly for milestone birthdays and anniversary celebrations.
            </p>

            <p className="text-lg text-[var(--color-neutral-dark)] leading-relaxed mb-6">
              For the largest gatherings, our <strong>houses sleeping 20-30+ guests</strong> include manor houses, converted barns, and estate properties. These impressive venues suit weddings, corporate retreats, and the grandest family reunions. Many feature multiple buildings, extensive grounds, and event-ready facilities.
            </p>
          </div>
        </div>
      </section>

      {/* Group Size Cards */}
      <section className="py-16 bg-[var(--color-bg-primary)]">
        <div className="max-w-[1200px] mx-auto px-6">
          <h2 className="text-3xl font-bold mb-8 text-center" style={{ fontFamily: "var(--font-display)" }}>
            Find Accommodation by Group Size
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-lg transition-shadow">
              <div className="w-14 h-14 rounded-full bg-[var(--color-accent-sage)]/20 flex items-center justify-center mb-6">
                <Users className="w-7 h-7 text-[var(--color-accent-sage)]" />
              </div>
              <h3 className="text-xl font-bold mb-3">Sleeps 10-15</h3>
              <p className="text-[var(--color-neutral-dark)] mb-4">Perfect for small groups, extended family weekends, and intimate celebrations. 5-7 bedrooms with cosy communal spaces.</p>
              <Link href="/properties" className="text-[var(--color-accent-sage)] font-medium hover:underline">Browse properties →</Link>
            </div>
            
            <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-lg transition-shadow">
              <div className="w-14 h-14 rounded-full bg-[var(--color-accent-pink)]/20 flex items-center justify-center mb-6">
                <Users className="w-7 h-7 text-[var(--color-accent-pink)]" />
              </div>
              <h3 className="text-xl font-bold mb-3">Sleeps 15-20</h3>
              <p className="text-[var(--color-neutral-dark)] mb-4">Ideal for family reunions, milestone birthdays, and corporate retreats. Multiple reception rooms and premium amenities.</p>
              <Link href="/properties" className="text-[var(--color-accent-sage)] font-medium hover:underline">Browse properties →</Link>
            </div>
            
            <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-lg transition-shadow">
              <div className="w-14 h-14 rounded-full bg-[var(--color-accent-gold)]/20 flex items-center justify-center mb-6">
                <Users className="w-7 h-7 text-[var(--color-accent-gold)]" />
              </div>
              <h3 className="text-xl font-bold mb-3">Sleeps 20-30+</h3>
              <p className="text-[var(--color-neutral-dark)] mb-4">Manor houses and estates for grand celebrations, weddings, and large corporate events. Extensive grounds and facilities.</p>
              <Link href="/properties" className="text-[var(--color-accent-sage)] font-medium hover:underline">Browse properties →</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Property Types Section */}
      <section className="py-16 bg-white">
        <div className="max-w-[1200px] mx-auto px-6">
          <h2 className="text-3xl font-bold mb-6" style={{ fontFamily: "var(--font-display)" }}>
            Types of Large Group Properties
          </h2>
          
          <div className="prose prose-lg max-w-none mb-12">
            <p className="text-lg text-[var(--color-neutral-dark)] leading-relaxed">
              Our collection spans the full spectrum of British property types, each offering unique character and amenities. <Link href="/house-styles/manor-houses" className="text-[var(--color-accent-sage)] hover:underline font-medium">Manor houses</Link> provide grandeur and history, with formal dining rooms, sweeping staircases, and manicured grounds. <Link href="/house-styles/country-houses" className="text-[var(--color-accent-sage)] hover:underline font-medium">Country houses</Link> offer comfortable elegance in rural settings, often with gardens, orchting, and countryside views.
            </p>
            
            <p className="text-lg text-[var(--color-neutral-dark)] leading-relaxed">
              <Link href="/house-styles/large-cottages" className="text-[var(--color-accent-sage)] hover:underline font-medium">Large cottages</Link> and converted barns combine rustic charm with modern comforts, featuring exposed beams, stone walls, and contemporary kitchens. <Link href="/house-styles/luxury-houses" className="text-[var(--color-accent-sage)] hover:underline font-medium">Luxury houses</Link> prioritise premium amenities, from infinity pools to home cinemas, ensuring a truly indulgent group experience.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <Link href="/house-styles/manor-houses" className="group bg-[var(--color-bg-primary)] rounded-xl p-6 text-center hover:shadow-lg transition-all">
              <Castle className="w-10 h-10 mx-auto mb-3 text-[var(--color-accent-sage)] group-hover:scale-110 transition-transform" />
              <span className="font-medium">Manor Houses</span>
            </Link>
            <Link href="/house-styles/country-houses" className="group bg-[var(--color-bg-primary)] rounded-xl p-6 text-center hover:shadow-lg transition-all">
              <TreePine className="w-10 h-10 mx-auto mb-3 text-[var(--color-accent-sage)] group-hover:scale-110 transition-transform" />
              <span className="font-medium">Country Houses</span>
            </Link>
            <Link href="/house-styles/large-cottages" className="group bg-[var(--color-bg-primary)] rounded-xl p-6 text-center hover:shadow-lg transition-all">
              <Home className="w-10 h-10 mx-auto mb-3 text-[var(--color-accent-sage)] group-hover:scale-110 transition-transform" />
              <span className="font-medium">Large Cottages</span>
            </Link>
            <Link href="/house-styles/luxury-houses" className="group bg-[var(--color-bg-primary)] rounded-xl p-6 text-center hover:shadow-lg transition-all">
              <Building className="w-10 h-10 mx-auto mb-3 text-[var(--color-accent-sage)] group-hover:scale-110 transition-transform" />
              <span className="font-medium">Luxury Houses</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      {transformedProperties.length > 0 && (
        <section className="py-16 bg-[var(--color-bg-primary)]">
          <div className="max-w-[1200px] mx-auto px-6">
            <div className="flex justify-between items-end mb-8">
              <div>
                <h2 className="text-3xl font-bold" style={{ fontFamily: "var(--font-display)" }}>
                  Featured Large Group Properties
                </h2>
                <p className="text-[var(--color-neutral-dark)] mt-2">Handpicked houses perfect for your group getaway</p>
              </div>
              <Link href="/properties" className="text-[var(--color-accent-sage)] font-medium hover:underline hidden md:block">
                View all properties →
              </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {transformedProperties.map((property) => (
                <PropertyCard key={property.id} {...property} />
              ))}
            </div>
            
            <div className="text-center mt-8 md:hidden">
              <Link href="/properties" className="text-[var(--color-accent-sage)] font-medium hover:underline">
                View all properties →
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Top Destinations */}
      <section className="py-16 bg-white">
        <div className="max-w-[1200px] mx-auto px-6">
          <h2 className="text-3xl font-bold mb-6" style={{ fontFamily: "var(--font-display)" }}>
            Popular Destinations for Large Groups
          </h2>
          
          <p className="text-lg text-[var(--color-neutral-dark)] leading-relaxed mb-8">
            From the dramatic landscapes of the <Link href="/destinations/lake-district" className="text-[var(--color-accent-sage)] hover:underline font-medium">Lake District</Link> to the golden beaches of <Link href="/destinations/cornwall" className="text-[var(--color-accent-sage)] hover:underline font-medium">Cornwall</Link>, we offer large group accommodation in the UK's most desirable locations. Each destination offers its own character, attractions, and type of getaway experience.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {topDestinations.map((dest) => (
              <Link key={dest.slug} href={`/destinations/${dest.slug}`} className="group bg-[var(--color-bg-primary)] rounded-xl p-6 hover:shadow-lg transition-all">
                <div className="flex items-start gap-4">
                  <MapPin className="w-6 h-6 text-[var(--color-accent-sage)] flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-lg group-hover:text-[var(--color-accent-sage)] transition-colors">{dest.name}</h3>
                    <p className="text-sm text-[var(--color-neutral-dark)] mt-1">{dest.description}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          
          <div className="text-center mt-8">
            <Link href="/destinations" className="text-[var(--color-accent-sage)] font-medium hover:underline">
              Explore all UK destinations →
            </Link>
          </div>
        </div>
      </section>

      {/* Amenities Section */}
      <section className="py-16 bg-[var(--color-bg-primary)]">
        <div className="max-w-[1200px] mx-auto px-6">
          <h2 className="text-3xl font-bold mb-6" style={{ fontFamily: "var(--font-display)" }}>
            Amenities for Group Stays
          </h2>
          
          <p className="text-lg text-[var(--color-neutral-dark)] leading-relaxed mb-8">
            Our large group properties are equipped with everything you need for a comfortable and enjoyable stay. From essential amenities to luxury extras, we ensure your group has access to facilities that make all the difference.
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="bg-white rounded-xl p-6 text-center">
              <Waves className="w-10 h-10 mx-auto mb-3 text-[var(--color-accent-sage)]" />
              <h3 className="font-medium mb-2">Hot Tubs</h3>
              <p className="text-sm text-[var(--color-neutral-dark)]">Relax together under the stars</p>
            </div>
            <div className="bg-white rounded-xl p-6 text-center">
              <Gamepad2 className="w-10 h-10 mx-auto mb-3 text-[var(--color-accent-pink)]" />
              <h3 className="font-medium mb-2">Games Rooms</h3>
              <p className="text-sm text-[var(--color-neutral-dark)]">Entertainment for all ages</p>
            </div>
            <div className="bg-white rounded-xl p-6 text-center">
              <ChefHat className="w-10 h-10 mx-auto mb-3 text-[var(--color-accent-gold)]" />
              <h3 className="font-medium mb-2">Large Kitchens</h3>
              <p className="text-sm text-[var(--color-neutral-dark)]">Fully equipped for group cooking</p>
            </div>
            <div className="bg-white rounded-xl p-6 text-center">
              <Car className="w-10 h-10 mx-auto mb-3 text-[var(--color-accent-sage)]" />
              <h3 className="font-medium mb-2">Ample Parking</h3>
              <p className="text-sm text-[var(--color-neutral-dark)]">Space for multiple vehicles</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-3xl font-bold mb-8 text-center" style={{ fontFamily: "var(--font-display)" }}>
            Frequently Asked Questions
          </h2>
          
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <details key={index} className="bg-[var(--color-bg-primary)] rounded-xl group">
                <summary className="flex items-center justify-between p-6 cursor-pointer list-none">
                  <span className="font-semibold pr-4">{faq.question}</span>
                  <ChevronDown className="w-5 h-5 text-[var(--color-accent-gold)] flex-shrink-0 transition-transform group-open:rotate-180" />
                </summary>
                <div className="px-6 pb-6">
                  <p className="text-[var(--color-neutral-dark)] leading-relaxed">{faq.answer}</p>
                </div>
              </details>
            ))}
            </div>
          </div>
        </section>

        {/* Related Categories */}
        <section className="py-16 bg-[var(--color-bg-primary)]">
          <div className="max-w-[1200px] mx-auto px-6">
            <h2 className="text-3xl font-bold mb-6" style={{ fontFamily: "var(--font-display)" }}>
              Browse Related Categories
            </h2>
            <p className="text-lg text-[var(--color-neutral-dark)] leading-relaxed mb-8">
              Explore our other specialist collections of group accommodation across the UK.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Link href="/large-holiday-houses" className="group bg-white rounded-xl p-6 hover:shadow-lg transition-all">
                <Home className="w-10 h-10 mb-4 text-[var(--color-accent-sage)] group-hover:scale-110 transition-transform" />
                <h3 className="font-bold text-lg mb-2 group-hover:text-[var(--color-accent-sage)] transition-colors">Large Holiday Houses</h3>
                <p className="text-sm text-[var(--color-neutral-dark)]">Spacious holiday homes for memorable group getaways</p>
              </Link>
              <Link href="/houses-with-hot-tubs" className="group bg-white rounded-xl p-6 hover:shadow-lg transition-all">
                <Waves className="w-10 h-10 mb-4 text-[var(--color-accent-pink)] group-hover:scale-110 transition-transform" />
                <h3 className="font-bold text-lg mb-2 group-hover:text-[var(--color-accent-sage)] transition-colors">Houses with Hot Tubs</h3>
                <p className="text-sm text-[var(--color-neutral-dark)]">Relax and unwind in properties featuring private hot tubs</p>
              </Link>
              <Link href="/houses-with-games-rooms" className="group bg-white rounded-xl p-6 hover:shadow-lg transition-all">
                <Gamepad2 className="w-10 h-10 mb-4 text-[var(--color-accent-gold)] group-hover:scale-110 transition-transform" />
                <h3 className="font-bold text-lg mb-2 group-hover:text-[var(--color-accent-sage)] transition-colors">Houses with Games Rooms</h3>
                <p className="text-sm text-[var(--color-neutral-dark)]">Entertainment-ready properties for fun-filled stays</p>
              </Link>
              <Link href="/hen-party-houses" className="group bg-white rounded-xl p-6 hover:shadow-lg transition-all">
                <Users className="w-10 h-10 mb-4 text-[var(--color-accent-sage)] group-hover:scale-110 transition-transform" />
                <h3 className="font-bold text-lg mb-2 group-hover:text-[var(--color-accent-sage)] transition-colors">Hen Party Houses</h3>
                <p className="text-sm text-[var(--color-neutral-dark)]">Perfect venues for unforgettable hen celebrations</p>
              </Link>
            </div>
          </div>
        </section>

        {/* CTA Section */}
      <section className="py-16 bg-[var(--color-bg-primary)]">
        <div className="max-w-[1200px] mx-auto px-6 text-center">
          <div className="bg-white p-12 rounded-3xl shadow-lg">
            <h2 className="text-3xl md:text-4xl font-bold mb-6" style={{ fontFamily: "var(--font-display)" }}>
              Ready to Book Your Large Group Getaway?
            </h2>
            <p className="text-xl text-[var(--color-neutral-dark)] mb-8 max-w-2xl mx-auto">
              Browse our collection of large group properties or get in touch for personalised recommendations based on your group size and requirements.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button asChild size="lg" className="rounded-2xl px-8 py-6 text-lg font-medium" style={{ background: "var(--color-accent-sage)", color: "white" }}>
                <Link href="/properties">Browse Properties</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="rounded-2xl px-8 py-6 text-lg font-medium">
                <Link href="/contact">Contact Us</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
