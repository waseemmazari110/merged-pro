import type { Metadata } from "next";

export const metadata: Metadata = {
  alternates: {
    canonical: "https://www.groupescapehouses.co.uk/features/fishing-lake",
  },
};

export default function FishingLakeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
