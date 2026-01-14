import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Group Escape Houses | Get Your Free Quote | UK",
  description: "Get a free quote for your group stay. Fast response from our UK team. Accommodation and activities for groups of 6-30+.",
  keywords: ["hen party contact", "hen do enquiry", "group booking UK", "hen party quote", "hen weekend planning"],
  openGraph: {
    title: "Contact Group Escape Houses - Group Accommodation UK",
    description: "Get a free quote for your group stay. Fast response from our UK team. Accommodation and activities for groups of 6-30+.",
    url: "https://www.groupescapehouses.co.uk/contact",
    type: "website",
  },
  alternates: {
    canonical: "https://www.groupescapehouses.co.uk/contact",
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
