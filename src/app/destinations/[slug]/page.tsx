import Image from "next/image";
import { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PropertyCard from "@/components/PropertyCard";
import { MapPin, Navigation, Coffee, Moon, Sparkles, UtensilsCrossed, ChevronDown, Calendar, Home, Waves, PoundSterling, Users, PartyPopper, Train, Plane, Car, Bus } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import DestinationClient from "./DestinationClient";
import UKServiceSchema from "@/components/UKServiceSchema";

// Generate metadata for SEO
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  
  // Destinations data
  const destinationsData: Record<string, any> = {
    "lake-district": {
      name: "Lake District",
      region: "Cumbria",
      overview: "The Lake District is England's most stunning national park, offering breathtaking landscapes, luxury lodges, and peaceful mountain retreats perfect for group celebrations.",
    },
    brighton: {
      name: "Brighton",
      region: "East Sussex",
      overview: "Brighton is the UK's premier hen party destination, combining stunning Regency architecture with legendary nightlife, a vibrant beach scene, and endless entertainment options.",
    },
    // ... rest will be loaded dynamically in the component
  };

  const destination = destinationsData[slug] || { 
    name: slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
    region: "UK",
    overview: `Discover amazing group accommodation in ${slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}`
  };

  const title = `${destination.name} Hen Party Houses | Luxury Group Accommodation`;
  const description = `${destination.overview.substring(0, 155)}... Book luxury ${destination.name} hen party houses sleeping 10-20+ guests. Hot tubs, pools, games rooms. From £65-£120 per night.`;
  const canonicalUrl = `https://www.groupescapehouses.co.uk/destinations/${slug}`;

  return {
    title,
    description,
    keywords: `${destination.name} hen party houses, ${destination.name} group accommodation, ${destination.name} houses with hot tubs, large group houses ${destination.name}, hen do ${destination.name}, ${destination.name} party houses, ${destination.name} weekend breaks, group holidays ${destination.name}`,
    authors: [{ name: 'Group Escape Houses' }],
    creator: 'Group Escape Houses',
    publisher: 'Group Escape Houses',
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      type: 'website',
      locale: 'en_GB',
      url: canonicalUrl,
      title,
      description,
      siteName: 'Group Escape Houses',
      images: [
        {
          url: 'https://www.groupescapehouses.co.uk/og-image.jpg',
          width: 1200,
          height: 630,
          alt: `${destination.name} Group Accommodation`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
        images: ['https://www.groupescapehouses.co.uk/og-image.jpg'],
    },
    other: {
      'format-detection': 'telephone=no, address=no, email=no',
    },
  };
}

export default async function DestinationDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  // Basic data for SSR
  const destinationName = slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  
    return (
      <div className="min-h-screen bg-[var(--color-bg-primary)]">
        <Header />
        
        <UKServiceSchema 
          type="breadcrumb" 
          data={{
            breadcrumbs: [
              { name: "Home", url: "/" },
              { name: "Destinations", url: "/destinations" },
              { name: destinationName, url: `/destinations/${slug}` }
            ]
          }}
        />

        {/* Initial HTML for SEO Crawlers */}

      <noscript>
        <div className="pt-32 pb-16 px-6 max-w-[1200px] mx-auto">
          <h1 className="text-4xl font-bold mb-4">{destinationName} Hen Party Houses</h1>
          <p className="text-xl mb-8">
            Discover luxury group accommodation in {destinationName}. Perfect for hen parties, 
            celebrations, and group getaways with stunning houses featuring hot tubs, pools, 
            and exceptional amenities.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="border rounded-xl p-4">
              <h2 className="text-xl font-semibold mb-2">Luxury Group Houses in {destinationName}</h2>
              <p>Browse our handpicked collection of large houses to rent in {destinationName}.</p>
                <Link href="/properties" className="text-blue-600 underline">View all properties</Link>
            </div>
          </div>
        </div>
      </noscript>

      <DestinationClient slug={slug} />
      <Footer />
    </div>
  );
}
