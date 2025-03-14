"use client";

import { useRouter } from "next/navigation";
import { Suspense } from "react";
import ScoresClient from "@/components/ScoresClient";

export default function ScoresModal() {
  const router = useRouter();

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-75 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900">Score History</h2>
          <button
            onClick={() => router.back()}
            className="text-gray-400 hover:text-gray-500"
            aria-label="Close"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <div className="flex-1 overflow-auto p-6">
          <Suspense
            fallback={<p className="text-center py-4">Loading scores...</p>}
          >
            <ScoresClient />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
