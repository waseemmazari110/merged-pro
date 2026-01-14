import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Christmas Party Houses UK | Festive Group Breaks",
  description: "Christmas party houses for 8-30+ guests. Log fires, hot tubs & festive cheer. Christmas week, Boxing Day & New Year availability.",
  keywords: ["Christmas party houses UK", "festive group accommodation", "Christmas breaks for groups", "holiday houses Christmas"],
  openGraph: {
    title: "Christmas Group Accommodation | Group Escape Houses",
    description: "Festive party houses with log fires and hot tubs. Christmas week and New Year availability.",
    url: "https://www.groupescapehouses.co.uk/occasions/christmas",
  },
  alternates: {
    canonical: "https://www.groupescapehouses.co.uk/occasions/christmas",
  },
};

export default function ChristmasLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}