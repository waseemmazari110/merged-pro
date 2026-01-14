import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Houses by Style | Castles, Manors & Country Estates",
  description: "Browse luxury properties by architectural style. Historic castles, elegant manor houses, contemporary villas, country estates. Unique character properties across the UK.",
  keywords: ["castle rental UK", "manor houses", "country estates", "luxury houses by style", "unique properties"],
  openGraph: {
    title: "Browse Houses by Style",

    description: "Castles, manor houses, country estates and unique architectural properties.",
    url: "https://www.groupescapehouses.co.uk/house-styles",
  },
  alternates: {
    canonical: "https://www.groupescapehouses.co.uk/house-styles",
  },
};

export default function HouseStylesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}