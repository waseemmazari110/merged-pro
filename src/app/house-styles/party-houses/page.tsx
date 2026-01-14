import Link from "next/link";
import { Check, ArrowRight, PartyPopper, Music, Users, Droplets, Gamepad2, Film } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import UKServiceSchema from "@/components/UKServiceSchema";
import { Button } from "@/components/ui/button";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Party Houses to Rent UK | Hen Party Accommodation",

  description: "Hen party houses and group party accommodation in the UK. Perfect celebration venues with hot tubs, games rooms, and entertainment spaces for unforgettable weekends.",
  alternates: {
    canonical: "https://www.groupescapehouses.co.uk/house-styles/party-houses",
  },
};

export default function PartyHousesPage() {
  const highlights = [
    "Properties designed for celebrations and parties",
    "Hot tubs, pools, and games rooms for entertainment",
    "Perfect for hen parties, birthdays, and stag dos",
    "Sound systems and party-friendly layouts",
    "Add cocktail classes, DJs, and catering options"
  ];

  const galleryImages = [
    { url: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=800&q=90", alt: "Group celebrating in luxury party house" },
    { url: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&q=90", alt: "Hot tub with friends at party house" },
    { url: "https://images.unsplash.com/photo-1534158914592-062992fbe900?w=800&q=90", alt: "Party house games room with pool table" },
    { url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=90", alt: "Spacious party house living area" },
  ];

  const relatedFeatures = [
    { title: "Hot Tub", slug: "hot-tub", icon: Droplets },
    { title: "Games Room", slug: "games-room", icon: Gamepad2 },
    { title: "Cinema Room", slug: "cinema-room", icon: Film },
  ];

  const relatedStyles = [
    { title: "Luxury Houses", slug: "luxury-houses" },
    { title: "Large Holiday Homes", slug: "large-holiday-homes" },
    { title: "Manor Houses", slug: "manor-houses" },
  ];

  return (
    <div className="min-h-screen">
      <UKServiceSchema 
        type="breadcrumb" 
        data={{
          breadcrumbs: [
            { name: "Home", url: "/" },
            { name: "House Styles", url: "/house-styles-and-features" },
            { name: "Party Houses", url: "/house-styles/party-houses" }
          ]
        }}
      />
      <Header />
      
      {/* Hero Section */}
      <section className="relative h-[70vh] min-h-[500px] flex items-center justify-center">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=1600&q=90')",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-black/70 to-black/50"></div>
        </div>
        
        <div className="relative z-10 max-w-[1200px] mx-auto px-6 text-center">
          <nav className="flex justify-center gap-2 text-sm mb-6 text-white/90">
            <Link href="/" className="hover:underline hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <Link href="/house-styles-and-features" className="hover:underline hover:text-white transition-colors">House Styles</Link>
            <span>/</span>
            <span className="text-white font-medium">Party Houses</span>
          </nav>
          
          <h1 className="mb-6 text-white" style={{ fontFamily: "var(--font-display)" }}>
            Party Houses to Rent
          </h1>
          <p className="text-xl max-w-3xl mx-auto text-white/95">
            Celebration venues perfect for hen parties, birthdays, and group events
          </p>
        </div>
      </section>

      {/* Image Gallery Section */}
      <section className="py-16 bg-[var(--color-bg-primary)]">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {galleryImages.map((image, index) => (
              <div key={index} className="group relative aspect-[4/3] rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300">
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                  style={{ backgroundImage: `url('${image.url}')` }}
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
                Hen Party Houses & Group Party Accommodation
              </h2>
              <p className="text-lg text-[var(--color-neutral-dark)] mb-6 leading-relaxed">
                Celebrate in style with our party houses designed for unforgettable group celebrations. Featuring hot tubs, games rooms, and entertainment spaces, these properties are perfect for hen parties, milestone birthdays, and any occasion that calls for a proper party. Add experiences like cocktail classes and private chefs to make it extra special.
              </p>
              <p className="text-lg text-[var(--color-neutral-dark)] mb-8 leading-relaxed">
                Our party houses come equipped with everything you need for the ultimate celebration. Most feature <Link href="/features/hot-tub" className="text-[var(--color-accent-sage)] hover:underline font-medium">hot tubs</Link>, <Link href="/features/games-room" className="text-[var(--color-accent-sage)] hover:underline font-medium">games rooms</Link>, and spacious entertainment areas. Book your <Link href="/experiences" className="text-[var(--color-accent-sage)] hover:underline font-medium">hen party experiences</Link> including cocktail masterclasses, butlers in the buff, and private chefs.
              </p>

              <h3 className="text-2xl font-semibold mb-4 text-[var(--color-text-primary)]" style={{ fontFamily: "var(--font-body)" }}>
                What to Expect
              </h3>
              <ul className="space-y-3 mb-8">
                {highlights.map((highlight, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <Check className="w-6 h-6 text-[var(--color-accent-sage)] flex-shrink-0 mt-0.5" />
                    <span className="text-[var(--color-neutral-dark)]">{highlight}</span>
                  </li>
                ))}
              </ul>

              <Button
                asChild
                size="lg"
                className="rounded-2xl px-10 py-6 text-white font-medium transition-all duration-200 hover:shadow-lg"
                style={{ background: "var(--color-accent-sage)" }}
              >
                <Link href="/properties">
                  Browse Party Houses
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
            </div>

            <div className="space-y-6">
              <div className="bg-[var(--color-bg-primary)] rounded-2xl p-8">
                <PartyPopper className="w-12 h-12 text-[var(--color-accent-sage)] mb-4" />
                <h3 className="text-3xl font-bold mb-2 text-[var(--color-text-primary)]" style={{ fontFamily: "var(--font-display)" }}>
                  Party Ready
                </h3>
                <p className="text-[var(--color-neutral-dark)]">
                  Hot tubs, sound systems, and entertainment spaces
                </p>
              </div>

              <div className="bg-[var(--color-bg-primary)] rounded-2xl p-8">
                <Music className="w-12 h-12 text-[var(--color-accent-gold)] mb-4" />
                <h3 className="text-3xl font-bold mb-2 text-[var(--color-text-primary)]" style={{ fontFamily: "var(--font-display)" }}>
                  Add Experiences
                </h3>
                <p className="text-[var(--color-neutral-dark)]">
                  Cocktail classes, butlers, DJs, and private chefs available
                </p>
              </div>

              <div className="bg-[var(--color-bg-primary)] rounded-2xl p-8">
                <Users className="w-12 h-12 text-[var(--color-accent-sage)] mb-4" />
                <h3 className="text-3xl font-bold mb-2 text-[var(--color-text-primary)]" style={{ fontFamily: "var(--font-display)" }}>
                  Group Celebrations
                </h3>
                <p className="text-[var(--color-neutral-dark)]">
                  Perfect for hen parties, birthdays, and special occasions
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
            Popular Features in Party Houses
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {relatedFeatures.map((feature) => (
              <Link
                key={feature.slug}
                href={`/features/${feature.slug}`}
                className="group bg-white rounded-2xl p-8 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                <feature.icon className="w-10 h-10 text-[var(--color-accent-sage)] mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="text-xl font-semibold mb-2 text-[var(--color-text-primary)] group-hover:text-[var(--color-accent-sage)] transition-colors">
                  {feature.title}
                </h3>
                <span className="text-[var(--color-accent-sage)] text-sm font-medium inline-flex items-center gap-2">
                  Explore <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
            ))}
          </div>

          <div className="text-center">
            <h3 className="text-xl font-semibold mb-6 text-[var(--color-text-primary)]">
              Similar House Styles
            </h3>
            <div className="flex flex-wrap justify-center gap-4">
              {relatedStyles.map((style) => (
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