import Link from "next/link";
import OptimizedImage from "@/components/OptimizedImage";
import { ArrowRight, Instagram, Home as HomeIcon, Sparkles, Shield, Users, Award, Clock } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PropertyCard from "@/components/PropertyCard";
import ExperienceCard from "@/components/ExperienceCard";
import ReviewSlider from "@/components/ReviewSlider";
import FAQSection from "@/components/FAQSection";
import UKServiceSchema from "@/components/UKServiceSchema";
import { Button } from "@/components/ui/button";
import HeroSearchForm from "@/components/home/HeroSearchForm";
import HeroVideo from "@/components/home/HeroVideo";
import NewsletterSection from "@/components/home/NewsletterSection";
import { InstagramSection } from "@/components/home/InstagramSection";
import { HenPartyCarousel } from "@/components/home/HenPartyCarousel";
import { getFeaturedProperties, getFeaturedExperiences, getFeaturedReviews } from "@/lib/data-fetchers";
import { homeFaqs } from "@/data/faqs";

// Static destinations data
const destinations = [
  {
    name: "London",
    image: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800&h=600&q=80&fit=crop",
    description: "Iconic attractions & world-class nightlife"
  },
  {
    name: "Brighton",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&q=80&fit=crop",
    description: "Seaside fun with vibrant beach bars"
  },
  {
    name: "Bath",
    image: "https://images.unsplash.com/photo-1549144511-f099e773c147?w=800&h=600&q=80&fit=crop",
    description: "Georgian elegance & thermal spas"
  },
  {
    name: "Manchester",
    image: "https://images.unsplash.com/photo-1515586838455-8f8f940d6853?w=800&h=600&q=80&fit=crop",
    description: "Northern vibes & legendary nightlife"
  },
  {
    name: "Newquay",
    image: "https://media.istockphoto.com/id/1211485656/photo/surfboard-and-palm-tree-on-beach-background.jpg?s=612x612&w=0&k=20&c=sjiA2xKDegW63sCAOc_b95aE6aDOuFIHUtasbKXFw7M=",
    description: "Surf beaches & coastal adventures"
  },
  {
    name: "Liverpool",
    image: "https://media.istockphoto.com/id/2175972607/photo/modern-luxury-home-with-geometric-driveway-and-sunset-sky.jpg?s=612x612&w=0&k=20&c=0pvJ_frDStQGywjOptq9XmyEQgVIxfH3Yg7MbYIfIjI=",
    description: "Beatles heritage & waterfront bars"
  },
];

