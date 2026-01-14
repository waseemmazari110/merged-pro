import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing Guide | Weekend & Midweek Rates",
  description: "Clear hen party house pricing. Weekend from £69pp, midweek from £49pp. 25% deposit, balance 8 weeks before. No hidden fees.",
  keywords: ["hen party house prices", "group accommodation pricing", "weekend rates", "transparent booking costs"],
  openGraph: {
    title: "Transparent Pricing & Payment Terms",

    description: "Clear pricing from £49pp with no hidden fees. Deposits and payment terms explained.",
    url: "https://www.groupescapehouses.co.uk/pricing",
  },
  alternates: {
    canonical: "https://www.groupescapehouses.co.uk/pricing",
  },
};

export default function PricingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}