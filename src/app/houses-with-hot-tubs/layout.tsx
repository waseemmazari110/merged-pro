import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Group Holiday Houses with Hot Tubs UK | Group Escape Houses",
  description: "Luxury large holiday houses with private hot tubs across the UK. Perfect for hen parties, celebrations, and group getaways. Sleeps 10-30 guests.",
  keywords: ["houses with hot tubs UK", "group accommodation hot tub", "party houses hot tub", "holiday homes with hot tubs"],
  openGraph: {
    title: "Group Holiday Houses with Hot Tubs UK",
    description: "Discover our range of luxury group houses featuring private hot tubs. Ideal for any group celebration.",
    url: "https://www.groupescapehouses.co.uk/houses-with-hot-tubs",
    siteName: "Group Escape Houses",
    images: ["/og-image.jpg"],
    locale: "en_GB",
    type: "website",
  },
  alternates: {
    canonical: "https://www.groupescapehouses.co.uk/houses-with-hot-tubs",
  },
};

export default function HousesWithHotTubsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
