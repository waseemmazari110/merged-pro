import type { Metadata } from "next";
import UKServiceSchema from "@/components/UKServiceSchema";

export const metadata: Metadata = {
  title: "Hen Party Planning Blog | Tips & City Guides",
  description: "Free hen party planning tips. City nightlife guides, packing checklists, budgeting advice & property spotlights. Updated weekly.",
  keywords: ["hen party planning tips", "hen weekend ideas", "UK hen party blog", "celebration planning guide"],
  openGraph: {
    title: "Hen Party Planning Blog & Resources",

    description: "Free expert advice, city guides, checklists and inspiration. Updated weekly.",
    url: "https://www.groupescapehouses.co.uk/blog",
  },
  alternates: {
    canonical: "https://www.groupescapehouses.co.uk/blog",
  },
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <UKServiceSchema 
        type="breadcrumb" 
        data={{
          breadcrumbs: [
            { name: "Home", url: "/" },
            { name: "Blog", url: "/blog" }
          ]
        }}
      />
      {children}
    </>
  );
}