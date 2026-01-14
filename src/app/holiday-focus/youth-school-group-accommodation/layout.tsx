import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Youth and School Group Accommodation UK | Safe & Spacious",
  description: "Safe and spacious large houses for school trips, youth groups, and educational getaways. High-capacity accommodation with great facilities for supervised groups.",
  keywords: ["youth group accommodation UK", "school trip stay", "educational group houses", "large houses for youth groups"],
  openGraph: {
    title: "Youth and School Group Accommodation UK",
    description: "Safe, spacious and well-equipped houses for educational and youth group stays.",
    url: "https://www.groupescapehouses.co.uk/holiday-focus/youth-school-group-accommodation",
    siteName: "Group Escape Houses",
    images: ["/og-image.jpg"],
    locale: "en_GB",
    type: "website",
  },
  alternates: {
    canonical: "https://www.groupescapehouses.co.uk/holiday-focus/youth-school-group-accommodation",
  },
};

export default function YouthGroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
