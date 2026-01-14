import type { Metadata } from "next";
import UKServiceSchema from "@/components/UKServiceSchema";

export const metadata: Metadata = {
  title: "Hen Party Activities | Chef, Cocktails & Spa",
  description: "Private chefs from £55pp, cocktail masterclasses, mobile spa treatments & wellness. Book experiences with your hen party house.",
  keywords: ["hen party activities UK", "cocktail masterclass", "private chef hen party", "spa treatments", "hen do experiences"],
  openGraph: {
    title: "Hen Weekend Experiences & Activities",

    description: "Private chefs, cocktail classes, spa days & wellness. Prices from £40pp.",
    url: "https://www.groupescapehouses.co.uk/experiences",
  },
  alternates: {
    canonical: "https://www.groupescapehouses.co.uk/experiences",
  },
};

export default function ExperiencesLayout({
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
            { name: "Experiences", url: "/experiences" }
          ]
        }}
      />
      {children}
    </>
  );
}