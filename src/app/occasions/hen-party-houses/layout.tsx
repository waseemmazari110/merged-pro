import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hen Do Houses UK | Celebration Venues for Groups",
  description: "Handpicked hen do houses across the UK. Hot tubs, pools, games rooms sleeping 8-30+ guests. Weekend & midweek. Free instant quotes.",
  keywords: ["hen party houses", "hen weekend accommodation", "hen do houses UK", "large group hen venues"],
  openGraph: {
    title: "Hen Party Houses UK | Group Escape Houses",
    description: "Luxury hen party accommodation with hot tubs and pools. 8-30+ guests.",
    url: "https://www.groupescapehouses.co.uk/occasions/hen-party-houses",
  },
  alternates: {
    canonical: "https://www.groupescapehouses.co.uk/occasions/hen-party-houses",
  },
};

export default function OccasionsHenPartyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}