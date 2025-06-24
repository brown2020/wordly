"use client";

import { useState, useEffect } from "react";
import { formatDistanceToNow } from "date-fns";

type ScoreData = {
  score: number;
  date: string;
  attempts: number;
  word: string;
};

export default function ScoresClient() {
  const [scores, setScores] = useState<ScoreData[]>([]);

  // Load scores from localStorage
  useEffect(() => {
    try {
      const savedScores = localStorage.getItem("wordly-scores");
      if (savedScores) {
        setScores(JSON.parse(savedScores));
      }
    } catch (error) {
      console.error("Error loading scores:", error);
    }
  }, []);

  if (scores.length === 0) {
    return (
      <div className="text-center py-10">
        <h3 className="mt-2 text-lg font-medium text-gray-900">
          No scores yet
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          Play some games to see your score history here.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Date
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Word
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Guesses
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Score
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {scores
            .slice()
            .reverse()
            .map((score, index) => (
              <tr
                key={index}
                className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDistanceToNow(new Date(score.date), {
                    addSuffix: true,
                  })}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {score.word}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {score.attempts}/6
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {score.score}
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}
