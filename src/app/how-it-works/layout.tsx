import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "How It Works | Booking Your Group Getaway | Group Escape Houses",
  description: "Learn how to book the perfect large group house for your hen party, celebration or family reunion. Simple, transparent and direct booking process.",
  keywords: ["how to book group house", "group booking process", "hen party planning guide", "large house rental help"],
  openGraph: {
    title: "How It Works | Booking Your Group Getaway",
    description: "Your step-by-step guide to finding and booking the perfect luxury group house in the UK.",
    url: "https://www.groupescapehouses.co.uk/how-it-works",
    siteName: "Group Escape Houses",
    images: ["/og-image.jpg"],
    locale: "en_GB",
    type: "website",
  },
  alternates: {
    canonical: "https://www.groupescapehouses.co.uk/how-it-works",
  },
};

export default function HowItWorksLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
