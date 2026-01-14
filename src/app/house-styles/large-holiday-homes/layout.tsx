import type { Metadata } from "next";

export const metadata: Metadata = {
  alternates: {
    canonical: "https://www.groupescapehouses.co.uk/house-styles/large-holiday-homes",
  },
};

export default function LargeHolidayHomesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
