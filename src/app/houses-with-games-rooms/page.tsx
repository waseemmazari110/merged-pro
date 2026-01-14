import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PropertyCard from "@/components/PropertyCard";
import UKServiceSchema from "@/components/UKServiceSchema";
import { Button } from "@/components/ui/button";
import { Gamepad2, Users, Trophy, Dices, Music, Tv, Target, MapPin, ChevronDown, CircleDot } from "lucide-react";
import { db } from "@/db";
import { properties } from "@/db/schema";
import { eq, desc } from "drizzle-orm";

export const metadata: Metadata = {
  title: "Houses with Games Rooms UK | Large Group Properties",

  description: "Find large houses with games rooms across the UK. Pool tables, table tennis, arcade games, and entertainment spaces. Perfect for group getaways, family holidays, and celebrations sleeping 10-30 guests.",
  keywords: "houses with games rooms UK, group houses games room, pool table holiday house, large house games room, party house games room, family holiday games room, entertainment room holiday house",
  alternates: {
    canonical: "https://www.groupescapehouses.co.uk/houses-with-games-rooms",
  },
  openGraph: {
    title: "Houses with Games Rooms UK | Large Group Properties",
    description: "Find large houses with games rooms across the UK. Pool tables, table tennis, and entertainment spaces for groups.",
    url: "https://www.groupescapehouses.co.uk/houses-with-games-rooms",
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
    question: "What equipment is typically found in a games room?",
    answer: "Our properties feature a variety of games room equipment including pool tables, table tennis, darts, foosball, air hockey, board games, and in some cases arcade machines and gaming consoles. Each property listing details the specific games available.",
  },
  {
    question: "Are games rooms suitable for all ages?",
    answer: "Absolutely. Games rooms are designed for multigenerational enjoyment. Pool and table tennis appeal to adults and older children, while board games and some arcade games suit younger guests. Many families find games rooms keep everyone entertained across different age groups.",
  },
  {
    question: "Is the games room included in the rental price?",
    answer: "Yes, games room access is included in the rental price at all our properties. All equipment is provided and ready to use. Occasionally, properties may have optional extras like hot tubs or specific activities at additional cost, but standard games room facilities are always included.",
  },
  {
    question: "Are games rooms separate from living areas?",
    answer: "In most cases, yes. Games rooms are typically in dedicated spaces—converted outbuildings, basements, or separate wings—allowing for enthusiastic play without disturbing those wanting quieter activities in the main living areas.",
  },
  {
    question: "What if equipment gets damaged during our stay?",
    answer: "Normal wear and tear is expected and covered. If significant damage occurs, this may be assessed against the security deposit. We recommend supervising younger players and handling equipment with care. Property owners maintain equipment regularly between stays.",
  },
  {
    question: "Can we host tournaments or games nights?",
    answer: "Definitely! Many groups organise pool tournaments, table tennis championships, or team games nights during their stay. Some properties even provide scoring systems and prizes. Games rooms are perfect for friendly competition and group bonding.",
  },
];

const gamesRoomFeatures = [
  {
    icon: CircleDot,
    title: "Pool Tables",
    description: "Full-size or bar-size tables for competitive play"
  },
  {
    icon: Target,
    title: "Table Tennis",
    description: "Fast-paced fun for players of all abilities"
  },
  {
    icon: Dices,
    title: "Board Games",
    description: "Collections of classic and modern games"
  },
  {
    icon: Tv,
    title: "Gaming Consoles",
    description: "PlayStation, Xbox, and Nintendo systems"
  },
];

