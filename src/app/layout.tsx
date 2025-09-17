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
  themeColor: "#0ea5e9",
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
      <body className="h-full">
        <div className="min-h-screen flex flex-col relative">
          {/* Beautiful background gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-blue-50/30 -z-10" />

          <main className="flex-grow flex flex-col relative z-10">
            {children}
          </main>

          <footer className="relative z-10 bg-white/60 backdrop-blur-md border-t border-white/20 py-6">
            <div className="max-w-4xl mx-auto px-6">
              <div className="text-center">
                <p className="text-sm text-neutral-600 font-medium">
                  Made with <span className="text-red-500">♥</span> by the
                  Wordly Team
                </p>
                <p className="text-xs text-neutral-500 mt-1">
                  &copy; {new Date().getFullYear()} Wordly. All rights reserved.
                </p>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
