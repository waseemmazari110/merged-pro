import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import { ArrowLeft, Calendar, Share2, Clock, User } from "lucide-react";
import { notFound } from "next/navigation";
import { guidesContent } from "../guidesContent";
import { Metadata } from "next";
import UKServiceSchema from "@/components/UKServiceSchema";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const guide = guidesContent[slug as keyof typeof guidesContent];

  if (!guide) {
    return {
      title: "Guide Not Found",
    };
  }

  const baseUrl = "https://www.groupescapehouses.co.uk";

  return {
    title: `${guide.title} | Group Travel Guides | Group Escape Houses`,
    description: guide.content.replace(/<[^>]*>/g, '').substring(0, 160),
    alternates: {
      canonical: `${baseUrl}/guides/${slug}`
    },
    openGraph: {
      title: guide.title,
      description: guide.content.replace(/<[^>]*>/g, '').substring(0, 160),
      images: [guide.image],
      type: 'article',
      publishedTime: new Date(guide.date).toISOString(),
    }
  };
}

export default async function GuidePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const guide = guidesContent[slug as keyof typeof guidesContent];

  if (!guide) {
    notFound();
  }

  const baseUrl = "https://www.groupescapehouses.co.uk";

  // Schema.org Article Data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": guide.title,
    "image": guide.image,
    "datePublished": new Date(guide.date).toISOString(),
    "author": {
      "@type": "Organization",
      "name": "Group Escape Houses",
      "url": baseUrl
    },
    "publisher": {
      "@type": "Organization",
      "name": "Group Escape Houses",
      "logo": {
        "@type": "ImageObject",
        "url": "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/document-uploads/stacked_logo-1760785640378.jpg"
      }
    },
    "description": guide.content.replace(/<[^>]*>/g, '').substring(0, 160)
  };

  return (
    <div className="min-h-screen bg-white">
      <UKServiceSchema
        type="breadcrumb"
        data={{
          breadcrumbs: [
            { name: "Home", url: "/" },
            { name: "Guides", url: "/guides" },
            { name: guide.title, url: `/guides/${slug}` }
          ]
        }}
      />
      <Header />

      <UKServiceSchema
        type="article"
        data={{
          title: guide.title,
          description: guide.content.replace(/<[^>]*>/g, '').substring(0, 160),
          image: guide.image,
          datePublished: new Date(guide.date).toISOString(),
          dateModified: new Date(guide.date).toISOString()
        }}
      />

      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-[var(--color-bg-primary)]">
        <div className="max-w-[1000px] mx-auto px-6">
          <Link 
            href="/guides"
            className="inline-flex items-center gap-2 text-[var(--color-accent-sage)] hover:gap-3 transition-all mb-8 font-medium"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Guides
          </Link>
          
          <div className="flex items-center gap-3 mb-6">
            <span className="px-3 py-1 bg-[var(--color-accent-sage)] text-white text-xs font-semibold rounded-full uppercase tracking-wider">
              {guide.category}
            </span>
            <span className="text-[var(--color-neutral-dark)] opacity-60 text-sm flex items-center gap-1">
              <Clock className="w-4 h-4" /> 8 min read
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl mb-8 leading-tight" style={{ fontFamily: "var(--font-display)" }}>
            {guide.title}
          </h1>

          <div className="flex flex-wrap items-center gap-8 py-6 border-t border-[rgba(0,0,0,0.05)]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[var(--color-accent-sage)] flex items-center justify-center text-white">
                <User className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-bold">Group Escape Houses Team</p>
                <p className="text-xs text-[var(--color-neutral-dark)] opacity-60">Travel Experts</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2 text-[var(--color-neutral-dark)] opacity-60">
              <Calendar className="w-5 h-5" />
              <span className="text-sm">{guide.date}</span>
            </div>

            <div className="ml-auto flex items-center gap-4">
               <button className="p-2 hover:bg-white rounded-full transition-colors border border-transparent hover:border-[rgba(0,0,0,0.1)]">
                 <Share2 className="w-5 h-5 text-[var(--color-accent-sage)]" />
               </button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Image */}
      <section className="relative -mt-8 mb-16">
        <div className="max-w-[1100px] mx-auto px-6">
          <div className="aspect-[21/9] rounded-3xl overflow-hidden shadow-2xl">
            <img 
              src={guide.image} 
              alt={guide.title}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Article Content */}
      <article className="pb-24">
        <div className="max-w-[800px] mx-auto px-6">
          <div 
            className="prose prose-lg md:prose-xl max-w-none prose-headings:font-display prose-a:text-[var(--color-accent-sage)] prose-a:no-underline hover:prose-a:underline prose-img:rounded-3xl"
            dangerouslySetInnerHTML={{ __html: guide.content }}
          />
          
          <div className="mt-16 p-8 bg-[var(--color-bg-primary)] rounded-3xl border border-[rgba(0,0,0,0.05)]">
            <h3 className="text-2xl mb-4 font-bold" style={{ fontFamily: "var(--font-display)" }}>
              Planning a group getaway?
            </h3>
            <p className="text-[var(--color-neutral-dark)] mb-6">
              Our team of experts is here to help you find the perfect property for your next gathering. From manor houses to luxury cottages, we have the best selection in the UK.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link 
                href="/properties"
                className="px-6 py-3 bg-[var(--color-accent-sage)] text-white rounded-full font-bold hover:scale-105 transition-transform"
              >
                Browse Properties
              </Link>
              <Link 
                href="/contact"
                className="px-6 py-3 border border-[var(--color-accent-sage)] text-[var(--color-accent-sage)] rounded-full font-bold hover:bg-white transition-colors"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </article>

      <Footer />
    </div>
  );
}
