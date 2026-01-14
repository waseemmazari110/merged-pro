import type { Metadata } from "next";

export const metadata: Metadata = {
  alternates: {
    canonical: "https://www.groupescapehouses.co.uk/house-styles/country-houses",
  },
};

export default function CountryHousesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
