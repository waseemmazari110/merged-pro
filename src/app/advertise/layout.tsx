import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Advertise Your Group Property | Fixed Fee Listings",

  description: "Advertise your large group house or cottage to UK travellers. Fixed fee listings, no commission, direct enquiries and availability syncing.",
  keywords: ["advertise group property", "list large holiday home UK", "commission free property advertising", "group escape houses for owners"],
  openGraph: {
    title: "Advertise Your Group Property | Fixed Fee Listings",

    description: "Advertise your large group house or cottage to UK travellers. Fixed fee listings, no commission, direct enquiries and availability syncing.",
    type: "website",
    url: "https://www.groupescapehouses.co.uk/advertise",
  },
  alternates: {
    canonical: "https://www.groupescapehouses.co.uk/advertise",
  },
};

export default function AdvertiseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
