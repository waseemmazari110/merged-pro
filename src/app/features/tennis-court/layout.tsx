import type { Metadata } from "next";

export const metadata: Metadata = {
  alternates: {
    canonical: "https://www.groupescapehouses.co.uk/features/tennis-court",
  },
};

export default function TennisCourtLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
