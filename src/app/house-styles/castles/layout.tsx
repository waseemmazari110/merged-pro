import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Castle Hire for Groups | Historic Castles Sleeping 20-40 Guests",
  description: "Rent a castle for your celebration. Scottish, Welsh and English castles with towers, turrets and dramatic settings. Sleeps 20-40+ guests.",
  keywords: ["castle hire UK", "rent a castle for groups", "castle accommodation hen party", "castle weddings and events"],
  openGraph: {
    title: "Hire a Castle for Your Celebration",

    description: "Scottish, Welsh and English castles sleeping 20-40+. Towers, turrets and dramatic settings.",
    url: "https://www.groupescapehouses.co.uk/house-styles/castles",
  },
  alternates: {
    canonical: "https://www.groupescapehouses.co.uk/house-styles/castles",
  },
};

export default function CastlesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}