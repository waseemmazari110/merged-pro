import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Special Celebration Houses | Birthdays, Anniversaries & Reunions",
  description: "Celebrate milestones in style. Luxury houses for birthdays, anniversaries, reunions and special occasions. Accommodation for 8-30 guests across the UK.",
  keywords: ["birthday party houses", "celebration venues", "anniversary accommodation", "family reunion houses"],
  openGraph: {
    title: "Special Celebrations | Group Escape Houses",
    description: "Luxury houses for birthdays, anniversaries and special occasions.",
    url: "https://www.groupescapehouses.co.uk/occasions/special-celebrations",
  },
  alternates: {
    canonical: "https://www.groupescapehouses.co.uk/occasions/special-celebrations",
  },
};

export default function SpecialCelebrationsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
