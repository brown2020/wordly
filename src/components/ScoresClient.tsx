"use client";

import { formatDistanceToNow } from "date-fns";
import { useScores } from "@/hooks/useScores";
import { GAME } from "@/constants/constants";

export default function ScoresClient() {
  const { scores, loading } = useScores();

  if (loading) {
    return <p className="text-center py-4">Loading scores...</p>;
  }

  if (scores.length === 0) {
    return (
      <div className="text-center py-10">
        <h3 className="mt-2 text-lg font-medium text-neutral-900">
          No scores yet
        </h3>
        <p className="mt-1 text-sm text-neutral-500">
          Play some games to see your score history here.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-neutral-200">
        <thead className="bg-neutral-50">
          <tr>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider"
            >
              Date
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider"
            >
              Word
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider"
            >
              Guesses
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider"
            >
              Score
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-neutral-200">
          {scores
            .slice()
            .reverse()
            .map((score, index) => (
              <tr
                key={score.date}
                className={index % 2 === 0 ? "bg-white" : "bg-neutral-50"}
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">
                  {formatDistanceToNow(new Date(score.date), {
                    addSuffix: true,
                  })}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-neutral-900">
                  {score.word}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">
                  {score.attempts}/{GAME.MAX_ATTEMPTS}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">
                  {score.score}
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}
