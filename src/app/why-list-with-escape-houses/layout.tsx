import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Why List With Us | Owners Guide to Large Group Bookings",
  description: "Learn why property owners choose Escape Houses for luxury group listings. 0% commission, direct guest communication, and full control over your bookings.",
  keywords: ["list property group escape houses", "commission free property listing UK", "large group holiday home advertising", "luxury cottage owner platform"],
  openGraph: {
    title: "Why List With Us",

    description: "The UK's specialist platform for luxury large group properties. Reach high-intent guests directly and keep 100% of your revenue.",
    url: "https://www.groupescapehouses.co.uk/why-list-with-escape-houses",
  },
  alternates: {
    canonical: "https://www.groupescapehouses.co.uk/why-list-with-escape-houses",
  },
};

export default function WhyListWithUsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
