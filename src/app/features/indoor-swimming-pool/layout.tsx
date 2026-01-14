import type { Metadata } from "next";

export const metadata: Metadata = {
  alternates: {
    canonical: "https://www.groupescapehouses.co.uk/features/indoor-swimming-pool",
  },
};

export default function IndoorSwimmingPoolLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
