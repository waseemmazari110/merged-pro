import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Group Holiday Houses with Games Rooms UK | Group Escape Houses",
  description: "Luxury group accommodation with games rooms, pool tables, and entertainment spaces. Perfect for family getaways and group celebrations across the UK.",
  keywords: ["houses with games rooms UK", "group accommodation games room", "holiday homes with pool table", "entertainment houses for rent"],
  openGraph: {
    title: "Group Holiday Houses with Games Rooms UK",
    description: "Browse our selection of large group houses with dedicated games rooms and entertainment facilities.",
    url: "https://www.groupescapehouses.co.uk/houses-with-games-rooms",
    siteName: "Group Escape Houses",
    images: ["/og-image.jpg"],
    locale: "en_GB",
    type: "website",
  },
  alternates: {
    canonical: "https://www.groupescapehouses.co.uk/houses-with-games-rooms",
  },
};

export default function HousesWithGamesRoomsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
