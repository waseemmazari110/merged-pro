import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Luxury Party Houses UK | 5-Star Group Homes",
  description: "Five-star luxury properties with designer interiors, hot tubs, pools & chef kitchens. Premium facilities for discerning hen parties.",
  keywords: ["luxury party houses UK", "high-end group accommodation", "5-star party houses", "premium celebration venues"],
  openGraph: {
    title: "Five-Star Luxury Houses",

    description: "Premium properties with designer interiors, exceptional facilities and boutique service.",
    url: "https://www.groupescapehouses.co.uk/house-styles/luxury-houses",
  },
  alternates: {
    canonical: "https://www.groupescapehouses.co.uk/house-styles/luxury-houses",
  },
};

export default function LuxuryHousesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}