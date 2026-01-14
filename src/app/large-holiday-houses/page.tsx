import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PropertyCard from "@/components/PropertyCard";
import UKServiceSchema from "@/components/UKServiceSchema";
import { Button } from "@/components/ui/button";
import { Users, Home, MapPin, Bed, Waves, Gamepad2, TreePine, Sun, Palmtree, Mountain, ChevronDown } from "lucide-react";
import { db } from "@/db";
import { properties } from "@/db/schema";
import { eq, desc } from "drizzle-orm";

export const metadata: Metadata = {
  title: "Large Holiday Houses UK | Spacious Homes for Group Holidays",

  description: "Discover large holiday houses across the UK perfect for group getaways. Spacious homes sleeping 10-30 guests with stunning locations, hot tubs, games rooms, and countryside or coastal settings.",
  keywords: "large holiday houses UK, big holiday homes, group holiday houses, spacious holiday rentals, large house holidays UK, family holiday houses, group holiday accommodation",
  alternates: {
    canonical: "https://www.groupescapehouses.co.uk/large-holiday-houses",
  },
  openGraph: {
    title: "Large Holiday Houses UK | Spacious Homes for Group Holidays",
    description: "Discover large holiday houses across the UK perfect for group getaways. Spacious homes sleeping 10-30 guests.",
    url: "https://www.groupescapehouses.co.uk/large-holiday-houses",
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
    question: "What makes a large holiday house different from standard accommodation?",
    answer: "Large holiday houses offer significantly more space than typical holiday rentals, with multiple bedrooms (usually 5-15), several bathrooms, spacious communal living areas, and often extensive private grounds. They're designed for groups to stay together rather than being split across multiple properties.",
  },
  {
    question: "How many guests can your large holiday houses accommodate?",
    answer: "Our large holiday houses sleep anywhere from 10 to 30+ guests. We have properties suitable for small groups of 10-12, medium groups of 15-20, and large gatherings of 25-30 or more. Each listing clearly states maximum occupancy.",
  },
  {
    question: "Are large holiday houses good value for money?",
    answer: "Absolutely. When the total cost is split between guests, large holiday houses often work out at £30-60 per person per night for luxury accommodation with premium amenities. This is frequently cheaper than individual hotel rooms while offering far more space and privacy.",
  },
  {
    question: "What locations are available for large holiday houses?",
    answer: "We offer large holiday houses across the UK, from coastal Cornwall and Devon to the Lake District, Yorkshire Dales, Cotswolds, Scottish Highlands, and everywhere in between. Whether you want beaches, mountains, or countryside, we have properties to suit.",
  },
  {
    question: "Can we bring dogs to large holiday houses?",
    answer: "Many of our properties are dog-friendly, welcoming well-behaved pets. Each property listing indicates whether dogs are allowed and any restrictions that apply. We recommend booking early as dog-friendly large houses are particularly popular.",
  },
  {
    question: "What's included in the rental price?",
    answer: "All our properties include bedding, towels, fully equipped kitchens, WiFi, heating, and parking. Many also include hot tub access, games rooms, and outdoor amenities. Any additional costs or optional extras are clearly stated in each property listing.",
  },
];

const holidayTypes = [
  { 
    title: "Coastal Holidays", 
    description: "Beach houses and clifftop retreats with sea views",
    icon: Palmtree,
    destinations: ["Cornwall", "Devon", "Norfolk", "Sussex"]
  },
  { 
    title: "Countryside Escapes", 
    description: "Rural retreats surrounded by rolling hills and farmland",
    icon: TreePine,
    destinations: ["Cotswolds", "Yorkshire", "Peak District", "Lake District"]
  },
  { 
    title: "Mountain Retreats", 
    description: "Highland lodges and lakeside properties with dramatic views",
    icon: Mountain,
    destinations: ["Lake District", "Snowdonia", "Scottish Highlands", "Peak District"]
  },
];

