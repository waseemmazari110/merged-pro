import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Houses with Pools UK | Indoor & Outdoor",
  description: "Properties with private swimming pools. Indoor heated & outdoor options. Perfect for group celebrations & hen parties across the UK.",
  keywords: ["houses with pools UK", "party houses with swimming pool", "group accommodation pool", "houses with indoor pool"],
  openGraph: {
    title: "Houses with Swimming Pools for Groups",

    description: "Indoor heated and outdoor pools. Perfect for active hen weekends and pool parties.",
    url: "https://www.groupescapehouses.co.uk/features/swimming-pool",
  },
  alternates: {
    canonical: "https://www.groupescapehouses.co.uk/features/swimming-pool",
  },
};

export default function SwimmingPoolLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}