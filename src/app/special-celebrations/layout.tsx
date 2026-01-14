import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Party Houses for Special Celebrations | Milestone Birthdays & Events",
  description: "Party houses for birthdays, anniversaries and special occasions. Hot tubs, entertainment spaces and catering options.",
  keywords: ["special celebration houses", "milestone birthday venues", "anniversary accommodation", "party houses UK celebrations"],
  openGraph: {
    title: "Special Celebration Party Houses",

    description: "Milestone birthdays, anniversaries and special occasions. Luxury houses with entertainment.",
    url: "https://www.groupescapehouses.co.uk/special-celebrations",
  },
  alternates: {
    canonical: "https://www.groupescapehouses.co.uk/special-celebrations",
  },
};

export default function SpecialCelebrationsRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
