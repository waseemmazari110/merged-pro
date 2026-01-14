import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PropertyCard from "@/components/PropertyCard";
import UKServiceSchema from "@/components/UKServiceSchema";
import { Button } from "@/components/ui/button";
import { InstagramSection } from "@/components/home/InstagramSection";
import { Heart, Sparkles, Wine, Music, Camera, Crown, Waves, Gamepad2, Star, MapPin, Users, ChevronDown } from "lucide-react";
import { db } from "@/db";
import { properties } from "@/db/schema";
import { eq, desc } from "drizzle-orm";

export const metadata: Metadata = {
  title: "Hen Party Houses UK | Large Houses for Hen Dos",

  description: "Find the perfect hen party house in the UK. Luxury properties sleeping 10-30+ guests with hot tubs, games rooms, and stylish interiors. Celebrate the bride-to-be in style.",
  keywords: "hen party houses UK, hen do houses, hen weekend accommodation, hen party venue, group hen accommodation, luxury hen party house, hen party hot tub, hen do venue",
  alternates: {
    canonical: "https://www.groupescapehouses.co.uk/hen-party-houses",
  },
  openGraph: {
    title: "Hen Party Houses UK | Large Houses for Hen Dos",
    description: "Find the perfect hen party house in the UK. Luxury properties sleeping 10-30+ guests with hot tubs and stylish interiors.",
    url: "https://www.groupescapehouses.co.uk/hen-party-houses",
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
    question: "How far in advance should we book a hen party house?",
    answer: "We recommend booking 3-6 months in advance for popular dates (weekends, summer, and bank holidays). For flexible dates or midweek stays, shorter notice is often possible. The best properties book up quickly, so earlier is always better for the widest choice.",
  },
  {
    question: "What group sizes can your hen party houses accommodate?",
    answer: "Our hen party houses sleep anywhere from 10 to 30+ guests. We have intimate properties perfect for small hen dos of 10-12 close friends, and larger manor houses ideal for extended groups of 25-30 guests including mothers, aunts, and wider friendship circles.",
  },
  {
    question: "Are your properties suitable for celebrations with activities?",
    answer: "Absolutely. Many groups organise cocktail classes, spa treatments, life drawing, or private chef experiences at our properties. Most houses have large kitchens for cooking activities, gardens for outdoor games, and entertainment spaces for planned activities.",
  },
  {
    question: "What time are check-in and check-out?",
    answer: "Standard check-in is typically 4pm on arrival day, with check-out at 10am on departure. Some properties offer flexible times—early check-in or late check-out—for an additional fee, subject to availability between bookings.",
  },
  {
    question: "Are decorations allowed at your hen party houses?",
    answer: "Yes, tasteful decorations are welcome at most properties. We ask that you use blu-tack rather than sticky tape, avoid glitter or confetti, and remove all decorations before departure. Some properties provide basic hen party decorations as part of the stay.",
  },
  {
    question: "Is there a minimum stay requirement?",
    answer: "Most of our hen party properties require a minimum 2-night stay, with 3 nights being standard for weekend bookings (Friday to Monday). Midweek stays of 2-3 nights are also popular and often more affordable.",
  },
];

const henFeatures = [
  {
    icon: Crown,
    title: "Made for Celebrations",
    description: "Spacious houses designed for groups, with open-plan living for socialising and private rooms for everyone."
  },
  {
    icon: Wine,
    title: "Hot Tubs & Pools",
    description: "Relax and unwind with luxury amenities including hot tubs, swimming pools, and beautiful outdoor spaces."
  },
  {
    icon: Music,
    title: "Entertainment Spaces",
    description: "Games rooms, cinemas, sound systems, and party-ready spaces to keep the celebrations going."
  },
  {
    icon: Camera,
    title: "Instagram-Worthy",
    description: "Beautiful interiors and stunning locations perfect for creating unforgettable memories and photos."
  },
  {
    icon: Sparkles,
    title: "Add Experiences",
    description: "Enhance your weekend with cocktail classes, spa treatments, private chefs, and more curated activities."
  },
  {
    icon: Heart,
    title: "Celebrate Together",
    description: "The perfect setting for celebrating the bride-to-be with all her closest friends and family."
  },
];

