import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Rural Retreats UK | Luxury Countryside Group Stay",
  description: "Escape to the country with our selection of luxury rural retreats. Large farmhouse rentals, converted barns, and country estates for groups of 10-30+.",
  keywords: ["rural retreats UK", "countryside group stay", "large farmhouse for rent", "remote group accommodation"],
  openGraph: {
    title: "Rural Retreats UK | Luxury Countryside Group Stay",
    description: "Discover the peace and beauty of the UK countryside in our luxury group houses.",
    url: "https://www.groupescapehouses.co.uk/holiday-focus/rural-retreats",
    siteName: "Group Escape Houses",
    images: ["/og-image.jpg"],
    locale: "en_GB",
    type: "website",
  },
  alternates: {
    canonical: "https://www.groupescapehouses.co.uk/holiday-focus/rural-retreats",
  },
};

export default function RuralRetreatsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
