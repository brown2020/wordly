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
      <body className="h-full bg-gray-50">
        <div className="min-h-screen flex flex-col">
          <main className="flex-grow flex flex-col">{children}</main>
          <footer className="bg-white py-4 border-t border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <p className="text-center text-sm text-gray-500">
                &copy; {new Date().getFullYear()} Wordly. All rights reserved.
              </p>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
