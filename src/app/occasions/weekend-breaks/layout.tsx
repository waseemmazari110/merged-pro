import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Weekend Breaks for Groups | 2-3 Night Stays UK",
  description: "2-3 night weekend breaks in party houses. Friday arrivals, flexible check-outs & midweek discounts. From £69pp for quick getaways.",
  keywords: ["weekend breaks for groups UK", "short stay party houses", "Friday to Sunday breaks", "group weekend accommodation"],
  openGraph: {
    title: "Group Weekend Breaks | Group Escape Houses",
    description: "2-3 night stays with Friday arrivals. Quick getaways and mini-celebrations from £69pp.",
    url: "https://www.groupescapehouses.co.uk/occasions/weekend-breaks",
  },
  alternates: {
    canonical: "https://www.groupescapehouses.co.uk/occasions/weekend-breaks",
  },
};

export default function WeekendBreaksLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}