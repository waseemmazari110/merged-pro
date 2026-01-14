import type { Metadata } from "next";

export const metadata: Metadata = {
  alternates: {
    canonical: "https://www.groupescapehouses.co.uk/booking-terms",
  },
};

export default function BookingTermsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
