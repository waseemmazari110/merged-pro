import type { Metadata } from "next";

export const metadata: Metadata = {
  alternates: {
    canonical: "https://www.groupescapehouses.co.uk/features/direct-beach-access",
  },
};

export default function DirectBeachAccessLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
