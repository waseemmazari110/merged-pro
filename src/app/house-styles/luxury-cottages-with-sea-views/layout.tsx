import type { Metadata } from "next";

export const metadata: Metadata = {
  alternates: {
    canonical: "https://www.groupescapehouses.co.uk/house-styles/luxury-cottages-with-sea-views",
  },
};

export default function LuxuryCottagesSeaViewsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
