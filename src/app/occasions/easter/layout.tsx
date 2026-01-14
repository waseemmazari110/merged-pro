import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Easter Party Houses UK | Spring Celebration Venues",
  description: "Easter party houses for family celebrations. Luxury properties sleeping 8-30 guests with hot tubs, pools & countryside views.",
  keywords: ["Easter houses", "spring break accommodation", "Easter holiday rental", "family Easter breaks"],
  openGraph: {
    title: "Easter Holiday Houses | Group Escape Houses",
    description: "Celebrate Easter in luxury group accommodation. Perfect for families and friends.",
    url: "https://www.groupescapehouses.co.uk/occasions/easter",
  },
  alternates: {
    canonical: "https://www.groupescapehouses.co.uk/occasions/easter",
  },
};

export default function EasterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}