import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Houses with Games Rooms UK | Party Entertainment",
  description: "Party houses with games rooms. Pool tables, table tennis & arcade games. Perfect for competitive hen party fun & group entertainment.",
  keywords: ["houses with games rooms UK", "party houses with pool tables", "entertainment rooms", "group houses with games"],
  openGraph: {
    title: "Houses with Games Rooms & Entertainment",

    description: "Pool tables, table tennis and entertainment facilities. Perfect for competitive hen party fun.",
    url: "https://www.groupescapehouses.co.uk/features/games-room",
  },
  alternates: {
    canonical: "https://www.groupescapehouses.co.uk/features/games-room",
  },
};

export default function GamesRoomLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}