import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Easter Family Holiday Houses UK",
  description: "Perfect large houses for Easter family gatherings and spring breaks. Luxury group accommodation with gardens, hot tubs, and plenty of space for the whole family.",
  alternates: {
    canonical: "https://www.groupescapehouses.co.uk/easter",
  },
};

export default function EasterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
