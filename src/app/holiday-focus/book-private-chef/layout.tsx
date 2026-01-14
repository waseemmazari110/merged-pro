import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Book a Private Chef for Your Group Stay | Luxury Catering",
  description: "Enhance your group holiday with a professional private chef. From celebratory dinners to fully catered weekends, enjoy restaurant-quality food in your holiday home.",
  keywords: ["private chef for group stay", "holiday home catering", "personal chef hire UK", "group dinner catering"],
  openGraph: {
    title: "Book a Private Chef for Your Group Stay",
    description: "Professional in-house catering services for your group holiday or celebration.",
    url: "https://www.groupescapehouses.co.uk/holiday-focus/book-private-chef",
    siteName: "Group Escape Houses",
    images: ["/og-image.jpg"],
    locale: "en_GB",
    type: "website",
  },
  alternates: {
    canonical: "https://www.groupescapehouses.co.uk/holiday-focus/book-private-chef",
  },
};

export default function BookPrivateChefLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
