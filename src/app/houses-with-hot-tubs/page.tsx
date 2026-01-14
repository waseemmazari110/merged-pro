import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PropertyCard from "@/components/PropertyCard";
import UKServiceSchema from "@/components/UKServiceSchema";
import { Button } from "@/components/ui/button";
import { Waves, Users, Star, Moon, Sun, ThermometerSun, Sparkles, MapPin, ChevronDown } from "lucide-react";
import { db } from "@/db";
import { properties } from "@/db/schema";
import { eq, desc } from "drizzle-orm";

export const metadata: Metadata = {
  title: "Houses with Hot Tubs UK | Large Group Properties",

  description: "Discover large houses with hot tubs across the UK. Perfect for group getaways, hen parties, and family celebrations. Properties sleeping 10-30 guests with private outdoor hot tubs.",
  keywords: "houses with hot tubs UK, hot tub holidays, large houses hot tubs, group accommodation hot tub, hen party house hot tub, holiday house hot tub, UK hot tub breaks",
  alternates: {
    canonical: "https://www.groupescapehouses.co.uk/houses-with-hot-tubs",
  },
  openGraph: {
    title: "Houses with Hot Tubs UK | Large Group Properties",
    description: "Discover large houses with hot tubs across the UK. Perfect for group getaways, hen parties, and family celebrations.",
    url: "https://www.groupescapehouses.co.uk/houses-with-hot-tubs",
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
    question: "What type of hot tubs do your properties have?",
    answer: "Our properties feature a range of hot tub styles, from traditional wooden barrel tubs to modern jetted spas. Most accommodate 6-8 people comfortably, and some larger properties have hot tubs that seat 10 or more. All are privately located for your group's exclusive use.",
  },
  {
    question: "Are hot tubs available year-round?",
    answer: "Yes, our hot tubs are available throughout the year. In fact, winter hot tubbing under a starry sky or with snow falling is a particularly magical experience. All our hot tubs are heated to a comfortable temperature regardless of the season.",
  },
  {
    question: "Is the hot tub included in the rental price?",
    answer: "In most cases, yes. The majority of our properties include hot tub use in the rental price. A small number may charge a nominal heating fee during winter months, which will be clearly stated in the property listing.",
  },
  {
    question: "How many people can use the hot tub at once?",
    answer: "This varies by property, but most hot tubs comfortably seat 6-8 people at a time. Some of our larger properties feature extra-large hot tubs that can accommodate more. The capacity is listed on each property page.",
  },
  {
    question: "Are hot tubs cleaned between guests?",
    answer: "Absolutely. All hot tubs are professionally cleaned, sanitised, and the water chemically balanced between each guest stay. Health and hygiene are our top priorities, and property owners follow strict maintenance protocols.",
  },
  {
    question: "Can we use the hot tub late at night?",
    answer: "Most properties allow hot tub use until 10pm or 11pm. Some more remote or rural properties permit later use. Specific hot tub hours are detailed in each property's house rules to ensure consideration for neighbours.",
  },
];

const hotTubBenefits = [
  {
    icon: Moon,
    title: "Evening Relaxation",
    description: "Unwind under the stars after a day of activities with your group"
  },
  {
    icon: Users,
    title: "Social Hub",
    description: "The perfect gathering spot for conversations and celebrations"
  },
  {
    icon: ThermometerSun,
    title: "Year-Round Enjoyment",
    description: "Heated hot tubs are even more magical in winter months"
  },
  {
    icon: Sparkles,
    title: "Luxury Touch",
    description: "Elevate your group getaway with spa-like relaxation"
  },
];

