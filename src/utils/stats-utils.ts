import { ScoreData } from "@/types/types";
import { GAME } from "@/constants/constants";
import { isScoreRecord } from "@/utils/storage-utils";

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
  const safeScores = scores.filter(isScoreRecord);
  const totalGames: number = safeScores.length;
  const isWin = (s: ScoreData) =>
    s.isWin ?? (s.attempts >= 1 && s.attempts <= GAME.MAX_ATTEMPTS);

  const wins: number = safeScores.filter(isWin).length;

  // Streaks: compute by consecutive days with wins
  const byDay = new Map<string, boolean>();
  for (const s of safeScores) {
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

  // A loss today breaks the streak. Otherwise it ends on today or yesterday.
  const today = new Date();
  const todayStr = today.toISOString().slice(0, 10);
  const yesterdayStr = new Date(today.getTime() - 24 * 60 * 60 * 1000)
    .toISOString()
    .slice(0, 10);
  const playedToday = byDay.has(todayStr);
  const wonToday = byDay.get(todayStr) === true;
  const anchor = wonToday
    ? todayStr
    : !playedToday && byDay.get(yesterdayStr)
      ? yesterdayStr
      : null;
  if (anchor) {
    let streak = 1;
    let cursor = anchor;
    while (true) {
      const prevDate = new Date(cursor);
      const prevStr = new Date(
        prevDate.getTime() - 24 * 60 * 60 * 1000
      )
        .toISOString()
        .slice(0, 10);
      if (byDay.get(prevStr)) {
        streak += 1;
        cursor = prevStr;
      } else {
        break;
      }
    }
    currentStreak = streak;
  } else {
    currentStreak = 0;
  }

  const guessDistribution: Record<number, number> = {};
  for (let i = 1; i <= GAME.MAX_ATTEMPTS; i++) guessDistribution[i] = 0;
  for (const s of safeScores) {
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

