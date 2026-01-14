import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Houses with Cinema Rooms UK | Private Screening",
  description: "Luxury homes with private cinema rooms. Perfect for movie nights during hen parties. Seating for 10+ guests with big screens.",
  keywords: ["houses with cinema rooms UK", "party houses with movie room", "private screening rooms", "home cinema group accommodation"],
  openGraph: {
    title: "Party Houses with Cinema Rooms",

    description: "Private screening rooms with big screens and surround sound. Perfect for movie night relaxation.",
    url: "https://www.groupescapehouses.co.uk/features/cinema-room",
  },
  alternates: {
    canonical: "https://www.groupescapehouses.co.uk/features/cinema-room",
  },
};

export default function CinemaRoomLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}