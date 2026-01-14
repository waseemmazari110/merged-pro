import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Corporate Offsite & Business Retreat Accommodation UK",
  description: "Luxury large houses for corporate offsites, team building, and business retreats. High-speed WiFi, meeting spaces, and professional facilities for groups.",
  keywords: ["corporate offsite accommodation", "business retreat venues UK", "team building houses", "large group business stay"],
  openGraph: {
    title: "Corporate Offsite & Business Retreat Accommodation UK",
    description: "Professional and luxury spaces for your next team offsite or corporate retreat.",
    url: "https://www.groupescapehouses.co.uk/holiday-focus/business-offsite-corporate-accommodation",
    siteName: "Group Escape Houses",
    images: ["/og-image.jpg"],
    locale: "en_GB",
    type: "website",
  },
  alternates: {
    canonical: "https://www.groupescapehouses.co.uk/holiday-focus/business-offsite-corporate-accommodation",
  },
};

export default function BusinessOffsiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
