import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import { Calendar, ChevronRight } from "lucide-react";
import { Metadata } from "next";
import UKServiceSchema from "@/components/UKServiceSchema";

export const metadata: Metadata = {
  title: "Group Travel Guides & Resources | Escape Houses",
  description: "Expert advice and guides for planning the perfect large group getaway in the UK. From choosing the right venue to destination inspiration.",
  alternates: {
    canonical: "https://www.escapehouses.co.uk/guides"
  }
};

const guides = [
  {
    title: "How to Choose Large Group Accommodation in the UK",
    excerpt: "A comprehensive guide covering what counts as large group accommodation, typical group sizes from 10 to 30+ guests, facilities to prioritise, location considerations, and common mistakes to avoid.",
    slug: "how-to-choose-large-group-accommodation-uk",
    image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/professional-stock-photo-of-planning-che-9704c7d1-20251018105913.jpg",
    date: "Dec 27, 2025",
    category: "Planning"
  },
  {
    title: "Large Group House vs Hotel: What's Better for Group Weekends?",
    excerpt: "An honest comparison of hotels versus holiday houses for groups of 10-30, covering cost, privacy, catering options, flexibility for celebrations, and weekend itinerary examples.",
    slug: "large-group-house-vs-hotel",
    image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/professional-stock-photo-showing-split-c-189baecf-20251018105904.jpg",
    date: "Dec 26, 2025",
    category: "Comparison"
  },
  {
    title: "Best UK Destinations for Large Group Weekends",
    excerpt: "Explore 8+ UK destinations perfect for group getaways including Brighton, London, Cornwall, Lake District, Cotswolds, Manchester, Devon, and York with property types, activities, and travel tips.",
    slug: "best-uk-destinations-for-large-group-weekends",
    image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/professional-stock-photo-of-brighton-uk--0e8a0dba-20251018105838.jpg",
    date: "Dec 25, 2025",
    category: "Destinations"
  },
  {
    title: "What to Check When Booking Accommodation for 20+ Guests",
    excerpt: "A comprehensive checklist for massive group bookings to ensure everyone has a bed and the dining table is actually big enough.",
    slug: "what-to-check-when-booking-accommodation-for-20-plus-guests",
    image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/professional-stock-photo-of-luxury-holid-f27f8e6d-20251018105853.jpg",
    date: "Dec 24, 2025",
    category: "Checklist"
  },
  {
    title: "Noise Rules and Neighbour Considerations for Group Stays",
    excerpt: "How to have a great time without falling foul of local regulations or bothering the neighbours during your group holiday.",
    slug: "noise-rules-and-neighbour-considerations-for-group-stays",
    image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/professional-stock-photo-of-hen-party-ac-2ed8f30b-20251018105832.jpg",
    date: "Dec 23, 2025",
    category: "Rules"
  }
];

export default function GuidesPage() {
  return (
    <div className="min-h-screen bg-[var(--color-bg-primary)]">
      <UKServiceSchema
        type="breadcrumb"
        data={{
          breadcrumbs: [
            { name: "Home", url: "/" },
            { name: "Guides", url: "/guides" }
          ]
        }}
      />
      <Header />
      
      <main className="pt-32 pb-24">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl lg:text-6xl mb-6" style={{ fontFamily: "var(--font-display)" }}>
              Group Travel Guides
            </h1>
            <p className="text-xl text-[var(--color-neutral-dark)] max-w-2xl mx-auto">
              Everything you need to know to plan, book, and enjoy the perfect large group getaway in the UK.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {guides.map((guide) => (
              <Link 
                key={guide.slug}
                href={`/guides/${guide.slug}`}
                className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
              >
                <div className="aspect-[16/10] overflow-hidden">
                  <img 
                    src={guide.image} 
                    alt={guide.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-8">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="px-3 py-1 bg-[var(--color-accent-sage)] text-white text-xs font-semibold rounded-full">
                      {guide.category}
                    </span>
                    <span className="flex items-center gap-1 text-sm text-[var(--color-neutral-dark)] opacity-70">
                      <Calendar className="w-3 h-3" />
                      {guide.date}
                    </span>
                  </div>
                  <h2 className="text-2xl font-bold mb-4 group-hover:text-[var(--color-accent-sage)] transition-colors" style={{ fontFamily: "var(--font-display)" }}>
                    {guide.title}
                  </h2>
                  <p className="text-[var(--color-neutral-dark)] mb-6 line-clamp-3">
                    {guide.excerpt}
                  </p>
                  <div className="flex items-center gap-2 text-[var(--color-accent-sage)] font-semibold">
                    Read Guide <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
