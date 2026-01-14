import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us | Brighton Hen Party Specialists Since 2018",
  description: "Brighton-based hen party specialists since 2018. Arranging 500+ weekends annually. Every property personally inspected by our team.",
  keywords: ["about group escape houses", "hen party specialists UK", "Brighton accommodation team"],
  openGraph: {
    title: "Our Story & Team",

    description: "Brighton-based since 2018. Arranging 500+ hen weekends annually with personal service.",
    url: "https://www.groupescapehouses.co.uk/our-story",
  },
  alternates: {
    canonical: "https://www.groupescapehouses.co.uk/our-story",
  },
};

export default function OurStoryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}