import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Girls Weekend Getaways UK | Luxury Group Houses",
  description: "Plan the ultimate girls' weekend away in the UK. Luxury houses with hot tubs, pools, and stylish interiors. Perfect for birthday celebrations and reunions.",
  keywords: ["girls weekend getaways UK", "girls trip accommodation", "ladies weekend away houses", "luxury girls weekend stay"],
  openGraph: {
    title: "Girls Weekend Getaways UK",
    description: "Discover the perfect setting for your next stylish girls' weekend away.",
    url: "https://www.groupescapehouses.co.uk/holiday-focus/girls-weekend-getaways",
    siteName: "Group Escape Houses",
    images: ["/og-image.jpg"],
    locale: "en_GB",
    type: "website",
  },
  alternates: {
    canonical: "https://www.groupescapehouses.co.uk/holiday-focus/girls-weekend-getaways",
  },
};

export default function GirlsWeekendLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
