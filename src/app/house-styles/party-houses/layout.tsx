import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Party Houses UK | Entertainment Venues for Groups",
  description: "Purpose-built party houses with sound systems, hot tubs & entertainment facilities. Relaxed noise policies for hen parties & birthdays.",
  keywords: ["party houses UK", "celebration venues", "entertainment houses", "group party accommodation"],
  openGraph: {
    title: "Purpose-Built Party Houses",

    description: "Designed for celebrations with entertainment facilities and relaxed noise policies.",
    url: "https://www.groupescapehouses.co.uk/house-styles/party-houses",
  },
  alternates: {
    canonical: "https://www.groupescapehouses.co.uk/house-styles/party-houses",
  },
};

export default function PartyHousesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}