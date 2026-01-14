import { Instagram, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const instagramImages = [
  "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=400&h=711&q=80&fit=crop",
  "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=400&h=711&q=80&fit=crop",
  "https://images.unsplash.com/photo-1523438885200-e635ba2c371e?w=400&h=711&q=80&fit=crop",
  "https://images.unsplash.com/photo-1540479859555-17af45c78602?w=400&h=711&q=80&fit=crop",
  "https://images.unsplash.com/photo-1516997121675-4c2d1684aa3e?w=400&h=711&q=80&fit=crop",
  "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=711&q=80&fit=crop",
  "https://images.unsplash.com/photo-1522158637959-30385a09e0da?w=400&h=711&q=80&fit=crop",
];

export function InstagramSection() {
  return (
    <section className="py-16 md:py-20 bg-white overflow-hidden content-visibility-auto">
      <div className="max-w-[1200px] mx-auto px-4 md:px-6">
        <div className="text-center mb-10 md:mb-12">
          <div className="flex items-center justify-center mb-3 md:mb-4">
            <Instagram className="w-12 h-12 md:w-16 md:h-16 text-transparent" style={{
              background: "linear-gradient(45deg, #f09433 0%,#e6683c 25%,#dc2743 50%,#cc2366 75%,#bc1888 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text"
            }} />
          </div>
          <h2 className="mb-3 md:mb-4" style={{ fontFamily: "var(--font-display)" }}>
            Follow The Fun
          </h2>
              <p className="text-lg md:text-xl text-[var(--color-neutral-dark)] mb-6 md:mb-8 max-w-2xl mx-auto px-4">
                See our latest hen party inspiration on Instagram
              </p>
            <a href="https://www.instagram.com/groupescapehouses/" target="_blank" rel="noopener noreferrer">
              <Button size="lg" className="rounded-2xl px-10 py-6 font-medium transition-all hover:scale-[1.05] text-white border-0 bg-gradient-to-r from-[#f09433] via-[#dc2743] to-[#bc1888]">
                Group Escape Houses
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </a>
          </div>
  
          <div className="relative mt-12 min-h-[400px] md:min-h-[500px]">
            <div className="overflow-hidden">
              <div className="flex gap-4 animate-slide-left">
                {[...instagramImages, ...instagramImages].map((img, index) => (
                  <a
                    key={`img-${index}`}
                    href="https://www.instagram.com/groupescapehouses/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative flex-shrink-0 w-[280px] aspect-[9/16] overflow-hidden rounded-xl transition-transform hover:scale-[1.02] bg-gray-100"
                    aria-label={`View Instagram post ${index + 1}`}
                  >
                    <img
                      src={img}
                      alt={`Group travel inspiration on Instagram - Image ${index % instagramImages.length + 1}`}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <div className="flex items-center justify-center w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm">
                      <Instagram className="w-10 h-10 text-white drop-shadow-lg" />
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
