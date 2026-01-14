"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { 
  Sparkles, 
  Loader2, 
  ArrowRight,
  Martini,
  Beef,
  Palette,
  Pizza,
  Utensils,
  Brush,
  GlassWater,
  ChefHat,
  Wine,
  Flower2,
  Flower,
  Music,
  Gift,
  Mic2,
  Wind,
  Users
} from "lucide-react";

interface Experience {
  id?: number;
  title: string;
  slug: string;
  isPublished?: boolean;
}

const getIcon = (title: string) => {
  const t = title.toLowerCase();
  if (t.includes("cocktail")) return Martini;
  if (t.includes("bbq") || t.includes("catering")) return Beef;
  if (t.includes("paint") || t.includes("sip")) return Palette;
  if (t.includes("pizza")) return Pizza;
  if (t.includes("butler")) return Users;
  if (t.includes("brunch")) return Utensils;
  if (t.includes("drawing")) return Brush;
  if (t.includes("gin")) return GlassWater;
  if (t.includes("chef")) return ChefHat;
  if (t.includes("wine")) return Wine;
  if (t.includes("spa") || t.includes("treatment")) return Flower2;
  if (t.includes("flower")) return Flower;
  if (t.includes("beauty") || t.includes("artist")) return Sparkles;
  if (t.includes("dance")) return Music;
  if (t.includes("pamper") || t.includes("package")) return Gift;
  if (t.includes("karaoke")) return Mic2;
  if (t.includes("yoga")) return Wind;
  return Sparkles;
};

export default function AddExperiencesToStay() {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchExperiences() {
      try {
        const response = await fetch("/api/experiences?isPublished=true");
        if (response.ok) {
          const data = await response.json();
          if (Array.isArray(data) && data.length > 0) {
            setExperiences(data);
          }
        }
      } catch (error) {
        console.error("Error fetching experiences:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchExperiences();
  }, []);

  // If no experiences from API, use the list from the screenshot as fallback
  const fallbackExperiences = [
    { title: "Cocktail Masterclass", slug: "cocktail-masterclass" },
    { title: "BBQ Catering", slug: "bbq-catering" },
    { title: "Sip & Paint", slug: "sip-and-paint" },
    { title: "Pizza Making Class", slug: "pizza-making-class" },
    { title: "Butlers in the Buff", slug: "butlers-in-the-buff" },
    { title: "Bottomless Brunch", slug: "bottomless-brunch" },
    { title: "Life Drawing", slug: "life-drawing" },
    { title: "Gin Tasting", slug: "gin-tasting" },
    { title: "Private Chef", slug: "private-chef" },
    { title: "Wine Tasting", slug: "wine-tasting" },
    { title: "Spa Treatments", slug: "spa-treatments" },
    { title: "Flower Crown Making", slug: "flower-crown-making" },
    { title: "Mobile Beauty Bar", slug: "mobile-beauty-bar" },
    { title: "Dance Class", slug: "dance-class" },
    { title: "Pamper Party Package", slug: "pamper-party-package" },
    { title: "Karaoke Night", slug: "karaoke-night" },
    { title: "Make-up Artist", slug: "make-up-artist" },
    { title: "Yoga Session", slug: "yoga-session" },
  ];

  const displayExperiences = experiences.length > 0 ? experiences : fallbackExperiences;

  if (isLoading && experiences.length === 0) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="w-8 h-8 text-[var(--color-accent-sage)] animate-spin" />
      </div>
    );
  }

  return (
    <section className="py-16 bg-white border-t border-[var(--color-bg-secondary)]">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="mb-10">
          <h2 
            className="text-sm font-bold uppercase tracking-widest text-[var(--color-accent-sage)] mb-8"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Trending Activity Ideas
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-6">
            {displayExperiences.map((experience, index) => {
              const Icon = getIcon(experience.title);
              return (
                <Link
                  key={index}
                  href={`/experiences/${experience.slug}`}
                  className="group flex items-center gap-3 text-lg text-[var(--color-neutral-dark)] hover:text-[var(--color-accent-sage)] transition-colors py-1"
                >
                  <div className="w-10 h-10 rounded-full bg-[var(--color-bg-primary)] flex items-center justify-center group-hover:bg-[var(--color-accent-sage)]/10 transition-colors">
                    <Icon className="w-5 h-5 text-[var(--color-accent-sage)]" />
                  </div>
                  <span className="flex-1">{experience.title}</span>
                </Link>
              );
            })}
          </div>
        </div>

        <div className="pt-8 border-t border-[var(--color-bg-secondary)]">
          <Link
            href="/experiences"
            className="inline-flex items-center gap-2 text-lg font-semibold text-[var(--color-accent-sage)] hover:gap-3 transition-all"
          >
            View All Experiences <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