export default async function HousesWithHotTubsPage() {
  const featuredProperties = await getFeaturedProperties();

  const transformedProperties = featuredProperties.map(p => ({
    id: p.id.toString(),
    title: p.title,
    location: p.location,
    sleeps: p.sleepsMax,
    bedrooms: p.bedrooms,
    priceFrom: Math.round(p.priceFromMidweek / 3),
    image: p.heroImage,
    features: ["Hot Tub"],
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
            { name: "Houses with Hot Tubs", url: "/houses-with-hot-tubs" }
          ]
        }}
      />
      <UKServiceSchema type="faq" data={{ faqs }} />

      {/* Hero Section */}
      <section className="relative min-h-[60vh] flex items-center justify-center pt-20">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1540202404-a2f29016b523?w=1920&q=90"
            alt="Luxury hot tub at holiday house"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60" />
        </div>
        
        <div className="relative z-10 max-w-[1200px] mx-auto px-6 py-20 text-center">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
            <Waves className="w-5 h-5 text-white" />
            <span className="text-white font-medium">Premium Hot Tub Properties</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6" style={{ fontFamily: "var(--font-display)" }}>
            Houses with Hot Tubs UK
          </h1>
          <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto mb-8">
            Large group properties with private hot tubs. Relax, unwind, and celebrate together in luxury accommodation across the UK.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button asChild size="lg" className="rounded-2xl px-8 py-6 text-lg font-medium" style={{ background: "var(--color-accent-sage)", color: "white" }}>
              <Link href="/properties">Browse Hot Tub Houses</Link>
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
              The Ultimate Addition to Your Group Getaway
            </h2>
            
            <p className="text-lg text-[var(--color-neutral-dark)] leading-relaxed mb-6">
              Few things enhance a group holiday quite like a private hot tub. At Group Escape Houses, we've curated an exceptional collection of <strong>large houses with hot tubs across the UK</strong>, giving your group the opportunity to relax, socialise, and create lasting memories in bubbling comfort. Whether you're planning a <Link href="/hen-party-houses" className="text-[var(--color-accent-sage)] hover:underline font-medium">hen party</Link>, family celebration, or weekend away with friends, a hot tub property elevates the entire experience.
            </p>

            <p className="text-lg text-[var(--color-neutral-dark)] leading-relaxed mb-6">
              Our hot tub houses sleep anywhere from 10 to 30+ guests, with private outdoor spa facilities for your group's exclusive use. Picture yourselves unwinding after a day exploring the <Link href="/destinations/lake-district" className="text-[var(--color-accent-sage)] hover:underline font-medium">Lake District</Link>, soaking under the stars in the <Link href="/destinations/cotswolds" className="text-[var(--color-accent-sage)] hover:underline font-medium">Cotswolds</Link>, or enjoying champagne in the tub at a <Link href="/destinations/cornwall" className="text-[var(--color-accent-sage)] hover:underline font-medium">Cornish</Link> coastal retreat.
            </p>

            <h3 className="text-2xl font-semibold mt-8 mb-4">Why Choose a House with a Hot Tub?</h3>
            
            <p className="text-lg text-[var(--color-neutral-dark)] leading-relaxed mb-6">
              Hot tubs have become one of the most requested features for group accommodation, and it's easy to understand why. They create a natural gathering point where conversation flows freely and inhibitions melt away. There's something about warm, bubbling water under an open sky that encourages connection—whether that's deep conversations with old friends or getting to know new acquaintances better.
            </p>

            <p className="text-lg text-[var(--color-neutral-dark)] leading-relaxed mb-6">
              For celebrations, a hot tub adds an undeniable touch of luxury. <strong>Hen parties</strong> love the spa-like atmosphere for prosecco sessions and pre-dinner relaxation. <strong>Birthday groups</strong> find it becomes the focal point of evening celebrations. <strong>Family reunions</strong> appreciate the multigenerational appeal—teenagers love it as much as grandparents, creating rare shared experiences across age groups.
            </p>

            <p className="text-lg text-[var(--color-neutral-dark)] leading-relaxed mb-6">
              The therapeutic benefits shouldn't be overlooked either. After a day of hiking, sightseeing, or simply being on your feet, the combination of heat, buoyancy, and massage jets works wonders on tired muscles. Many guests report their best night's sleep of the holiday follows an evening hot tub session.
            </p>

            <h3 className="text-2xl font-semibold mt-8 mb-4">Hot Tubs for Every Season</h3>
            
            <p className="text-lg text-[var(--color-neutral-dark)] leading-relaxed mb-6">
              While summer hot tubbing offers the pleasure of warm evenings and long twilights, many of our guests discover that <strong>winter hot tubbing is even more magical</strong>. Steam rising into cold air, frost on surrounding trees, perhaps even snowflakes landing on warm water—these create genuinely unique experiences. The contrast between cold air on your face and hot water enveloping your body is invigorating rather than uncomfortable.
            </p>

            <p className="text-lg text-[var(--color-neutral-dark)] leading-relaxed mb-6">
              Autumn brings its own charm, with hot tub sessions surrounded by golden leaves and crisp evening air. Spring offers longer daylight hours and the promise of warmer months ahead. In truth, there's no bad time for a hot tub holiday—each season brings its own particular pleasure.
            </p>
          </div>
        </div>
      </section>

      {/* Benefits Grid */}
      <section className="py-16 bg-[var(--color-bg-primary)]">
        <div className="max-w-[1200px] mx-auto px-6">
          <h2 className="text-3xl font-bold mb-8 text-center" style={{ fontFamily: "var(--font-display)" }}>
            Why Groups Love Hot Tub Houses
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {hotTubBenefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <div key={index} className="bg-white rounded-2xl p-6 text-center shadow-sm hover:shadow-lg transition-shadow">
                  <div className="w-14 h-14 mx-auto rounded-full bg-[var(--color-accent-sage)]/20 flex items-center justify-center mb-4">
                    <Icon className="w-7 h-7 text-[var(--color-accent-sage)]" />
                  </div>
                  <h3 className="font-bold mb-2">{benefit.title}</h3>
                  <p className="text-sm text-[var(--color-neutral-dark)]">{benefit.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Occasions Section */}
      <section className="py-16 bg-white">
        <div className="max-w-[1200px] mx-auto px-6">
          <h2 className="text-3xl font-bold mb-6" style={{ fontFamily: "var(--font-display)" }}>
            Perfect Occasions for Hot Tub Houses
          </h2>
          
          <div className="prose prose-lg max-w-none mb-12">
            <p className="text-lg text-[var(--color-neutral-dark)] leading-relaxed">
              Our houses with hot tubs are ideal for a wide range of group occasions. <Link href="/hen-party-houses" className="text-[var(--color-accent-sage)] hover:underline font-medium">Hen parties</Link> consider a hot tub essential for the ultimate girls' weekend experience. <Link href="/special-celebrations" className="text-[var(--color-accent-sage)] hover:underline font-medium">Birthday celebrations</Link> and anniversary getaways take on extra sparkle when champagne is enjoyed from the tub. Family holidays become more memorable when three generations share the experience together.
            </p>
            
            <p className="text-lg text-[var(--color-neutral-dark)] leading-relaxed">
              <Link href="/weekend-breaks" className="text-[var(--color-accent-sage)] hover:underline font-medium">Weekend breaks</Link> with friends are elevated from ordinary to extraordinary. Corporate retreats find that hot tub time breaks down hierarchies and builds genuine team connections. Even rainy-day holidays are transformed when you can escape to the warmth of outdoor spa facilities.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link href="/hen-party-houses" className="group p-4 bg-[var(--color-bg-primary)] rounded-xl text-center hover:shadow-md transition-all">
              <Star className="w-6 h-6 mx-auto mb-2 text-[var(--color-accent-pink)]" />
              <span className="font-medium group-hover:text-[var(--color-accent-sage)]">Hen Parties</span>
            </Link>
            <Link href="/special-celebrations" className="group p-4 bg-[var(--color-bg-primary)] rounded-xl text-center hover:shadow-md transition-all">
              <Sparkles className="w-6 h-6 mx-auto mb-2 text-[var(--color-accent-gold)]" />
              <span className="font-medium group-hover:text-[var(--color-accent-sage)]">Celebrations</span>
            </Link>
            <Link href="/weekend-breaks" className="group p-4 bg-[var(--color-bg-primary)] rounded-xl text-center hover:shadow-md transition-all">
              <Sun className="w-6 h-6 mx-auto mb-2 text-[var(--color-accent-sage)]" />
              <span className="font-medium group-hover:text-[var(--color-accent-sage)]">Weekend Breaks</span>
            </Link>
            <Link href="/large-group-accommodation" className="group p-4 bg-[var(--color-bg-primary)] rounded-xl text-center hover:shadow-md transition-all">
              <Users className="w-6 h-6 mx-auto mb-2 text-[var(--color-accent-pink)]" />
              <span className="font-medium group-hover:text-[var(--color-accent-sage)]">Family Reunions</span>
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
                  Featured Houses with Hot Tubs
                </h2>
                <p className="text-[var(--color-neutral-dark)] mt-2">Large group properties with private hot tub facilities</p>
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

      {/* Destinations Section */}
      <section className="py-16 bg-white">
        <div className="max-w-[1200px] mx-auto px-6">
          <h2 className="text-3xl font-bold mb-6" style={{ fontFamily: "var(--font-display)" }}>
            Hot Tub Houses by Destination
          </h2>
          
          <p className="text-lg text-[var(--color-neutral-dark)] leading-relaxed mb-8">
            Find houses with hot tubs in the UK's most beautiful locations. From countryside retreats to coastal escapes, the combination of stunning scenery and spa relaxation creates unforgettable experiences.
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link href="/destinations/lake-district" className="group p-4 bg-[var(--color-bg-primary)] rounded-xl hover:shadow-md transition-all">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[var(--color-accent-sage)]" />
                <span className="font-medium group-hover:text-[var(--color-accent-sage)]">Lake District</span>
              </div>
            </Link>
            <Link href="/destinations/cotswolds" className="group p-4 bg-[var(--color-bg-primary)] rounded-xl hover:shadow-md transition-all">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[var(--color-accent-sage)]" />
                <span className="font-medium group-hover:text-[var(--color-accent-sage)]">Cotswolds</span>
              </div>
            </Link>
            <Link href="/destinations/cornwall" className="group p-4 bg-[var(--color-bg-primary)] rounded-xl hover:shadow-md transition-all">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[var(--color-accent-sage)]" />
                <span className="font-medium group-hover:text-[var(--color-accent-sage)]">Cornwall</span>
              </div>
            </Link>
            <Link href="/destinations/yorkshire" className="group p-4 bg-[var(--color-bg-primary)] rounded-xl hover:shadow-md transition-all">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[var(--color-accent-sage)]" />
                <span className="font-medium group-hover:text-[var(--color-accent-sage)]">Yorkshire</span>
              </div>
            </Link>
            <Link href="/destinations/devon" className="group p-4 bg-[var(--color-bg-primary)] rounded-xl hover:shadow-md transition-all">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[var(--color-accent-sage)]" />
                <span className="font-medium group-hover:text-[var(--color-accent-sage)]">Devon</span>
              </div>
            </Link>
            <Link href="/destinations/peak-district" className="group p-4 bg-[var(--color-bg-primary)] rounded-xl hover:shadow-md transition-all">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[var(--color-accent-sage)]" />
                <span className="font-medium group-hover:text-[var(--color-accent-sage)]">Peak District</span>
              </div>
            </Link>
            <Link href="/destinations/norfolk" className="group p-4 bg-[var(--color-bg-primary)] rounded-xl hover:shadow-md transition-all">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[var(--color-accent-sage)]" />
                <span className="font-medium group-hover:text-[var(--color-accent-sage)]">Norfolk</span>
              </div>
            </Link>
            <Link href="/destinations/brighton" className="group p-4 bg-[var(--color-bg-primary)] rounded-xl hover:shadow-md transition-all">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[var(--color-accent-sage)]" />
                <span className="font-medium group-hover:text-[var(--color-accent-sage)]">Brighton</span>
              </div>
            </Link>
          </div>
          
          <div className="text-center mt-8">
            <Link href="/destinations" className="text-[var(--color-accent-sage)] font-medium hover:underline">
              Explore all UK destinations →
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
            <Waves className="w-12 h-12 mx-auto mb-6 text-[var(--color-accent-sage)]" />
            <h2 className="text-3xl md:text-4xl font-bold mb-6" style={{ fontFamily: "var(--font-display)" }}>
              Ready for Your Hot Tub Getaway?
            </h2>
            <p className="text-xl text-[var(--color-neutral-dark)] mb-8 max-w-2xl mx-auto">
              Browse our collection of houses with hot tubs and find the perfect property for your group celebration.
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
