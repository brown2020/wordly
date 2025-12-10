import { GameStoreState } from "@/stores/game-store";
import { wordList } from "@/constants/wordlist";
import { LetterState, KeyboardState } from "@/types/types";

export function normalize(word: string): string {
  return word.trim().toUpperCase();
}

export function computeDailyIndex(date: Date): number {
  // Deterministic index based on UTC date
  const epoch = Date.UTC(2021, 5, 19); // Wordle epoch-ish (June 19, 2021)
  const dayMs = 24 * 60 * 60 * 1000;
  const today = Date.UTC(
    date.getUTCFullYear(),
    date.getUTCMonth(),
    date.getUTCDate()
  );
  const day = Math.floor((today - epoch) / dayMs);
  return ((day % wordList.length) + wordList.length) % wordList.length;
}

export function getDailyAnswer(): { answer: string; id: string } {
  const now = new Date();
  const index = computeDailyIndex(now);
  const ans = normalize(wordList[index]);
  const id = now.toISOString().slice(0, 10); // YYYY-MM-DD
  return { answer: ans, id };
}

export function getRandomAnswer(): { answer: string; id: string } {
  const index = Math.floor(Math.random() * wordList.length);
  const ans = normalize(wordList[index]);
  const id = `rand-${Date.now()}`;
  return { answer: ans, id };
}

export function evaluateGuess(answer: string, guess: string): LetterState[] {
  const a = answer.split("");
  const g = guess.split("");

  const result: LetterState[] = Array(g.length).fill("absent");

  // Count of letters in answer not yet matched
  const remainingCounts: Record<string, number> = {};

  // First pass: mark correct and tally remaining letters
  for (let i = 0; i < g.length; i++) {
    if (g[i] === a[i]) {
      result[i] = "correct";
    } else {
      const ch = a[i];
      remainingCounts[ch] = (remainingCounts[ch] ?? 0) + 1;
    }
  }

  // Second pass: mark present where counts remain
  for (let i = 0; i < g.length; i++) {
    if (result[i] === "correct") continue;
    const ch = g[i];
    const count = remainingCounts[ch] ?? 0;
    if (count > 0) {
      result[i] = "present";
      remainingCounts[ch] = count - 1;
    } else {
      result[i] = "absent";
    }
  }

  return result;
}

export function mergeKeyboardState(
  prev: KeyboardState,
  guess: string,
  evals: LetterState[]
): KeyboardState {
  // Priority: correct > present > absent
  const priority: Record<Exclude<LetterState, "unused">, number> = {
    correct: 3,
    present: 2,
    absent: 1,
  };
  const next: KeyboardState = { ...prev };
  for (let i = 0; i < guess.length; i++) {
    const letter = guess[i];
    const newState = evals[i] as Exclude<LetterState, "unused">;
    const existing = next[letter];
    if (!existing || priority[newState] > priority[existing]) {
      next[letter] = newState;
    }
  }
  return next;
}

export function getShareText(
  state: Pick<
    GameStoreState,
    "isWinner" | "guesses" | "evaluations" | "mode" | "solutionId"
  >
) {
  const { isWinner, guesses, evaluations, mode, solutionId } = state;
  const header =
    mode === "daily"
      ? `Wordly ${solutionId} ${isWinner ? guesses.length : "X"}/6`
      : `Wordly ${isWinner ? guesses.length : "X"}/6`;
  const rows = evaluations
    .map((evalRow) =>
      evalRow
        .map((s) => (s === "correct" ? "🟩" : s === "present" ? "🟨" : "⬛"))
        .join("")
    )
    .join("\n");
  return `${header}\n${rows}`;
}
