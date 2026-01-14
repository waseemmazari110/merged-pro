import Link from "next/link";
import { Check, ArrowRight, Gamepad2, Trophy, Users, Droplets, Film, Waves } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import UKServiceSchema from "@/components/UKServiceSchema";
import { Button } from "@/components/ui/button";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Properties with Games Rooms | Luxury Group Houses UK",

  description: "Luxury hen party houses in the UK with dedicated games rooms. Perfect for group entertainment with pool tables, table tennis, board games, and more.",
  alternates: {
    canonical: "https://www.groupescapehouses.co.uk/features/games-room",
  },
};

export default function GamesRoomPage() {
  const highlights = [
    "Pool tables, table tennis, and arcade games",
    "Perfect entertainment for all ages and abilities",
    "Great for competitive fun and group bonding",
    "Indoor entertainment for any weather",
    "Ideal for evening entertainment after activities"
  ];

  const galleryImages = [
    { url: "https://images.unsplash.com/photo-1626995216005-51fce6be8f73?w=800&q=90", alt: "Luxury games room with professional pool table" },
    { url: "https://images.unsplash.com/photo-1534878883218-7650ec5e5b10?w=800&q=90", alt: "Friends playing table tennis in modern games room" },
    { url: "https://images.unsplash.com/photo-1511882150382-421056c89033?w=800&q=90", alt: "Arcade games and entertainment area" },
    { url: "https://images.unsplash.com/photo-1550645612-83f5d594b671?w=800&q=90", alt: "Pool table with vintage arcade games" },
    { url: "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=800&q=90", alt: "Luxury home entertainment room with gaming setup" },
    { url: "https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=800&q=90", alt: "Group enjoying games and entertainment together" },
  ];

  const relatedFeatures = [
    { title: "Hot Tub", slug: "hot-tub", icon: Droplets },
    { title: "Cinema Room", slug: "cinema-room", icon: Film },
    { title: "Swimming Pool", slug: "swimming-pool", icon: Waves },
  ];

  const popularHouseStyles = [
    { title: "Party Houses", slug: "party-houses" },
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
            { name: "Features", url: "/house-styles-and-features" },
            { name: "Games Room", url: "/features/games-room" }
          ]
        }}
      />
      <Header />
      
      {/* Hero Section */}
      <section className="relative h-[70vh] min-h-[500px] flex items-center justify-center">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1626995216005-51fce6be8f73?w=1600&q=90')",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-black/70 to-black/50"></div>
        </div>
        
        <div className="relative z-10 max-w-[1200px] mx-auto px-6 text-center">
          <nav className="flex justify-center gap-2 text-sm mb-6 text-white/90">
            <Link href="/" className="hover:underline hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <Link href="/house-styles-and-features" className="hover:underline hover:text-white transition-colors">Features</Link>
            <span>/</span>
            <span className="text-white font-medium">Games Room</span>
          </nav>
          
          <h1 className="mb-6 text-white" style={{ fontFamily: "var(--font-display)" }}>
            Properties with Games Rooms
          </h1>
          <p className="text-xl max-w-3xl mx-auto text-white/95">
            Entertainment spaces with pool tables, arcade games, and competitive fun
          </p>
        </div>
      </section>

      {/* Image Gallery Section */}
      <section className="py-16 bg-[var(--color-bg-primary)]">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                Hen Party Houses with Games Rooms UK
              </h2>
              <p className="text-lg text-[var(--color-neutral-dark)] mb-6 leading-relaxed">
                Keep the fun going with properties featuring dedicated games rooms. From pool tables and table tennis to arcade games and board game collections, these entertainment spaces provide hours of competitive fun for your group celebration.
              </p>
              <p className="text-lg text-[var(--color-neutral-dark)] mb-8 leading-relaxed">
                Games rooms are perfect for all-weather entertainment and evening activities. Many of our <Link href="/house-styles/party-houses" className="text-[var(--color-accent-gold)] hover:underline font-medium">party houses</Link> combine games rooms with <Link href="/features/hot-tub" className="text-[var(--color-accent-gold)] hover:underline font-medium">hot tubs</Link> and <Link href="/features/cinema-room" className="text-[var(--color-accent-gold)] hover:underline font-medium">cinema rooms</Link> for the ultimate entertainment package.
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
                  Browse Games Room Properties
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
            </div>

            <div className="space-y-6">
              <div className="bg-[var(--color-bg-primary)] rounded-2xl p-8">
                <Gamepad2 className="w-12 h-12 text-[var(--color-accent-gold)] mb-4" />
                <h3 className="text-3xl font-bold mb-2 text-[var(--color-text-primary)]" style={{ fontFamily: "var(--font-display)" }}>
                  Pool & Games
                </h3>
                <p className="text-[var(--color-neutral-dark)]">
                  Pool tables, table tennis, and arcade entertainment
                </p>
              </div>

              <div className="bg-[var(--color-bg-primary)] rounded-2xl p-8">
                <Trophy className="w-12 h-12 text-[var(--color-accent-sage)] mb-4" />
                <h3 className="text-3xl font-bold mb-2 text-[var(--color-text-primary)]" style={{ fontFamily: "var(--font-display)" }}>
                  Competitive Fun
                </h3>
                <p className="text-[var(--color-neutral-dark)]">
                  Perfect for tournaments and friendly competition
                </p>
              </div>

              <div className="bg-[var(--color-bg-primary)] rounded-2xl p-8">
                <Users className="w-12 h-12 text-[var(--color-accent-gold)] mb-4" />
                <h3 className="text-3xl font-bold mb-2 text-[var(--color-text-primary)]" style={{ fontFamily: "var(--font-display)" }}>
                  Group Entertainment
                </h3>
                <p className="text-[var(--color-neutral-dark)]">
                  All-weather entertainment for your entire group
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
              House Styles with Games Rooms
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