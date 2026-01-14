import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Large Holiday Houses to Rent UK | Group Escape Houses",
  description: "Browse our collection of large holiday houses for rent across the UK. Perfect for big groups, families, and celebrations. Sleeps 10-40 guests with luxury facilities.",
  keywords: ["large holiday houses UK", "big holiday homes", "group holiday rentals", "large self catering accommodation", "luxury large houses"],
  openGraph: {
    title: "Large Holiday Houses to Rent UK | Group Escape Houses",
    description: "Discover luxury large holiday houses across the UK. Perfect for any group occasion.",
    url: "https://www.groupescapehouses.co.uk/large-holiday-houses",
    siteName: "Group Escape Houses",
    images: ["/og-image.jpg"],
    locale: "en_GB",
    type: "website",
  },
  alternates: {
    canonical: "https://www.groupescapehouses.co.uk/large-holiday-houses",
  },
};

export default function LargeHolidayHousesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
