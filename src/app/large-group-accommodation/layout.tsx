import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Large Group Accommodation UK | Sleeps 10, 20, 30+",
  description: "Find the perfect large group accommodation across the UK. Luxury houses with hot tubs, pools, and games rooms for 10-30+ guests. Book your group getaway today.",
  keywords: ["large group accommodation UK", "group stay UK", "big houses for rent UK", "accommodation for 20 guests", "accommodation for 30 guests"],
  openGraph: {
    title: "Large Group Accommodation UK | Group Escape Houses",
    description: "Luxury large group accommodation across the UK. Perfect for hen parties, family reunions, and celebrations.",
    url: "https://www.groupescapehouses.co.uk/large-group-accommodation",
    siteName: "Group Escape Houses",
    images: ["/og-image.jpg"],
    locale: "en_GB",
    type: "website",
  },
  alternates: {
    canonical: "https://www.groupescapehouses.co.uk/large-group-accommodation",
  },
};

export default function LargeGroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
