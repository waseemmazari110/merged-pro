import Link from "next/link";
import { Check, ArrowRight, Film, Popcorn, Users, Droplets, Waves, Gamepad2 } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import UKServiceSchema from "@/components/UKServiceSchema";
import { Button } from "@/components/ui/button";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Properties with Cinema Rooms | Luxury Group Houses UK",

  description: "Luxury hen party houses in the UK with private cinema rooms. Perfect for cosy movie nights, entertainment, and relaxed group celebrations.",
  alternates: {
    canonical: "https://www.groupescapehouses.co.uk/features/cinema-room",
  },
};

export default function CinemaRoomPage() {
  const highlights = [
    "Private cinema rooms with large screens",
    "Comfortable seating for group movie nights",
    "Perfect for cosy evenings in",
    "Surround sound systems for immersive viewing",
    "Great for rainy days and relaxed nights"
  ];

  const relatedFeatures = [
    { title: "Hot Tub", slug: "hot-tub", icon: Droplets },
    { title: "Swimming Pool", slug: "swimming-pool", icon: Waves },
    { title: "Games Room", slug: "games-room", icon: Gamepad2 },
  ];

  const popularHouseStyles = [
    { title: "Luxury Houses", slug: "luxury-houses" },
    { title: "Manor Houses", slug: "manor-houses" },
    { title: "Large Holiday Homes", slug: "large-holiday-homes" },
  ];

  const galleryImages = [
    {
      url: "https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?w=1600&q=90",
      alt: "Luxury home cinema room with reclining seats and large screen"
    },
    {
      url: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1600&q=90",
      alt: "Private cinema room with comfortable seating for groups"
    },
    {
      url: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=1600&q=90",
      alt: "Home theater with popcorn and movie night setup"
    },
    {
      url: "https://images.unsplash.com/photo-1524712245354-2c4e5e7121c0?w=1600&q=90",
      alt: "Cozy cinema room with plush seating and ambient lighting"
    },
    {
      url: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=1600&q=90",
      alt: "Modern home cinema with surround sound system"
    },
    {
      url: "https://images.unsplash.com/photo-1627873649417-c67f701f1949?w=1600&q=90",
      alt: "Cinema room ready for group movie screening"
    }
  ];

  return (
    <div className="min-h-screen">
      <UKServiceSchema 
        type="breadcrumb" 
        data={{
          breadcrumbs: [
            { name: "Home", url: "/" },
            { name: "Features", url: "/house-styles-and-features" },
            { name: "Cinema Room", url: "/features/cinema-room" }
          ]
        }}
      />
      <Header />
      
      {/* Hero Section */}
      <section className="relative h-[70vh] min-h-[500px] flex items-center justify-center">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?w=1600&q=90')",
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
            <span className="text-white font-medium">Cinema Room</span>
          </nav>
          
          <h1 className="mb-6 text-white" style={{ fontFamily: "var(--font-display)" }}>
            Properties with Cinema Rooms
          </h1>
          <p className="text-xl max-w-3xl mx-auto text-white/95">
            Private screenings in luxury cinema lounges for your group celebration
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-24 bg-white">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <div>
              <h2 className="mb-6 text-[var(--color-text-primary)]" style={{ fontFamily: "var(--font-display)" }}>
                Hen Party Houses with Private Cinema Rooms
              </h2>
              <p className="text-lg text-[var(--color-neutral-dark)] mb-6 leading-relaxed">
                Enjoy movie nights in style with properties featuring dedicated cinema rooms. Complete with large screens, surround sound, and comfortable seating, these spaces provide the perfect entertainment for cosy evenings during your group celebration.
              </p>
              <p className="text-lg text-[var(--color-neutral-dark)] mb-8 leading-relaxed">
                Cinema rooms are perfect for rainy days or relaxed evenings after busy activities. Many of our <Link href="/house-styles/luxury-houses" className="text-[var(--color-accent-gold)] hover:underline font-medium">luxury houses</Link> and <Link href="/house-styles/manor-houses" className="text-[var(--color-accent-gold)] hover:underline font-medium">manor houses</Link> feature state-of-the-art cinema facilities alongside other entertainment options like <Link href="/features/games-room" className="text-[var(--color-accent-gold)] hover:underline font-medium">games rooms</Link>.
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
                  Browse Cinema Room Properties
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
            </div>

            <div className="space-y-6">
              <div className="bg-[var(--color-bg-primary)] rounded-2xl p-8">
                <Film className="w-12 h-12 text-[var(--color-accent-gold)] mb-4" />
                <h3 className="text-3xl font-bold mb-2 text-[var(--color-text-primary)]" style={{ fontFamily: "var(--font-display)" }}>
                  Big Screen
                </h3>
                <p className="text-[var(--color-neutral-dark)]">
                  Large screens with surround sound for immersive viewing
                </p>
              </div>

              <div className="bg-[var(--color-bg-primary)] rounded-2xl p-8">
                <Popcorn className="w-12 h-12 text-[var(--color-accent-sage)] mb-4" />
                <h3 className="text-3xl font-bold mb-2 text-[var(--color-text-primary)]" style={{ fontFamily: "var(--font-display)" }}>
                  Movie Nights
                </h3>
                <p className="text-[var(--color-neutral-dark)]">
                  Perfect for cosy group film screenings
                </p>
              </div>

              <div className="bg-[var(--color-bg-primary)] rounded-2xl p-8">
                <Users className="w-12 h-12 text-[var(--color-accent-gold)] mb-4" />
                <h3 className="text-3xl font-bold mb-2 text-[var(--color-text-primary)]" style={{ fontFamily: "var(--font-display)" }}>
                  Comfortable Seating
                </h3>
                <p className="text-[var(--color-neutral-dark)]">
                  Plush seating for the whole group to relax
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-16 bg-[var(--color-bg-primary)]">
        <div className="max-w-[1200px] mx-auto px-6">
          <h2 className="mb-8 text-center text-[var(--color-text-primary)]" style={{ fontFamily: "var(--font-display)" }}>
            Cinema Room Gallery
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {galleryImages.map((image, index) => (
              <div 
                key={index}
                className="relative aspect-[4/3] rounded-2xl overflow-hidden group"
              >
                <img
                  src={image.url}
                  alt={image.alt}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Related Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-[1200px] mx-auto px-6">
          <h2 className="mb-8 text-center text-[var(--color-text-primary)]" style={{ fontFamily: "var(--font-display)" }}>
            Other Popular Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {relatedFeatures.map((feature) => (
              <Link
                key={feature.slug}
                href={`/features/${feature.slug}`}
                className="group bg-[var(--color-bg-primary)] rounded-2xl p-8 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
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
              House Styles with Cinema Rooms
            </h3>
            <div className="flex flex-wrap justify-center gap-4">
              {popularHouseStyles.map((style) => (
                <Link
                  key={style.slug}
                  href={`/house-styles/${style.slug}`}
                  className="px-6 py-3 bg-[var(--color-bg-primary)] rounded-full text-[var(--color-text-primary)] hover:bg-[var(--color-accent-sage)] hover:text-white transition-all duration-300 font-medium"
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