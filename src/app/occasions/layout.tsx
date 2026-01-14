import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Party Houses by Occasion | Hen Parties & Celebrations",
  description: "Party houses for every celebration. Hen parties, birthdays, reunions, Christmas and New Year. Find the perfect house for your occasion.",
  keywords: ["hen party houses", "birthday party houses UK", "wedding accommodation", "celebration venues", "Christmas party houses"],
  openGraph: {
    title: "Properties for Every Occasion",

    description: "Hen parties, birthdays, reunions, weddings and seasonal celebrations. Find your perfect match.",
    url: "https://www.groupescapehouses.co.uk/occasions",
  },
  alternates: {
    canonical: "https://www.groupescapehouses.co.uk/occasions",
  },
};

export default function OccasionsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}