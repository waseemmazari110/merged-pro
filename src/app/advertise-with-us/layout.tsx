import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Advertise Your Group Property | Fixed Fee Listings",
  description: "Advertise your large group house or cottage to UK travellers. Fixed fee listings, no commission, direct enquiries and availability syncing.",
  keywords: ["list property", "advertise accommodation", "property owner", "fixed fee listings", "group accommodation platform", "no commission"],
  openGraph: {
    title: "Advertise Your Group Property | Fixed Fee Listings",
    description: "Advertise your large group house or cottage to UK travellers. Fixed fee listings, no commission, direct enquiries and availability syncing.",
    url: "https://www.groupescapehouses.co.uk/advertise-with-us",
  },
  alternates: {
    canonical: "https://www.groupescapehouses.co.uk/advertise-with-us",
  },
};

export default function AdvertiseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}