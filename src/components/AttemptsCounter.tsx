import React from "react";

interface AttemptsCounterProps {
  attempts: number;
  maxAttempts: number;
}

export function AttemptsCounter({
  attempts,
  maxAttempts,
}: AttemptsCounterProps) {
  return (
    <div className="mt-6 text-center">
      <div className="inline-flex items-center rounded-full bg-neutral-100 px-4 py-2">
        <span className="text-sm font-medium text-neutral-600">Attempts:</span>
        <span className="ml-2 text-sm font-bold text-neutral-800">
          {attempts}/{maxAttempts}
        </span>
      </div>
    </div>
  );
}
