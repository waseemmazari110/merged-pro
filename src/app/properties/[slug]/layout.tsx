import type { Metadata } from "next";
import UKServiceSchema from "@/components/UKServiceSchema";

const faqs = [
  {
    question: "What is included in the price?",
    answer:
      "The price includes full use of the property and all facilities including hot tub, pool, games room, and all utilities. Bedding and towels are provided. Additional cleaning during your stay can be arranged for an extra fee.",
  },
  {
    question: "How do deposits and payments work?",
    answer:
      "A 25% deposit is required to secure your booking. The remaining balance is due 6 weeks before your arrival. A refundable damage deposit of £500 is also required.",
  },
  {
    question: "Can we bring pets?",
    answer:
      "Unfortunately, pets are not permitted at this property. Please check our other listings for pet-friendly options.",
  },
  {
    question: "Is there parking available?",
    answer:
      "Yes, there is free private parking for up to 6 cars on the property. Additional street parking is available nearby.",
  },
];

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const baseUrl = 'https://www.groupescapehouses.co.uk';
  
  try {
    const response = await fetch(`${baseUrl}/api/properties?slug=${slug}`, {
      next: { revalidate: 60 },
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch property');
    }

    const propertyData = await response.json();
    
    if (!propertyData || propertyData.length === 0) {
      return {
        title: "Property",

        alternates: {
          canonical: `${baseUrl}/properties/${slug}`,
        },
      };
    }

    const property = propertyData[0];
    const title = `${property.title} | ${property.sleepsMax} Guests | Hot Tub & Pool`;
    const description = `${property.title} in ${property.location}. Sleeps ${property.sleepsMax} guests across ${property.bedrooms} bedrooms. From £${Math.min(property.priceFromWeekend, property.priceFromMidweek)}/night. ${property.description?.substring(0, 100)}...`;
    
    return {
      title,
      description,
      keywords: `${property.title}, ${property.location} holiday home, group accommodation, hen party house, party house, houses sleeping ${property.sleepsMax} guests, hot tub rental, luxury group accommodation`,
      authors: [{ name: 'Group Escape Houses' }],
      creator: 'Group Escape Houses',
      openGraph: {
        title: `${property.title}`,
        description,
        url: `${baseUrl}/properties/${slug}`,
        type: 'website',
        images: [
          {
            url: property.heroImage || 'https://www.groupescapehouses.co.uk/og-image.jpg',
            width: 1200,
            height: 630,
            alt: property.title,
          },
        ],
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: [property.heroImage || 'https://www.groupescapehouses.co.uk/og-image.jpg'],
      },
      alternates: {
        canonical: `${baseUrl}/properties/${slug}`,
      },
    };
  } catch (error) {
    console.error('Error generating property metadata:', error);
    return {
      title: "Property",

      alternates: {
        canonical: `${baseUrl}/properties/${slug}`,
      },
    };
  }
}

interface PropertyDetailLayoutProps {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}

export default async function PropertyDetailLayout({
  children,
  params,
}: PropertyDetailLayoutProps) {
    const { slug } = await params;
    const baseUrl = 'https://www.groupescapehouses.co.uk';
    
    let property = null;
    try {
      const response = await fetch(`${baseUrl}/api/properties?slug=${slug}`, {
        next: { revalidate: 60 },
      });
      if (response.ok) {
        const data = await response.json();
        if (data && data.length > 0) {
          property = data[0];
        }
      }
    } catch (e) {
      console.error('Error fetching property for layout schema:', e);
    }

    return (
      <>
        {property && (
          <>
            <UKServiceSchema 
              type="breadcrumb" 
              data={{
                breadcrumbs: [
                  { name: "Home", url: "/" },
                  { name: "Properties", url: "/properties" },
                  { name: property.title, url: `/properties/${slug}` }
                ]
              }}
            />
            <UKServiceSchema type="faq" data={{ faqs }} />
          </>
        )}
        {children}
      </>
    );
}
