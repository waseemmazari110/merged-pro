import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hen Party Houses UK | Verified Properties 8-30 Guests",
  description: "Personally inspected hen party houses sleeping 8-30+ guests. Hot tubs, BBQ areas & entertainment spaces. Weekend & midweek availability.",
  keywords: ["hen party houses", "hen weekend accommodation UK", "hen do houses", "large group hen party venues"],
  openGraph: {
    title: "Verified Hen Party Houses",

    description: "Handpicked properties for hen celebrations. Each house inspected, verified and ready to party.",
    url: "https://www.groupescapehouses.co.uk/hen-party-houses",
  },
  alternates: {
    canonical: "https://www.groupescapehouses.co.uk/hen-party-houses",
  },
};

export default function HenPartyHousesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}