import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "House Styles & Features | Manors & Castles",
  description: "Filter party houses by style and features. Manors, castles, cottages. Search by hot tubs, pools and games rooms.",
  keywords: ["luxury manor houses UK", "party houses with hot tubs", "houses with pools", "castles for hire UK", "luxury cottages"],
  openGraph: {
    title: "House Styles & Premium Features",

    description: "Filter by architectural style or feature. Manors, castles, hot tubs, pools and entertainment.",
    url: "https://www.groupescapehouses.co.uk/house-styles-and-features",
  },
  alternates: {
    canonical: "https://www.groupescapehouses.co.uk/house-styles-and-features",
  },
};

export default function HouseStylesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}