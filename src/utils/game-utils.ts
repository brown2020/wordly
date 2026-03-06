import { GameStoreState } from "@/stores/game-store";
import { GAME } from "@/constants/constants";
import { wordList } from "@/constants/wordlist";
import { GameMode, LetterState, KeyboardState } from "@/types/types";

type PuzzleDetails = {
  answer: string;
  id: string;
  puzzleNumber: number | null;
};

export function normalize(word: string): string {
  return word.trim().toUpperCase();
}

/**
 * Get the puzzle number (days since Wordle epoch)
 */
export function getPuzzleNumber(date: Date = new Date()): number {
  const epoch = Date.UTC(2021, 5, 19); // June 19, 2021
  const dayMs = 24 * 60 * 60 * 1000;
  const today = Date.UTC(
    date.getUTCFullYear(),
    date.getUTCMonth(),
    date.getUTCDate()
  );
  return Math.floor((today - epoch) / dayMs);
}

/**
 * Validate a guess against hard mode rules.
 * Returns null if valid, or an error message if invalid.
 */
export function validateHardMode(
  guess: string,
  previousGuesses: string[],
  previousEvaluations: LetterState[][]
): string | null {
  if (previousGuesses.length === 0) return null;

  const lastGuess = previousGuesses[previousGuesses.length - 1];
  const lastEval = previousEvaluations[previousEvaluations.length - 1];

  // Check that all correct letters are in the same position
  for (let i = 0; i < lastEval.length; i++) {
    if (lastEval[i] === "correct" && guess[i] !== lastGuess[i]) {
      const pos = i + 1;
      const letter = lastGuess[i];
      return `${pos}${getOrdinalSuffix(pos)} letter must be ${letter}`;
    }
  }

  // Check that all present letters are used somewhere
  for (let i = 0; i < lastEval.length; i++) {
    if (lastEval[i] === "present") {
      const letter = lastGuess[i];
      if (!guess.includes(letter)) {
        return `Guess must contain ${letter}`;
      }
    }
  }

  return null;
}

function getOrdinalSuffix(n: number): string {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return s[(v - 20) % 10] || s[v] || s[0];
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

export function getDailyPuzzle(date: Date = new Date()): PuzzleDetails {
  const index = computeDailyIndex(date);
  const answer = normalize(wordList[index]);
  const id = date.toISOString().slice(0, 10);
  return {
    answer,
    id,
    puzzleNumber: getPuzzleNumber(date),
  };
}

/**
 * Get the answer for a specific puzzle number (archive mode)
 */
export function getArchiveAnswer(puzzleNumber: number): { answer: string; id: string; puzzleNumber: number } {
  // Convert puzzle number back to date for validation
  const epoch = Date.UTC(2021, 5, 19); // June 19, 2021
  const dayMs = 24 * 60 * 60 * 1000;
  const puzzleDate = new Date(epoch + puzzleNumber * dayMs);

  // Compute word index (wraps around word list)
  const index = ((puzzleNumber % wordList.length) + wordList.length) % wordList.length;
  const ans = normalize(wordList[index]);
  const id = puzzleDate.toISOString().slice(0, 10); // YYYY-MM-DD
  return { answer: ans, id, puzzleNumber };
}

/**
 * Get the current puzzle number (for determining max archive puzzle)
 */
export function getCurrentPuzzleNumber(): number {
  return getPuzzleNumber(new Date());
}

export function getRandomAnswer(): { answer: string; id: string } {
  const index = Math.floor(Math.random() * wordList.length);
  const ans = normalize(wordList[index]);
  const id = `rand-${Date.now()}`;
  return { answer: ans, id };
}

export function getPuzzleForMode(
  mode: GameMode,
  archivePuzzleNumber?: number
): PuzzleDetails {
  if (mode === "archive" && archivePuzzleNumber !== undefined) {
    return getArchiveAnswer(archivePuzzleNumber);
  }

  if (mode === "daily") {
    return getDailyPuzzle();
  }

  const { answer, id } = getRandomAnswer();
  return {
    answer,
    id,
    puzzleNumber: null,
  };
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
    "isWinner" | "guesses" | "evaluations" | "mode" | "solutionId" | "puzzleNumber"
  >,
  hardMode: boolean = false,
  highContrastMode: boolean = false
) {
  const { isWinner, guesses, evaluations, mode, solutionId, puzzleNumber: statePuzzleNumber } = state;

  // Use puzzle number for daily/archive mode (like original Wordle)
  const puzzleNumber = (mode === "daily" || mode === "archive")
    ? (statePuzzleNumber ?? getPuzzleNumber(new Date(solutionId)))
    : null;
  const hardModeIndicator = hardMode ? "*" : "";

  const header = puzzleNumber !== null
    ? `Wordly ${puzzleNumber} ${isWinner ? guesses.length : "X"}/${GAME.MAX_ATTEMPTS}${hardModeIndicator}`
    : `Wordly ${isWinner ? guesses.length : "X"}/${GAME.MAX_ATTEMPTS}${hardModeIndicator}`;

  // Use high contrast colors if enabled
  const correct = highContrastMode ? "🟧" : "🟩";
  const present = highContrastMode ? "🟦" : "🟨";
  const absent = "⬛";

  const rows = evaluations
    .map((evalRow) =>
      evalRow
        .map((s) => (s === "correct" ? correct : s === "present" ? present : absent))
        .join("")
    )
    .join("\n");
  return `${header}\n${rows}`;
}
