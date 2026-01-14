import type { Metadata } from "next";

export const metadata: Metadata = {
  alternates: {
    canonical: "https://www.groupescapehouses.co.uk/house-styles/large-cottages",
  },
};

export default function LargeCottagesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
