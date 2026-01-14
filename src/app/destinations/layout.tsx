import { Metadata } from "next";

export const metadata: Metadata = {
  title: "UK Hen Party Destinations | Best Cities & Regions",
  description: "Best UK group accommodation destinations. Brighton, Bath, Lake District and 30+ locations with luxury houses and activities.",
  keywords: "UK hen party destinations, hen do locations UK, group celebration destinations, Brighton hen party, Bath hen party, London hen party houses",
  alternates: {
    canonical: "https://www.groupescapehouses.co.uk/destinations",
  },
  openGraph: {
    title: "UK Hen Party Destinations",
    description: "Explore 30+ handpicked cities and regions across the UK for your group celebration.",
    url: "https://www.groupescapehouses.co.uk/destinations",
    siteName: "Group Escape Houses",
    images: [
      {
        url: "https://www.groupescapehouses.co.uk/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "UK Hen Party Destinations",
      },
    ],
    locale: "en_GB",
    type: "website",
  },
};

export default function DestinationsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