export default async function Home() {
  const [featuredProperties, experiences, reviews] = await Promise.all([
    getFeaturedProperties(3),
    getFeaturedExperiences(6),
    getFeaturedReviews(6)
  ]);

  return (
    <div className="min-h-screen">
      <UKServiceSchema type="website" />
      <UKServiceSchema type="faq" data={{ faqs: homeFaqs }} />
      <Header />

      <main>
        {/* Hero Section */}
        <section className="relative min-h-[90vh] flex items-center justify-center bg-gradient-to-br from-[var(--color-bg-primary)] to-[var(--color-bg-secondary)] px-4 sm:px-6 py-20 sm:py-32 md:py-16">
          <HeroVideo />

                <div className="relative z-10 max-w-[1200px] mx-auto px-4 md:px-6 text-center w-full mt-24 sm:mt-20 md:mt-0">
                      <h1 className="mb-6 md:mb-6 text-white drop-shadow-[0_4px_4px_rgba(0,0,0,0.5)] px-2 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold" style={{ fontFamily: "var(--font-display)" }}>
                        Group Escape Houses | Large Group Accommodation UK
                      </h1>
                      <p className="text-base sm:text-lg md:text-xl lg:text-2xl mb-8 md:mb-12 text-white drop-shadow-[0_2px_2px_rgba(0,0,0,0.5)] max-w-3xl mx-auto px-2 sm:px-4 font-medium">
                        Discover large group houses and cottages across the UK sleeping 10 to 30 guests. Enquire and book directly with property owners via Group Escape Houses. Ideal for family celebrations, group weekends away and corporate retreats.
                      </p>


            <HeroSearchForm />

            <div className="mt-6 sm:mt-8 md:mt-8 flex flex-col sm:flex-row flex-wrap justify-center gap-3 md:gap-4 px-2 sm:px-4">
            </div>
          </div>
        </section>

        {/* Trust Signals */}
        <section className="py-10 sm:py-14 md:py-16 bg-white">
          <div className="max-w-[1200px] mx-auto px-4 sm:px-5 md:px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-7 md:gap-8 text-center">
                  {[
                    { icon: Award, label: "5 Star Reviews", val: "3,000+", color: "var(--color-accent-gold)" },
                    { icon: Shield, label: "Safe Payments", val: "Secure", color: "var(--color-accent-sage)" },
                    { icon: Users, label: "Expert Support", val: "UK Team", color: "var(--color-accent-pink)" },
                    { icon: Clock, label: "Quick Response", val: "Fast", color: "var(--color-accent-gold)" }
                  ].map((item, i) => (
                    <div key={i} className="md:transition-transform md:hover:scale-105">
                      <item.icon className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 mx-auto mb-2 md:mb-3" style={{ color: item.color }} aria-hidden="true" />
                      <div className="text-xl sm:text-2xl md:text-3xl font-bold mb-0.5" style={{ fontFamily: "var(--font-display)" }}>{item.val}</div>
                      <div className="text-xs sm:text-sm md:text-base text-[var(--color-neutral-dark)]">{item.label}</div>
                    </div>
                  ))}

            </div>
          </div>
        </section>

        {/* Featured Properties */}
        <section className="py-16 md:py-20 bg-[var(--color-bg-primary)]">
          <div className="max-w-[1200px] mx-auto px-4 md:px-6">
            <div className="text-center mb-10 md:mb-12 px-4">
                <h2 className="mb-3 md:mb-4" style={{ fontFamily: "var(--font-display)" }}>
                  Large Group Houses Across the UK
                </h2>
                <p className="text-lg md:text-xl text-[var(--color-neutral-dark)] max-w-2xl mx-auto">
                  Exceptional <Link href="/house-styles/luxury-houses" className="underline hover:text-[var(--color-accent-sage)] transition-colors">luxury properties</Link> sleeping 10 to 40 guests with premium facilities including <Link href="/features/hot-tub" className="underline hover:text-[var(--color-accent-sage)] transition-colors">hot tubs</Link> and <Link href="/features/games-room" className="underline hover:text-[var(--color-accent-sage)] transition-colors">games rooms</Link>
                </p>
              </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featuredProperties.map((property) => (
                <PropertyCard key={property.id} {...property} />
              ))}
            </div>

            <div className="text-center mt-12">
              <Button
                asChild
                size="lg"
                className="rounded-2xl px-10 py-6 font-medium transition-all hover:scale-[1.05] bg-[var(--color-accent-sage)] text-white"
              >
                <Link href="/properties">
                  View All Properties
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Hen Party Section */}
        <HenPartyCarousel />

        {/* Experiences */}
        <section className="py-16 md:py-20 bg-white content-visibility-auto">
          <div className="max-w-[1200px] mx-auto px-4 md:px-6">
            <div className="text-center mb-10 md:mb-12 px-4">
                <h2 className="mb-3 md:mb-4" style={{ fontFamily: "var(--font-display)" }}>
                  Group Accommodation for 10 to 30 Guests
                </h2>
                <p className="text-lg md:text-xl text-[var(--color-neutral-dark)] max-w-2xl mx-auto">
                  Add special touches and activities to make your <Link href="/hen-party-houses" className="underline hover:text-[var(--color-accent-sage)] transition-colors">hen party</Link>, <Link href="/weekend-breaks" className="underline hover:text-[var(--color-accent-sage)] transition-colors">weekend break</Link>, or <Link href="/special-celebrations" className="underline hover:text-[var(--color-accent-sage)] transition-colors">celebration</Link> unforgettable
                </p>
              </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {experiences.map((experience) => (
                <ExperienceCard key={experience.slug} {...experience} />
              ))}
            </div>

            <div className="text-center mt-12">
              <Button
                asChild
                size="lg"
                className="rounded-2xl px-10 py-6 font-medium transition-all hover:scale-[1.05] bg-[var(--color-accent-sage)] text-white"
              >
                <Link href="/experiences">
                  View All Experiences
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Destinations */}
        <section className="py-16 md:py-20 bg-[var(--color-bg-secondary)] overflow-hidden content-visibility-auto">
          <div className="max-w-[1200px] mx-auto px-4 md:px-6">
            <div className="text-center mb-10 md:mb-12 px-4">
                <h2 className="mb-3 md:mb-4" style={{ fontFamily: "var(--font-display)" }}>
                  Ideal for Hen Parties, Weekends and Celebrations
                </h2>
                <p className="text-lg md:text-xl text-[var(--color-neutral-dark)] max-w-2xl mx-auto">
                  From vibrant cities to coastal escapes
                </p>
              </div>

            {/* Scrolling Carousel */}
            <div className="relative min-h-[170px] md:min-h-[225px]">
              <div className="overflow-hidden">
                <div className="flex gap-6 animate-slide-left">
                  {[...destinations, ...destinations].map((destination, index) => (
                      <Link
                        key={`${destination.name}-${index}`}
                        href={`/destinations/${destination.name.toLowerCase().replace(/\s+/g, '-')}`}
                        className="group relative flex-shrink-0 w-[300px] md:w-[400px] overflow-hidden rounded-2xl aspect-video transition-transform hover:scale-[1.02]"
                        aria-label={`View properties in ${destination.name}`}
                      >
                        <OptimizedImage
                          src={destination.image}
                          alt={`Scenic view of ${destination.name} - a top UK holiday destination`}
                          fill
                          className="transition-transform group-hover:scale-110"
                          sizes="(max-width: 768px) 300px, 400px"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-6">
                        <h3 className="text-2xl font-bold mb-2 text-white" style={{ fontFamily: "var(--font-display)" }}>
                          {destination.name}
                        </h3>
                        <p className="text-sm text-white opacity-90">{destination.description}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            <div className="text-center mt-12">
                <Button
                  asChild
                  size="lg"
                  className="rounded-2xl px-10 py-6 font-medium transition-all hover:scale-[1.05] bg-[var(--color-accent-sage)] text-white"
                >
                  <Link href="/destinations">
                    See all locations
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-16 md:py-20 bg-white content-visibility-auto">
          <div className="max-w-[1200px] mx-auto px-4 md:px-6">
            <div className="text-center mb-12 md:mb-16 px-4">
              <h2 className="mb-3 md:mb-4" style={{ fontFamily: "var(--font-display)" }}>
                How It Works
              </h2>
              <p className="text-lg md:text-xl text-[var(--color-neutral-dark)] max-w-2xl mx-auto">
                Booking your perfect group accommodation is simple
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-8">
              {[
                { icon: HomeIcon, title: "Choose Property", text: "Browse our collection and find the perfect house for your group", color: "#3d5a47" },
                { icon: Sparkles, title: "Add Services", text: "Enhance your stay with catering, activities, and special services", color: "#3d5a47" },
                { icon: Shield, title: "Book Direct", text: "Enquire and book directly with property owners with no platform commission", color: "#C6A76D" },
                { icon: Users, title: "Enjoy Together", text: "Gather your group and create lasting memories", color: "#C6A76D" }
              ].map((item, i) => (
                <div key={i} className="group text-center">
                  <div className="w-32 h-32 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg transform transition-all duration-300 group-hover:scale-110 hover:shadow-xl" style={{ backgroundColor: item.color }}>
                    <item.icon className="w-12 h-12 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                  <p className="text-[var(--color-neutral-dark)] leading-relaxed">{item.text}</p>
                </div>
              ))}
            </div>

            <div className="text-center mt-10 md:mt-12">
              <Button
                asChild
                size="lg"
                variant="outline"
                className="rounded-2xl px-10 py-6 font-medium border-2 transition-all hover:bg-[var(--color-bg-primary)] border-[var(--color-accent-sage)] text-[var(--color-text-primary)]"
              >
                <Link href="/how-it-works">
                  Learn More
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Reviews */}
        <section className="py-16 md:py-20 bg-[var(--color-bg-secondary)] min-h-[400px] content-visibility-auto">
          <div className="max-w-[1200px] mx-auto px-4 md:px-6">
            <div className="text-center mb-10 md:mb-12 px-4">
              <h2 className="mb-3 md:mb-4" style={{ fontFamily: "var(--font-display)" }}>
                What Our Guests Say
              </h2>
              <p className="text-lg md:text-xl text-[var(--color-neutral-dark)] max-w-2xl mx-auto">
                Over 3,000 five-star reviews from happy groups
              </p>
            </div>

            <ReviewSlider reviews={reviews} />

            <div className="text-center mt-12">
              <Button
                asChild
                size="lg"
                className="rounded-2xl px-10 py-6 font-medium transition-all hover:scale-[1.05] bg-[var(--color-accent-sage)] text-white"
              >
                <Link href="/reviews">
                  Read All Reviews
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <div className="content-visibility-auto">
          <FAQSection />
        </div>

        {/* Newsletter */}
        <div className="content-visibility-auto">
          <NewsletterSection />
        </div>

        {/* Instagram */}
        <InstagramSection />
      </main>

      <Footer />
    </div>
  );
}
