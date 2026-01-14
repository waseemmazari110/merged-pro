import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Luxury Group Houses to Rent UK",
  description: "Perfect for hen parties, weddings, celebrations, and group getaways across the UK. Large selection of party houses with hot tubs and pools.",
  alternates: {
    canonical: "https://www.groupescapehouses.co.uk/properties",
  },
};

export default function PropertiesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
