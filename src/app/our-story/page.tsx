import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import AnimatedStats from "@/components/AnimatedStats";
import UKServiceSchema from "@/components/UKServiceSchema";

export default function OurStoryPage() {
  return (
    <div className="min-h-screen">
      <UKServiceSchema
        type="breadcrumb"
        data={{
          breadcrumbs: [
            { name: "Home", url: "/" },
            { name: "Our Story", url: "/our-story" }
          ]
        }}
      />
      <Header />
      
      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/luxury-uk-country-house-with-outdoor-hot-249dad12-20251023182040.jpg')",
          }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-text-primary)]/70 to-[var(--color-text-primary)]/50"></div>
        
        <div className="relative z-10 max-w-[1200px] mx-auto px-6 text-center">
          <h1 className="text-white mb-6" style={{ fontFamily: "var(--font-display)" }}>
            Our Story
          </h1>
          <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto">
            Creating unforgettable celebrations across the UK since 2019
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-24 bg-white">
        <div className="max-w-[900px] mx-auto px-6">
            <div className="space-y-12">
              <div>
                <h2 className="mb-6" style={{ fontFamily: "var(--font-display)" }}>
                  Where It All Began
                </h2>
                <p className="text-lg leading-relaxed mb-6" style={{ color: "var(--color-neutral-dark)" }}>
                  Group Escape Houses was born from a simple frustration. Our founders spent weeks searching for the perfect large group accommodation for a family milestone. They wanted somewhere special with a hot tub, space for 20 guests, and a location that offered both luxury and privacy. But every search led to generic holiday cottages, confusing booking processes, and properties that didn't live up to the photos.
                </p>
                <p className="text-lg leading-relaxed" style={{ color: "var(--color-neutral-dark)" }}>
                  After finally finding a gorgeous estate through word of mouth, they realised there had to be a better way. What if there was a platform dedicated entirely to large group celebrations, featuring only the best luxury houses across the UK, with direct owner contact and trusted local experiences? That weekend, Group Escape Houses was born.
                </p>
              </div>

              <div className="bg-[var(--color-bg-primary)] p-12 rounded-2xl">
                <h2 className="mb-6" style={{ fontFamily: "var(--font-display)" }}>
                  Our Mission
                </h2>
                <p className="text-xl leading-relaxed italic" style={{ color: "var(--color-neutral-dark)" }}>
                  "To make planning large group celebrations effortless by connecting people directly with exceptional luxury properties and curated experiences that create memories to last a lifetime."
                </p>
              </div>

              <div>
                <h2 className="mb-6" style={{ fontFamily: "var(--font-display)" }}>
                  How We Select Our Properties
                </h2>
                <p className="text-lg leading-relaxed mb-6" style={{ color: "var(--color-neutral-dark)" }}>
                  We personally vet every property on our platform. We don't just look at photos; we ensure the space genuinely works for large groups. Only properties that meet our strict standards for quality, space, and facilities make it onto Group Escape Houses.
                </p>
                <p className="text-lg leading-relaxed" style={{ color: "var(--color-neutral-dark)" }}>
                  We look for homes with character—whether that's a converted barn in the Cotswolds, a coastal estate in Cornwall, or a stately home in Scotland. Features like hot tubs, games rooms, and spacious kitchens are standard, but we also care about the intangibles: great natural light, comfortable beds, and that special something that makes a house feel like an escape.
                </p>
              </div>

              {/* Property Showcase Gallery */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-12">
              <div className="rounded-2xl overflow-hidden shadow-lg">
                <img
                  src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/luxury-stone-cottage-in-the-cotswolds-wi-67216eb4-20251023182252.jpg"
                  alt="Luxury Cotswolds cottage with hot tub"
                  className="w-full h-[300px] object-cover"
                />
              </div>
              <div className="rounded-2xl overflow-hidden shadow-lg">
                <img
                  src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/modern-luxury-manor-house-with-outdoor-h-b62da5c9-20251023182252.jpg"
                  alt="Modern luxury manor house with hot tub"
                  className="w-full h-[300px] object-cover"
                />
              </div>
              <div className="rounded-2xl overflow-hidden shadow-lg">
                <img
                  src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/beachfront-villa-in-brighton-with-hot-tu-ddcc4ed4-20251023182243.jpg"
                  alt="Brighton beachfront villa with hot tub"
                  className="w-full h-[300px] object-cover"
                />
              </div>
              <div className="rounded-2xl overflow-hidden shadow-lg">
                <img
                  src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/converted-barn-in-countryside-with-outdo-bf036188-20251023182253.jpg"
                  alt="Converted barn with hot tub"
                  className="w-full h-[300px] object-cover"
                />
              </div>
            </div>

            <AnimatedStats />

            <div>
              <h2 className="mb-6" style={{ fontFamily: "var(--font-display)" }}>
                More Than Just Houses
              </h2>
              <p className="text-lg leading-relaxed mb-6" style={{ color: "var(--color-neutral-dark)" }}>
                We quickly realised that the perfect hen weekend wasn't just about the accommodation. It was about the experiences too. That's why we partnered with the best cocktail class providers, private chefs, life drawing artists, and entertainment professionals across the UK.
              </p>
              <p className="text-lg leading-relaxed" style={{ color: "var(--color-neutral-dark)" }}>
                Every experience provider is personally vetted and trusted. We've shared cocktails with them, tasted their food, and seen their shows. When you book an add-on through us, you know you're getting quality.
              </p>
            </div>

            <div>
              <h2 className="mb-6" style={{ fontFamily: "var(--font-display)" }}>
                Our Values
              </h2>
              <div className="space-y-6">
                <div>
                  <h3
                    className="text-2xl font-semibold mb-3"
                    style={{ fontFamily: "var(--font-body)", color: "var(--color-text-primary)" }}
                  >
                    Transparency
                  </h3>
                  <p className="text-lg leading-relaxed" style={{ color: "var(--color-neutral-dark)" }}>
                    No hidden fees, no misleading photos. What you see is what you get. Our pricing is clear, and we include all the information you need to make an informed decision.
                  </p>
                </div>
                <div>
                  <h3
                    className="text-2xl font-semibold mb-3"
                    style={{ fontFamily: "var(--font-body)", color: "var(--color-text-primary)" }}
                  >
                    Quality
                  </h3>
                  <p className="text-lg leading-relaxed" style={{ color: "var(--color-neutral-dark)" }}>
                    We only work with properties and experience providers who share our commitment to excellence. Every detail matters.
                  </p>
                </div>
                <div>
                  <h3
                    className="text-2xl font-semibold mb-3"
                    style={{ fontFamily: "var(--font-body)", color: "var(--color-text-primary)" }}
                  >
                    Service
                  </h3>
                  <p className="text-lg leading-relaxed" style={{ color: "var(--color-neutral-dark)" }}>
                    Our UK-based support team is here to help, whether you have a question at 9am or need assistance during your stay. We respond fast and genuinely care about your experience.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-[var(--color-bg-secondary)] p-12 rounded-2xl">
              <h2 className="mb-6" style={{ fontFamily: "var(--font-display)" }}>
                Meet The Team
              </h2>
              <p className="text-lg leading-relaxed mb-6" style={{ color: "var(--color-neutral-dark)" }}>
                Today, Group Escape Houses is a team of 15 passionate people based in our Brighton office. From property scouts to customer service heroes, we all share the same goal: making your celebration unforgettable.
              </p>
              <p className="text-lg leading-relaxed" style={{ color: "var(--color-neutral-dark)" }}>
                We're hen party planners, weekend warriors, and celebration enthusiasts. Many of us have used our own platform for birthdays, stag dos, and friend reunions. We know what makes a great weekend, because we live it.
              </p>
            </div>

            <div>
              <h2 className="mb-6" style={{ fontFamily: "var(--font-display)" }}>
                Looking Ahead
              </h2>
              <p className="text-lg leading-relaxed mb-6" style={{ color: "var(--color-neutral-dark)" }}>
                Since launching in 2019, we've helped over 12,000 guests create incredible memories. But we're just getting started. We're constantly adding new properties, expanding to new destinations, and developing innovative ways to make group booking even easier.
              </p>
              <p className="text-lg leading-relaxed" style={{ color: "var(--color-neutral-dark)" }}>
                Whether you're planning a hen party, birthday celebration, or friends' reunion, we're here to help you find the perfect house and create a weekend you'll never forget.
              </p>
            </div>

            <div className="text-center pt-8">
              <Button
                asChild
                size="lg"
                className="rounded-2xl px-10 py-6 text-lg font-medium transition-all duration-200 hover:shadow-xl hover:-translate-y-1"
                style={{
                  background: "var(--color-accent-sage)",
                  color: "white",
                }}
              >
                <Link href="/properties">Browse Our Houses</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}