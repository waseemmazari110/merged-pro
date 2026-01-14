import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Multi-Generational Holiday Houses UK | All Ages Welcome",
  description: "Perfect large houses for multi-generational family holidays. Accessible ground floor bedrooms, safe gardens, and entertainment for all ages from toddlers to grandparents.",
  keywords: ["multi generational holiday houses", "family reunion accommodation", "large houses for all ages", "ground floor bedroom holiday home"],
  openGraph: {
    title: "Multi-Generational Holiday Houses UK",
    description: "Space for the whole family to celebrate together in comfort and style.",
    url: "https://www.groupescapehouses.co.uk/holiday-focus/multi-generational-holidays",
    siteName: "Group Escape Houses",
    images: ["/og-image.jpg"],
    locale: "en_GB",
    type: "website",
  },
  alternates: {
    canonical: "https://www.groupescapehouses.co.uk/holiday-focus/multi-generational-holidays",
  },
};

export default function MultiGenerationalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
