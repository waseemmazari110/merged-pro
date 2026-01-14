import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mobile Spa Treatments | Massage & Facials",
  description: "Luxury mobile spa treatments delivered to your party house. Professional therapists bring massages, facials and pamper packages. Book for 10+ and the bride goes free.",
  keywords: ["mobile spa treatments", "hen party spa", "massage at party house", "mobile beauty therapist"],
  openGraph: {
    title: "Mobile Spa & Beauty Treatments",
    description: "Professional spa treatments at your house. Massages, facials and pamper packages. Bride free on 10+ bookings.",
    url: "https://www.groupescapehouses.co.uk/spa-treatments",
  },
  alternates: {
    canonical: "https://www.groupescapehouses.co.uk/spa-treatments",
  },
};

export default function SpaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}