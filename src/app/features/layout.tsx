import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Houses by Feature | Hot Tubs, Pools & Games Rooms",
  description: "Browse luxury houses by feature. Hot tubs, swimming pools, cinema rooms, games rooms, tennis courts, beach access. Find your perfect property amenities.",
  keywords: ["houses with hot tubs UK", "pool houses", "games room properties", "cinema room houses", "luxury features"],
  openGraph: {
    title: "Browse Houses by Feature",

    description: "Find houses with hot tubs, pools, games rooms and luxury amenities.",
    url: "https://www.groupescapehouses.co.uk/features",
  },
  alternates: {
    canonical: "https://www.groupescapehouses.co.uk/features",
  },
};

export default function FeaturesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}