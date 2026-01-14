import type { Metadata } from "next";

export const metadata: Metadata = {
  alternates: {
    canonical: "https://www.groupescapehouses.co.uk/house-styles/family-holidays",
  },
};

export default function FamilyHolidaysLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