export default async function LargeHolidayHousesPage() {
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
            { name: "Large Holiday Houses", url: "/large-holiday-houses" }
          ]
        }}
      />
      <UKServiceSchema type="faq" data={{ faqs }} />

      {/* Hero Section */}
      <section className="relative min-h-[60vh] flex items-center justify-center pt-20">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=1920&q=90"
            alt="Large holiday house UK countryside"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60" />
        </div>
        
        <div className="relative z-10 max-w-[1200px] mx-auto px-6 py-20 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6" style={{ fontFamily: "var(--font-display)" }}>
            Large Holiday Houses UK
          </h1>
          <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto mb-8">
            Spacious holiday homes for unforgettable group getaways. From coastal retreats to countryside escapes, find the perfect large house for your next holiday.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button asChild size="lg" className="rounded-2xl px-8 py-6 text-lg font-medium" style={{ background: "var(--color-accent-sage)", color: "white" }}>
              <Link href="/properties">Browse All Houses</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="rounded-2xl px-8 py-6 text-lg font-medium bg-white/10 border-white text-white hover:bg-white hover:text-black">
              <Link href="/contact">Check Availability</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Introduction Section */}
      <section className="py-16 bg-white">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="prose prose-lg max-w-none">
            <h2 className="text-3xl font-bold mb-6" style={{ fontFamily: "var(--font-display)" }}>
              Unforgettable Group Holidays in Spacious UK Houses
            </h2>
            
            <p className="text-lg text-[var(--color-neutral-dark)] leading-relaxed mb-6">
              There's something special about gathering your favourite people under one roof for a holiday together. At Group Escape Houses, we curate a collection of <strong>large holiday houses across the UK</strong> that make group getaways not just possible, but truly memorable. Our properties range from traditional country estates to contemporary coastal homes, each offering the space, comfort, and character that group holidays deserve.
            </p>

            <p className="text-lg text-[var(--color-neutral-dark)] leading-relaxed mb-6">
              Unlike piecing together multiple hotel rooms or cramped holiday rentals, our large holiday houses bring your entire group together. Imagine long breakfasts around a farmhouse table, afternoons in the garden, evenings by the fire or in the <Link href="/houses-with-hot-tubs" className="text-[var(--color-accent-sage)] hover:underline font-medium">hot tub</Link>, and late nights in the <Link href="/houses-with-games-rooms" className="text-[var(--color-accent-sage)] hover:underline font-medium">games room</Link>. These are the experiences that create lasting memories.
            </p>

            <h3 className="text-2xl font-semibold mt-8 mb-4">Why Choose a Large Holiday House?</h3>
            
            <p className="text-lg text-[var(--color-neutral-dark)] leading-relaxed mb-6">
              <strong>Space to breathe:</strong> Our properties offer generous living areas where everyone can spread out. Multiple lounges mean different activities can happen simultaneously—board games in one room, a film in another, conversation by the fire in a third. When you want together time, spacious dining rooms and open-plan kitchens bring everyone back together.
            </p>

            <p className="text-lg text-[var(--color-neutral-dark)] leading-relaxed mb-6">
              <strong>Privacy and freedom:</strong> A large holiday house is yours exclusively. No hotel corridors, no shared facilities with strangers, no restaurant opening hours to work around. Cook when you want, eat when you want, and enjoy your holiday on your own terms. This privacy is particularly valued by families with young children and groups celebrating special occasions.
            </p>

            <p className="text-lg text-[var(--color-neutral-dark)] leading-relaxed mb-6">
              <strong>Exceptional value:</strong> Split between your group, large holiday houses often cost less per person than a standard hotel room. For a typical group of 15, our properties average £35-55 per person per night—and you're getting far more than a bedroom. You're getting exclusive access to an entire property with premium amenities and grounds.
            </p>

            <h3 className="text-2xl font-semibold mt-8 mb-4">Perfect for Every Type of Group Holiday</h3>
            
            <p className="text-lg text-[var(--color-neutral-dark)] leading-relaxed mb-6">
              <strong>Family reunions:</strong> Multi-generational gatherings thrive in our large holiday houses. Grandparents, parents, children, and cousins can all stay together while still having their own space. Many properties feature ground-floor bedrooms for those with mobility needs, enclosed gardens for younger children, and layouts that accommodate different schedules and preferences.
            </p>

            <p className="text-lg text-[var(--color-neutral-dark)] leading-relaxed mb-6">
              <strong>Friend getaways:</strong> Whether you're celebrating a milestone birthday, organising a <Link href="/hen-party-houses" className="text-[var(--color-accent-sage)] hover:underline font-medium">hen party</Link>, or simply catching up with old friends, our properties provide the perfect setting. Many groups return year after year, making the annual house holiday a treasured tradition.
            </p>

            <p className="text-lg text-[var(--color-neutral-dark)] leading-relaxed mb-6">
              <strong>Special celebrations:</strong> From significant birthdays to anniversary parties and <Link href="/special-celebrations" className="text-[var(--color-accent-sage)] hover:underline font-medium">milestone celebrations</Link>, large holiday houses offer a private venue for your event. Celebrate in style surrounded by the people who matter most, without the constraints and costs of traditional venues.
            </p>
          </div>
        </div>
      </section>

      {/* Holiday Types */}
      <section className="py-16 bg-[var(--color-bg-primary)]">
        <div className="max-w-[1200px] mx-auto px-6">
          <h2 className="text-3xl font-bold mb-8 text-center" style={{ fontFamily: "var(--font-display)" }}>
            Find Your Perfect Holiday Setting
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {holidayTypes.map((type, index) => {
              const Icon = type.icon;
              return (
                <div key={index} className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-lg transition-shadow">
                  <div className="w-14 h-14 rounded-full bg-[var(--color-accent-sage)]/20 flex items-center justify-center mb-6">
                    <Icon className="w-7 h-7 text-[var(--color-accent-sage)]" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{type.title}</h3>
                  <p className="text-[var(--color-neutral-dark)] mb-4">{type.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {type.destinations.map((dest, i) => (
                      <span key={i} className="text-xs bg-[var(--color-bg-primary)] px-2 py-1 rounded">{dest}</span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-[1200px] mx-auto px-6">
          <h2 className="text-3xl font-bold mb-6" style={{ fontFamily: "var(--font-display)" }}>
            What to Expect from Our Large Holiday Houses
          </h2>
          
          <div className="prose prose-lg max-w-none mb-12">
            <p className="text-lg text-[var(--color-neutral-dark)] leading-relaxed">
              Every property in our collection is personally selected for its ability to host memorable group holidays. We look for character properties with soul, modern amenities for comfort, and locations that inspire. Whether you choose a <Link href="/house-styles/manor-houses" className="text-[var(--color-accent-sage)] hover:underline font-medium">historic manor house</Link>, a <Link href="/house-styles/country-houses" className="text-[var(--color-accent-sage)] hover:underline font-medium">country farmhouse</Link>, or a <Link href="/house-styles/luxury-houses" className="text-[var(--color-accent-sage)] hover:underline font-medium">contemporary luxury home</Link>, you can expect quality and attention to detail.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto rounded-full bg-[var(--color-accent-sage)]/20 flex items-center justify-center mb-4">
                <Bed className="w-8 h-8 text-[var(--color-accent-sage)]" />
              </div>
              <h3 className="font-medium mb-2">5-15 Bedrooms</h3>
              <p className="text-sm text-[var(--color-neutral-dark)]">Comfortable sleeping for every guest</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto rounded-full bg-[var(--color-accent-pink)]/20 flex items-center justify-center mb-4">
                <Waves className="w-8 h-8 text-[var(--color-accent-pink)]" />
              </div>
              <h3 className="font-medium mb-2">Hot Tubs</h3>
              <p className="text-sm text-[var(--color-neutral-dark)]">Relax and unwind together</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto rounded-full bg-[var(--color-accent-gold)]/20 flex items-center justify-center mb-4">
                <Gamepad2 className="w-8 h-8 text-[var(--color-accent-gold)]" />
              </div>
              <h3 className="font-medium mb-2">Games Rooms</h3>
              <p className="text-sm text-[var(--color-neutral-dark)]">Entertainment for all ages</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto rounded-full bg-[var(--color-accent-sage)]/20 flex items-center justify-center mb-4">
                <Sun className="w-8 h-8 text-[var(--color-accent-sage)]" />
              </div>
              <h3 className="font-medium mb-2">Private Grounds</h3>
              <p className="text-sm text-[var(--color-neutral-dark)]">Gardens, terraces and outdoor space</p>
            </div>
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
                  Featured Large Holiday Houses
                </h2>
                <p className="text-[var(--color-neutral-dark)] mt-2">Handpicked properties for unforgettable group holidays</p>
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
          </div>
        </section>
      )}

      {/* Destinations Grid */}
      <section className="py-16 bg-white">
        <div className="max-w-[1200px] mx-auto px-6">
          <h2 className="text-3xl font-bold mb-6" style={{ fontFamily: "var(--font-display)" }}>
            Popular Destinations for Large Holiday Houses
          </h2>
          
          <p className="text-lg text-[var(--color-neutral-dark)] leading-relaxed mb-8">
            From dramatic coastlines to peaceful countryside, we offer large holiday houses in the UK's most sought-after locations. Each destination brings its own character to your group holiday experience.
          </p>
          
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Link href="/destinations/lake-district" className="group p-4 bg-[var(--color-bg-primary)] rounded-xl hover:shadow-md transition-all">
                <span className="font-medium group-hover:text-[var(--color-accent-sage)]">Lake District</span>
              </Link>
              <Link href="/destinations/cornwall" className="group p-4 bg-[var(--color-bg-primary)] rounded-xl hover:shadow-md transition-all">
                <span className="font-medium group-hover:text-[var(--color-accent-sage)]">Cornwall</span>
              </Link>
              <Link href="/destinations/cotswolds" className="group p-4 bg-[var(--color-bg-primary)] rounded-xl hover:shadow-md transition-all">
                <span className="font-medium group-hover:text-[var(--color-accent-sage)]">Cotswolds</span>
              </Link>
              <Link href="/destinations/devon" className="group p-4 bg-[var(--color-bg-primary)] rounded-xl hover:shadow-md transition-all">
                <span className="font-medium group-hover:text-[var(--color-accent-sage)]">Devon</span>
              </Link>
              <Link href="/destinations/yorkshire" className="group p-4 bg-[var(--color-bg-primary)] rounded-xl hover:shadow-md transition-all">
                <span className="font-medium group-hover:text-[var(--color-accent-sage)]">Yorkshire</span>
              </Link>
              <Link href="/destinations/norfolk" className="group p-4 bg-[var(--color-bg-primary)] rounded-xl hover:shadow-md transition-all">
                <span className="font-medium group-hover:text-[var(--color-accent-sage)]">Norfolk</span>
              </Link>
              <Link href="/destinations/peak-district" className="group p-4 bg-[var(--color-bg-primary)] rounded-xl hover:shadow-md transition-all">
                <span className="font-medium group-hover:text-[var(--color-accent-sage)]">Peak District</span>
              </Link>
              <Link href="/destinations/sussex" className="group p-4 bg-[var(--color-bg-primary)] rounded-xl hover:shadow-md transition-all">
                <span className="font-medium group-hover:text-[var(--color-accent-sage)]">Sussex</span>
              </Link>
              <Link href="/destinations/bath" className="group p-4 bg-[var(--color-bg-primary)] rounded-xl hover:shadow-md transition-all">
                <span className="font-medium group-hover:text-[var(--color-accent-sage)]">Bath</span>
              </Link>
              <Link href="/destinations/suffolk" className="group p-4 bg-[var(--color-bg-primary)] rounded-xl hover:shadow-md transition-all">
                <span className="font-medium group-hover:text-[var(--color-accent-sage)]">Suffolk</span>
              </Link>
            </div>
          
          <div className="text-center mt-8">
            <Link href="/destinations" className="text-[var(--color-accent-sage)] font-medium hover:underline">
              Explore all UK destinations →
            </Link>
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
              Find the perfect property by exploring our specialist collections.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Link href="/large-group-accommodation" className="group bg-white rounded-xl p-6 hover:shadow-lg transition-all">
                <Users className="w-10 h-10 mb-4 text-[var(--color-accent-sage)] group-hover:scale-110 transition-transform" />
                <h3 className="font-bold text-lg mb-2 group-hover:text-[var(--color-accent-sage)] transition-colors">Large Group Accommodation</h3>
                <p className="text-sm text-[var(--color-neutral-dark)]">Houses for 10-30+ guests across the UK</p>
              </Link>
              <Link href="/houses-with-hot-tubs" className="group bg-white rounded-xl p-6 hover:shadow-lg transition-all">
                <Waves className="w-10 h-10 mb-4 text-[var(--color-accent-pink)] group-hover:scale-110 transition-transform" />
                <h3 className="font-bold text-lg mb-2 group-hover:text-[var(--color-accent-sage)] transition-colors">Houses with Hot Tubs</h3>
                <p className="text-sm text-[var(--color-neutral-dark)]">Relax in properties with private hot tubs</p>
              </Link>
              <Link href="/houses-with-games-rooms" className="group bg-white rounded-xl p-6 hover:shadow-lg transition-all">
                <Gamepad2 className="w-10 h-10 mb-4 text-[var(--color-accent-gold)] group-hover:scale-110 transition-transform" />
                <h3 className="font-bold text-lg mb-2 group-hover:text-[var(--color-accent-sage)] transition-colors">Houses with Games Rooms</h3>
                <p className="text-sm text-[var(--color-neutral-dark)]">Entertainment-ready properties</p>
              </Link>
              <Link href="/hen-party-houses" className="group bg-white rounded-xl p-6 hover:shadow-lg transition-all">
                <Home className="w-10 h-10 mb-4 text-[var(--color-accent-sage)] group-hover:scale-110 transition-transform" />
                <h3 className="font-bold text-lg mb-2 group-hover:text-[var(--color-accent-sage)] transition-colors">Hen Party Houses</h3>
                <p className="text-sm text-[var(--color-neutral-dark)]">Perfect venues for hen celebrations</p>
              </Link>
            </div>
          </div>
        </section>

        {/* FAQs */}
      <section className="py-16 bg-[var(--color-bg-primary)]">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-3xl font-bold mb-8 text-center" style={{ fontFamily: "var(--font-display)" }}>
            Frequently Asked Questions
          </h2>
          
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <details key={index} className="bg-white rounded-xl group">
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

      {/* CTA Section */}
      <section className="py-16 bg-white">
        <div className="max-w-[1200px] mx-auto px-6 text-center">
          <div className="bg-[var(--color-bg-primary)] p-12 rounded-3xl">
            <h2 className="text-3xl md:text-4xl font-bold mb-6" style={{ fontFamily: "var(--font-display)" }}>
              Start Planning Your Group Holiday
            </h2>
            <p className="text-xl text-[var(--color-neutral-dark)] mb-8 max-w-2xl mx-auto">
              Browse our collection of large holiday houses or contact us for personalised recommendations. Your perfect group getaway awaits.
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
