import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Wedding Accommodation UK | Guest Houses for Groups",
  description: "Exclusive-use houses for wedding parties & guests. Space for getting ready, celebrations & post-wedding brunches. Sleep groups together.",
  keywords: ["wedding accommodation UK", "wedding party houses", "exclusive use wedding venues", "wedding guest accommodation"],
  metadataBase: new URL("https://www.groupescapehouses.co.uk"),
  openGraph: {
    title: "Wedding Party Accommodation | Group Escape Houses",
    description: "Exclusive houses for wedding parties and guests. Getting ready space, celebrations and brunches.",
    url: "https://www.groupescapehouses.co.uk/occasions/weddings",
    siteName: "Group Escape Houses",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Wedding Party Accommodation | Group Escape Houses",
    description: "Exclusive houses for wedding parties and guests. Getting ready space, celebrations and brunches.",
  },
  alternates: {
    canonical: "https://www.groupescapehouses.co.uk/occasions/weddings",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function WeddingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}