"use client";

import { useEffect } from "react";
import Link from "next/link";
import { BUTTON } from "@/constants/constants";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-neutral-50 p-4">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md text-center">
        <h2 className="text-2xl font-bold text-red-600 mb-4">
          Something went wrong!
        </h2>
        <p className="mb-6 text-neutral-600">
          We&apos;re sorry, but there was an error loading the game. Please try
          again.
        </p>
        <div className="space-y-4">
          <button
            onClick={() => reset()}
            className={`${BUTTON.primary} w-full`}
          >
            Try again
          </button>
          <Link
            href="/"
            className={`${BUTTON.secondary} block w-full text-center`}
          >
            Return to home
          </Link>
        </div>
      </div>
    </div>
  );
}
