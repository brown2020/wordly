import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Wordly - A daily word game",
  description:
    "Guess the hidden word in 6 tries. A new puzzle is available each day.",
  keywords: ["word game", "puzzle", "wordly", "vocabulary", "brain teaser"],
  authors: [{ name: "Wordly" }],
  openGraph: {
    title: "Wordly - A daily word game",
    description: "Guess the hidden word in 6 tries. A new puzzle is available each day.",
    url: "https://wordlyapp.vercel.app",
    siteName: "Wordly",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Wordly - A daily word game",
    description: "Guess the hidden word in 6 tries. A new puzzle is available each day.",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#121213" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full" suppressHydrationWarning>
      <body className="h-full overflow-hidden">{children}</body>
    </html>
  );
}
