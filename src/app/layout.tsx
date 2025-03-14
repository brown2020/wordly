import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Wordly - A Word Guessing Game",
  description:
    "Challenge your vocabulary with Wordly, a fun word guessing game similar to Wordle",
  keywords: ["word game", "puzzle", "wordle", "vocabulary", "brain teaser"],
  authors: [{ name: "Wordly Team" }],
  openGraph: {
    title: "Wordly - A Word Guessing Game",
    description:
      "Challenge your vocabulary with Wordly, a fun word guessing game",
    url: "https://wordly-game.vercel.app",
    siteName: "Wordly",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Wordly - A Word Guessing Game",
    description:
      "Challenge your vocabulary with Wordly, a fun word guessing game",
  },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full bg-gray-50">{children}</body>
    </html>
  );
}
