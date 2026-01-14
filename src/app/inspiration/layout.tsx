import type { Metadata } from "next";
import UKServiceSchema from "@/components/UKServiceSchema";

export const metadata: Metadata = {
  title: "Inspiration | Planning Tips & City Guides",
  description: "Free planning tips. City nightlife guides, packing checklists, budgeting advice & property spotlights. Updated weekly.",
  keywords: ["planning tips", "weekend ideas", "UK holiday blog", "celebration planning guide", "inspiration"],
  openGraph: {
    title: "Inspiration & Resources",

    description: "Free expert advice, city guides, checklists and inspiration. Updated weekly.",
    url: "https://www.groupescapehouses.co.uk/inspiration",
  },
  alternates: {
    canonical: "https://www.groupescapehouses.co.uk/inspiration",
  },
};

export default function InspirationLayout({
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
            { name: "Inspiration", url: "/inspiration" }
          ]
        }}
      />
      {children}
    </>
  );
}
