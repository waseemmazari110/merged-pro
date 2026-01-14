import type { Metadata } from "next";
import UKServiceSchema from "@/components/UKServiceSchema";

// Inspiration posts data - extract to a file later
const inspirationPosts: Record<string, any> = {
  "alternative-hen-party-ideas": {
    title: "10 Hen Party Ideas That Aren't the Usual Spa Day",
    excerpt: "Looking for something different? From cocktail making to life drawing, here are our favourite alternative hen party activities.",
    description: "Discover 10 unique hen party ideas beyond spa days. Cocktail making, life drawing, dance workshops, private chefs & more for unforgettable celebrations.",
    date: "15 Jan 2025",
    category: "Hen Do Ideas",
  },
  "brighton-hen-do-guide": {
    title: "The Ultimate Brighton Hen Do Guide: Where to Stay, Eat & Party",
    excerpt: "Brighton is the UK's hen party capital for a reason. Our complete guide covers the best houses, restaurants, bars, and activities.",
    description: "Complete Brighton hen party guide. Best houses, restaurants, bars, activities & nightlife tips. Plan the perfect Brighton hen do with Group Escape Houses.",
    date: "12 Jan 2025",
    category: "City Guides",
  },
};

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const baseUrl = 'https://www.groupescapehouses.co.uk';
  
  const post = inspirationPosts[slug];
  if (!post) {
    return {
      title: "Inspiration Post",

      alternates: {
        canonical: `${baseUrl}/inspiration/${slug}`,
      },
    };
  }

  return {
    title: post.title,
    description: post.description || post.excerpt,
    keywords: `${post.category.toLowerCase()}, hen party planning, group accommodation, UK celebrations`,
    authors: [{ name: 'Group Escape Houses' }],
    creator: 'Group Escape Houses',
    openGraph: {
      title: post.title,
      description: post.description || post.excerpt,
      url: `${baseUrl}/inspiration/${slug}`,
      type: 'article',
      publishedTime: new Date(post.date).toISOString(),
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description || post.excerpt,
    },
    alternates: {
      canonical: `${baseUrl}/inspiration/${slug}`,
    },
  };
}

interface InspirationPostLayoutProps {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}

export default async function InspirationPostLayout({
  children,
  params,
}: InspirationPostLayoutProps) {
  const { slug } = await params;
  const post = inspirationPosts[slug];

  if (!post) {
    return children;
  }

  return (
    <>
      <UKServiceSchema 
        type="breadcrumb" 
        data={{
          breadcrumbs: [
            { name: "Home", url: "/" },
            { name: "Inspiration", url: "/inspiration" },
            { name: post.title, url: `/inspiration/${slug}` }
          ]
        }}
      />
      <UKServiceSchema 
        type="article"
        data={{
          title: post.title,
          description: post.description || post.excerpt,
          datePublished: new Date(post.date).toISOString(),
          image: "https://www.groupescapehouses.co.uk/logo.png", // Fallback or post image
          url: `/inspiration/${slug}`
        }}
      />
      {children}
    </>
  );
}
