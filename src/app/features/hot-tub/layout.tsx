import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Houses with Hot Tubs UK | Party Homes",
  description: "Group houses with private hot tubs. Perfect for hen parties. Sleeps 8-30+ guests. Weekend & midweek availability across the UK.",
  keywords: ["houses with hot tubs UK", "party houses hot tub", "group accommodation hot tub", "hen party houses with hot tubs"],
  openGraph: {
    title: "Group Houses with Private Hot Tubs",

    description: "Properties with wood-fired and electric hot tubs. Scenic views, privacy and perfect hen party relaxation.",
    url: "https://www.groupescapehouses.co.uk/features/hot-tub",
  },
  alternates: {
    canonical: "https://www.groupescapehouses.co.uk/features/hot-tub",
  },
};

export default function HotTubLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}