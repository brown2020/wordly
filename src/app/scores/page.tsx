import Link from "next/link";
import { Suspense } from "react";
import ScoresClient from "@/components/ScoresClient";

export const metadata = {
  title: "Wordly - Score History",
  description: "View your Wordly game score history",
};

export default function ScoresPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Wordly Scores</h1>
          <Link
            href="/"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Back to Game
          </Link>
        </div>
      </header>

      <main className="flex-grow max-w-7xl w-full mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="border-4 border-dashed border-gray-200 rounded-lg p-4 bg-white">
            <Suspense
              fallback={<p className="text-center py-4">Loading scores...</p>}
            >
              <ScoresClient />
            </Suspense>
          </div>
        </div>
      </main>

      <footer className="bg-white">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-500">
            &copy; {new Date().getFullYear()} Wordly. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
