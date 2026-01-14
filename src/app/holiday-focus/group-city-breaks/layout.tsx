import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Group City Breaks UK | Luxury Large Houses",
  description: "Explore the UK's best cities with a luxury group house as your base. Perfect for sightseeing, shopping, and nightlife in London, Brighton, Bath, and more.",
  keywords: ["group city breaks UK", "large city houses for rent", "urban group stay", "city weekend away houses"],
  openGraph: {
    title: "Group City Breaks UK",
    description: "Discover the best luxury group houses in the UK's most vibrant cities.",
    url: "https://www.groupescapehouses.co.uk/holiday-focus/group-city-breaks",
    siteName: "Group Escape Houses",
    images: ["/og-image.jpg"],
    locale: "en_GB",
    type: "website",
  },
  alternates: {
    canonical: "https://www.groupescapehouses.co.uk/holiday-focus/group-city-breaks",
  },
};

export default function GroupCityBreaksLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
