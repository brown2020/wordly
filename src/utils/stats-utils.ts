import { ScoreData } from "@/types/types";
import { GAME } from "@/constants/constants";

export type GameStats = {
  totalGames: number;
  wins: number;
  currentStreak: number;
  maxStreak: number;
  guessDistribution: {
    [key: number]: number;
  };
};

export function calculateStats(scores: ScoreData[]): GameStats {
  const totalGames: number = scores.length;
  const isWin = (s: ScoreData) =>
    s.isWin ?? (s.attempts >= 1 && s.attempts < GAME.MAX_ATTEMPTS);

  const wins: number = scores.filter(isWin).length;

  // Streaks: compute by consecutive days with wins
  const byDay = new Map<string, boolean>();
  for (const s of scores) {
    const day = new Date(s.date).toISOString().slice(0, 10);
    byDay.set(day, (byDay.get(day) ?? false) || isWin(s));
  }
  const days = [...byDay.entries()]
    .filter(([, won]) => won)
    .map(([day]) => day)
    .sort();
  let maxStreak: number = 0;
  let currentStreak: number = 0;
  let prev: string | null = null;
  for (const d of days) {
    if (!prev) {
      currentStreak = 1;
    } else {
      const prevDate: Date = new Date(prev);
      const nextDate: Date = new Date(prevDate.getTime() + 24 * 60 * 60 * 1000);
      const nextStr: string = nextDate.toISOString().slice(0, 10);
      if (d === nextStr) {
        currentStreak += 1;
      } else {
        currentStreak = 1;
      }
    }
    prev = d;
    maxStreak = Math.max(maxStreak, currentStreak);
  }

  const guessDistribution: Record<number, number> = {};
  for (let i = 1; i <= GAME.MAX_ATTEMPTS; i++) guessDistribution[i] = 0;
  for (const s of scores) {
    if (isWin(s) && s.attempts >= 1 && s.attempts <= GAME.MAX_ATTEMPTS) {
      guessDistribution[s.attempts]++;
    }
  }

  return {
    totalGames,
    wins,
    currentStreak,
    maxStreak,
    guessDistribution,
  };
}

