"use client";

import { useMemo } from "react";
import { useScores } from "@/hooks/useScores";
import { calculateStats } from "@/utils/stats-utils";
import { Modal } from "./ui/Modal";
import { GAME } from "@/constants/constants";

interface StatsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function StatsModal({ isOpen, onClose }: StatsModalProps) {
  const { scores, loading } = useScores();

  const stats = useMemo(() => {
    if (!scores.length) return null;
    return calculateStats(scores);
  }, [scores]);

  const winPercentage = stats
    ? Math.round((stats.wins / Math.max(1, stats.totalGames)) * 100)
    : 0;

  const maxDistribution = stats
    ? Math.max(...Object.values(stats.guessDistribution))
    : 0;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Statistics">
      {loading ? (
        <div className="flex justify-center">
          <div className="h-40 w-full animate-pulse rounded bg-neutral-200" />
        </div>
      ) : stats ? (
        <>
          <div className="grid grid-cols-4 gap-4 mb-6">
            <StatItem value={stats.totalGames} label="Played" />
            <StatItem value={`${winPercentage}%`} label="Win %" />
            <StatItem value={stats.currentStreak} label="Current Streak" />
            <StatItem value={stats.maxStreak} label="Max Streak" />
          </div>

          <h3 className="text-lg font-medium mb-3">Guess Distribution</h3>
          <div className="space-y-2">
            {Array.from({ length: GAME.MAX_ATTEMPTS }, (_, i) => i + 1).map(
              (guessNumber) => {
              const count = stats.guessDistribution[guessNumber] || 0;
              const percentage =
                maxDistribution > 0 ? (count / maxDistribution) * 100 : 0;

              return (
                <div key={guessNumber} className="flex items-center space-x-2">
                  <div className="w-4 text-neutral-600">{guessNumber}</div>
                  <div className="flex-1 h-6 overflow-hidden rounded-sm bg-neutral-200">
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
        <p className="text-center text-neutral-500">
          No statistics available yet. Play some games!
        </p>
      )}
    </Modal>
  );
}

function StatItem({ value, label }: { value: string | number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <span className="text-2xl font-bold">{value}</span>
      <span className="text-xs text-neutral-500">{label}</span>
    </div>
  );
}
