import { useGameStore, GameStoreState } from "@/stores/game-store";
import { StarIcon } from "./ui/icons";

export const GameHeader = () => {
  const score = useGameStore((s: GameStoreState) => s.score);
  return (
    <header className="flex justify-between items-center p-6">
      <Logo />
      <div className="flex items-center gap-3">
        <ModeToggle />
        <ScoreDisplay score={score} />
      </div>
    </header>
  );
};

const Logo = () => (
  <div className="flex items-center space-x-2">
    <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-accent-purple rounded-lg flex items-center justify-center">
      <span className="text-white font-bold text-lg">W</span>
    </div>
    <h1 className="text-3xl font-bold gradient-text">Wordly</h1>
  </div>
);

const ScoreDisplay = ({ score }: { score: number }) => (
  <div className="flex items-center space-x-2 bg-gradient-to-r from-primary-50 to-accent-purple/10 px-4 py-2 rounded-full border border-primary-200/50">
    <StarIcon className="w-4 h-4 text-primary-600" />
    <div className="text-sm">
      <span className="text-neutral-600 font-medium">Score:</span>
      <span className="ml-1 font-bold text-primary-700">{score}</span>
    </div>
  </div>
);

const ModeToggle = () => {
  const mode = useGameStore((s: GameStoreState) => s.mode);
  const startNewGame = useGameStore((s: GameStoreState) => s.startNewGame);
  const nextMode = mode === "daily" ? "random" : "daily";
  return (
    <button
      onClick={() => startNewGame(nextMode)}
      className="px-3 py-2 text-sm bg-white border border-neutral-200 rounded-xl hover:bg-neutral-50"
      title={`Switch to ${nextMode} mode`}
    >
      {mode === "daily" ? "Daily" : "Random"}
    </button>
  );
};
