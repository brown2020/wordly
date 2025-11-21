import { GameStoreState } from "@/stores/game-store";

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
