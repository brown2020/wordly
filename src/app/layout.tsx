import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Wordly",
  description: "Kind of like Wordle but different",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
