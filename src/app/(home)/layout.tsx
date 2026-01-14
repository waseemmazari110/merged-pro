import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Large Group Accommodation UK",
  description: "Discover large group accommodation and escape houses across the UK. Sleeps 10 to 30 guests. Book direct with property owners.",
  keywords: "large group accommodation UK, group accommodation UK, escape houses UK, large holiday houses UK, hen party houses, houses with hot tubs, party houses for groups, luxury group houses, weekend break houses, large cottages UK, group holiday homes, hen do accommodation",
  authors: [{ name: 'Group Escape Houses' }],
  creator: 'Group Escape Houses',
  publisher: 'Group Escape Houses',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: 'https://www.groupescapehouses.co.uk',
  },
  openGraph: {
    type: 'website',
    locale: 'en_GB',
    url: 'https://www.groupescapehouses.co.uk',
    title: "Large Group Accommodation UK",
    description: "Discover large group accommodation and escape houses across the UK. Sleeps 10 to 30 guests. Book direct with property owners.",
    siteName: 'Group Escape Houses',
    images: [
      {
        url: 'https://www.groupescapehouses.co.uk/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Group Escape Houses - Large Group Accommodation UK',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "Large Group Accommodation UK",
    description: "Discover large group accommodation and escape houses across the UK. Sleeps 10 to 30 guests. Book direct with property owners.",
    images: ['https://www.groupescapehouses.co.uk/og-image.jpg'],
  },
  other: {
    'format-detection': 'telephone=no, address=no, email=no',
  },
};

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}