export default async function HousesWithGamesRoomsPage() {
  const featuredProperties = await getFeaturedProperties();

  const transformedProperties = featuredProperties.map(p => ({
    id: p.id.toString(),
    title: p.title,
    location: p.location,
    sleeps: p.sleepsMax,
    bedrooms: p.bedrooms,
    priceFrom: Math.round(p.priceFromMidweek / 3),
    image: p.heroImage,
    features: ["Games Room"],
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
            { name: "Houses with Games Rooms", url: "/houses-with-games-rooms" }
          ]
        }}
      />
      <UKServiceSchema type="faq" data={{ faqs }} />

      {/* Hero Section */}
      <section className="relative min-h-[60vh] flex items-center justify-center pt-20">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1611329857570-f02f340e7378?w=1920&q=90"
            alt="Games room with pool table"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60" />
        </div>
        
        <div className="relative z-10 max-w-[1200px] mx-auto px-6 py-20 text-center">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
            <Gamepad2 className="w-5 h-5 text-white" />
            <span className="text-white font-medium">Entertainment Ready Properties</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6" style={{ fontFamily: "var(--font-display)" }}>
            Houses with Games Rooms UK
          </h1>
          <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto mb-8">
            Large group properties with dedicated entertainment spaces. Pool tables, table tennis, arcade games, and more for unforgettable group getaways.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button asChild size="lg" className="rounded-2xl px-8 py-6 text-lg font-medium" style={{ background: "var(--color-accent-sage)", color: "white" }}>
              <Link href="/properties">Browse Games Room Houses</Link>
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
              Entertainment for Everyone Under One Roof
            </h2>
            
            <p className="text-lg text-[var(--color-neutral-dark)] leading-relaxed mb-6">
              A dedicated games room transforms a good group holiday into a great one. At Group Escape Houses, we specialise in <strong>large houses with games rooms across the UK</strong>, giving your group access to entertainment facilities that keep everyone engaged, laughing, and bonding throughout your stay. Whether you're competitive pool sharks or casual board game enthusiasts, our properties deliver endless entertainment options.
            </p>

            <p className="text-lg text-[var(--color-neutral-dark)] leading-relaxed mb-6">
              Our games room properties sleep anywhere from 10 to 30+ guests, perfect for <Link href="/large-group-accommodation" className="text-[var(--color-accent-sage)] hover:underline font-medium">large group getaways</Link>, <Link href="/hen-party-houses" className="text-[var(--color-accent-sage)] hover:underline font-medium">hen parties</Link>, family reunions, and friend gatherings. Combine a games room with a <Link href="/houses-with-hot-tubs" className="text-[var(--color-accent-sage)] hover:underline font-medium">hot tub property</Link> for the ultimate entertainment package—competition in the games room, relaxation in the tub.
            </p>

            <h3 className="text-2xl font-semibold mt-8 mb-4">Why a Games Room Makes All the Difference</h3>
            
            <p className="text-lg text-[var(--color-neutral-dark)] leading-relaxed mb-6">
              Games rooms create <strong>natural social hubs</strong> within a property. While some of your group might prefer quiet conversation in the lounge, others can enjoy active entertainment without disturbing the peace. This flexibility is invaluable for larger groups with varied interests and energy levels—there's genuinely something for everyone.
            </p>

            <p className="text-lg text-[var(--color-neutral-dark)] leading-relaxed mb-6">
              The <strong>competitive element</strong> adds excitement to any group getaway. Impromptu pool tournaments become legendary. Table tennis champions emerge from unexpected quarters. Dart competitions spark friendly rivalries. These shared experiences create stories that your group will reminisce about for years to come.
            </p>

            <p className="text-lg text-[var(--color-neutral-dark)] leading-relaxed mb-6">
              For <strong>rainy days and evenings</strong>, games rooms prove their worth many times over. Rather than being stuck in front of the television, your group has active entertainment that keeps spirits high regardless of the weather outside. This is particularly valuable in British destinations where weather can be unpredictable.
            </p>

            <h3 className="text-2xl font-semibold mt-8 mb-4">Perfect for Every Type of Group</h3>
            
            <p className="text-lg text-[var(--color-neutral-dark)] leading-relaxed mb-6">
              <strong>Family reunions</strong> benefit enormously from games rooms. Teenagers who might otherwise retreat to their phones find themselves drawn into pool games with uncles or darts competitions with cousins. Board game nights bring three generations around the same table. The games room becomes common ground across age groups.
            </p>

            <p className="text-lg text-[var(--color-neutral-dark)] leading-relaxed mb-6">
              <strong>Friend groups</strong> discover that games rooms encourage mixing rather than splitting into smaller cliques. Rotating pool partners, team games, and tournament brackets ensure everyone interacts with everyone else. For reunion gatherings where some members might not know each other well, this social lubrication is invaluable.
            </p>

            <p className="text-lg text-[var(--color-neutral-dark)] leading-relaxed mb-6">
              <strong>Hen parties and celebrations</strong> use games rooms for organised activities—cocktail competitions, quiz nights, team challenges. Many groups combine games room fun with <Link href="/experiences" className="text-[var(--color-accent-sage)] hover:underline font-medium">add-on experiences</Link> like cocktail classes or pamper sessions for the ultimate celebration weekend.
            </p>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 bg-[var(--color-bg-primary)]">
        <div className="max-w-[1200px] mx-auto px-6">
          <h2 className="text-3xl font-bold mb-8 text-center" style={{ fontFamily: "var(--font-display)" }}>
            What You'll Find in Our Games Rooms
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {gamesRoomFeatures.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="bg-white rounded-2xl p-6 text-center shadow-sm hover:shadow-lg transition-shadow">
                  <div className="w-14 h-14 mx-auto rounded-full bg-[var(--color-accent-pink)]/20 flex items-center justify-center mb-4">
                    <Icon className="w-7 h-7 text-[var(--color-accent-pink)]" />
                  </div>
                  <h3 className="font-bold mb-2">{feature.title}</h3>
                  <p className="text-sm text-[var(--color-neutral-dark)]">{feature.description}</p>
                </div>
              );
            })}
          </div>
          
          <div className="mt-12 bg-white rounded-2xl p-8">
            <h3 className="text-xl font-bold mb-4">Additional Entertainment You Might Find</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-[var(--color-accent-gold)]" />
                <span className="text-sm">Air Hockey</span>
              </div>
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5 text-[var(--color-accent-gold)]" />
                <span className="text-sm">Darts</span>
              </div>
              <div className="flex items-center gap-2">
                <Music className="w-5 h-5 text-[var(--color-accent-gold)]" />
                <span className="text-sm">Karaoke</span>
              </div>
              <div className="flex items-center gap-2">
                <Gamepad2 className="w-5 h-5 text-[var(--color-accent-gold)]" />
                <span className="text-sm">Arcade Machines</span>
              </div>
              <div className="flex items-center gap-2">
                <Tv className="w-5 h-5 text-[var(--color-accent-gold)]" />
                <span className="text-sm">Cinema Rooms</span>
              </div>
              <div className="flex items-center gap-2">
                <Dices className="w-5 h-5 text-[var(--color-accent-gold)]" />
                <span className="text-sm">Card Tables</span>
              </div>
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-[var(--color-accent-gold)]" />
                <span className="text-sm">Foosball</span>
              </div>
              <div className="flex items-center gap-2">
                <Music className="w-5 h-5 text-[var(--color-accent-gold)]" />
                <span className="text-sm">Sound Systems</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Group Types Section */}
      <section className="py-16 bg-white">
        <div className="max-w-[1200px] mx-auto px-6">
          <h2 className="text-3xl font-bold mb-6" style={{ fontFamily: "var(--font-display)" }}>
            Ideal for These Group Occasions
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-[var(--color-bg-primary)] rounded-2xl p-8">
              <Users className="w-10 h-10 text-[var(--color-accent-sage)] mb-4" />
              <h3 className="text-xl font-bold mb-3">Family Holidays</h3>
              <p className="text-[var(--color-neutral-dark)] mb-4">
                Keep all ages entertained with games that bridge generations. From grandparents to grandchildren, everyone finds something to enjoy in our games rooms.
              </p>
              <Link href="/large-group-accommodation" className="text-[var(--color-accent-sage)] font-medium hover:underline">
                Browse family properties →
              </Link>
            </div>
            
            <div className="bg-[var(--color-bg-primary)] rounded-2xl p-8">
              <Trophy className="w-10 h-10 text-[var(--color-accent-pink)] mb-4" />
              <h3 className="text-xl font-bold mb-3">Hen Parties & Celebrations</h3>
              <p className="text-[var(--color-neutral-dark)] mb-4">
                Organise competitions, team games, and forfeit challenges. Games rooms add an extra dimension to celebration weekends.
              </p>
              <Link href="/hen-party-houses" className="text-[var(--color-accent-sage)] font-medium hover:underline">
                Browse party properties →
              </Link>
            </div>
            
            <div className="bg-[var(--color-bg-primary)] rounded-2xl p-8">
              <Target className="w-10 h-10 text-[var(--color-accent-gold)] mb-4" />
              <h3 className="text-xl font-bold mb-3">Friend Reunions</h3>
              <p className="text-[var(--color-neutral-dark)] mb-4">
                Recreate university days with pool tournaments and darts competitions. Games rooms encourage mixing and create shared memories.
              </p>
              <Link href="/weekend-breaks" className="text-[var(--color-accent-sage)] font-medium hover:underline">
                Browse weekend breaks →
              </Link>
            </div>
            
            <div className="bg-[var(--color-bg-primary)] rounded-2xl p-8">
              <Gamepad2 className="w-10 h-10 text-[var(--color-accent-sage)] mb-4" />
              <h3 className="text-xl font-bold mb-3">Corporate Retreats</h3>
              <p className="text-[var(--color-neutral-dark)] mb-4">
                Team building happens naturally over pool games and friendly competition. Break down workplace hierarchies in relaxed settings.
              </p>
              <Link href="/holiday-focus/business-offsite-corporate-accommodation" className="text-[var(--color-accent-sage)] font-medium hover:underline">
                Browse corporate venues →
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
                  Featured Houses with Games Rooms
                </h2>
                <p className="text-[var(--color-neutral-dark)] mt-2">Large group properties with dedicated entertainment spaces</p>
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
            Games Room Houses by Destination
          </h2>
          
          <p className="text-lg text-[var(--color-neutral-dark)] leading-relaxed mb-8">
            Find houses with games rooms in the UK's most popular holiday destinations. Entertainment facilities are particularly valued in countryside and rural locations where indoor activities complement outdoor exploration.
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
            <Link href="/destinations/bath" className="group p-4 bg-[var(--color-bg-primary)] rounded-xl hover:shadow-md transition-all">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[var(--color-accent-sage)]" />
                <span className="font-medium group-hover:text-[var(--color-accent-sage)]">Bath</span>
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
            <Gamepad2 className="w-12 h-12 mx-auto mb-6 text-[var(--color-accent-pink)]" />
            <h2 className="text-3xl md:text-4xl font-bold mb-6" style={{ fontFamily: "var(--font-display)" }}>
              Ready for Fun and Games?
            </h2>
            <p className="text-xl text-[var(--color-neutral-dark)] mb-8 max-w-2xl mx-auto">
              Browse our collection of houses with games rooms and find the perfect property for your group entertainment.
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
