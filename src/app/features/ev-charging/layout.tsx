import type { Metadata } from "next";

export const metadata: Metadata = {
  alternates: {
    canonical: "https://www.groupescapehouses.co.uk/features/ev-charging",
  },
};

export default function EvChargingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
