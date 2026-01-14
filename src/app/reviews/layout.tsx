import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Guest Reviews | 3,000+ Five-Star Testimonials",
  description: "3,000+ verified five-star reviews from hen parties. Real photos, ratings & honest feedback from celebrations across the UK.",
  keywords: ["hen party house reviews", "group escape houses reviews", "party house testimonials UK", "5 star hen accommodation"],
  openGraph: {
    title: "3,000+ Verified Guest Reviews",

    description: "Real testimonials with photos from hen parties across the UK. Average rating 4.9/5.",
    url: "https://www.groupescapehouses.co.uk/reviews",
  },
  alternates: {
    canonical: "https://www.groupescapehouses.co.uk/reviews",
  },
};

export default function ReviewsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}