import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Manor Houses UK | Grand Country Estates to Rent",
  description: "Historic manor houses sleeping 16-30+ guests. Period features, sprawling grounds & elegant interiors for sophisticated hen weekends.",
  keywords: ["manor houses to rent UK", "country estates for groups", "historic houses for hire", "stately homes hen parties"],
  openGraph: {
    title: "Manor Houses & Country Estates",

    description: "Grand historic properties with period features and sprawling grounds for elegant celebrations.",
    url: "https://www.groupescapehouses.co.uk/house-styles/manor-houses",
  },
  alternates: {
    canonical: "https://www.groupescapehouses.co.uk/house-styles/manor-houses",
  },
};

export default function ManorHousesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}