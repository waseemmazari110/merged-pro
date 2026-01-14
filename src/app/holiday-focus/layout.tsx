import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Group Holiday Focus & Inspiration | Group Escape Houses",
  description: "Explore different group holiday styles: from rural retreats and adventure holidays to corporate offsites and girls' weekend getaways across the UK.",
  keywords: ["group holiday ideas UK", "rural retreats for groups", "corporate offsite accommodation", "adventure holidays UK"],
  openGraph: {
    title: "Group Holiday Focus & Inspiration",
    description: "Discover the perfect focus for your next group getaway. Luxury houses for every occasion.",
    url: "https://www.groupescapehouses.co.uk/holiday-focus",
    siteName: "Group Escape Houses",
    images: ["/og-image.jpg"],
    locale: "en_GB",
    type: "website",
  },
  alternates: {
    canonical: "https://www.groupescapehouses.co.uk/holiday-focus",
  },
};

export default function HolidayFocusLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
