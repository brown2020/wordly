"use client";

import { useState, useEffect } from "react";

type GameStats = {
  totalGames: number;
  wins: number;
  currentStreak: number;
  maxStreak: number;
  guessDistribution: {
    [key: number]: number;
  };
};

interface StatsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function StatsModal({ isOpen, onClose }: StatsModalProps) {
  const [stats, setStats] = useState<GameStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      fetch("/api/stats")
        .then((res) => res.json())
        .then((data) => {
          setStats(data);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching stats:", error);
          setLoading(false);
        });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const winPercentage = stats
    ? Math.round((stats.wins / Math.max(1, stats.totalGames)) * 100)
    : 0;

  // Find the max value in the distribution to scale the bars
  const maxDistribution = stats
    ? Math.max(...Object.values(stats.guessDistribution))
    : 0;

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-75 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full overflow-hidden">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900">Statistics</h2>
          <button
            onClick={onClose}
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

        <div className="p-6">
          {loading ? (
            <div className="flex justify-center">
              <div className="animate-pulse h-40 w-full bg-gray-200 rounded"></div>
            </div>
          ) : stats ? (
            <>
              <div className="grid grid-cols-4 gap-4 mb-6">
                <div className="flex flex-col items-center">
                  <span className="text-2xl font-bold">{stats.totalGames}</span>
                  <span className="text-xs text-gray-500">Played</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-2xl font-bold">{winPercentage}%</span>
                  <span className="text-xs text-gray-500">Win %</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-2xl font-bold">
                    {stats.currentStreak}
                  </span>
                  <span className="text-xs text-gray-500">Current Streak</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-2xl font-bold">{stats.maxStreak}</span>
                  <span className="text-xs text-gray-500">Max Streak</span>
                </div>
              </div>

              <h3 className="text-lg font-medium mb-3">Guess Distribution</h3>
              <div className="space-y-2">
                {[1, 2, 3, 4, 5, 6].map((guessNumber) => {
                  const count = stats.guessDistribution[guessNumber] || 0;
                  const percentage =
                    maxDistribution > 0 ? (count / maxDistribution) * 100 : 0;

                  return (
                    <div
                      key={guessNumber}
                      className="flex items-center space-x-2"
                    >
                      <div className="w-4 text-gray-600">{guessNumber}</div>
                      <div className="flex-1 h-6 bg-gray-200 rounded-sm overflow-hidden">
                        <div
                          className="h-full bg-green-600 flex items-center justify-end px-2"
                          style={{ width: `${Math.max(5, percentage)}%` }}
                        >
                          {count > 0 && (
                            <span className="text-white text-xs font-medium">
                              {count}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          ) : (
            <p className="text-center text-gray-500">
              No statistics available yet. Play some games!
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
