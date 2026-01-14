import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Group Adventure Holidays UK | Large Activity Houses",
  description: "Luxury group accommodation near the UK's best adventure spots. Perfect for hiking, biking, and water sports with friends and family. Sleeps 10-30 guests.",
  keywords: ["adventure holidays UK", "group activity stay", "outdoor adventure accommodation", "large houses for hikers"],
  openGraph: {
    title: "Group Adventure Holidays UK",
    description: "Discover luxury group houses perfect for your next adventure getaway in the UK.",
    url: "https://www.groupescapehouses.co.uk/holiday-focus/adventure-holidays",
    siteName: "Group Escape Houses",
    images: ["/og-image.jpg"],
    locale: "en_GB",
    type: "website",
  },
  alternates: {
    canonical: "https://www.groupescapehouses.co.uk/holiday-focus/adventure-holidays",
  },
};

export default function AdventureHolidaysLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
