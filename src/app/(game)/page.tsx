"use client";

import dynamic from "next/dynamic";
import Loading from "@/app/loading";

// Dynamically import the client component
const WordlyMain = dynamic(() => import("@/components/WordlyMain"), {
  loading: () => <Loading />,
  ssr: true, // Enable SSR for better performance
});

export default function HomePage() {
  return <WordlyMain />;
}
