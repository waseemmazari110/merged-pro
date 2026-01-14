import type { Metadata } from "next";

export const metadata: Metadata = {
  alternates: {
    canonical: "https://www.groupescapehouses.co.uk/house-styles/luxury-dog-friendly-cottages",
  },
};

export default function LuxuryDogFriendlyCottagesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