const topDestinations = [
  { name: "Brighton", slug: "brighton", description: "Vibrant nightlife and beach clubs" },
  { name: "Bath", slug: "bath", description: "Elegant spa town with history" },
  { name: "Cotswolds", slug: "cotswolds", description: "Picturesque countryside retreats" },
  { name: "Lake District", slug: "lake-district", description: "Stunning lakeside properties" },
  { name: "Cornwall", slug: "cornwall", description: "Coastal charm and beaches" },
  { name: "London", slug: "london", description: "City sophistication and nightlife" },
];

export default async function HenPartyHousesPage() {
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
            { name: "Hen Party Houses", url: "/hen-party-houses" }
          ]
        }}
      />
      <UKServiceSchema type="faq" data={{ faqs }} />

      {/* Hero Section */}
      <section className="relative min-h-[70vh] flex items-center justify-center pt-20">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=1920&q=90"
            alt="Hen party celebration"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60" />
        </div>
        
        <div className="relative z-10 max-w-[1200px] mx-auto px-6 py-20 text-center">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
            <Crown className="w-5 h-5 text-white" />
            <span className="text-white font-medium">Celebrate the Bride-to-Be</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold text-white mb-6" style={{ fontFamily: "var(--font-display)" }}>
            Hen Party Houses UK
          </h1>
          <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto mb-8">
            Luxury group accommodation with hot tubs, pools, and stylish interiors. Create unforgettable memories with the bride-to-be in our handpicked properties.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button asChild size="lg" className="rounded-2xl px-8 py-6 text-lg font-medium" style={{ background: "var(--color-accent-sage)", color: "white" }}>
              <Link href="/properties">Browse Hen Houses</Link>
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
              The Perfect Setting for Your Hen Party
            </h2>
            
            <p className="text-lg text-[var(--color-neutral-dark)] leading-relaxed mb-6">
              Planning a hen party is one of the most exciting responsibilities for any maid of honour or bridesmaid. At Group Escape Houses, we make finding the perfect <strong>hen party house</strong> simple, offering a carefully curated collection of luxury properties across the UK that are ideal for celebrating the bride-to-be. From elegant country manors to stylish coastal retreats, our houses provide the space, amenities, and atmosphere that transform a hen weekend from ordinary to extraordinary.
            </p>

            <p className="text-lg text-[var(--color-neutral-dark)] leading-relaxed mb-6">
              Our hen party properties sleep anywhere from 10 to 30+ guests, with exclusive amenities including <Link href="/houses-with-hot-tubs" className="text-[var(--color-accent-sage)] hover:underline font-medium">private hot tubs</Link> for prosecco sessions, <Link href="/houses-with-games-rooms" className="text-[var(--color-accent-sage)] hover:underline font-medium">games rooms</Link> for competitive fun, and stunning interiors perfect for Instagram-worthy photos. Whether you're planning a relaxed spa weekend or a lively celebration, we have the ideal property for your group.
            </p>

            <h3 className="text-2xl font-semibold mt-8 mb-4">Why Choose a Hen Party House?</h3>
            
            <p className="text-lg text-[var(--color-neutral-dark)] leading-relaxed mb-6">
              A dedicated hen party house offers advantages that hotels and traditional venues simply cannot match. <strong>Privacy</strong> is paramount—no strangers in the corridor, no restricted hours, no watching what you say or do. The entire property is yours, giving your group the freedom to celebrate however you choose, whether that's an early morning yoga session, an afternoon cocktail masterclass, or dancing until the small hours.
            </p>

            <p className="text-lg text-[var(--color-neutral-dark)] leading-relaxed mb-6">
              <strong>Togetherness</strong> is what makes hen parties special, and a shared house keeps the entire group under one roof. No splitting into hotel rooms and missing conversations. Instead, everyone gathers in spacious living areas, around large dining tables, or in the hot tub together. The moments between planned activities—morning coffee, late-night chats, lazy Sunday brunches—often become the most treasured memories.
            </p>

            <p className="text-lg text-[var(--color-neutral-dark)] leading-relaxed mb-6">
              <strong>Value</strong> surprises many hen party organisers. Split between your group, our luxury properties often cost less per person than a city centre hotel, while offering far more—private grounds, premium amenities, fully equipped kitchens (great for DIY brunch), and character that makes for stunning photos. A 3-night stay for 15 guests might work out at just £80-120 per person for the entire weekend.
            </p>

            <h3 className="text-2xl font-semibold mt-8 mb-4">Hen Party House Must-Haves</h3>
            
            <p className="text-lg text-[var(--color-neutral-dark)] leading-relaxed mb-6">
              When choosing a hen party property, certain features make all the difference. A <strong>hot tub</strong> is almost essential—there's something about bubbling water, champagne flutes, and fairy lights that creates magic for hen celebrations. Our <Link href="/houses-with-hot-tubs" className="text-[var(--color-accent-sage)] hover:underline font-medium">hot tub properties</Link> range from traditional wooden tubs in rural settings to modern spa facilities with multiple relaxation options.
            </p>

            <p className="text-lg text-[var(--color-neutral-dark)] leading-relaxed mb-6">
              <strong>Spacious communal areas</strong> accommodate group activities, from cocktail making to pamper sessions to team games. Look for properties with open-plan living spaces, large dining tables (essential for group meals and craft activities), and perhaps a separate area for louder entertainment. <Link href="/houses-with-games-rooms" className="text-[var(--color-accent-sage)] hover:underline font-medium">Games rooms</Link> add another dimension—pool tournaments and darts competitions keep the fun going.
            </p>

            <p className="text-lg text-[var(--color-neutral-dark)] leading-relaxed mb-6">
              <strong>Beautiful settings</strong> matter for hen parties more than most occasions. Whether you choose a <Link href="/destinations/cotswolds" className="text-[var(--color-accent-sage)] hover:underline font-medium">Cotswolds</Link> manor house with manicured gardens, a <Link href="/destinations/cornwall" className="text-[var(--color-accent-sage)] hover:underline font-medium">Cornish</Link> beach house with sea views, or a <Link href="/destinations/lake-district" className="text-[var(--color-accent-sage)] hover:underline font-medium">Lake District</Link> retreat with mountain backdrops, the location becomes part of your celebration story.
            </p>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 bg-[var(--color-bg-primary)]">
        <div className="max-w-[1200px] mx-auto px-6">
          <h2 className="text-3xl font-bold mb-8 text-center" style={{ fontFamily: "var(--font-display)" }}>
            What Makes Our Hen Houses Special
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {henFeatures.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-lg transition-shadow">
                  <div className="w-14 h-14 rounded-full bg-[var(--color-accent-sage)]/20 flex items-center justify-center mb-6">
                    <Icon className="w-7 h-7 text-[var(--color-accent-sage)]" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                  <p className="text-[var(--color-neutral-dark)]">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Group Sizes */}
      <section className="py-16 bg-white">
        <div className="max-w-[1200px] mx-auto px-6">
          <h2 className="text-3xl font-bold mb-6" style={{ fontFamily: "var(--font-display)" }}>
            Hen Party Houses for Every Group Size
          </h2>
          
          <div className="prose prose-lg max-w-none mb-12">
            <p className="text-lg text-[var(--color-neutral-dark)] leading-relaxed">
              Whether you're planning an intimate celebration or a larger gathering, we have hen party houses to suit. Our properties cater for groups of 10 to 30+ guests, ensuring there's comfortable sleeping, ample bathrooms, and sufficient communal space for everyone to enjoy the weekend together.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-[var(--color-bg-primary)] rounded-2xl p-8">
              <Users className="w-10 h-10 text-[var(--color-accent-sage)] mb-4" />
              <h3 className="text-xl font-bold mb-3">Sleeps 10-15</h3>
              <p className="text-[var(--color-neutral-dark)] mb-4">
                Perfect for close-knit groups of bridesmaids and best friends. Intimate properties with all the essential amenities for a memorable hen weekend.
              </p>
              <Link href="/properties" className="text-[var(--color-accent-sage)] font-medium hover:underline">
                Browse properties →
              </Link>
            </div>
            
            <div className="bg-[var(--color-bg-primary)] rounded-2xl p-8">
              <Users className="w-10 h-10 text-[var(--color-accent-pink)] mb-4" />
              <h3 className="text-xl font-bold mb-3">Sleeps 15-20</h3>
              <p className="text-[var(--color-neutral-dark)] mb-4">
                Room for the wider friendship group. These properties offer multiple living spaces, keeping activities flexible and ensuring no one feels crowded.
              </p>
              <Link href="/properties" className="text-[var(--color-accent-sage)] font-medium hover:underline">
                Browse properties →
              </Link>
            </div>
            
            <div className="bg-[var(--color-bg-primary)] rounded-2xl p-8">
              <Users className="w-10 h-10 text-[var(--color-accent-gold)] mb-4" />
              <h3 className="text-xl font-bold mb-3">Sleeps 20-30+</h3>
              <p className="text-[var(--color-neutral-dark)] mb-4">
                Include mothers, aunts, and extended circles. Our largest properties are ideal for multi-generational hen celebrations with varying energy levels.
              </p>
              <Link href="/properties" className="text-[var(--color-accent-sage)] font-medium hover:underline">
                Browse properties →
              </Link>
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
                  Featured Hen Party Houses
                </h2>
                <p className="text-[var(--color-neutral-dark)] mt-2">Handpicked properties perfect for celebrating</p>
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

      {/* Top Destinations */}
      <section className="py-16 bg-white">
        <div className="max-w-[1200px] mx-auto px-6">
          <h2 className="text-3xl font-bold mb-6" style={{ fontFamily: "var(--font-display)" }}>
            Popular Hen Party Destinations
          </h2>
          
          <p className="text-lg text-[var(--color-neutral-dark)] leading-relaxed mb-8">
            From vibrant <Link href="/destinations/brighton" className="text-[var(--color-accent-sage)] hover:underline font-medium">Brighton</Link> with its legendary nightlife to peaceful <Link href="/destinations/cotswolds" className="text-[var(--color-accent-sage)] hover:underline font-medium">Cotswolds</Link> retreats, we offer hen party houses in the UK's most popular celebration destinations.
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

      {/* Related Categories */}
      <section className="py-16 bg-[var(--color-bg-primary)]">
        <div className="max-w-[1200px] mx-auto px-6">
          <h2 className="text-3xl font-bold mb-8" style={{ fontFamily: "var(--font-display)" }}>
            Browse by Feature
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link href="/houses-with-hot-tubs" className="group bg-white rounded-xl p-6 text-center hover:shadow-lg transition-all">
              <Waves className="w-8 h-8 mx-auto mb-3 text-[var(--color-accent-sage)] group-hover:scale-110 transition-transform" />
              <span className="font-medium">Houses with Hot Tubs</span>
            </Link>
            <Link href="/houses-with-games-rooms" className="group bg-white rounded-xl p-6 text-center hover:shadow-lg transition-all">
              <Gamepad2 className="w-8 h-8 mx-auto mb-3 text-[var(--color-accent-pink)] group-hover:scale-110 transition-transform" />
              <span className="font-medium">Houses with Games Rooms</span>
            </Link>
            <Link href="/large-group-accommodation" className="group bg-white rounded-xl p-6 text-center hover:shadow-lg transition-all">
              <Users className="w-8 h-8 mx-auto mb-3 text-[var(--color-accent-gold)] group-hover:scale-110 transition-transform" />
              <span className="font-medium">Large Group Houses</span>
            </Link>
            <Link href="/large-holiday-houses" className="group bg-white rounded-xl p-6 text-center hover:shadow-lg transition-all">
              <Star className="w-8 h-8 mx-auto mb-3 text-[var(--color-accent-sage)] group-hover:scale-110 transition-transform" />
              <span className="font-medium">Large Holiday Houses</span>
            </Link>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-3xl font-bold mb-8 text-center" style={{ fontFamily: "var(--font-display)" }}>
            Hen Party FAQs
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

      {/* CTA Section */}
      <section className="py-16 bg-[var(--color-bg-primary)]">
        <div className="max-w-[1200px] mx-auto px-6 text-center">
          <div className="bg-white p-12 rounded-3xl shadow-lg">
            <Crown className="w-12 h-12 mx-auto mb-6 text-[var(--color-accent-sage)]" />
            <h2 className="text-3xl md:text-4xl font-bold mb-6" style={{ fontFamily: "var(--font-display)" }}>
              Ready to Plan the Perfect Hen Weekend?
            </h2>
            <p className="text-xl text-[var(--color-neutral-dark)] mb-8 max-w-2xl mx-auto">
              Browse our collection of hen party houses or get in touch for personalised recommendations. Let's make it a celebration to remember!
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

      {/* Instagram */}
      <InstagramSection />

      <Footer />
    </div>
  );
}
