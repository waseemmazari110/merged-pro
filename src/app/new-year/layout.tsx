import { Metadata } from "next";

export const metadata: Metadata = {
  title: "New Year's Eve Party Houses UK",

  description: "Ring in the New Year with our selection of luxury party houses. Epic group accommodation with plenty of space for celebrations, hot tubs, and games rooms.",
  alternates: {
    canonical: "https://www.groupescapehouses.co.uk/new-year",
  },
};

export default function NewYearLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
