import Link from "next/link";
import { ArrowRight } from "lucide-react";

const henItems = [
  {
    title: "HenFest™",
    description: "Your own mini festival from £229pp",
    image: "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=800&h=1000&q=80&fit=crop",
    link: "/hen-party-houses"
  },
  {
    title: "Hen Party Houses",
    description: "Over 550 Properties",
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&h=1000&q=80&fit=crop",
    link: "/hen-party-houses"
  },
  {
    title: "Liverpool Hen Packages",
    description: "from £59pp",
    image: "https://images.unsplash.com/photo-1540479859555-17af45c78602?w=800&h=1000&q=80&fit=crop",
    link: "/destinations/liverpool"
  },
  {
    title: "Bath Hen Packages",
    description: "from £69pp",
    image: "https://images.unsplash.com/photo-1522158637959-30385a09e0da?w=800&h=1000&q=80&fit=crop",
    link: "/destinations/bath"
  }
];

export function HenPartyCarousel() {
  return (
    <section className="py-16 md:py-20 bg-white overflow-hidden">
      <div className="max-w-[1200px] mx-auto px-4 md:px-6">
        <div className="mb-10">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold" style={{ fontFamily: "var(--font-display)" }}>
            You bring the bride, we'll bring the party.
          </h2>
        </div>

        <div className="relative">
          <div className="flex gap-4 overflow-x-auto pb-8 scrollbar-hide snap-x">
            {henItems.map((item, index) => (
              <Link
                key={index}
                href={item.link}
                className="group relative flex-shrink-0 w-[280px] md:w-[320px] aspect-[4/5] overflow-hidden rounded-2xl snap-start transition-transform hover:scale-[1.02]"
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="text-xl md:text-2xl font-bold text-white mb-1">
                    {item.title}
                  </h3>
                  <p className="text-sm md:text-base text-white/90">
                    {item.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
          
          <div className="mt-8 flex justify-end">
            <Link 
              href="/hen-party-houses" 
              className="inline-flex items-center text-lg font-medium hover:text-[var(--color-accent-sage)] transition-colors"
            >
              See All Hen Packages
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
