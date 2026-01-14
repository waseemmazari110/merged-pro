import type { Metadata } from "next";

export const metadata: Metadata = {
  alternates: {
    canonical: "https://www.groupescapehouses.co.uk/house-styles/unusual-and-quirky",
  },
};

export default function UnusualAndQuirkyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
