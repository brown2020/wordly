import { useGameStore, GameStoreState } from "@/stores/game-store";
import { StarIcon } from "./ui/icons";

export const GameHeader = () => {
  const score = useGameStore((s: GameStoreState) => s.score);
  return (
    <header className="grid h-14 grid-cols-3 items-center">
      <div className="flex items-center justify-start">
        <ModeToggle />
      </div>

      <div className="flex items-center justify-center">
        <Logo />
      </div>

      <div className="flex items-center justify-end">
        <ScoreDisplay score={score} />
      </div>
    </header>
  );
};

const Logo = () => (
  <h1 className="select-none text-[clamp(1.125rem,2.2vw,1.5rem)] font-semibold tracking-[0.25em] text-neutral-900">
    WORDLY
  </h1>
);

const ScoreDisplay = ({ score }: { score: number }) => (
  <div className="flex items-center gap-1.5 rounded-md border border-neutral-200 bg-white px-2 py-1 text-xs font-medium text-neutral-700">
    <StarIcon className="h-4 w-4 text-neutral-700" />
    <span className="tabular-nums">{score}</span>
  </div>
);

const ModeToggle = () => {
  const mode = useGameStore((s: GameStoreState) => s.mode);
  const startNewGame = useGameStore((s: GameStoreState) => s.startNewGame);
  const nextMode = mode === "daily" ? "random" : "daily";
  return (
    <button
      onClick={() => startNewGame(nextMode)}
      className="rounded-md border border-neutral-200 bg-white px-2 py-1 text-xs font-medium text-neutral-700 hover:bg-neutral-50 active:bg-neutral-100"
      title={`Switch to ${nextMode} mode`}
    >
      {mode === "daily" ? "Daily" : "Random"}
    </button>
  );
};
