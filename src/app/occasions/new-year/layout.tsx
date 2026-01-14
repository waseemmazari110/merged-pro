import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "NYE Party Houses UK | New Year's Eve Group Venues",
  description: "Ring in the New Year at private party houses. Hot tubs, champagne & celebrations from £99pp. Full NYE week availability.",
  keywords: ["New Year party houses UK", "NYE group accommodation", "New Year's Eve houses", "Hogmanay group houses"],
  openGraph: {
    title: "New Year's Eve Party Houses | Group Escape Houses",
    description: "Celebrate NYE in private houses. Hot tubs, celebrations and champagne from £99pp.",
    url: "https://www.groupescapehouses.co.uk/occasions/new-year",
  },
  alternates: {
    canonical: "https://www.groupescapehouses.co.uk/occasions/new-year",
  },
};

export default function NewYearLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}