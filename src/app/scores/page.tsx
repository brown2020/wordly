import Link from "next/link";
import { Suspense } from "react";
import ScoresClient from "@/components/ScoresClient";
import { BUTTON } from "@/constants/constants";

export const metadata = {
  title: "Wordly - Score History",
  description: "View your Wordly game score history",
};

export default function ScoresPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-neutral-200/60">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold gradient-text">Wordly Scores</h1>
          <Link href="/" className={BUTTON.primary}>
            Back to Game
          </Link>
        </div>
      </header>

      <main className="flex-grow max-w-7xl w-full mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="card p-4">
            <Suspense
              fallback={<p className="text-center py-4">Loading scores...</p>}
            >
              <ScoresClient />
            </Suspense>
          </div>
        </div>
      </main>
    </div>
  );
}
