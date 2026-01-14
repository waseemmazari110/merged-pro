import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Retreat Venues UK | Wellness & Creative Group Stays",
  description: "Inspiring large houses for wellness retreats, yoga workshops, and creative group getaways. Peaceful locations with space for activities and group dining.",
  keywords: ["retreat venues UK", "wellness retreat accommodation", "yoga retreat houses", "creative retreat spaces"],
  openGraph: {
    title: "Retreat Venues UK | Wellness & Creative Group Stays",
    description: "Find the perfect peaceful setting for your next group retreat or workshop.",
    url: "https://www.groupescapehouses.co.uk/holiday-focus/retreat-venues",
    siteName: "Group Escape Houses",
    images: ["/og-image.jpg"],
    locale: "en_GB",
    type: "website",
  },
  alternates: {
    canonical: "https://www.groupescapehouses.co.uk/holiday-focus/retreat-venues",
  },
};

export default function RetreatVenuesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
