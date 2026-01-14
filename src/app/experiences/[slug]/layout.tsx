import type { Metadata } from "next";
import UKServiceSchema from "@/components/UKServiceSchema";
import { experiencesData } from "@/data/experiences";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const baseUrl = 'https://www.groupescapehouses.co.uk';
  const experience = experiencesData[slug] || experiencesData["private-chef"];

  return {
    title: experience.title,
    description: experience.description,
    alternates: {
      canonical: `${baseUrl}/experiences/${slug}`,
    },
    openGraph: {
      title: experience.title,
      description: experience.description,
      url: `${baseUrl}/experiences/${slug}`,
      images: [{ url: experience.image }],
    }
  };
}

interface ExperienceDetailLayoutProps {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}

export default async function ExperienceDetailLayout({
  children,
  params,
}: ExperienceDetailLayoutProps) {
  const { slug } = await params;
  const experience = experiencesData[slug] || experiencesData["private-chef"];

  return (
    <>
      <UKServiceSchema 
        type="breadcrumb" 
        data={{
          breadcrumbs: [
            { name: "Home", url: "/" },
            { name: "Experiences", url: "/experiences" },
            { name: experience.title, url: `/experiences/${slug}` }
          ]
        }}
      />
      {experience.faqs && experience.faqs.length > 0 && (
        <UKServiceSchema type="faq" data={{ faqs: experience.faqs }} />
      )}
      {children}
    </>
  );
}
