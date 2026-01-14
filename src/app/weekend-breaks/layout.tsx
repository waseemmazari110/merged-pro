import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Weekend Breaks for Groups | Short Break Houses Sleeping 8-30+",
  description: "Weekend group getaways in luxury houses across the UK. 2-3 night breaks with hot tubs, games rooms and premium facilities. From £69pp per night.",
  keywords: ["group weekend breaks UK", "short breaks for groups", "weekend getaway houses", "group weekend accommodation"],
  openGraph: {
    title: "Group Weekend Breaks & Short Stays",

    description: "Luxury weekend breaks for groups. 2-3 nights from £69pp with hot tubs and entertainment.",
    url: "https://www.groupescapehouses.co.uk/weekend-breaks",
  },
  alternates: {
    canonical: "https://www.groupescapehouses.co.uk/weekend-breaks",
  },
};

export default function WeekendBreaksRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
