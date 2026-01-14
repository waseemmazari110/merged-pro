import Image from "next/image";
import Link from "next/link";
import { Clock, UsersRound } from "lucide-react";

interface ExperienceCardProps {
  title: string;
  duration: string;
  priceFrom: number;
  image: string;
  groupSize: string;
  slug: string;
}

export default function ExperienceCard({
  title,
  duration,
  priceFrom,
  image,
  groupSize,
  slug,
}: ExperienceCardProps) {
  return (
    <Link href={`/experiences/${slug}`}>
      <div className="group relative rounded-2xl overflow-hidden h-[450px] md:h-96 shadow-md hover:shadow-2xl transition-all duration-300">
        <div className="relative w-full h-[250px] md:h-64 bg-gray-50">
          <Image
            src={image}
            alt={title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            quality={85}
            unoptimized={image.includes('supabase.co') || image.includes('fal.media')}
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            priority={false}
          />
        </div>
        
        {/* Content with white background */}
        <div className="absolute bottom-0 left-0 right-0 p-6 bg-white text-[var(--color-text-primary)]">
          <h3
            className="text-2xl font-semibold mb-3"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {title}
          </h3>
          
          <div className="flex items-center gap-6 mb-4 text-sm">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-[var(--color-accent-sage)]" />
              <span>{duration}</span>
            </div>
            <div className="flex items-center gap-2">
              <UsersRound className="w-4 h-4 text-[var(--color-accent-sage)]" />
              <span>{groupSize}</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[var(--color-neutral-dark)]">From</p>
              <p className="text-2xl font-bold" style={{ color: "var(--color-accent-gold)" }}>
                £{priceFrom}
              </p>
              <p className="text-xs text-[var(--color-neutral-dark)]">per person</p>
            </div>
            
            <div
              className="px-6 py-2 rounded-xl font-medium text-sm group-hover:scale-105 transition-transform text-white"
              style={{ background: "var(--color-accent-sage)" }}
            >
              View Experience
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}